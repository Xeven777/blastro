import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import sharp from "sharp";
import { jsonrepair } from "jsonrepair";
import {
  GROQ_API_KEY,
  CEREBRAS_API_KEY,
  IMAGE_API_BASE,
  HN_API,
  DEVTO_API,
} from "./constants";
import type {
  TrendingTopic,
  GroqResponse,
  BlogMetadata,
  RawTopic,
} from "./types";
import {
  TRENDING_TOPICS_PROMPT,
  BLOG_GENERATION_SYSTEM_PROMPT,
  getBlogPrompt,
  METADATA_GENERATION_PROMPT,
  CYBERPUNK_IMAGE_STYLE_SYSTEM,
  getTopicCurationPrompt,
} from "./prompts";

async function readErrorBody(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return "";
    try {
      const json = JSON.parse(text) as any;
      const message =
        json?.error?.message || json?.message || json?.error || undefined;
      return message ? `${message}\n${text}` : text;
    } catch {
      return text;
    }
  } catch {
    return "";
  }
}

async function researchWithWebSearch(topic: TrendingTopic): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "groq/compound",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a meticulous research assistant. Use web_search when needed. Provide concise, technically accurate notes with source URLs.",
          },
          {
            role: "user",
            content: `Research the topic: ${topic.title}\n\n${
              topic.description ? `Context: ${topic.description}\n` : ""
            }${
              topic.url ? `Reference: ${topic.url}\n` : ""
            }\nReturn markdown with:\n- 6–10 bullet key points (facts, definitions, pitfalls, best practices)\n- A short list of 5–10 source URLs under a "Sources" heading\nKeep it under 350 words.`,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Web research failed (${response.status} ${response.statusText})${
        details ? `\n${details}` : ""
      }`
    );
  }

  const data: GroqResponse = await response.json();
  return data.choices[0].message.content;
}

/**
 * Fetch trending web dev topics using gpt-oss-20b with built-in browser_search
 */
export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  console.log("\n🔍 Fetching trending topics with gpt-oss-20b...");

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        include_reasoning: false,
        reasoning_effort: "low",
        tool_choice: "required",
        tools: [{ type: "browser_search" }],
        // response_format: {
        //   type: "json_schema",
        //   json_schema: {
        //     name: "TrendingTopicsResponse",
        //     schema: {
        //       type: "array",
        //       properties: {
        //         title: { type: "string" },
        //         url: { type: "string" },
        //         description: { type: "string" },
        //       },
        //       required: ["title", "description"],
        //       additionalProperties: false,
        //     },
        //   },
        // },
        messages: [
          {
            role: "user",
            content: TRENDING_TOPICS_PROMPT,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Failed to fetch topics (${response.status} ${response.statusText})${
        details ? `\n${details}` : ""
      }`
    );
  }

  const data: GroqResponse = await response.json();
  const content = data.choices[0].message.content;

  // If the API already returned a parsed object/array, handle that first
  if (typeof content !== "string") {
    if (Array.isArray(content)) {
      console.log(`✅ Retrieved ${(content as any[]).length} trending topics`);
      return content as TrendingTopic[];
    }
    if (content && Array.isArray((content as any).topics)) {
      console.log(
        `✅ Retrieved ${(content as any).topics.length} trending topics`
      );
      return (content as any).topics as TrendingTopic[];
    }
  }

  // Use jsonrepair to handle malformed JSON (missing brackets, trailing commas, etc.)
  try {
    const repairedJson = jsonrepair(content);
    const parsed = JSON.parse(repairedJson);

    const topics = Array.isArray(parsed)
      ? parsed
      : parsed?.topics && Array.isArray(parsed.topics)
      ? parsed.topics
      : null;

    if (!topics) {
      throw new Error("Parsed JSON doesn't contain a topics array");
    }

    console.log(`✅ Retrieved ${topics.length} trending topics`);
    return topics as TrendingTopic[];
  } catch (err) {
    throw new Error(
      `Failed to parse topics JSON: ${
        (err as Error).message
      }\nRaw response:\n${content}`
    );
  }
}

/**
 * Generate blog content using openai/gpt-oss-120b with browser_search
 */
export async function generateBlogContent(
  topic: TrendingTopic
): Promise<string> {
  console.log(
    "\n📝 Generating blog with gpt-oss-120b + browser_search:",
    topic.title
  );

  let researchNotes = "";
  try {
    console.log("\n🌐 Researching with web_search...");
    researchNotes = await researchWithWebSearch(topic);
  } catch (err) {
    console.warn(
      `⚠️  Web research unavailable; proceeding without it: ${
        (err as Error).message
      }`
    );
  }

  const userPrompt =
    getBlogPrompt(topic.title, topic.url, topic.description) +
    (researchNotes
      ? `\n\nResearch notes (use these to stay accurate; cite sources by linking URLs inline when making specific claims):\n\n${researchNotes}`
      : "");

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    // "https://api.cerebras.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
        // Authorization: `Bearer ${CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: BLOG_GENERATION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "openai/gpt-oss-120b",
        // model: "qwen-3-32b",
        temperature: 1,
        top_p: 1,
        stream: false,
        reasoning_effort: "medium",
        tool_choice: "auto",
        tools: [
          {
            type: "browser_search",
          },
        ],
      }),
    }
  );
  if (!response.ok) {
    const details = await readErrorBody(response);
    throw new Error(
      `Failed to generate blog (${response.status} ${response.statusText})${
        details ? `\n${details}` : ""
      }`
    );
  }

  const data: GroqResponse = await response.json();
  const content = data.choices[0].message.content;

  let blog = content;

  // If the model wrapped the whole post in code fences, strip them
  if (blog.trim().startsWith("```")) {
    blog = blog.replace(/^```[^\n]*\n/, "").replace(/\n```\s*$/, "");
  }

  // Remove frontmatter if present
  if (blog.trim().startsWith("---")) {
    blog = blog.replace(/^---[\s\S]*?---\s*/, "");
  }

  console.log(
    `✅ Blog generated: ${blog.length} characters (cleaned from ${content.length})`
  );
  return blog;
}

/**
 * Generate metadata from blog content using gpt-oss-120b from cerebras.ai
 */
export async function generateMetadata(
  blogContent: string
): Promise<BlogMetadata> {
  console.log("\n🏷️  Generating metadata...");

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-oss-120b",
      stream: false,
      reasoning_effort: "low",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "BlogMetadataResponse",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              imagePrompts: {
                type: "object",
                properties: {
                  header: { type: "string" },
                  content: { type: "array", items: { type: "string" } },
                },
                required: ["header", "content"],
              },
            },
            required: ["title", "description", "tags", "imagePrompts"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: METADATA_GENERATION_PROMPT(blogContent),
        },
      ],
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate metadata: ${response.statusText}`);
  }

  const data: GroqResponse = await response.json();
  const content = data.choices[0].message.content;

  try {
    const repairedJson = jsonrepair(content);
    const metadata = JSON.parse(repairedJson) as BlogMetadata;
    console.log(`✅ Metadata generated:`, metadata.title);
    return metadata;
  } catch (err) {
    throw new Error(
      `Failed to parse metadata JSON: ${
        (err as Error).message
      }\nRaw response:\n${content}`
    );
  }
}

/**
 * Generate and save image with proper WebP conversion using sharp
 * Optimized: fetch and convert operations happen in a pipeline
 */
export async function generateAndSaveImage(
  prompt: string,
  filename: string,
  imageDir: string
): Promise<void> {
  try {
    const url = new URL(IMAGE_API_BASE);
    const styledPrompt = `${CYBERPUNK_IMAGE_STYLE_SYSTEM} Subject: ${prompt}`;
    url.searchParams.set("prompt", styledPrompt);
    url.searchParams.set("model", "lucid-origin");
    url.searchParams.set(
      "negative_prompt",
      "blurry,low quality,text,watermark,ugly"
    );
    url.searchParams.set("height", "720");
    url.searchParams.set("width", "1280");
    url.searchParams.set("num_steps", "40");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Image API returned ${response.status}`);
    }

    // Fetch the image (PNG or JPEG from API)
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Convert to WebP with optimization in parallel with file write preparation
    const webpBuffer = await sharp(imageBuffer)
      .webp({
        quality: 85,
        effort: 6, // 0-6, higher = better compression but slower
      })
      .toBuffer();

    await writeFile(
      join(imageDir, `${filename}.webp`),
      new Uint8Array(webpBuffer)
    );
    console.log(
      `  ✅ Converted ${filename}.webp (${Math.round(
        webpBuffer.length / 1024
      )}KB)`
    );
  } catch (error) {
    console.error(`  ❌ Failed to generate ${filename}:`, error);
    throw error; // Re-throw to handle at higher level
  }
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate all images in parallel (header + content images)
 */
export async function generateAllImages(
  metadata: BlogMetadata,
  blogContent: string,
  slug: string,
  blogType: "blog" | "ai-blogs" = "blog"
): Promise<string> {
  console.log("\n🖼️  Generating images in parallel...");

  const imageDir = join(process.cwd(), "public", blogType, slug);
  if (!existsSync(imageDir)) {
    await mkdir(imageDir, { recursive: true });
  }

  // Extract [IMAGE:description] placeholders from content
  const imageRegex = /\[IMAGE:([^\]]+)\]/g;
  const imageMatches = [...blogContent.matchAll(imageRegex)];

  // Prepare all image generation tasks
  const imagePromises: Promise<void>[] = [];

  // 1. Header image
  imagePromises.push(
    generateAndSaveImage(metadata.imagePrompts.header, "header", imageDir)
  );
  console.log("  📸 Queued: header image");

  // 2. Content images
  const contentPrompts = metadata.imagePrompts.content.slice(
    0,
    Math.min(imageMatches.length, 3)
  );
  contentPrompts.forEach((prompt, index) => {
    const filename = `content-${index + 1}`;
    imagePromises.push(generateAndSaveImage(prompt, filename, imageDir));
    console.log(`  📸 Queued: ${filename}`);
  });

  // Generate all images in parallel
  await Promise.all(imagePromises);
  console.log(`✅ Generated ${imagePromises.length} images`);

  // Replace [IMAGE:...] placeholders with actual image markdown
  let updatedContent = blogContent;
  imageMatches.forEach((match, index) => {
    if (index < contentPrompts.length) {
      const filename = `content-${index + 1}`;
      updatedContent = updatedContent.replace(
        match[0],
        `![](/${blogType}/${slug}/${filename}.webp)`
      );
    }
  });

  return updatedContent;
}

/**
 * Determine blog source from environment variable or day of month
 */
export function determineBlogSource(): "hn" | "devto" {
  // Check if BLOG_SOURCE env var is set (from GitHub Actions)
  const envSource = process.env.BLOG_SOURCE;
  if (envSource === "hn" || envSource === "devto") {
    return envSource;
  }

  // Fall back to day-based logic
  const day = new Date().getDate();
  return day % 2 === 0 ? "hn" : "devto";
}

export async function fetchHNTrendingTopics(
  keywords?: string[]
): Promise<RawTopic[]> {
  console.log("\n🔥 Fetching Hacker News trending topics...");
  if (keywords) {
    console.log(`   Filtering by keywords: ${keywords.join(", ")}`);
  }

  const now = Date.now();
  const MAX_AGE = 72 * 60 * 60 * 1000; // 72 hours

  // Get both new + best stories
  const [newIds, bestIds] = await Promise.all([
    fetch(`${HN_API}/newstories.json`).then((res) => res.json()),
    fetch(`${HN_API}/beststories.json`).then((res) => res.json()),
  ]);

  const ids = Array.from(
    new Set([...newIds.slice(0, 150), ...bestIds.slice(0, 150)])
  );

  const stories = await Promise.all(
    ids.map(async (id: number) => {
      const item = await fetch(`${HN_API}/item/${id}.json`).then((res) =>
        res.json()
      );
      if (!item || !item.title || !item.time) return null;

      const publishedAt = item.time * 1000;
      if (now - publishedAt > MAX_AGE) return null;

      if (
        item.title.startsWith("Ask HN") ||
        item.title.startsWith("Show HN Hiring") ||
        item.title.startsWith("Who is hiring")
      ) {
        return null;
      }

      // Keyword filter
      if (keywords && keywords.length > 0) {
        const titleLower = item.title.toLowerCase();
        const matchesKeyword = keywords.some((kw) =>
          titleLower.includes(kw.toLowerCase())
        );
        if (!matchesKeyword) return null;
      }

      return {
        source: "hn" as const,
        title: item.title,
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        description: "",
        score: item.score || 0,
        comments: item.descendants || 0,
        publishedAt,
      };
    })
  );

  const filtered = stories.filter(Boolean) as RawTopic[];
  console.log(`✅ HN topics fetched: ${filtered.length}`);
  return filtered;
}

export async function fetchDevToTrendingTopics(
  keywords?: string[]
): Promise<RawTopic[]> {
  console.log("\n🔥 Fetching Dev.to trending articles...");
  if (keywords) {
    console.log(`   Filtering by keywords: ${keywords.join(", ")}`);
  }

  const params = new URLSearchParams({
    per_page: "30",
    top: "7",
  });

  const response = await fetch(`${DEVTO_API}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Dev.to articles");
  }

  const articles = await response.json();

  const now = Date.now();
  const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

  const topics: RawTopic[] = articles
    .filter((a: any) => {
      const publishedAt = new Date(a.published_at).getTime();
      const titleLower = a.title.toLowerCase();
      const descriptionLower = (a.description || "").toLowerCase();

      // Base filters
      if (
        now - publishedAt >= MAX_AGE ||
        a.public_reactions_count <= 20 ||
        titleLower.includes("career") ||
        titleLower.includes("resume")
      ) {
        return false;
      }

      // Keyword filter
      if (keywords && keywords.length > 0) {
        const matchesKeyword = keywords.some(
          (kw) =>
            titleLower.includes(kw.toLowerCase()) ||
            descriptionLower.includes(kw.toLowerCase())
        );
        return matchesKeyword;
      }

      return true;
    })
    .map((a: any) => ({
      source: "devto",
      title: a.title,
      url: a.url,
      description: a.description || a.tag_list?.join(", "),
      score: a.public_reactions_count,
      comments: a.comments_count,
      publishedAt: new Date(a.published_at).getTime(),
    }));

  console.log(`✅ Dev.to topics fetched: ${topics.length}`);
  return topics;
}

export async function curateTrendingTopicsWithLLM(
  rawTopics: RawTopic[]
): Promise<TrendingTopic[]> {
  console.log("\n🧠 Curating topics with LLM (dedupe + summary)...");

  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CEREBRAS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: getTopicCurationPrompt(rawTopics),
        },
      ],
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to curate topics");
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    const repaired = jsonrepair(content);
    return JSON.parse(repaired) as TrendingTopic[];
  } catch (err) {
    throw new Error(`Failed to parse curated topics\n${content}`);
  }
}

export async function fetchTrendingTopics2(): Promise<TrendingTopic[]> {
  console.log("\n🚀 Fetching REAL trending dev topics...");

  const [hn, devto] = await Promise.all([
    fetchHNTrendingTopics(),
    fetchDevToTrendingTopics(),
  ]);

  const rawTopics = [...hn, ...devto];

  // Optional: quick pre-sort before LLM
  rawTopics.sort((a, b) => {
    const scoreA = a.score + (a.comments || 0);
    const scoreB = b.score + (b.comments || 0);
    return scoreB - scoreA;
  });

  const curated = await curateTrendingTopicsWithLLM(rawTopics);

  console.log(`✅ Final curated topics: ${curated.length}`);
  return curated;
}

/**
 * Fetch HN topics only (no deduplication, no LLM curation)
 * Returns top topics sorted by score + comments
 */
export async function fetchHNTopicsOnly(
  keywords?: string[]
): Promise<RawTopic[]> {
  console.log("\n🔥 Fetching HN topics only (no deduplication)...");

  const rawTopics = await fetchHNTrendingTopics(keywords);

  // Sort by engagement (score + comments)
  rawTopics.sort((a, b) => {
    const scoreA = a.score + (a.comments || 0);
    const scoreB = b.score + (b.comments || 0);
    return scoreB - scoreA;
  });

  const topTopics = rawTopics.slice(0, 10);
  console.log(`✅ Selected top ${topTopics.length} HN topics`);

  return topTopics;
}

/**
 * Fetch Dev.to topics only (no deduplication, no LLM curation)
 * Returns top topics sorted by score + comments
 */
export async function fetchDevToTopicsOnly(
  keywords?: string[]
): Promise<RawTopic[]> {
  console.log("\n🔥 Fetching Dev.to topics only (no deduplication)...");

  const rawTopics = await fetchDevToTrendingTopics(keywords);

  // Sort by engagement (score + comments)
  rawTopics.sort((a, b) => {
    const scoreA = a.score + (a.comments || 0);
    const scoreB = b.score + (b.comments || 0);
    return scoreB - scoreA;
  });

  const topTopics = rawTopics.slice(0, 10);
  console.log(`✅ Selected top ${topTopics.length} Dev.to topics`);

  return topTopics;
}

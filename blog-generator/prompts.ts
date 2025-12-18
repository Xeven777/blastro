import type { RawTopic } from "./types";

export const getCurrentDate = () => new Date().toISOString().split("T")[0];

export const TRENDING_TOPICS_PROMPT = `Search the web for the most trending and discussed web development, UI/UX, mobile app development, or technology topics from the past 2-3 days. Focus on:
- New framework releases or updates
- Trending GitHub projects
- Hot discussions on Twitter/X, Reddit, or Hacker News
- Breaking news in web development
- Viral coding techniques or patterns

Return exactly 5 trending topics as a JSON array and NOTHING else. The array must contain objects with the
following properties: 'title' (string), 'url' (string, optional), and 'description' (string).
Example (must match this shape exactly):
[
  {"title": "Example Topic", "url": "https://...", "description": "Short description"},
  {"title": "Another Topic", "description": "Short description"},
  ... (5 items total)
]
Do not include any surrounding explanation, markdown, or additional fields — only the JSON array.
Prioritize topics that would interest developers working with:AI News, React, Next.js, TypeScript, Rust, Linux, opensource, UI/UX, mobile apps, e-commerce, or modern web APIs, Google, Amazon, Nvidia, Microsoft.`;

export const BLOG_GENERATION_SYSTEM_PROMPT = `You are an expert technical writer specializing in web development, UI/UX, mobile apps, and modern web technologies.

Write a blog post for a web development agency audience.

Hard constraints:
- Length: 700–900 words (not a massive guide, not a thin recap)
- Output: Markdown only, with exactly one H1 title at the top
- No frontmatter, no metadata, no preamble

Style and tone:
- Sound like a sharp human writer: conversational, confident, slightly sarcastic (lightly), and helpful
- Use contractions, varied sentence length, and occasional punchy one-liners
- Avoid robotic filler (“In today’s world…”, “As we all know…”) and never mention being an AI
- Keep paragraphs tight and scannable; use bullets when it improves readability

SEO:
- Start with a single H1 title that is highly SEO-optimized and keyword-rich
- Use descriptive, scannable H2/H3 headings (no forced template like “Introduction” or “Conclusion”)
- Naturally weave primary and related keywords (semantic variations) without keyword stuffing
- Include a short “Quick take” section near the top (2–4 bullets) that answers: what it is, why it matters, who should care

Content quality:
- Be technically accurate
- Use code blocks only if they actually clarify the point (keep them short and correct)
- Add exactly 3 image placeholders using [IMAGE:description] distributed throughout the post:
  * Place the FIRST [IMAGE:...] after your first major section (after the Quick take)
  * Place the SECOND [IMAGE:...] in the middle of the post (after a key H2 section)
  * Place the THIRD [IMAGE:...] toward the end but BEFORE the FAQ section
  * NEVER cluster all images at the end — they must be spread naturally between sections
- Include real-world use cases, pitfalls, FAQs (3–5 Q&As), and best practices
- Use tables for comparisons when they add clarity, if applicable
- Prefer concrete claims you can justify; if something is time-sensitive, verify with browser_search or phrase cautiously

Rules:
1) Write ONLY the blog content (markdown format); no frontmatter or metadata
2) Do not enforce a predefined section structure; organize naturally for the topic
3) Verify recent/rapidly changing facts using browser_search when needed
4) Avoid fluff and hallucinations; prefer concrete, current info`;

export const getBlogPrompt = (
  topic: string,
  url?: string,
  description?: string
) => `Write a long-form blog post about: ${topic}

${description ? `Context: ${description}` : ""}
${url ? `Reference: ${url}` : ""}
SEO focus:
- Target relevant primary keywords and natural variations
- Use meaningful, semantic headings and clear, scannable structure
- Keep the writing concrete, current, and helpful

Constraints recap:
- 700–900 words
- Exactly one H1 title at the top
- Exactly 3 image placeholders like [IMAGE:...] DISTRIBUTED throughout:
  * 1st image: after the Quick take / first major section
  * 2nd image: middle of the post (after a key section)
  * 3rd image: toward the end, BEFORE the FAQ section
  * DO NOT place all images at the end
- Include 3–5 FAQs

Write the complete blog post now:`;

export const CYBERPUNK_IMAGE_STYLE_SYSTEM = `Style system (must be applied to every image prompt): dark cyberpunk, realistic 8k, cinematic lighting, neon lights with neon green as the primary accent, high contrast, sharp detail, moody atmosphere, no text, no watermark.`;

export const METADATA_GENERATION_PROMPT = (
  blogContent: string
) => `Analyze this blog post and generate optimized metadata.

Blog content:
${blogContent.substring(0, 1500)}...

Generate metadata in this EXACT JSON format:
{
  "title": "SEO-optimized, catchy title (50-60 chars)",
  "description": "Compelling description that summarizes the post (150-160 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "imagePrompts": {
    "header": "Detailed prompt for hero image (specific, vivid, tech-themed)",
    "content": [
      "Prompt for first inline image",
      "Prompt for second inline image",
      "Prompt for third inline image"
    ]
  }
}

Rules:
- Title must be catchy and include main keywords
- Description must be compelling and between 150-160 chars to avoid truncation
- Tags should be lowercase, hyphenated, relevant (e.g., "react", "web-development", "typescript")
- Image prompts must follow this EXACT style system: ${CYBERPUNK_IMAGE_STYLE_SYSTEM}
- Image prompts should be specific about subject, setting, camera/lighting vibe, and composition (but keep them single-paragraph)

Return ONLY the JSON object, no other text.`;

export function getTopicCurationPrompt(rawTopics: RawTopic[]) {
  return `
You are a senior developer editor.

Given the following list of raw tech topics from multiple sources:
- Remove duplicates and near-duplicates
- Merge similar topics into one
- Rewrite clear, modern descriptions (2–3 sentences)
- Keep only topics that are genuinely NEW and relevant in the last few days
- Focus on web development, AI dev tools, frameworks, infra, and OSS

Return JSON ONLY in this exact format:

[
  {
    "title": "string",
    "url": "string",
    "description": "string"
  }
]

Raw topics:
${JSON.stringify(rawTopics, null, 2)}
`;
}

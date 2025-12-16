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

Write an in-depth, friendly, cool, and casual blog post (~1000 words) for a web development agency audience.

Style and tone:
- Conversational, approachable, a little witty; avoid corporate jargon
- Plain-English explanations with practical tips and light humor
- Keep paragraphs tight and scannable; use bullets where helpful

SEO:
- Start with a single H1 title that is highly SEO-optimized and keyword-rich
- Use descriptive, scannable H2/H3 headings (no fixed template like "Introduction" or "Conclusion")
- Weave primary and related keywords naturally; include semantic variations

Content quality:
- Be technically accurate
- Some code blocks with syntax highlighting, only if its needed to explain tech topic, or else skip
- Add 3–4 image placeholders using [IMAGE:description] in between sections, not at last
- Include real-world use cases, pitfalls, FAQs, and best practices
- Use tables for comparisons when they add clarity, if applicable
- Length: about 1,000–1200 words
- Tone: friendly, cool, casual, slightly witty; avoid corporate jargon
- Start with a single H1 SEO-optimized title
- Use natural, descriptive headings (no forced \"Introduction\" or \"Conclusion\")
- if used code examples, use \`\`\`language fences
- Incorporate real-world examples, tips, pitfalls, and best practices
- NO frontmatter or metadata

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

Write the complete blog post now:`;

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
- Image prompts should be specific and describe the visual style (e.g., "Modern minimalist illustration of React component architecture with blue and purple gradients")

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

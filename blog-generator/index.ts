import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { CEREBRAS_API_KEY, GROQ_API_KEY } from "./constants";
import {
  generateBlogContent,
  generateMetadata,
  generateAllImages,
  createSlug,
  fetchHNTopicsOnly,
  fetchDevToTopicsOnly,
  determineBlogSource,
} from "./utils";
import type { RawTopic } from "./types";

async function main() {
  try {
    console.log("\n🚀 Starting optimized blog generator...\n");

    if (!GROQ_API_KEY || !CEREBRAS_API_KEY) {
      throw new Error("GROQ_API_KEY or CEREBRAS_API_KEY not set");
    }

    // Step 1: Determine source and fetch topics
    const source = determineBlogSource();
    console.log(`📰 Using source: ${source.toUpperCase()}`);

    let rawTopics: RawTopic[];
    if (source === "hn") {
      rawTopics = await fetchHNTopicsOnly();
    } else {
      rawTopics = await fetchDevToTopicsOnly();
    }

    if (rawTopics.length === 0) {
      throw new Error("❌ No trending topics found!");
    }

    console.log(`\n✅ Found ${rawTopics.length} trending topics:`);
    // Show up to the top 10 topics for visibility
    rawTopics.slice(0, Math.min(10, rawTopics.length)).forEach((t, i) => {
      console.log(
        `   ${i + 1}. ${t.title} (score: ${t.score}, comments: ${
          t.comments || 0
        })`
      );
    });

    // Select the topic with the highest score. If scores tie, prefer more comments.
    const selectedTopic = rawTopics.reduce((best, t) => {
      const bestScore = (best.score ?? 0) as number;
      const tScore = (t.score ?? 0) as number;
      if (tScore > bestScore) return t;
      if (tScore === bestScore) {
        const bestComments = (best.comments ?? 0) as number;
        const tComments = (t.comments ?? 0) as number;
        if (tComments > bestComments) return t;
      }
      return best;
    }, rawTopics[0]);

    console.log(
      `\n🎯 Selected: "${selectedTopic.title}" (score: ${
        selectedTopic.score
      }, comments: ${selectedTopic.comments || 0})`
    );

    // Convert RawTopic to TrendingTopic format
    const topicForGeneration = {
      title: selectedTopic.title,
      url: selectedTopic.url,
      description: selectedTopic.description || selectedTopic.title,
    };

    // Step 2: Generate blog content using gpt-oss-120b
    console.log("\n📝 Generating blog content with gpt-oss-120b...");
    const blogContent = await generateBlogContent(topicForGeneration);

    // Step 3: Generate metadata (title, description, tags, image prompts)
    console.log("\n🏷️  Generating optimized metadata...");
    const metadata = await generateMetadata(blogContent);

    console.log(`   Title: ${metadata.title}`);
    console.log(`   Tags: ${metadata.tags.join(", ")}`);

    // Step 4: Create slug from optimized title
    const slug = createSlug(metadata.title);
    console.log(`   Slug: ${slug}`);

    // Step 5: Generate all images in parallel (header + content images)
    // AI blogs go to /ai-blogs
    const blogType = "ai-blogs";
    const updatedContent = await generateAllImages(
      metadata,
      blogContent,
      slug,
      blogType
    );

    // Step 6: Create final markdown file with frontmatter
    const today = new Date().toISOString().split("T")[0];
    const frontmatter = `---
title: "${metadata.title}"
pubDate: "${today}"
description: "${metadata.description}"
heroImage: "/${blogType}/${slug}/header.webp"
tags: [${metadata.tags.map((t) => `"${t}"`).join(", ")}]
source: "${source}"
originalUrl: "${selectedTopic.url || ""}"
---

`;

    const fullContent = frontmatter + updatedContent;

    const blogDir = join(process.cwd(), "src", "content", blogType);
    if (!existsSync(blogDir)) {
      await mkdir(blogDir, { recursive: true });
    }

    const filePath = join(blogDir, `${slug}.md`);
    await writeFile(filePath, fullContent, "utf-8");

    console.log(`\n✅ Blog generated successfully!`);
    console.log(`   File: src/content/${blogType}/${slug}.md`);
    console.log(`   Length: ${fullContent.length} characters`);
    console.log(`   Title: ${metadata.title}`);
    console.log(`   Tags: ${metadata.tags.join(", ")}`);
    console.log(`   Source: ${source}`);
    console.log(`   Images: public/${blogType}/${slug}/`);
  } catch (error) {
    console.error("\n❌ Error:", error);
    throw error;
  }
}

main();

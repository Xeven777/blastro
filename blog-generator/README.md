# Blog Generator V3 - AI-Powered with Source-Based Selection

This blog generator creates AI-powered blog posts from trending topics on Hacker News and Dev.to.

## 🚀 Latest Updates (V3)

### **New Workflow (Every 5 Days)**

- Even days → Hacker News topics only
- Odd days → Dev.to topics only
- No deduplication - direct topic selection

### **AI Blogs Directory**

- Content saved to: `src/content/ai-blogs/`
- Images saved to: `public/ai-blogs/`
- Includes source tracking in frontmatter

### **Parallelized Operations**

- All images generated concurrently
- Optimized WebP conversion pipeline
- See `WORKFLOW_UPDATES.md` for details

## 🚀 Key Features

### 1. **Groq Compound System for Trending Topics** (Legacy)

- Uses `groq/compound` with built-in `web_search` tool
- Automatically searches the web for trending topics
- No manual Hacker News scraping needed
- Faster and more comprehensive topic discovery

### 2. **Direct Source Integration** (New)

- **Hacker News**: Fetches top stories by score + comments
- **Dev.to**: Fetches trending articles by reactions
- Source selection based on day of month
- No LLM curation needed for AI blogs

### 3. **GPT-OSS 120B with Browser Search**

- Uses `openai/gpt-oss-120b` (131K context window)
- Built-in `browser_search` tool for research
- Single API call generates comprehensive blog posts
- No manual tool orchestration required

### 3. **Intelligent Metadata Generation**

- Analyzes blog content to generate:
  - SEO-optimized title (50-60 chars)
  - Compelling description (120-155 chars)
  - 4-5 relevant tags
  - High-quality image prompts (1 header + 3 content images)
- Uses `groq/compound` for creative generation

### 4. **Parallel Image Generation**

- All images generated simultaneously
- 3-4x faster than sequential generation
- Header image + 3 content images
- Proper WebP format support

### 5. **Simplified Architecture**

- No custom tools needed (uses Groq's built-in tools)
- Removed complex tool orchestration code
- Cleaner, more maintainable codebase

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  1. Fetch Trending Topics               │
│     - groq/compound + web_search        │
│     - Returns 5 trending topics         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. Generate Blog Content               │
│     - openai/gpt-oss-120b               │
│     - browser_search tool               │
│     - 2000-3000 word article            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  3. Generate Metadata                   │
│     - groq/compound                     │
│     - Title, description, tags          │
│     - Image prompts (4 total)           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  4. Generate Images (Parallel)          │
│     - All 4 images at once              │
│     - Header + 3 content images         │
│     - WebP format                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  5. Create Markdown File                │
│     - Frontmatter with metadata         │
│     - Blog content with images          │
│     - Save to src/content/blog/         │
└─────────────────────────────────────────┘
```

## 📦 Usage

```bash
# Generate a new blog post
bun run generate-blog
```

## 🔧 Configuration

Set your Groq API key:

```bash
export GROQ_API_KEY="your-groq-api-key"
```

## 🖼️ WebP Conversion

✅ **Now Implemented!** The blog generator uses Sharp library to properly convert images from PNG/JPEG to optimized WebP format.

### Implementation Details

Images from the API (PNG/JPEG) are automatically converted to WebP with:

- **Quality:** 85% (optimal balance between size and quality)
- **Effort:** 6 (maximum compression effort)
- **Result:** ~60-80% smaller file sizes compared to PNG

```typescript
// Automatic conversion in utils.ts
const webpBuffer = await sharp(imageBuffer)
  .webp({
    quality: 85,
    effort: 6,
  })
  .toBuffer();
```

No additional configuration needed! Sharp is already installed as a dependency.

## 🎯 Models Used

| Purpose         | Model                 | Why                                        |
| --------------- | --------------------- | ------------------------------------------ |
| Trending Topics | `groq/compound`       | Built-in web_search, multi-tool support    |
| Blog Content    | `openai/gpt-oss-120b` | 131K context, browser_search, high quality |
| Metadata        | `groq/compound`       | Creative generation, web_search for trends |
| Images          | Flux Schnell API      | Fast, high-quality generation              |

## 📊 Performance Comparison

| Feature         | Old Version               | New Version                         |
| --------------- | ------------------------- | ----------------------------------- |
| Topic Discovery | Manual HN API + filtering | Groq compound web_search            |
| Blog Generation | Custom tool orchestration | Single API call with browser_search |
| Metadata        | Regex extraction          | AI-generated with SEO optimization  |
| Images          | Sequential generation     | Parallel generation (3-4x faster)   |
| Total Time      | ~5-7 minutes              | ~2-3 minutes                        |

## 🐛 Troubleshooting

### Rate Limits

If you hit rate limits, the functions will handle retries automatically with exponential backoff.

### No Topics Found

The web search might not return web dev topics. Try running again as trending topics change frequently.

### Image Generation Fails

Individual image failures are logged but don't stop the process. Check console warnings.

## 📝 Output

Generated blog posts include:

- SEO-optimized frontmatter
- 2000-3000 word content
- 6-8 code examples
- 4 images (1 header + 3 content)
- 4-5 relevant tags
- Compelling description

Example output: `src/content/blog/next-js-15-introduces-partial-prerendering.md`

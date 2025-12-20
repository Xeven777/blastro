# Blog Generator V3 - AI-Powered with Source-Based Selection

This blog generator creates AI-powered blog posts from trending topics on Hacker News and Dev.to.

## 🚀 Latest Updates (V3)

### **Smart Source Selection**

- **Day-based rotation**: Even days → Hacker News, Odd days → Dev.to
- **Environment override**: Set `BLOG_SOURCE=hn` or `BLOG_SOURCE=devto` (for GitHub Actions)
- **Direct topic selection**: No deduplication, ranked by engagement (score + comments)
- **Keyword filtering**: Optional filtering for web development topics

### **AI Blogs Directory**

- Content saved to: `src/content/ai-blogs/`
- Images saved to: `public/ai-blogs/`
- Source tracking in frontmatter (HN or Dev.to)

### **Parallelized Operations**

- All images generated concurrently
- Optimized WebP conversion pipeline with Sharp
- 3-4x faster than sequential generation

## 🚀 Key Features

### 1. **Direct Source Integration**

- **Hacker News**: Top stories from new + best feeds (last 72 hours)
- **Dev.to**: Trending articles by reactions (last 7 days)
- Sorted by engagement: score + comments
- Optional keyword filtering for focused topics

### 2. **GPT-OSS 120B Blog Generation**

- Uses `openai/gpt-oss-120b` (131K context window)
- Built-in `browser_search` tool for research
- Web research with `groq/compound` + `web_search`
- Single API call generates comprehensive 2000-3000 word articles

### 3. **Intelligent Metadata Generation**

- Uses Cerebras `gpt-oss-120b` with JSON schema
- SEO-optimized title (50-60 chars)
- Compelling description (120-155 chars)
- 4-5 relevant tags
- High-quality image prompts (1 header + 3 content images)

### 4. **Parallel Image Generation**

- All images generated simultaneously
- Lucid Origin model via API
- Cyberpunk aesthetic styling
- Header image + 3 content images
- Automatic WebP conversion with Sharp

### 5. **Streamlined Architecture**

- No complex tool orchestration
- Built-in API tools (browser_search, web_search)
- Clean, maintainable codebase
- Efficient error handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  1. Determine Source & Fetch Topics     │
│     - Day-based or env var selection    │
│     - HN: new + best stories (72h)      │
│     - Dev.to: trending articles (7d)    │
│     - Sort by score + comments          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  2. Web Research (Optional)             │
│     - groq/compound + web_search        │
│     - 6-10 key points + sources         │
│     - Under 350 words                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  3. Generate Blog Content               │
│     - openai/gpt-oss-120b (Groq)        │
│     - browser_search tool               │
│     - Research notes integration        │
│     - 2000-3000 word article            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  4. Generate Metadata                   │
│     - gpt-oss-120b (Cerebras)           │
│     - JSON schema validation            │
│     - Title, description, tags          │
│     - Image prompts (4 total)           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  5. Generate Images (Parallel)          │
│     - All 4 images concurrently         │
│     - Lucid Origin model                │
│     - 1280x720 resolution               │
│     - Sharp WebP conversion (85%)       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  6. Create Markdown File                │
│     - Frontmatter with metadata         │
│     - Blog content with embedded images │
│     - Save to src/content/ai-blogs/     │
└─────────────────────────────────────────┘
```

## 📦 Usage

```bash
# Generate a new blog post (automatic source selection)
bun run generate-blog

# Or with GitHub Actions, set environment variable:
# BLOG_SOURCE=hn or BLOG_SOURCE=devto
```

## 🔧 Configuration

Set your API keys:

```bash
export GROQ_API_KEY="your-groq-api-key"
export CEREBRAS_API_KEY="your-cerebras-api-key"
```

### Environment Variables

- `GROQ_API_KEY`: Required for blog generation and web research
- `CEREBRAS_API_KEY`: Required for metadata generation
- `BLOG_SOURCE`: Optional override for source selection (`hn` or `devto`)

### Source Selection Logic

1. **Environment Variable**: If `BLOG_SOURCE` is set, uses that source
2. **Day-based**: Falls back to day of month (even = HN, odd = Dev.to)

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

## 🎯 Models & APIs Used

| Component      | Provider     | Model/Service         | Purpose                          |
| -------------- | ------------ | --------------------- | -------------------------------- |
| Topic Research | Groq         | `groq/compound`       | Web search + research notes      |
| Blog Content   | Groq         | `openai/gpt-oss-120b` | Blog generation + browser search |
| Metadata       | Cerebras     | `gpt-oss-120b`        | Structured JSON metadata         |
| Images         | Lucid Origin | `lucid-origin`        | High-quality image generation    |
| Image Optimize | Sharp        | -                     | WebP conversion                  |

## 📊 Performance & Features

| Aspect        | Implementation                | Result                             |
| ------------- | ----------------------------- | ---------------------------------- |
| Topic Sources | HN API + Dev.to API           | Real-time trending topics          |
| Filtering     | Score + comments ranking      | High engagement content            |
| Research      | groq/compound web_search      | Factual, sourced research          |
| Blog Quality  | 131K context + browser_search | Comprehensive 2000-3000 word posts |
| Metadata      | JSON schema validation        | Consistent, structured output      |
| Images        | Parallel generation           | 3-4x faster (4 images at once)     |
| Image Format  | Sharp WebP (85% quality)      | 60-80% smaller than PNG            |
| Total Time    | ~2-3 minutes                  | End-to-end blog generation         |

## 🐛 Troubleshooting

### Rate Limits

If you hit rate limits, the functions will handle retries automatically with exponential backoff (where implemented).

### No Topics Found

- **HN**: May not have recent stories matching filters (check 72-hour window)
- **Dev.to**: May not have articles with enough reactions (minimum 20)
- Try running again or check source manually

### Image Generation Fails

Individual image failures are logged but don't stop the process. Check console warnings for details.

### WebP Conversion Issues

Sharp library handles conversion automatically. If images fail to convert, check console errors.

## 🔍 Topic Filtering

### Hacker News

- Age: Last 72 hours only
- Excludes: "Ask HN", "Show HN Hiring", "Who is hiring"
- Optional: Keyword filtering

### Dev.to

- Age: Last 7 days only
- Minimum reactions: 20+
- Excludes: Career/resume posts
- Optional: Keyword filtering

## 📝 Output Structure

Generated blog posts include:

### Frontmatter

- SEO-optimized title (50-60 chars)
- Compelling description (120-155 chars)
- 4-5 relevant tags
- Source tracking (hn/devto)
- Publication date

### Content

- 2000-3000 word article
- 6-8 code examples
- Research-backed information
- Inline source citations (when available)

### Images

- 1 header image (1280x720 WebP)
- 3 content images (1280x720 WebP)
- Cyberpunk aesthetic styling
- Auto-embedded in markdown

### File Structure

```
src/content/ai-blogs/
  └── topic-slug.md
public/ai-blogs/
  └── topic-slug/
      ├── header.webp
      ├── content-1.webp
      ├── content-2.webp
      └── content-3.webp
```

Example output: `src/content/ai-blogs/scaling-saas-products-a-developer-s-guide-to-growth.md`

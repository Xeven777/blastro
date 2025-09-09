---
title: "Free & Best Quality AI Image generator API"
description: Documentation for using this AI image API
pubDate: "2024-11-29T09:00:00+05:30"
heroImage: /assets/ai-img-cover.jpg
author: "Anish"
---

# 🤖 AI Image Generation API 🖼️

## Overview

This Hono.js-powered API allows you to generate stunning AI images using multiple state-of-the-art image generation models!

## 🚀 Quick Start

### Base URL

```
https://ai-image-api.xeven.workers.dev/img
```

### Available Query Parameters

#### General Parameters

-   `prompt` (optional): Your image description. Default: `Cyberpunk Dinosaur robot, modern, 3D render, 8K, HD`
-   `model` (optional): Choose your AI model. Default Model: `SD XL Lightning`
-   `strength` (optional): Image generation strength. Default: `1`
-   `guidance` (optional): Guidance scale. Default: `7.5`

#### Model-Specific Parameters

##### Lucid Origin (`model=lucid-origin`)

-   `guidance` (optional): Controls prompt adherence (0-10). Default: `4.5`
-   `seed` (optional): Random seed for reproducibility (≥0)
-   `height` (optional): Image height in pixels (0-2500). Default: `1120`
-   `width` (optional): Image width in pixels (0-2500). Default: `1120`
-   `num_steps` or `steps` (optional): Diffusion steps (1-40)

##### Phoenix (`model=phoenix`)

-   `guidance` (optional): Controls prompt adherence (2-10). Default: `2`
-   `seed` (optional): Random seed for reproducibility (≥0)
-   `height` (optional): Image height in pixels (0-2048). Default: `1024`
-   `width` (optional): Image width in pixels (0-2048). Default: `1024`
-   `num_steps` (optional): Diffusion steps (1-50). Default: `25`
-   `negative_prompt` (optional): What to exclude from the image

##### Flux Schnell (`model=flux-schnell`)

-   `steps` (optional): Diffusion steps (1-8). Default: `4`

##### Stable Diffusion Base (`model=sdxl`) & Lightning (`model=sdxl-lightning`)

-   `guidance` (optional): Controls prompt adherence. Default: `7.5`
-   `negative_prompt` (optional): What to exclude from the image
-   `height` (optional): Image height in pixels (256-2048)
-   `width` (optional): Image width in pixels (256-2048)
-   `num_steps` (optional): Diffusion steps (1-20). Default: `20`
-   `strength` (optional): Transformation strength for img2img (0-1). Default: `1`
-   `seed` (optional): Random seed for reproducibility
-   `image_b64` (optional): Base64-encoded input image for img2img tasks

##### Dreamshaper (`model=dreamshaper`)

-   `guidance` (optional): Controls prompt adherence. Default: `7.5`
-   `negative_prompt` (optional): What to exclude from the image
-   `height` (optional): Image height in pixels (256-2048)
-   `width` (optional): Image width in pixels (256-2048)
-   `num_steps` (optional): Diffusion steps (1-20). Default: `20`
-   `strength` (optional): Transformation strength for img2img (0-1). Default: `1`
-   `seed` (optional): Random seed for reproducibility
-   `image_b64` (optional): Base64-encoded input image for img2img tasks

## 🎨 Models Available

| Model Name                    | Query Parameter  | Best For                                                        |
| ----------------------------- | ---------------- | --------------------------------------------------------------- |
| Stable Diffusion XL Lightning | `sdxl-lightning` | Fast, high-quality images < 5 secs 🚀                           |
| Stable Diffusion XL           | `sdxl`           | Balanced, professional images, highest quality < 12 secs 🖼️     |
| Flux Schnell                  | `flux-schnell`   | Best and most realistic model with quick generations < 6secs 🔥 |
| Dreamshaper                   | `dreamshaper`    | Fastest model < 2secs, low quality🌈                            |
| Lucid Origin                  | `lucid-origin`   | High-quality artistic images with advanced parameter control ✨ |
| Phoenix                       | `phoenix`        | Professional-grade images with negative prompting support 🔥    |

## 📝 Example Requests

### Basic Request

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Cyberpunk landscape with neon cities
```

### Detailed Request

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Futuristic robot&model=dreamshaper&strength=0.8&guidance=7
```

### Dreamshaper Example

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Fantasy castle&model=dreamshaper&guidance=8&negative_prompt=blurry,low quality&height=768&width=768&num_steps=15&seed=42
```

### SD XL Lightning Example

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Space battle&model=sdxl-lightning&guidance=8&negative_prompt=blurry&height=1024&width=1024&num_steps=15```

### SD XL Example

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Future cityscape&model=sdxl&guidance=9&height=1536&width=1536&num_steps=18&seed=12345
```

### Flux Schnell Example

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Realistic portrait&model=flux-schnell&steps=6
```

### Lucid Origin Example

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Mystical forest&model=lucid-origin&guidance=6&height=1500&width=1500&num_steps=35
```

### Phoenix Example

```
GET https://ai-image-api.xeven.workers.dev/img?prompt=Futuristic city&model=phoenix&guidance=3&negative_prompt=blurry,low quality&height=1536&width=1536&num_steps=30
```

### Curl Example

```bash
curl -X GET "https://ai-image-api.xeven.workers.dev/img?prompt=Fantasy%20castle&model=dreamshaper" --output image.png
```

**Note:** Binary output can mess up your terminal. Use "--output -" to tell curl to output it to your terminal anyway, or consider "--output <FILE>" to save to a file.

### Curl Example with Parameters

```bash
curl -X GET "https://ai-image-api.xeven.workers.dev/img?prompt=Fantasy%20castle&model=flux-schnell" --output image.png
```

## 🛠️ Error Handling

-   Invalid routes return a 404 "Not Found" JSON response
-   Unsupported parameters fall back to default values

## 📁 Project Structure

```
src/
├── index.ts              # Main application entry point
├── handlers/
│   └── models.ts         # Model-specific request handlers
├── validators/
│   └── index.ts          # Parameter validation functions
└── types/
    └── index.ts          # TypeScript type definitions
```

### Architecture

-   **Modular Design**: Each model has its own handler and validation function
-   **Type Safety**: Full TypeScript support with proper type definitions
-   **Clean Separation**: Validation logic separated from business logic
-   **Extensible**: Easy to add new models by creating new handlers and validators

## 🚀 Development

### Adding a New Model

1.  **Add validation function** in `src/validators/index.ts`
2.  **Create model handler** in `src/handlers/models.ts`
3.  **Update types** in `src/types/index.ts` if needed
4.  **Add case** in main switch statement in `src/index.ts`
5.  **Update README** with new model documentation

### Local Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Type checking
npx tsc --noEmit

# Deploy to Cloudflare Workers
bun run deploy
```

### By Flux :

![alt text](/assets/pics/imgflux.jpg)

### By Stable Diffusion Base :

![sd-base](/assets/pics/img-sdbase.png)

### By Stable Diffusion Lightning :

![alt text](/assets/pics/img-sdxll.jpg)

### By Dreamshaper :

![alt text](/assets/pics/imgdream.png)

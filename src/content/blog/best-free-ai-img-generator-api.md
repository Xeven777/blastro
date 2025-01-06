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
https://ai-image-api.xeven.workers.dev
```

### Available Query Parameters

- `prompt` (optional): Your image description. Default: `Cyberpunk Dinosaur robot, modern, 3D render, 8K, HD`
- `model` (optional): Choose your AI model. Default Model: `SD XL Lightning`
- `strength` (optional): Image generation strength. Default: `1`
- `guidance` (optional): Guidance scale. Default: `7.5`

## 🎨 Models Available

| Model Name                    | Query Parameter  | Best For                                                        |
| ----------------------------- | ---------------- | --------------------------------------------------------------- |
| Stable Diffusion XL Lightning | `sdxl-lightning` | Fast, high-quality images < 5 secs 🚀                           |
| Stable Diffusion XL           | `sdxl`           | Balanced, professional images, highest quality < 12 secs 🖼️     |
| Flux Schnell                  | `flux-schnell`   | Best and most realistic model with quick generations < 6secs 🔥 |
| Dreamshaper                   | `dreamshaper`    | Fastest model < 2secs, low quality🌈                            |

## 📝 Example Requests

### Basic Request

```
GET /img?prompt=Cyberpunk landscape with neon cities
```

### Detailed Request

```
GET /img?prompt=Futuristic robot&model=dreamshaper&strength=0.8&guidance=7
```

### Dreamshaper Example

```
GET /img?prompt=Fantasy castle&model=dreamshaper
```

### SD XL Lightning Example

```
GET /img?prompt=Space battle&model=sdxl-lightning
```

### SD XL Example

```
GET /img?prompt=Future cityscape&model=sdxl
```

### Flux Schnell Example

```
GET /img?prompt=Realistic portrait&model=flux-schnell
```

### Curl Example

```bash
curl -X GET "https://ai-image-api.xeven.workers.dev/img?prompt=Fantasy%20castle&model=dreamshaper" --output image.png
```

**Note:** Binary output can mess up your terminal. Use "--output -" to tell curl to output it to your terminal anyway, or consider "--output <FILE>" to save to a file.

### Curl Example with Parameters

```bash
curl -X GET "https://ai-image-api.xeven.workers.dev/img?prompt=Fantasy%20castle&model=flex-schnell" --output image.png
```

## 🛠️ Error Handling

- Invalid routes return a 404 "Not Found" JSON response
- Unsupported parameters fall back to default values

### By Flux :

![flux](/assets/pics/imgflux.jpg)

### By Stable Diffusion Base :

![sd-base](/assets/pics/img-sdbase.png)

### By Stable Diffusion Lightning :

![sdxllightning](/assets/pics/img-sdxll.jpg)

### By Dreamshaper :

![dreamshaper](/assets/pics/imgdream.png)

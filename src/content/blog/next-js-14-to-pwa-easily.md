---
title: Next.Js 14 to PWA easily !
description: How to convert your Next.Js website to a Progressive Web App
author: Anish
pubDate: "2024-01-03T20:39:48+05:30"
heroImage: /assets/picsart_24-01-03_20-36-18-909.jpg
---

### So, You Want Your Next.js Website to Go From Web to "Wow, Dude, _Is That an App_?"

Yeah, yeah, progressive web apps, the future of the internet, blah blah blah. You've heard the buzz, seen the fancy icons in Chrome's address bar, and now you're itching to turn your Next.js site into the next big thing. ✨

So, Picture this: You've got a website. People love it. But what if they could love it even more? Enter PWA - your website's cool transformation into an app-like experience. Users can access your site offline, receive push notifications, and it loads faster than your cat when you shake the treat bag !! Sounds awesome right. So lets do it! 🚀

> I will be using latest _Next.js 14.0.4_ with _App-router_.
> (Cuz there are mostly blogs on the outdated pages router)

### 1. Install '_next-pwa_' :

`npm/bun i next-pwa`

`yarn add next-pwa`

We'll be using a little package called next-pwa, your friendly neighborhood PWA-izer.

### 2. Update your '_next.config.js_' :

```js
/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});
module.exports = withPWA({
  reactStrictMode: true,
});
```

We'll wrap the next.config with the PWA plugin we just installed.

### 3. Create _manifest.json_ & icon files

Use any favicon generator to generate icons💫 of different sizes. And also you can use any manifest generator out there . My personal favourite is [Favicon.io](https://favicon.io/) . The keep all the files you got in your public folder of the project.

![folderStructure](https://i.imgur.com/ZT8j5At.png)

**_manifest.json_** example :

```json
{
  "id": "AppName",
  "name": "AppName",
  "short_name": "",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#fff",
  "background_color": "#fff",
  "display": "standalone"
}
```

### 4. Update '_layout.tsx_ ' :

```js
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Your site name",
  description: "A cool description",

  manifest: "/manifest.json",

  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

// and everything else...
```

Add your manifest.json file in the metadata and set the icons too. Change the viewport themes and fix its sizes too (it aint necessary , but it'll make your webapp PWA efficient in Lighthouse metrics😉)

### 5. Set Up service workers :

🥱mmmmm... You know what?🥱 Just leave it! Our PWA is ready!🎉🪄
_'next-pwa'_ will automatically setup the service workers during the build process !!

```bash
public/sw.js
public/workbox-*.js
```

Just add these 2 lines to your .gitignore file, so that it doesn't get uploaded with your code. Don't worry as it'll be automatically generated when your app is being build by the server on Vercel/ Netlify (you can any of the two. I used and deployed in both and it works very smooth😊)

#### Examples:

- [Guessing Game](https://guess-d-num.netlify.app/)
- [GeminiAI Astrologer](https://gemini-the-astro.vercel.app/)

So yeah! _Voila_ ! Your Next.js website just evolved into a PWA😍, and users are now experiencing your site like never before🔥. They might not send you thank-you cards, but their increased engagement and seamless offline experience will speak volumes.
PWA is like magic on your Next.js masterpiece! Remember, it's not just about app-like fancy features, it's about giving your users a smoother, faster, more engaging experience. So, go forth, conquer the web, and don't forget the sprinkles! (P.S. If you get stuck, there are tons of resources online like Stack Overflow, Bard, ChatGpt, and hey, maybe [I'll write](mailto:anish7biswas@gmail.com) another blog post to help you out🤭.)

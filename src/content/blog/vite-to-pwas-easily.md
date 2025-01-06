---
title: Vite to PWAs easily!
description: Convert your Vite+React sites into PWAs
author: Anish
pubDate: "2024-01-16T18:26:20+05:30"
heroImage: /assets/screenshot_2024-01-16_18-25-07.png
---

### So, You Want Your Vite+React Website to Go From Web to "Wow, Dude, _Is That an App_?"

Yeah, yeah, progressive web apps, the future of the internet, blah blah blah. You've heard the buzz, seen the fancy icons in Chrome's address bar, and now you're itching to turn your vite+react site into the next big thing. ✨

So, Picture this: You've got a website. People love it. But what if they could love it even more? Enter PWA - your website's cool transformation into an app-like experience. Users can access your site offline, receive push notifications, and it loads faster than your cat when you shake the treat bag !! Sounds awesome right. So lets do it! 🚀

### 1. Install '_vite-plugin-pwa_' :

`npm/bun i vite-plugin-pwa`

`yarn add vite-plugin-pwa`

We'll be using a little package called vite-plugin-pwa, your friendly neighborhood PWA-izer.

### 2. Update your '_vite.config.js_' :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), VitePWA()],
});
```

We'll wrap the vite.config with the PWA plugin we just installed. For most minimal cases (without taking in count- caching) this will enough.

### 3. Create _manifest.json_ & icon files

Use any favicon generator to generate icons💫 of different sizes. And also you can use any manifest generator out there . My personal favourite is [Favicon.io](https://favicon.io/) . The keep all the files you got in your public folder of the project.

![folderStructure](https://i.imgur.com/ZT8j5At.png)

**_manifest.json_** example :

```json
{
  "id": "AppName",
  "name": "AppName",
  "short_name": "AppName",
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

### 4. Modify your HTML head tags :

```html
<link rel="manifest" href="/site.webmanifest" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
```

Add your manifest.json file in the metadata and set the icons too.

### 5. Set Up service workers :

🥱mmmmm... You know what?🥱 Just leave it! Our PWA is ready!🎉🪄
_'vite-plugin-pwa'_ will automatically setup the service workers during the build process !!

Just add these 2 lines to your .gitignore file, so that it doesn't get uploaded with your code. Don't worry as it'll be automatically generated when your app is being build by the server on Vercel/ Netlify (you can any of the two. I used and deployed in both and it works very smooth😊)

#### Examples:

- [Currency Convertor](https://currency-convertor7.netlify.app/)
- [Simplifyy Site](https://simplifyy.vercel.app/)

So yeah! _Voila_ ! Your vite+react website just evolved into a PWA😍, and users are now experiencing your site like never before🔥. They might not send you thank-you cards, but their increased engagement and seamless offline experience will speak volumes.
PWA is like magic on your Next.js masterpiece! Remember, it's not just about app-like fancy features, it's about giving your users a smoother, faster, more engaging experience. So, go forth, conquer the web, and don't forget the sprinkles! (P.S. If you get stuck, there are tons of resources online like Stack Overflow, Bard, ChatGpt, and hey, maybe [I'll write](mailto:anish7biswas@gmail.com) another blog post to help you out🤭.)

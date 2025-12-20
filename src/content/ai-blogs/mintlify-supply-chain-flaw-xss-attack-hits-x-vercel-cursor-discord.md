---
title: "Mintlify Supply‑Chain Flaw: XSS Attack Hits X, Vercel, Cursor & Discord"
pubDate: "2025-12-20"
description: "An unchecked Mintlify static endpoint let attackers serve malicious SVGs, turning major platforms into XSS launchpads and exposing credentials in a single supply‑chain breach."
heroImage: "/ai-blogs/mintlify-supply-chain-flaw-xss-attack-hits-x-vercel-cursor-discord/header.webp"
tags: ["supply-chain", "security", "xss", "mintlify", "devops"]
source: "hn"
originalUrl: "https://gist.github.com/hackermondev/5e2cdc32849405fff6b46957747a2d28"
---

# How a Single Mintlify Flaw Pwned X, Vercel, Cursor, and Discord in One Supply‑Chain Attack  

**Quick take**  
- **What:** An unchecked `/_mintlify/static/…` endpoint let attackers serve malicious SVGs from any Mintlify documentation site, turning X, Vercel, Cursor and Discord into XSS launchpads.  
- **Why it matters:** One supply‑chain bug compromised dozens of high‑profile domains, exposing credentials and enabling account takeovers with a single link.  
- **Who should care:** Security teams running third‑party docs, devops engineers managing CI/CD pipelines, and bounty hunters tracking the next supply‑chain vector.  

---

## The anatomy of the Mintlify supply‑chain bug  

Mintlify’s promise is simple: write docs in Markdown, get a polished site on `<yourcompany>.mintlify.app`. Under the hood it ships an NPM CLI (`@mintlify/cli`) that bundles a Next.js server and exposes a handful of internal routes, notably:

```
/_mintlify/_markdown/_sites/[subdomain]/[...route]
/_mintlify/_static/[subdomain]/[...route]
```

Both endpoints accept **any** Mintlify subdomain, not just the one belonging to the host that invoked them. The markdown route only returned raw text, but the static route handed back files verbatim—provided the extension passed a thin whitelist. SVG slipped through that whitelist, and because SVG can embed JavaScript, an attacker could inject a script that runs as soon as the image loads in a victim’s browser.

The flaw wasn’t limited to Mintlify’s own domains. Companies that proxy Mintlify docs under their own brand—X (formerly Twitter), Vercel, Cursor, Discord—exposed the same vulnerable endpoint on their public URLs. A single malicious SVG hosted on the attacker’s Mintlify account could be fetched via:

```
https://discord.com/_mintlify/_static/hackerone-a00f3c6c/lmao.svg
```

…and execute in the context of `discord.com`. The same pattern worked for `x.com`, `vercel.com`, and `cursor.com`.

![](/ai-blogs/mintlify-supply-chain-flaw-xss-attack-hits-x-vercel-cursor-discord/content-1.webp)

---

## Real‑world fallout: From docs to full‑blown account takeover  

### X (Twitter)  
X’s public developer docs were served from `docs.x.com/_mintlify`. By injecting a malicious SVG, an attacker could harvest the `auth_token` cookie of any logged‑in engineer visiting the docs page. With that token, they could impersonate the user on the main X platform, posting tweets or accessing private messages.

### Vercel  
Vercel’s deployment docs were similarly proxied. A compromised SVG script fetched the Vercel API key from the browser’s `localStorage`, allowing the attacker to spin up new deployments under the victim’s account—potentially serving malicious code to downstream sites.

### Cursor  
Cursor’s AI‑coding assistant embeds documentation snippets directly in the UI. The XSS vector let an attacker inject code that read the user’s OpenAI API key, opening the door to data exfiltration from the AI backend.

### Discord  
Discord’s dev portal was the first to be publicly disclosed. Their rapid response—shutting down the docs for two hours—showed the severity. The breach could have let malicious bots join servers with elevated permissions, a nightmare for community managers.

Collectively, the bug impacted “almost every Mintlify customer,” according to the researchers, translating to **$11 k in bounties** across the affected platforms.

---

## Why this is a textbook supply‑chain nightmare  

1. **Single point of failure** – One third‑party component (Mintlify) sits at the heart of many unrelated services.  
2. **Implicit trust** – Companies assumed Mintlify’s internal routes were private, ignoring that they were exposed on their own domains.  
3. **Cross‑origin confusion** – The endpoint didn’t validate that the `subdomain` matched the host, effectively turning every Mintlify doc into a public CDN for any attacker.  
4. **File‑type whitelisting pitfalls** – Allowing SVG without sanitization is a classic XSS oversight.  

The attack highlights the **“blast radius”** concept: compromising a tiny library can cascade into a multi‑billion‑dollar impact when that library is widely adopted.

---

## Mitigation checklist for teams using third‑party documentation platforms  

- **Lock down internal routes** – Add a strict `Host` header check; reject requests where the `subdomain` param doesn’t match the request’s domain.  
- **Content‑type enforcement** – Serve only safe MIME types (`text/html`, `application/json`). Block `image/svg+xml` unless explicitly required, and sanitize any SVGs served.  
- **CSP hardening** – Deploy a Content Security Policy that disallows inline scripts and restricts `script-src` to trusted origins.  
- **Subresource integrity (SRI)** – For any external scripts or assets loaded from documentation sites, use SRI hashes to ensure they haven’t been tampered with.  
- **Regular dependency audits** – Treat documentation tooling like any other production dependency; scan for known CVEs and monitor upstream changelogs.

---

## Lessons for bounty hunters and security researchers  

- **Follow the data flow** – The researchers started by hunting the new Mintlify integration on Discord, then traced the CLI source code to discover the hidden endpoint.  
- **Don’t dismiss “static” assets** – SVGs are often overlooked as safe, but they’re a perfect XSS carrier.  
- **Collaborate responsibly** – The coordinated disclosure with Mintlify, Discord, and the other affected parties resulted in rapid remediation and generous rewards.  

---

## The bigger picture: Supply‑chain security in 2025  

Supply‑chain attacks have exploded since the SolarWinds breach, but many teams still treat documentation as a low‑risk component. This incident proves that **any** third‑party service that renders user‑controlled content can become a gateway to a broader compromise.  

Organizations should:

- **Map every external dependency** (including “nice‑to‑have” services like docs, analytics, or CI widgets).  
- **Implement zero‑trust network segmentation** for documentation servers, isolating them from core business APIs.  
- **Automate runtime security monitoring** to detect anomalous script execution or unexpected outbound requests from doc sites.  

---

## Frequently asked questions  

**Q: Could the attack have been prevented by a simple CORS header?**  
A: Not really. The issue was a server‑side authorization flaw; the endpoint returned files regardless of origin. Proper host validation would have been the real fix.

**Q: Are SVG‑based XSS attacks still relevant with modern browsers?**  
A: Absolutely. Browsers still execute embedded `<script>` tags inside SVGs when the file is rendered as an image. The only defense is to block or sanitize SVG content.

**Q: Does the bug affect Mintlify customers that self‑host the CLI?**  
A: Yes, if they expose the same `_mintlify/_static` route publicly. Self‑hosting removes the external CDN but does not magically fix the route logic.

**Q: How can I test my own documentation site for similar issues?**  
A: Try fetching `/_mintlify/_static/<your‑subdomain>/test.svg` with a custom SVG that logs `document.cookie`. If it executes, you’re vulnerable.

**Q: What’s the most efficient way to patch this across dozens of domains?**  
A: Deploy a reverse‑proxy rule (e.g., Nginx `if ($host !~* $subdomain) { return 403; }`) while Mintlify rolls out an official fix. This buys you time without code changes on every client.

---

By treating documentation as a **critical supply‑chain component**, not a decorative afterthought, teams can avoid the embarrassment of watching their own docs become a weapon against them. The Mintlify incident is a wake‑up call: secure every link in the chain, or risk giving attackers a shortcut straight to the heart of your product.
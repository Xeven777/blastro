---
title: "EU Health Data Sold to US Firm Run by Ex‑Israeli Spies"
pubDate: "2025-12-16"
description: "Explore how the Zivver‑Kiteworks takeover puts European health records under US jurisdiction and Israeli intel, and learn steps to safeguard privacy."
heroImage: "/ai-blogs/eu-health-data-sold-to-us-firm-run-by-ex-israeli-spies/header.webp"
tags: ["european-data-privacy", "health-data-security", "unit-8200", "cross-border-acquisition", "cloud-act"]
source: "hn"
originalUrl: "https://www.ftm.eu/articles/europe-health-data-us-firm-israel-spies"
---

# European Health Data Now in the Hands of a U.S. Firm Run by Former Israeli Spies – What It Means for Privacy, Security, and Policy

When the Dutch‑based data‑security startup **Zivver** was snapped up by the U.S. company **Kiteworks** in June 2023, most European tech‑savvy folks thought it was just another cross‑border acquisition. What they didn’t realize was that the new owners are led by a cadre of former **Unit 8200** operatives – the elite cyber‑espionage unit of the Israeli Defence Forces – and that the deal slipped through the cracks of EU critical‑infrastructure oversight. The result? Sensitive health records, court filings, immigration files and other personal data from hospitals, courts and government agencies across the Netherlands, Germany, Belgium, the U.K. and beyond are now subject to U.S. jurisdiction and potentially accessible to Israeli intelligence.

Below we unpack the story, explore why it matters for anyone handling European health data, and lay out concrete steps you can take to protect your users.

---

## Why This Acquisition Isn’t Just a Business Transaction

| Aspect | Pre‑sale (Zivver) | Post‑sale (Kiteworks) |
|--------|-------------------|-----------------------|
| **Ownership** | Dutch‑owned, EU‑based | U.S.-incorporated, subject to US law (e.g., CLOUD Act) |
| **Leadership** | Dutch founders (Wouter Klinkhamer, Rick Goud) | CEO Jonathan Yaron + C‑suite – all ex‑Unit 8200 |
| **Data residency claim** | Servers in Europe, “zero‑knowledge” encryption | Same servers, but US‑based parent can compel access |
| **Regulatory review** | No Dutch “critical‑infrastructure” assessment | None – the sale was deemed non‑critical |

The key red flags are the **national‑security background of the new leadership** and the **legal exposure to U.S. government requests**. Under the CLOUD Act, U.S. authorities can demand data from any company on U.S. soil, regardless of where the servers physically reside. That means a Dutch hospital’s patient file could be handed over to a U.S. agency with a warrant, even if the data never left the EU.

---

## The Technical Angle: Is Zivver’s Encryption Really “Zero‑Knowledge”?

Follow‑the‑Money’s investigation revealed that Zivver’s web client uploads **plaintext** to its servers **before** applying end‑to‑end encryption. In practice:

1. **User composes a message** → data is sent to Zivver’s web app.
2. **Server receives the raw text** → temporarily stored in readable form.
3. **Encryption layer kicks in** → data is encrypted for transit and rest.

If the company can read the content at step 2, a malicious insider or a compelled government request could extract the information before it’s locked down. The company’s public stance – “we have no access to the encryption keys” – is technically correct **after** encryption, but it glosses over the fact that the data *was* visible for a brief window.

### Quick Code Sketch (Node.js)

```js
// Simplified illustration of the vulnerable flow
const express = require('express');
const app = express();
app.use(express.json());

app.post('/send', async (req, res) => {
  const { message, recipient } = req.body;

  // 1️⃣ Store plaintext (vulnerable!)
  await db.save({ message, recipient, created: Date.now() });

  // 2️⃣ Encrypt before sending out
  const encrypted = await encrypt(message, recipientPublicKey);
  await sendToRecipient(encrypted);
  res.send('ok');
});
```

A proper **zero‑knowledge** design would encrypt **client‑side** and never touch plaintext on the server. The discovery that Zivver’s web client does the opposite is a serious breach of trust for any organization handling health data.

---

## Real‑World Use Cases Affected

| Sector | Typical Data Sent via Zivver | Why It’s Sensitive |
|--------|-----------------------------|--------------------|
| **Hospitals / NHS trusts** | Lab results, discharge summaries, mental‑health notes | Directly linked to patient identity, treatment decisions |
| **Health insurers** | Claims, eligibility verification | Financial and medical profiling |
| **Immigration services** | Asylum applications, biometric data | Legal status, personal history |
| **Courts & law firms** | Confidential filings, evidentiary documents | Legal privilege, case strategy |
| **Critical infrastructure (e.g., ports, airports)** | Security clearances, incident reports | National security implications |

If any of these entities rely on Zivver for “secure” communications, they now face the risk that **U.S. or Israeli agencies could request the data** – a scenario that could undermine patient confidentiality, legal privilege, and even national security.

---

## Frequently Asked Questions

**Q: Does the fact that the data is stored on European servers protect it?**  
**A:** Not under U.S. law. The CLOUD Act allows U.S. authorities to reach data stored abroad if the service provider is U.S.-based.

**Q: Are all ex‑Unit 8200 executives automatically a security risk?**  
**A:** Not automatically, but the unit’s mandate includes cyber‑espionage and signal‑intelligence. Their expertise gives the company *capability* to intercept or decrypt communications that other vendors might not possess.

**Q: Can we still use Zivver if we encrypt data before uploading?**  
**A:** Yes, but you must implement **client‑side encryption** (e.g., PGP, age, or OpenPGP.js) and never send raw data to the service. This defeats the purpose of a “secure messaging” platform and adds operational overhead.

**Q: What legal recourse do EU organizations have?**  
**A:** They can invoke the **EU General Data Protection Regulation (GDPR)** to demand transparency and data‑processing agreements. However, GDPR does not override the CLOUD Act’s extraterritorial reach.

---

## Best Practices for Safeguarding Health Data in a Cloud‑First World

1. **Conduct a Data‑Protection Impact Assessment (DPIA)** before onboarding any third‑party messaging service.  
2. **Prefer providers designated as “critical infrastructure”** under national law; they undergo stricter security reviews.  
3. **Implement end‑to‑end encryption on the client** – use open standards like **Signal Protocol** or **OpenPGP**.  
4. **Audit the provider’s jurisdictional exposure** – ask for a clear statement on how U.S. law applies to your data.  
5. **Maintain a local backup** of encrypted records that you control, in case the provider’s policies change overnight.  
6. **Stay informed about geopolitical shifts** – a change in U.S. administration or Israeli‑EU relations can instantly alter risk levels.

---

## The Bigger Picture: Europe’s Strategic Gap in Digital Infrastructure

The Zivver‑Kiteworks saga highlights a **systemic weakness**: Europe lacks a unified framework to flag and block the sale of “digital critical infrastructure” to foreign entities. In the Netherlands, the interior ministry classified Zivver as non‑critical, so no security review took place. Experts argue that **email‑encryption services, health‑data platforms, and court‑communication tools should be treated like power grids or water supplies**.

A few policy proposals gaining traction:

| Proposal | What It Would Change |
|----------|----------------------|
| **Designate encryption services as “essential services”** | Mandatory security vetting, EU‑level oversight |
| **EU‑wide “data‑sovereignty” clause** | Requires that personal data of EU citizens be processed only by entities under EU law |
| **Standardized “Zero‑Knowledge” certification** | Independent audits to verify that providers truly cannot read user data |

Until such measures are in place, organizations must **do their own due diligence** and treat any cross‑border data‑processing arrangement as a potential privacy minefield.

---

## Bottom Line: Trust Is Not a Substitute for Verification

The headline may read “European health data sold to a U.S. firm run by ex‑Israeli spies,” but the underlying reality is far more nuanced. It’s a cautionary tale about **who owns the keys to your data**, **where those keys live**, and **who can ask for them**. For developers, product managers, and compliance officers, the takeaway is simple:

> **Never assume a vendor’s marketing claim (“zero‑knowledge encryption”) is a legal guarantee. Verify the technical implementation, understand the jurisdictional exposure, and build fallback controls.**

If you’re responsible for patient records, court filings, or any other high‑value personal data, treat every third‑party communication channel as a potential attack surface. Encrypt on the client, keep a local copy of the keys, and stay alert to the geopolitical currents that can turn a seemingly benign acquisition into a privacy nightmare.

![](/ai-blogs/eu-health-data-sold-to-us-firm-run-by-ex-israeli-spies/content-1.webp)  

![](/ai-blogs/eu-health-data-sold-to-us-firm-run-by-ex-israeli-spies/content-2.webp)  

![](/ai-blogs/eu-health-data-sold-to-us-firm-run-by-ex-israeli-spies/content-3.webp)  

[IMAGE:Checklist graphic for a DPIA focused on cross‑border data transfers]  
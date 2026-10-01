# Chatbot Global — Site Plan

Living document. Update it whenever a decision is made or a step is finished. If this file and the code disagree, ask the owner which is right.

## Business goal
Chatbot Global sells chatbots to small businesses. **Carpet cleaning companies are the first focus.** More industries (HVAC, plumbing, landscaping, etc.) will be added later, so the site must be easy to extend without rebuilding.

## Business context
The full business plan lives in a separate project: `C:\Users\Alfred Johnson\Documents\Chatbot Global Business\BUSINESS-PLAN.md`. It is not loaded here. Only the facts the website needs are kept below in Positioning; if a business decision changes them, update this section.

## Positioning
- **Core message: no risk, proof first.** Business owners are tired of paying up front for products that don't work or only "might" work. Chatbot Global gets the client a lead first and gets paid only after that. Lead with this on the home page.
- **Home page headline direction (owner, 2026-09-24):** "Get a free chatbot for your business so you never miss another customer." For details, visitors talk to the assistant, which is the chatbot on the home page itself.
- Hook line candidate: "Are you tired of paying for products that don't work?"
- Wording caution: promise "you pay only after you get a lead," not that a certain number of leads is guaranteed. Avoid claims we can't back up until the owner confirms exactly what is promised.
- **Home page** advertises Chatbot Global as a **pay-per-lead chatbot service**. This is the unique angle: businesses pay for leads, not for software. Chatbot details will be added later by the owner, so keep chatbot specifics generic until then.
- **Second page** concentrates on carpet cleaning companies.
- **No pricing section or plans on the site.** The chatbot is free and clients pay only a very low amount per lead, billed automatically. Say that simply ("free chatbot, pay only for leads"); do not show tiers or a pricing table. The old `index.html` Starter/Growth/Enterprise plans must be dropped.
- Do not publish a specific per-lead price until the owner confirms one.

## Home page chatbot (centerpiece)
The home page is built around a live assistant chatbot (SimpleBot embed, bot 3791), not a static brochure. Confirmed flow (owner, 2026-10-01):
- Visitor chats with the assistant for all questions (free bot, pay per lead).
- Visitor shares their website and email in the chat.
- An n8n flow, triggered from the bot, scrapes the visitor's site and builds a REAL demo page: a working page styled like their site with a chatbot filled with carpet cleaning knowledge, not just a recolored widget.
- The bot sends the visitor a follow-up email (presumably with the demo page link; confirm).
- The demo is NOT instant/client-side. The home page should set that expectation (e.g. "get a demo page built and emailed to you"), not promise an on-page preview.

## Audience
- **Ideal customer (owner, 2026-09-24): anyone who controls their business website, any industry.** Carpet cleaning companies are the first focus, reached through location-specific pages (see Site structure). The bot should confirm the visitor controls the site, since the demo and install depend on it.
- Primary carpet buyer size (owner-operator vs multi-crew): still open.
- What they care about: TBD

## What the bot does
TBD — confirm with owner before writing copy. Candidates: lead capture, booking jobs, answering pricing questions, after-hours coverage, service-area checks, repeat-cleaning follow-ups. **Do not invent features not listed here.**

## Site structure
```
/                              Home: umbrella brand + industry tabs
/carpet-cleaning/              Landing page (build first)
/carpet-cleaning/<city>/       Location pages aimed at carpet cleaning companies in each area (owner plans many)
/carpet-cleaning/how-it-works/ Supporting pages (SEO); explains free bot + pay per lead
/carpet-cleaning/faq/
/carpet-cleaning/lead-capture-chatbot/
/hvac/  /plumbing/  ...        Later industries, same template
/blog/                         Articles targeting industry search terms
/about/  /contact/
/shared/                       Common CSS, logo, chat widget code
```

### Home page tabs
- Tab bar: Carpet Cleaning | HVAC | Plumbing | Landscaping (placeholders except carpet cleaning).
- Each tab shows a short preview of the offer plus a button to that industry's landing page.
- **Decision:** panel content lives in the HTML (not JS-only) so it can be indexed, and each tab links to a real URL.
- Carpet cleaning is featured; other industries are "coming soon."

### Landing pages
- One per industry, own URL, title, meta description, and keywords.
- Later industries copy the carpet-cleaning template and swap copy, examples, and demo conversation.

## Location pages (carpet cleaning)
- Purpose: rank for carpet cleaning companies searching in a given city/area. The visitor is the cleaning company, not its end customer.
- Each page needs genuinely unique content (local details, examples, a demo bot in that area's context), not a swapped city name. Near-duplicate pages risk being ignored or penalised by search engines.
- Open: which locations first, and a URL pattern (e.g. /carpet-cleaning/las-vegas/).

## SEO
- Larger site with many supporting pages per industry helps ranking; each links back to its landing page.
- Per page: unique title + meta description, one H1, clean URLs.
- Site-wide: sitemap.xml, robots.txt, schema markup (Organization, FAQ, Service).
- Target keywords: TBD (e.g. "AI chatbot for carpet cleaning companies").

## Tech
- Static HTML, Tailwind via CDN, served locally with `node serve.mjs` (see CLAUDE.md for design and screenshot rules).
- Revisit a static site generator (e.g. Astro) if the page count grows large enough that shared templates are needed.

## Brand
- Assets are in `brand_assets/` (logo, light logo, icon). Use them; do not invent brand colors.

## Build order and status
- [~] 1. Home page: owner prefers the ORIGINAL index.html design (cream/coral, Fraunces + DM Sans) with Scrollcraft scroll effects added (2026-09-24). Effects done: layered hero parallax, pinned how-it-works, magnetic CTA. Copy is still the old multilingual page and needs rewriting (see Open questions). The dark chat-workspace alternative is kept at scrollcraft/builds/home/ (SimpleBot embed, bot 3791). Original saved at scrollcraft/builds/index.original.html.
- [ ] 2. Build carpet-cleaning landing page
- [ ] 3. Supporting pages (how it works, FAQ, use cases) and shared SEO files
- [ ] 4. Blog
- [ ] 5. Additional industries

Note: the existing `index.html` is an earlier generic "multilingual support chatbot" page and will be replaced by step 1.

## Decisions log
- Page sections stay (full real HTML text, not trimmed to just hero + chat), because real crawlable copy is better for SEO than a page that defers everything to the chat widget (chat content is not reliably indexed). Each section's job is still to fun­nel toward the chat. Decided 2026-10-01.
- Site is one brand with one landing page per industry (not a single page).
- Tabs on the home page are real links for SEO.
- Carpet cleaning is built first.
- Home page message is the pay-per-lead chatbot service; the carpet-cleaning page is the second page.
- No pricing structure on the site: free chatbot, pay only per lead.
- Home page centers on a live chatbot that offers a demo in the visitor's own site style and shows autonomous actions (follow-up email, auto-created demo bot). Headline: free chatbot so you never miss a customer.
- Core message is risk-free, proof first: the client gets a lead before we get paid.
- The site does not mention a guaranteed number of leads, and does not mention website, SEO, or other add-on services. Those upsells go in a follow-up email after leads are delivered.

## Open questions
0b. Original index.html copy conflicts with this plan: pricing tiers, 60+ languages, and invented stats/testimonial/logos. Rewrite to the free-chatbot, pay-per-lead message when the owner says go.
0a. RESOLVED 2026-09-24: the home chat is the owner's SimpleBot embed (script https://platform.simplebotinstall.com/w/chat_form_plugin.js, data-bot-id 3791, renders into <div id="chat_form">). Greeting text, colors and flow are edited in the bot platform, not on the site. Open: does the bot itself collect website/business/email/phone and send the follow-up email and build the demo bot?
0. Does the home page still use industry tabs, or is it now a single pay-per-lead pitch that links to the carpet page? (Tabs were discussed earlier; confirm.)
1. Who is the primary carpet-cleaning buyer?
2. What exactly does the bot do?
3. Which industries appear as tabs?
4. Is there pricing, a demo, or a booking link for the call to action? (Default: "Book a demo" placeholder.)

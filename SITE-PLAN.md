# Chatbot Global — Site Plan

Living document. Update it whenever a decision is made or a step is finished. If this file and the code disagree, ask the owner which is right.

## Business goal
Chatbot Global gives small businesses a **free chatbot** (owner, 2026-11-04). Paid upgrades will come later; their number, names and prices are undecided, so the site says nothing about them yet. (Before 2026-11-04 the model was pay per completed job; see the Decisions log.) **Service companies are the focus (owner, 2026-10-31), replacing carpet cleaning as the first focus.** Which service companies are in scope is TBD in the business plan. The sections below that describe carpet cleaning pages reflect the earlier plan and what is already built; see Open question 00 before building more of them.

## Business context
The full business plan lives in a separate project: `C:\Users\Alfred Johnson\Documents\Chatbot Global\03-Branding\BUSINESS-PLAN.md`. It is not loaded here. Only the facts the website needs are kept below in Positioning; if a business decision changes them, update this section.

## Positioning
- **Core message: a free chatbot (changed by owner 2026-11-04; was no-risk pay per completed job).** Business owners are tired of paying for products that don't work. Lead with the free chatbot and a working demo to try. Do not mention paid upgrades, a number of upgrades, prices, or pay-per-job anywhere on the site until the owner decides. Whether to mention upgrades on the home page at all is open (Open question 0c).
- **Home page headline direction (owner, 2026-09-24):** "Get a free chatbot for your business so you never miss another customer." For details, visitors talk to the assistant, which is the chatbot on the home page itself.
- Hook line candidate: "Are you tired of paying for products that don't work?"
- **Delivery (owner, 2026-11-04; applied across home, carpet-cleaning and privacy pages the same day; there is now no "demo" step on the home page, only chat, share details, get code, install):** after the visitor shares their details, the owner sends them a code for the bot, they install it on their own site, and it is up and running the same day. Say this on the home and carpet-cleaning pages. The code is sent by email (owner, 2026-11-04). Open: whether "same day" holds for every site platform.
- **Demo requests (owner, 2026-11-04):** the home-page assistant will be on all pages. Visitors request a demo with a "Get a demo by email" button (home page hero, free strip and closing banner; carpet-cleaning free strip and closing banner). It opens a small form (service + email, `demo-request.js`) that POSTs JSON `{ email, service, page, requestedAt }` to `https://n8n.chatbotglobal.com/webhook/demo-request`. The n8n workflow "Demo Request → Email Demo Bot" (ID Mq6GV7JHnVEAs0kY) exists and is active as of 2026-11-09: it picks the demo bot for the service and emails the visitor its link. The live form has not been tested end to end yet. The assistant points visitors to the button and never gives a demo link in the chat. **Service list (owner, 2026-11-04):** the form lists 20 service types alphabetically plus "Other"; the master list, priorities and demo-bot status are in `08-Aminos/demo-services.md`, and names must match it exactly (n8n looks them up). Open: whether the demo and the install code are one email or two; whether the carpet-cleaning page keeps its own demo bot or also uses the all-pages assistant (Open question 00).
- **Sign-up page (owner, 2026-11-04):** `get-started/index.html` at chatbotglobal.com/get-started. Form: name, email, business name, website, kind of service (same 20-item list plus Other; `?service=hvac` preselects), can they edit their website, phone (optional). POSTs JSON to `https://n8n.chatbotglobal.com/webhook/signup` (n8n workflow "Chatbot Sign-up → Alert Owner + Confirm", ID LPqI1s87a0X1kRpJ, active in n8n as of 2026-11-09): the owner gets every detail by email, the visitor gets a short confirmation, and the owner sends the code by hand. All 19 Aminos demo pages (platform.simplebotinstall.com/demo/services/<service>-demo) have a "Get your free bot now" button linking here, so this page must be published before those buttons work. Not yet linked from the home page.
- **Why the chatbot is free, the "catch" (owner, 2026-11-04):** "Yes, there is a catch. I could easily sell this chatbot for $49 a month. I'm giving it away because I want to help you get new clients, so you'll use me for the other services I offer." Shown in the owner's voice in a "So what's the catch?" section on the home page (after the Free section) and as a carpet-cleaning FAQ entry (also in its FAQPage schema). Other services are mentioned only as existing and always the visitor's choice; they are not named or priced.
- Wording caution: say only that the chatbot is free to get started. Do not promise a number of leads or jobs, and do not claim "no card", "no catch" or similar until the owner confirms exactly what is promised.
- **Home page** advertises Chatbot Global as a **free chatbot** for service companies. Chatbot details will be added later by the owner, so keep chatbot specifics generic until then.
- **Service pages:** one page per service, each with a demo bot for that service that also sells the chatbot. Carpet cleaning is the first (owner, 2026-11-01).
- **No pricing section or plans on the site.** The chatbot is free (owner, 2026-11-04). Say that simply; do not show tiers, a pricing table, or any count of paid upgrades. The old `index.html` Starter/Growth/Enterprise plans must stay dropped.
- **Superseded 2026-11-04:** the pay-per-completed-job model and the flat $10 per job (owner, 2026-11-01). Kept here only as history; do not put either on the site. Whether $10 per job survives as part of a paid upgrade is undecided.

## Home page chatbot (centerpiece)
The home page is built around a live assistant chatbot (SimpleBot embed, bot 3791), not a static brochure. Since 2026-10-21 it is a floating corner chat icon (`chat_plugin.js`), not an in-page chat card, so it is visible without scrolling. Every "Chat with the assistant" / "Try the demo" button carries `data-open-chat` and opens that corner chat. The hero's right column is a short "Free demo" panel explaining the three steps. Confirmed flow (owner, 2026-10-01):
- Visitor chats with the assistant for all questions (free bot).
- Visitor shares their details in the chat.
- The home page bot is a lead generator. Demos live on service pages, one demo bot per service (owner, 2026-11-01). The bot links the visitor to the matching service page if one exists. The per-visitor demo page built by n8n is dropped for now, which replaces the 2026-10-01 flow.

## Audience
- **Ideal customer (owner, 2026-09-24): anyone who controls their business website, any industry.** Service companies are now the focus (2026-10-31); whether this wider "any industry" audience still stands is being confirmed in the business plan. The bot should confirm the visitor controls the site, since the demo and install depend on it.
- Primary carpet buyer size (owner-operator vs multi-crew): still open.
- What they care about: TBD

## What the bot does
TBD — confirm with owner before writing copy. Candidates: lead capture, booking jobs, answering pricing questions, after-hours coverage, service-area checks, repeat-cleaning follow-ups. **Do not invent features not listed here.**

## Site structure
```
/                              Home: umbrella brand + industry tabs
/carpet-cleaning/              Landing page (build first)
/carpet-cleaning/<city>/       Location pages aimed at carpet cleaning companies in each area (owner plans many)
/carpet-cleaning/how-it-works/ Supporting pages (SEO); explains the free chatbot
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
- [~] 1. Home page: owner prefers the ORIGINAL index.html design (cream/coral, Fraunces + DM Sans) with Scrollcraft scroll effects added (2026-09-24). Effects done: layered hero parallax, pinned how-it-works, magnetic CTA. Copy rewritten 2026-11-01 for service companies, then again 2026-11-04 to a free-chatbot message (no pay-per-job, no paid-upgrade mention); awaiting owner review. The dark chat-workspace alternative is kept at scrollcraft/builds/home/ (SimpleBot embed, bot 3791). Original saved at scrollcraft/builds/index.original.html.
- [~] 2. Carpet-cleaning landing page: first draft at carpet-cleaning/index.html (2026-10-21). Same design as home, same corner bot (3791). Sections: hero + example conversation, why it matters, knows carpet cleaning, how it works, no risk, FAQ (with FAQPage/Service schema), CTA. Copy avoids unconfirmed features and prices; moved to the free-chatbot message 2026-11-04; awaiting owner review.
- [ ] 3. Supporting pages (how it works, FAQ, use cases) and shared SEO files
- [ ] 4. Blog
- [ ] 5. Additional industries

Note: the existing `index.html` is an earlier generic "multilingual support chatbot" page and will be replaced by step 1.

## Decisions log
- Page sections stay (full real HTML text, not trimmed to just hero + chat), because real crawlable copy is better for SEO than a page that defers everything to the chat widget (chat content is not reliably indexed). Each section's job is still to fun­nel toward the chat. Decided 2026-10-01.
- Site is one brand with one landing page per industry (not a single page).
- Tabs on the home page are real links for SEO.
- **Free chatbot, paid upgrades later (owner, 2026-11-04).** Replaces the pay-per-completed-job model (owner, 2026-11-01), which had replaced pay per lead. Older entries below that mention pay per job or pay per lead are history, not current. The site does not mention paid upgrades or how many there will be; the home page's treatment is open (Open question 0c). Home, carpet-cleaning pages updated; `privacy/index.html` still has invoicing wording (Open question 0d).
- The business focus moved from carpet cleaning to service companies (owner, 2026-10-31). The earlier decisions to build carpet cleaning first and make it the second page are under review (Open question 00).
- Home page message is a free chatbot (owner, 2026-11-04; was pay per completed job, 2026-11-01; was pay per lead before that).
- No pricing structure on the site: free chatbot, no paid-upgrade details yet (updated 2026-11-04).
- Home page centers on a live chatbot that offers a demo in the visitor's own site style and shows autonomous actions (follow-up email, auto-created demo bot). Headline: free chatbot so you never miss a customer.
- Core message is a free chatbot with a working demo to try first (updated 2026-11-04). Replaces the 2026-11-01 "client completes a job before we get paid" message.
- The site does not mention a guaranteed number of leads, and does not mention website, SEO, or other add-on services. Those upsells go in a follow-up email after leads are delivered.
- The chatbot is a floating corner icon (SimpleBot `chat_plugin.js`), replacing the in-page chat card and the coral #launcher button. The owner did not like having to scroll to reach the card. Decided 2026-10-21.

## Open questions
00. Service pages (2026-11-01): carpet-cleaning/index.html still loads the home page bot (data-bot-id 3791). Its copy now says the chat is a carpet cleaning demo, so swap in the demo bot's ID before pushing. Do the city pages and industry tabs still apply? Hold further carpet-specific building until the owner decides.
0b. Original index.html copy conflicts with this plan: pricing tiers, 60+ languages, and invented stats/testimonial/logos. Rewritten to the free-chatbot message 2026-11-04.
0c. Partly resolved 2026-11-04: the home page now says other services exist (in the catch section) without naming or pricing them. Still open: should the home page mention that paid upgrades exist, and if so where and how (footer, FAQ, chat only)? The owner is unsure. Default: no mention. Also decide whether to name a number of upgrades.
0d. Open (2026-11-04): `privacy/index.html` no longer mentions invoicing or billing (reworded to setup details). Add billing wording back when paid upgrades are decided, and fill in the [LEGAL BUSINESS NAME] / [CONTACT EMAIL] placeholders. The business now has Google Workspace email (2026-11-07): creator@, hello@, demo@ and billing@chatbotglobal.com; which one is the site's contact email is the owner's choice. The legal name waits on registering the business (BUSINESS-PLAN.md, Legal and admin).
0e. Open (2026-11-04): the SimpleBot assistant (bot 3791) greeting and flow are edited in the bot platform; make sure it no longer talks about paying per job.
0a. RESOLVED 2026-09-24, updated 2026-10-21: the home chat is the owner's SimpleBot corner widget (script https://platform.simplebotinstall.com/w/chat_plugin.js, data-bot-id 3791; it renders its own #widget-chat-host in a shadow root). The earlier in-page version used chat_form_plugin.js with <div id="chat_form">. Greeting text, colors and flow are edited in the bot platform, not on the site. Open: does the bot itself collect website/business/email/phone and send the follow-up email and build the demo bot?
0. Does the home page still use industry tabs, or is it now a single free-chatbot pitch that links to the carpet page? (Tabs were discussed earlier; confirm.)
1. Who is the primary carpet-cleaning buyer?
2. What exactly does the bot do?
3. Which industries appear as tabs?
4. Is there pricing, a demo, or a booking link for the call to action? (Default: "Book a demo" placeholder.)

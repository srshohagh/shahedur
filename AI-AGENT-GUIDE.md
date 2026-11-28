# AI chat assistant: guide

## What you have now
The floating blue orb opens a chat window. **Without any setup** it already:
- answers questions about Shohagh (services, skills, experience, results, education, contact) from your own site data,
- runs a **meeting request flow** (name, contact, topic, preferred time and timezone) and then offers "Send via WhatsApp" and "Send via Email" with the message ready,
- falls back to WhatsApp and email if it does not know something.

This built-in mode uses fixed rules, not a language model. It is reliable and free, but it only understands the topics above.

## Can it be a real AI agent? Yes.
Your site is static (GitHub Pages), so it cannot hold a secret API key. The safe design is:

    Visitor's browser  ->  small backend (holds the secret key)  ->  Claude API
         chat window            Worker or n8n                       writes the reply

The chat window is already built for this. You only paste one URL into `app/chatConfig.js` (`apiUrl`). If the backend is slow or down, the chat automatically falls back to the built-in answers. Meeting requests always use the built-in flow.

## Option A: Cloudflare Worker + Claude API (recommended)
Free to host, about 5 minutes. Code is in `chat-backend/worker.js`.
1. Create an API key at **console.anthropic.com** (separate from a claude.ai subscription; it needs a small prepaid balance). In the console set a **monthly spend limit**.
2. Create a free account at **dash.cloudflare.com**, open **Workers & Pages -> Create -> Worker**, click **Edit code**, paste the whole `worker.js`, and **Deploy**.
3. In the Worker open **Settings -> Variables and Secrets -> Add**, type `Secret`, name `ANTHROPIC_API_KEY`, paste your key, and save.
4. In `worker.js` check `ALLOWED_ORIGINS` (your live site address; add your own domain later) and `MODEL` (use a current model name from the Anthropic console).
5. Copy the Worker address (it looks like `https://something.workers.dev`).
6. In your GitHub repository open `app/chatConfig.js`, set `apiUrl: 'https://something.workers.dev'`, and commit. After the green tick, the assistant is live.

## Option B: n8n (fits your skills)
1. Make a workflow: **Webhook** (POST) -> **AI Agent** (with an Anthropic chat model, system prompt from `worker.js`) -> **Respond to Webhook**.
2. The chat sends: `{ "messages": [ { "role": "user" | "assistant", "content": "text" }, ... ] }`
3. Your workflow must answer with: `{ "reply": "text to show" }`
4. In the Webhook node allow your site's origin (CORS). Paste the production webhook URL into `apiUrl`.
5. Bonus: add Google Sheets, Telegram or email nodes to log every conversation or send you an alert for new leads.

## Turning it into an "agent" (it acts, not only answers)
Add tools to the backend and let the model call them:
- **Book meetings:** Cal.com or Google Calendar API (check free slots, create an event, email a confirmation).
- **Capture leads:** send name, contact and topic to Google Sheets or Telegram through an n8n webhook.
- **Look up knowledge:** put your services, FAQs and case studies in the system prompt, or a small knowledge base later.
Quick win without a backend: paste a Calendly or Cal.com link into `bookingUrl` in `app/chatConfig.js`; the meeting flow then shows an "Open calendar" button.

## Safety and cost checklist
- Never put the API key in the website code or GitHub. Only inside the Worker or n8n.
- Keep `ALLOWED_ORIGINS` limited to your own site, and add a rate limit (in Cloudflare: Security -> WAF -> Rate limiting rules, for example 20 requests per minute per IP, if your plan includes it).
- Keep `max_tokens` small (400) and the history short (10 messages): a small model costs very little for a portfolio.
- Put only public facts in the system prompt. Never add private information.
- Keep the note "Automated assistant" visible so visitors know it is AI.
- Test it: ask about services, ask an unrelated question (it should decline politely), and try "book a meeting".

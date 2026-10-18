# Personal Health Record Organizer — Synthetic Lab Portals

A hackathon-only, synthetic browser-agent practice site built with Next.js App Router and TypeScript. It contains three fake lab portals. All records are fictional; this is not a medical service and provides no medical advice.

## Add the supplied data

Copy your existing `data/` directory into the project root so the structure is:

```text
data/
  patients.json
  portal_reports.json
  pdfs/
    labA/<patientId>/<filename>.pdf
    labB/<patientId>/<filename>.pdf
    labC/<patientId>/<filename>.pdf
```

The application intentionally does not generate or include a manifest/answer key. The supplied JSON and files remain the source of truth. Do not put `data/` in `public/`.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Set `SESSION_SECRET` to a random secret at least 32 characters long. For example, use a password manager or `openssl rand -base64 32`.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

5. Open http://localhost:3000.

Demo login: `pt001` / `demo123` (assuming that account exists in your supplied `patients.json`). The password is checked against the supplied data file.

## Lab differences

- **Lab A — A1 Diagnostics:** blue theme, table, `DD-MM-YYYY` dates, From/To filter, no CAPTCHA.
- **Lab B — CityScan Imaging:** green theme, report cards, `20 Feb 2026` date style, mock CAPTCHA.
- **Lab C — Vitals Labs:** grey theme, three reports per page, ISO dates, From/To filter, mock arithmetic CAPTCHA.

Lab B and C require a human to solve the mock challenge. The challenge answer is stored in a signed, HTTP-only cookie and is not embedded in the page HTML or URL. No CAPTCHA-solving or bypass code is included.

For local-only testing, set `DEMO_CAPTCHA_FIXED=true`: Lab B displays `DEMO1` and Lab C displays `7 + 5` (answer `12`). It defaults to `false`; keep it off for demos outside local development.

`DEMO_EXPIRE_SESSION` is an optional recovery-demo flag. Set it to `labA`, `labB`, or `labC` to expire that lab's session after two **download** requests. It is intentionally off when empty. This implementation counts download requests; opening the reports page does not increment the counter.

## Deploy to Vercel

1. Push the project (including `data/`) to a private or otherwise appropriate repository. The data files are fake, but keep them out of `public/` because download access is session-controlled.
2. Import the repository into Vercel; use the Next.js defaults.
3. Add `SESSION_SECRET` in Vercel project environment variables (use a strong random value of 32+ characters). Leave `DEMO_CAPTCHA_FIXED` unset or set it to `false`. Leave `DEMO_EXPIRE_SESSION` empty unless demonstrating recovery.
4. Deploy. The `next.config.mjs` tracing includes package `data/**` with the download route so PDFs are available in the serverless deployment.

No database, external service, analytics, external font, or writable filesystem is required. Sessions and CAPTCHA challenges use signed HTTP-only cookies. The download endpoint checks the authenticated patient's own portal listing before reading a file and always responds with `Content-Type: application/pdf`, even if the stored bytes are HTML.

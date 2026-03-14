# Beat Sheet Tool

An interactive story structure tool designed for ADHD writers.
Pick a beat-sheet template, fill in your beats, dump your ideas, and keep moving.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3    |
| Routing    | React Router v6                   |
| Drag & Drop| dnd-kit                           |
| Backend    | Cloudflare Workers (JS)           |
| Storage    | Cloudflare KV                     |
| Hosting    | Cloudflare Pages (frontend)       |

---

## Project Structure

```
beat-sheet-tool/
  frontend/                  # Cloudflare Pages — React app
    public/
      _redirects             # SPA fallback for Pages
    src/
      components/            # Reusable UI components
      pages/                 # Route-level page components
      hooks/                 # Custom React hooks
      utils/                 # Template data + helpers
      styles/                # Global Tailwind CSS
    index.html
    vite.config.js
    tailwind.config.js
  backend/                   # Cloudflare Worker — REST API
    src/
      index.js               # Worker entry point + route handlers
    wrangler.toml            # Wrangler config (KV bindings, env vars)
  .gitignore
  README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm i -g wrangler`)

### 1. Frontend (local dev)

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### 2. Backend (local dev)

```bash
cd backend
npm install
npm run dev
# Worker runs at http://localhost:8787
```

The frontend Vite dev server proxies `/api/*` to `localhost:8787` automatically.

### 3. Build frontend for production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## Cloudflare Deployment

### Backend — Cloudflare Workers

1. Log in: `wrangler login`
2. Create a KV namespace:
   ```bash
   wrangler kv:namespace create SHEETS
   ```
3. Copy the returned `id` into `backend/wrangler.toml` (uncomment the `[[kv_namespaces]]` block).
4. Deploy:
   ```bash
   cd backend
   npm run deploy
   ```

### Frontend — Cloudflare Pages

Option A — Cloudflare dashboard: connect your GitHub repo, set build command to `npm run build` and output directory to `dist`, root to `frontend/`.

Option B — Wrangler:
```bash
cd frontend
npm run build
wrangler pages deploy dist --project-name beat-sheet-tool
```

---

## API Reference

| Method | Path              | Description          |
|--------|-------------------|----------------------|
| GET    | /api/sheets       | List all sheets      |
| POST   | /api/sheets       | Create a new sheet   |
| GET    | /api/sheets/:id   | Fetch a sheet        |
| PUT    | /api/sheets/:id   | Update a sheet       |
| DELETE | /api/sheets/:id   | Delete a sheet       |

---

## Roadmap

- [ ] Auth (Cloudflare Access or Clerk)
- [ ] Drag-to-reorder beats (dnd-kit already installed)
- [ ] AI beat suggestions via Claude API
- [ ] Export to PDF / Markdown
- [ ] Focus mode (one beat at a time)
- [ ] Progress bar / completion tracker

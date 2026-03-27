# DevMinds Links

URL shortener and link-in-bio platform with Japanese-inspired design. Create short links with instant redirects, build customizable link pages, and track detailed analytics.

**Live:** [l.devminds.online](https://l.devminds.online)

## Features

- **URL Shortener** — Create short links with optional custom aliases and countdown redirects
- **Link-in-Bio Pages** — Build personalized link pages with avatar, bio, multiple buttons and full customization
- **Analytics** — Track clicks, unique visitors, countries, devices, browsers, OS and referrers
- **Visual Editor** — Mobile-first editor with tabs (Profile / Links / Design) and live preview
- **Customization** — 16 background colors + custom picker, 9 wagara patterns, accent colors, button styles, border colors, highlighted links
- **i18n** — Spanish, English and Japanese
- **Auth** — Google OAuth with terms acceptance on first login
- **Admin Panel** — Link moderation and user report management
- **RBAC** — Permission-based role system (USER / ADMIN)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 + Google OAuth |
| Rate Limiting | Upstash Redis |
| Animations | Framer Motion |
| Validation | Zod v4 |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, Google OAuth credentials, Upstash keys

# Push schema to database
pnpm db:push

# Seed permissions
pnpm db:seed

# Start dev server
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm db:push` | Push schema to database |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:seed` | Seed permissions and roles |
| `pnpm db:reset` | Drop and recreate schema |
| `pnpm db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
  app/              # Next.js pages and layouts
  actions/          # Server actions (links, admin, user)
  components/
    auth/           # SignIn, TermsGate, UserMenu
    editor/         # LinkHub visual editor (tabs, preview, pickers)
    home/           # Landing page components
    patterns/       # Wagara SVG patterns (seigaiha, asanoha, etc.)
    stats/          # Analytics charts and tables
    ui/             # Shared UI primitives
  db/               # Drizzle schema, relations, index
  i18n/             # Routing and request config
  lib/              # Auth, permissions, utils, css-vars
messages/           # i18n JSON files (es, en, ja)
drizzle/            # Migration files
```

## License

All rights reserved.

# AGENTS.md

This document describes the project structure for developers and AI agents working on
this codebase.

## Project Overview

A medical clinic website for **Dr. Adel Ammar Adam** (OB-GYN), built with TanStack Start
and deployed on Netlify. Arabic is the primary and only implemented locale today, with
`dir="rtl"` set at the document root. The content is structured so an English locale can
be added later without restructuring components (see "Content & i18n readiness" below).

This is milestone 1 of a larger clinic-management product. Full roadmap: [`PLAN.md`](./PLAN.md).
Do not start on later milestones (database schema, auth, admin dashboard, medical
records, reminders) without re-reading that plan first — those are explicitly deferred,
not forgotten.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (utility classes, no CSS-in-JS) |
| Icons | lucide-react |
| Language | TypeScript 5 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── public
│   └── img/                          # AI-generated illustrations (hero, clinic interior)
├── src
│   ├── components
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx        # Sticky nav + mobile menu + booking CTA
│   │   │   └── SiteFooter.tsx        # Footer: quick links, contact placeholders, policy
│   │   ├── home/                     # One component per home page section
│   │   │   ├── Hero.tsx
│   │   │   ├── DoctorIntro.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── CtaBanner.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── WorkingHours.tsx
│   │   │   └── Faq.tsx
│   │   └── booking/                  # Booking wizard, one component per step
│   │       ├── types.ts              # PatientInfo type + empty default
│   │       ├── StepIndicator.tsx
│   │       ├── DateTimeStep.tsx
│   │       ├── PatientInfoStep.tsx
│   │       ├── SummaryStep.tsx
│   │       ├── Captcha.tsx           # Simple arithmetic anti-spam check
│   │       └── ConfirmationCard.tsx
│   ├── data
│   │   ├── clinic.ts                 # Doctor info, services, FAQ, hours, contact — see below
│   │   └── booking.ts                # Stubbed slot availability + booking number generator
│   ├── lib
│   │   └── utils.ts                  # cn() class-merging helper (no external dep)
│   ├── routes
│   │   ├── __root.tsx                # Document shell: html[dir=rtl], Cairo font, header/footer
│   │   ├── index.tsx                 # Home page (/)
│   │   └── booking.tsx               # Booking wizard state machine (/booking)
│   ├── router.tsx
│   └── styles.css
├── AGENTS.md                          # This document
├── PLAN.md                            # Roadmap for milestones 2+
├── README.md
├── netlify.toml
├── package.json
├── tsconfig.json                      # @/* → src/*
└── vite.config.ts
```

## Key Concepts

### File-Based Routing (TanStack Router)

- `__root.tsx` — document shell wrapping every route with `<SiteHeader>` / `<SiteFooter>`.
- `index.tsx` — route for `/`.
- `booking.tsx` — route for `/booking`, a self-contained multi-step wizard driven by
  local `useState` (step index, selected date/time, patient form, generated booking
  number). No server round-trip yet — see "Stubbed data" below.

### Content & i18n readiness

All user-facing Arabic copy for the home page lives in `src/data/clinic.ts` (doctor info,
services, FAQ, working hours, contact placeholders) rather than being inlined across
components. This keeps a future English translation (or a real i18n library) a matter of
adding a second locale file and a switcher, not rewriting components. Do not hardcode new
Arabic strings deep inside a component if they belong conceptually with the rest of the
clinic content — add them to `clinic.ts` instead.

### Stubbed data — read before wiring up a backend

`src/data/booking.ts` fabricates 14 days of appointment slots with a deterministic
pseudo-random availability pattern, purely so the booking UI has something realistic to
render. `generateBookingNumber()` produces a client-side booking number; nothing is
persisted. This is intentional for this milestone (see `PLAN.md` milestone 2) — when
wiring up Netlify DB, replace the contents of this module with real queries rather than
threading fixture data further into components.

### Do-not-invent content

Per the original product brief, the site must never fabricate medical credentials,
degrees, hospital affiliations, awards, phone numbers, or addresses. `clinic.ts` marks
every such field with an explicit Arabic placeholder string (e.g. "يُضاف رقم الهاتف من
لوحة التحكم") rather than a plausible-looking fake value. When editing that file, keep
this convention — a future admin panel is meant to fill these in, not this codebase.

## Conventions

### Naming
- Components: PascalCase, one component per file
- Utilities/hooks: camelCase
- Routes: TanStack Router file-based conventions (kebab/flat file names)

### Styling
- Tailwind CSS utility classes only
- RTL: use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`)
  instead of physical `ml-*`/`mr-*`/`text-left` when adding new layout code, since the
  whole document is `dir="rtl"`
- `cn()` from `@/lib/utils` for conditional class merging (a minimal hand-rolled helper,
  not clsx/tailwind-merge — no need to add those dependencies for this project's needs)
- Primary brand color is Tailwind's `teal-700/800`; accent usage is minimal amber/warm
  tones in the policy callout box

### TypeScript
- Strict mode enabled, `@/*` → `src/*`
- Type-only imports with the `type` keyword

## Environment Variables

None required to run this milestone. Image generation for `public/img/*` used
`NETLIFY_AI_GATEWAY_KEY` / `NETLIFY_AI_GATEWAY_BASE_URL` as a one-off build-time script
(not part of the running app) — see `PLAN.md` milestone 6 for the real reminder/messaging
integrations (WhatsApp/SMS/email) that will need their own credentials later.

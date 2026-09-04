# Job Application Tracker

Track every job you've applied to: company, location, LinkedIn profile, date applied, salary range, your proposed salary, contacts, interview rounds, and more. Multi-user with sign-in via email/password, Google, Microsoft, GitHub, or a passkey.

## Stack

- **client/** — Next.js (App Router) + TypeScript + Tailwind CSS + Auth.js v5 (auth)
- **server/** — Express + TypeScript + MongoDB (Mongoose) + Zod validation (pure API, no auth logic of its own)

## Architecture

Authentication lives entirely in the Next.js app; Express never sees a password, OAuth token, or passkey. The two talk to each other with a short-lived signed JWT:

1. The client signs the user in via Auth.js (OAuth, credentials, or passkey).
2. Before calling the Express API, the client fetches `GET /api/auth-token` (a Next.js route) which mints a 15-minute JWT signed with `AUTH_SECRET`.
3. The client sends that JWT as `Authorization: Bearer <token>` to Express.
4. Express verifies it (same `AUTH_SECRET`) and scopes every query to that user's `userId`.

This keeps Express a dumb, stateless API — no session store, no OAuth client secrets, no password hashing — while still supporting every sign-in method Auth.js offers.

## What's tracked per application

- Company name, location, LinkedIn profile
- Job title, posting URL, job type (full-time/contract/...), work mode (remote/hybrid/onsite)
- Date applied, source (LinkedIn/referral/...), status, priority
- Salary range (min/max) and your proposed salary, with currency
- Recruiter/contact name, email, phone, referral
- Resume version used, whether a cover letter was submitted
- Interview rounds (name, date, notes)
- Next follow-up date, offer deadline, rejection reason
- Tags and free-form notes

## Setup

### 1. MongoDB

Make sure MongoDB is running locally (or use a connection string from MongoDB Atlas). Auth data (users/accounts/sessions/passkeys) and job-application data can live on the same cluster in separate databases.

```bash
brew services start mongodb-community
```

### 2. Server

```bash
cd server
cp .env.example .env   # edit MONGODB_URI/ports if needed; AUTH_SECRET must match the client's
npm install
npm run dev             # http://localhost:4000
```

### 3. Client

```bash
cd client
cp .env.example .env.local   # fill in AUTH_SECRET + whichever OAuth credentials you have
npm install
npm run dev                   # http://localhost:3000
```

Generate `AUTH_SECRET` with `openssl rand -base64 32` — use the **same value** in both `server/.env` and `client/.env.local`.

Open [http://localhost:3000](http://localhost:3000). Email/password sign-up works out of the box with no extra setup. Passkeys work out of the box too (no external registration needed) but rely on Auth.js's WebAuthn provider, which is still labeled experimental.

### 4. OAuth providers (optional)

Each requires registering an app with the provider and adding the credentials to `client/.env.local`:

| Provider  | Where to register                                                              | Redirect URI                                              |
| --------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Google    | [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials | `http://localhost:3000/api/auth/callback/google`            |
| Microsoft | [entra.microsoft.com](https://entra.microsoft.com) → App registrations           | `http://localhost:3000/api/auth/callback/microsoft-entra-id` |
| GitHub    | GitHub → Settings → Developer settings → OAuth Apps                              | `http://localhost:3000/api/auth/callback/github`             |

A provider with no credentials set simply won't work when clicked — the rest of the app is unaffected.

## API

Base URL: `http://localhost:4000/api/job-applications`. Every route requires `Authorization: Bearer <token>` and only returns/affects the authenticated user's own data.

| Method | Path             | Description                              |
| ------ | ---------------- | ----------------------------------------- |
| GET    | `/`              | List applications (`?status=`, `?search=`) |
| GET    | `/stats`         | Totals + counts by status                 |
| GET    | `/:id`           | Get one application                       |
| POST   | `/`              | Create an application                     |
| PATCH  | `/:id`           | Update an application                     |
| DELETE | `/:id`           | Delete an application                     |

## Project structure

```
job-application-tracker/
├── client/     Next.js frontend + Auth.js (sign-in, sessions, OAuth/passkey/credentials)
└── server/     Express API + MongoDB models, JWT-verifying auth middleware
```

# QuizLander

A modern quiz builder application built with Next.js, Supabase, and Prisma. Create beautiful quizzes, share them with anyone, and get instant results.

## Features

- **Easy Quiz Creation** - Intuitive editor with drag-and-drop support
- **Shareable Links** - Unique URLs for each quiz
- **Instant Scoring** - Server-side scoring for security
- **Customizable Completion Pages** - Personalize the results screen
- **Embed Support** - Embed quizzes on any website
- **Analytics** - Track quiz attempts and performance

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **UI**: Shadcn UI + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Slug Generation**: nanoid

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)

### 1. Clone and Install

```bash
cd quizlander
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy the URL and anon key
3. Go to **SQL Editor** and run the schema from `supabase-schema.sql`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── quizzes/          # Quiz CRUD endpoints
│   │   └── play/             # Public play & submit endpoints
│   ├── dashboard/            # Quiz management
│   ├── play/[slug]/          # Public quiz player
│   ├── login/                # Auth pages
│   └── signup/
├── components/
│   ├── auth/                 # Auth components
│   ├── quiz/                 # Quiz editor & player
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── supabase/             # Supabase clients (client, server, middleware)
│   └── validations/          # Zod schemas
└── types/                    # TypeScript types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | List user's quizzes |
| POST | `/api/quizzes` | Create new quiz |
| GET | `/api/quizzes/[id]` | Get quiz details |
| PUT | `/api/quizzes/[id]` | Update quiz |
| DELETE | `/api/quizzes/[id]` | Delete quiz |
| GET | `/api/quizzes/[id]/export` | Export quiz as JSON |
| GET | `/api/play/[slug]` | Get quiz for playing (public) |
| POST | `/api/play/[slug]/submit` | Submit quiz answers |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## License

MIT

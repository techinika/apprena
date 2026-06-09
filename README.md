# Apprena - AI-Powered Career Coaching Platform

A Next.js 16 application providing personalized career roadmaps, learning paths, and achievement tracking for mid-career professionals and students.

## Features

- **AI-Powered Career Analysis** - Generate personalized roadmaps using Google Gemini with file upload (PDF with magic byte validation)
- **AI-Generated Curriculum** - Custom learning paths with lessons, exercises, and quizzes
- **Interactive Course Viewer** - Track progress through each content piece
- **Learning Path Tracking** - Track courses and curriculum progress
- **Milestone Generation** - One-click milestone creation from roadmaps
- **Achievement System** - Earn verified badges and milestones
- **Notifications** - Real-time updates for all learning activities
- **Social Network Suggestions** - AI-recommended connections for career growth
- **Workspace Management** - Organize all your career activities
- **AI Mentor Chat** - Conversational career guidance with streaming responses
- **Organization Management** - Team workspaces with billing tiers, member invitations, and templates
- **Dark Mode** - Full dark mode support with system preference detection
- **Shareable Roadmaps** - Public sharing with dynamic OG images

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes (Edge + Node), Firebase Firestore
- **AI**: Google Gemini 2.5 Flash, Claude (Anthropic), Groq (fallback chain)
- **Authentication**: Firebase Auth (Google OAuth)
- **Payments**: IremboPay (African payment gateway)
- **File Storage**: Cloudinary (signed uploads with SHA-1 signature)
- **Visualizations**: Mermaid.js, Cytoscape, html2canvas-pro, jsPDF
- **Animations**: Framer Motion, canvas-confetti

## Prerequisites

- Node.js 18+
- Firebase project with Firestore & Auth enabled
- Google Gemini API key (primary) + Claude/Groq keys (fallback)
- Cloudinary account (for file uploads)

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd admin-home

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Fill in your environment variables (see Configuration section)
```

## Environment Variables

Create `.env.local` with the following variables:

```env
# Firebase (get from Firebase Console > Project Settings)
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_DOMAIN=https://apprena.techinika.com

# AI Providers (at least GEMINI required)
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_claude_key       # fallback
GROQ_API_KEY=your_groq_key              # fallback

# Cloudinary (for document uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx               # server-side only

# IremboPay (RWF payment gateway)
NEXT_PUBLIC_IREMBOPAY_API_KEY=xxx
```

## Development

```bash
# Run development server
npm run dev

# Type-check
npm run typecheck

# Lint
npm run lint

# Build for production
npm run build

# Analyze bundle (opens analyzer after build)
ANALYZE=true npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                       # Next.js App Router pages
│   ├── (authenticated)/       # Protected routes (workspace, learning, profile, organization, upgrade)
│   ├── (compliance)/          # Legal pages (terms, privacy)
│   ├── api/                   # API routes
│   │   ├── analyze/           # AI analysis + rate limiting + Cloudinary upload
│   │   ├── og/                # Dynamic OG image generation (Edge)
│   │   └── ...                # Payment, notification, organization, sharing endpoints
│   ├── share/[slug]/          # Public roadmap sharing with OG images
│   ├── sitemap.ts             # Dynamic sitemap (public + shared roadmaps)
│   ├── robots.ts              # Robots.txt with disallow rules
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout (JSON-LD, manifests, preconnect, theme-color)
│   ├── not-found.tsx          # 404 page (dark mode)
│   ├── error.tsx              # Root error boundary
│   └── loading.tsx            # Loading skeleton (dark mode)
├── components/
│   ├── pages/                 # Page-level components (client components extracted from pages)
│   ├── parts/                 # Reusable UI components
│   │   ├── home/              # Landing page sections
│   │   ├── activity/          # Activity/roadmap components
│   │   ├── workspace/         # Workspace components
│   │   ├── chat/              # AI Mentor Chat (dynamic import, ssr: false)
│   │   └── learning/          # Learning path components
│   ├── ui/                    # Shared component library (Button, Card, Input, Dialog)
│   └── error/                 # Error boundary with dark mode
├── db/                        # Firebase & database operations
├── lib/                       # Utilities, contexts, rate limiting
│   ├── theme/                 # Dark mode ThemeProvider
│   ├── apiAuth.ts             # Server-side Firebase Auth verification
│   ├── apiClient.ts           # Authenticated fetch wrapper
│   ├── rateLimit.ts           # In-memory rate limiting
│   └── firebaseAdmin.ts       # Firebase Admin SDK
├── prompts/                   # Extracted AI system prompts
├── types/                     # TypeScript type definitions
└── variables/                 # Global constants
```

## API Endpoints

### POST /api/analyze
Generate AI-powered career roadmap. Rate-limited (5 req/min per IP).

**Request (multipart/form-data):**
- `file` (optional): Resume/CV files (PDF, validated by MIME type + magic bytes)
- `answers`: JSON string with assessment answers (goal, current, skills, blocks, ecosystem)

**Response:**
```json
{
  "id": "activity_id",
  "title": "AI Product Manager Path",
  "confidenceScore": 85,
  "roadmap": [...],
  "learningGaps": {...},
  "curriculum": [...],
  "habits": [...],
  "network": [...],
  "achievements": [...],
  "milestones": [...]
}
```

### POST /api/generate-curriculum
Generate AI-powered personalized learning curriculum with lessons, exercises, and quizzes.

### POST /api/analyze (learning analysis)
Alternative analysis endpoint for curriculum learning content.

### GET /api/og
Dynamic Open Graph image generation (Edge Runtime, 1200x630, cached 1 day).

### POST /api/ai-chat
Streaming AI Mentor Chat responses (server-sent events).

### POST /api/generate-roadmap
Organization team member roadmap generation.

### POST /api/organizations /organization-members /organization-templates
Organization management CRUD endpoints.

### POST /api/create-payment-invoice /payment-callback /payment-public-key
IremboPay payment lifecycle.

## Key Components

- **AssessmentForm** - Landing page form for generating roadmaps (multi-step)
- **OneActivityPage** - Detailed view of generated roadmap (refactored with extracted sidebar/input sections)
- **CourseViewer** - Interactive learning with AI grading for exercises
- **MentorChat** - AI career mentor (dynamically imported, SSR disabled)
- **LearningSection** - Curriculum and skill gap tracking
- **RoadmapSection** - Timeline and flowchart visualization
- **NotificationsPage** - Activity feed for all learning events
- **OrganizationPageClient** - Team management and billing
- **AuthNav** - Navigation with dark mode toggle

## Security

- CSP headers enforced via middleware (form-action, object-src, base-uri)
- HSTS (2 years), Permissions-Policy headers
- Cloudinary uploads: signed with SHA-1 HMAC (no public unsigned preset)
- File uploads: MIME type + PDF magic byte header validation, 5MB limit
- API routes: rate-limited per IP (5 req/min for analysis)
- Auth: Firebase Auth token verification on all API routes
- `poweredByHeader: false` in Next.js config
- `.env.example` documents all required variables (secrets never in client)

## Performance

- Dynamic imports: MentorChat (`ssr: false`), canvas-confetti (lazy), IremboPayWidget
- `optimizePackageImports` for lucide-react, react-icons, framer-motion, date-fns
- Static asset caching (`Cache-Control: immutable, 1 year`) for images and fonts
- `output: "standalone"` for optimized Docker deployments
- Preconnect hints for Firebase, Cloudinary in root layout
- Bundle analyzer available via `ANALYZE=true npm run build`

## TypeScript

Strict mode enabled. Run `npm run typecheck` (zero errors expected).

## License

MIT

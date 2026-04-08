# Apprena - AI-Powered Career Coaching Platform

A Next.js 16 application providing personalized career roadmaps, learning paths, and achievement tracking for mid-career professionals and students.

## Features

- **AI-Powered Career Analysis** - Generate personalized roadmaps using Google Gemini
- **Learning Path Tracking** - Track courses and curriculum progress
- **Achievement System** - Earn verified badges and milestones
- **Social Network Suggestions** - AI-recommended connections for career growth
- **Workspace Management** - Organize all your career activities

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, Firebase Firestore
- **AI**: Google Gemini 2.5 Flash
- **Authentication**: Firebase Auth (Google OAuth)
- **Payments**: IremboPay (African payment gateway)
- **Visualizations**: Mermaid.js, Cytoscape

## Prerequisites

- Node.js 18+
- Firebase project with Firestore & Auth enabled
- Google Gemini API key
- (Optional) Stripe or IremboPay account for payments

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
NEXT_PUBLIC_BASE_DOMAIN=https://apprena.app

# AI (get from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key

# Optional: Payment Gateway (Stripe/IremboPay)
NEXT_PUBLIC_PAYMENT_PUBLIC_KEY=pk_xxx
NEXT_PUBLIC_PAYMENT_SECRET_KEY=sk_xxx

# Optional: Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_API_KEY=xxx
NEXT_PUBLIC_CLOUDINARY_API_SECRET=xxx
```

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (authenticated)/   # Protected routes (workspace, learning, profile)
│   ├── (compliance)/      # Legal pages (terms, privacy)
│   ├── api/               # API routes
│   │   └── analyze/       # AI analysis endpoint
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── parts/             # Reusable UI components
│   │   ├── home/          # Landing page sections
│   │   ├── activity/      # Activity/roadmap components
│   │   └── workspace/     # Workspace components
│   └── pages/             # Page-level components
├── db/                    # Firebase & database operations
├── lib/                   # Utilities & contexts
├── types/                 # TypeScript type definitions
└── variables/             # Global constants
```

## API Endpoints

### POST /api/analyze
Generate AI-powered career roadmap.

**Request:**
- `file` (optional): Resume/CV files (PDF, DOC, DOCX)
- `answers`: JSON string with assessment answers
- `userId` (optional): User ID for credit deduction

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
  "achievements": [...]
}
```

## Key Components

- **AssessmentForm** - Landing page form for generating roadmaps
- **OneActivityPage** - Detailed view of generated roadmap
- **LearningSection** - Curriculum and skill gap tracking
- **RoadmapSection** - Timeline and flowchart visualization

## Security Notes

- Never commit `.env` or sensitive keys to version control
- Rate limit API endpoints in production
- Validate all user inputs
- Implement proper credit/usage limiting

## License

MIT
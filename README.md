# AI Chat Application

A modern AI chat interface built with Next.js 14+, featuring autocomplete search, nested comments, and real-time interactions.

## Features

- **Smart Search** - Autocomplete with debouncing, keyboard navigation, and text highlighting
- **Nested Comments** - 4-level threaded discussions with CRUD operations
- **Sticky Headers** - Dynamic headers that update on scroll
- **Vote System** - Blue upvote, red downvote with LocalStorage persistence
- **Real Data** - 100 questions from JSONPlaceholder API
- **Responsive** - Works on all devices

## 🛠️ Technology Stack

- **Framework:** Next.js 14.2.33 (App Router)
- **Language:** TypeScript
- **State Management:** TanStack Query v5
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Data Persistence:** Browser LocalStorage

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
app/
├── api/                    # API routes
│   ├── search/            # Search endpoint
│   └── questions/[id]/    # Question detail
├── layout.tsx             # Root layout
├── page.tsx               # Main page
└── globals.css            # Styles

components/
├── ui/                    # shadcn/ui components
├── autocomplete-search.tsx
├── chat-interface.tsx
├── comment-system.tsx
└── providers.tsx

lib/
├── data.ts                # Data fetching
├── types.ts               # TypeScript types
└── utils.ts               # Utilities
```

## How It Works

### Search
- Type to search 100 questions from JSONPlaceholder
- Debounced (300ms) to reduce API calls
- Results cached for 5 minutes
- Navigate with arrow keys, select with Enter

### Chat
- Questions appear as white bubbles (right)
- AI answers as gray bubbles (left)
- Sticky header shows current question while scrolling
- Auto-scrolls to new messages

### Comments
- Add comments to any answer
- Reply up to 4 levels deep
- Edit/delete with confirmation
- Vote with blue thumbs up, red thumbs down (persists in LocalStorage)
- Sort by newest, oldest, or most voted

## API Endpoints

**Search:** `GET /api/search?q={query}`
- Fetches from JSONPlaceholder
- Returns top 10 matches
- Cached for 1 hour

**Question Detail:** `GET /api/questions/{id}`
- Returns specific question
- Cached for 1 hour

## Testing

### Search
- Type "Artificial Intelligence", "Blockchain", or "DevOps"
- Use arrow keys to navigate
- Press Enter to select

### Chat
- Add multiple questions
- Scroll to see sticky headers change
- Check timestamps and categories

### Comments
- Add root comment
- Reply (up to 4 levels)
- Edit/delete with confirmation
- Vote and sort

## Tech Stack Details

- **Next.js 14** - App Router, Server/Client Components
- **TanStack Query** - Caching, optimistic updates
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible components
- **JSONPlaceholder** - Real API data

## Performance

- Debouncing (300ms)
- Query caching (5 min)
- Code splitting
- Optimistic updates
- LocalStorage persistence

## License

MIT

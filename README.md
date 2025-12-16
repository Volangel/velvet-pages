# Velvet Pages - Erotica Ebook Creator

A comprehensive web application for creating, writing, and publishing erotica ebooks to Amazon KDP.

## Features

### 📚 Book Management
- Create and manage multiple book projects
- Track word count progress toward goals
- Organize books by status (draft, writing, editing, complete, published)

### ✨ Story Generator
- AI-powered story idea generation
- Genre-specific plot premises
- Automatic chapter outline creation
- Heat level selection (sweet to scorching)

### ✍️ Writing Studio
- Distraction-free chapter editor
- Real-time word count tracking
- Chapter organization and reordering
- Auto-save functionality

### 👥 Character Builder
- Create detailed character profiles
- Track protagonists, love interests, antagonists, and supporting characters
- Template-based character creation with role-specific prompts

### 🖼️ Cover Management
- Upload cover images
- KDP specification guidelines
- Cover preview at multiple sizes

### 📖 EPUB Export
- Generate KDP-ready EPUB files
- Proper formatting for Kindle devices
- Table of contents generation
- Custom styling

### 📋 KDP Metadata
- Book description editor (HTML supported)
- Keyword management (up to 7 keywords)
- Category selection
- Price setting for 70% royalty eligibility
- Content warnings
- Publishing checklist

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: Local Storage (client-side)
- **EPUB Generation**: Custom EPUB builder

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Creating a New Book

1. Click "New Book" on the dashboard
2. Select your genre and sub-genre
3. Optionally use the Story Generator for ideas
4. Set your title, pen name, and target word count
5. The app will generate chapter outlines automatically

### Writing Chapters

1. Open your book from the dashboard
2. Select a chapter from the sidebar
3. Write in the main editor area
4. Your work auto-saves every 30 seconds
5. Use *** or --- for scene breaks

### Adding Characters

1. Go to the Characters tab in the book editor
2. Or use the Character Builder page
3. Select a role (protagonist, love interest, etc.)
4. Fill in character details

### Exporting for KDP

1. Go to Export & Publish
2. Select your book
3. Complete the publishing checklist
4. Fill in metadata (description, keywords, categories)
5. Upload a cover image
6. Click "Export EPUB"
7. Upload the EPUB to KDP

## KDP Publishing Tips

- **Word Count**: Aim for 20,000-50,000 words for romance novels
- **Keywords**: Use all 7 keyword slots for discoverability
- **Categories**: Choose 2 relevant categories
- **Price**: $2.99-$9.99 for 70% royalty (35% for prices outside this range)
- **Cover**: 1600 x 2560 pixels ideal, minimum 625 x 1000 pixels

## File Structure

```
src/
├── app/
│   ├── page.tsx           # Dashboard
│   ├── book/[id]/page.tsx # Book editor
│   ├── generator/page.tsx # Story generator
│   ├── export/page.tsx    # Export & publish
│   ├── books/page.tsx     # Book library
│   ├── characters/page.tsx# Character builder
│   └── covers/page.tsx    # Cover manager
├── components/
│   ├── Sidebar.tsx
│   ├── BookCard.tsx
│   ├── NewBookModal.tsx
│   ├── CharacterPanel.tsx
│   └── ChapterOutlinePanel.tsx
├── lib/
│   ├── utils.ts
│   ├── storage.ts
│   ├── epub-generator.ts
│   └── story-generator.ts
└── types/
    └── index.ts
```

## License

Private use only. Not for redistribution.

---

Made with 💜 for romance authors


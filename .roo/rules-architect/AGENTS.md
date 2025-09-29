# Project Architecture Rules (Non-Obvious Only)

- Next.js 15 app router architecture with Turbopack for development
- Genkit framework for AI flow orchestration and management
- Firebase backend for data persistence and authentication
- TipTap editor for rich text content creation and editing
- AI flows are server-side functions registered through imports in src/ai/dev.ts
- All external images restricted to placehold.co domain only
- TypeScript errors and ESLint warnings are ignored during build process
- Custom dagger emoji (⚔️) styling for list items in TipTap editor
- Campaign data stored in browser localStorage with specific key pattern
- Component library built on Radix UI with shadcn/ui patterns
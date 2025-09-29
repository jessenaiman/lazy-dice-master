# AGENTS.md

`pnpm run dev`

This file provides guidance to agents when working with code in this repository.

## Build/Lint/Test Commands

- `npm run dev` - Start development server with Turbopack on port 9002 (not the default port)
- `npm run genkit:dev` - Start Genkit development server for AI flows (requires GOOGLE_GENAI_API_KEY)
- `npm run genkit:watch` - Start Genkit with watch mode for AI development (uses tsx --watch)

## Code Style & Conventions

- Project uses Next.js 15 with App Router and TypeScript
- Component library: Radix UI with shadcn/ui patterns
- Styling: Tailwind CSS with custom theme variables
- Font families: 'Cinzel' for headlines, 'Open Sans' for body text
- File-based routing with Next.js app directory structure
- AI flows are registered in `src/ai/dev.ts` and must be imported there to be available
- Firebase integration uses environment variables prefixed with NEXT_PUBLIC_FIREBASE_
- Google AI integration uses GOOGLE_GENAI_API_KEY environment variable
- Rich text editing uses TipTap editor with custom configuration
- Component imports use @/ alias for src directory (e.g., `@/components/ui/button`)
- AI flow files must be imported in `src/ai/dev.ts` to be registered with Genkit

## Project-Specific Patterns

- AI flows are located in `src/ai/flows/` and follow the pattern of individual files per flow
- Campaign data is stored in localStorage with ACTIVE_CAMPAIGN_ID_KEY
- TipTap editor is configured with placeholder extension and custom styling
- Remote images from placehold.co are allowed in next.config.ts images.remotePatterns
- TypeScript build errors are ignored during builds (typescript.ignoreBuildErrors: true)
- ESLint warnings are ignored during builds (eslint.ignoreDuringBuilds: true)
- Session prep notes are converted to markdown using TurndownService
- Map images are downloaded with specific naming format: `{mapType}-map-{prompt_snippet}.png`
- Custom list item styling uses dagger emoji (⚔️) as bullet points in TipTap editor
- AI flow files are machine-generated - edit with care (as noted in file header)
- All AI flows must be imported in src/ai/dev.ts to be registered with Genkit
- TipTap list items have custom CSS with dagger emoji bullets
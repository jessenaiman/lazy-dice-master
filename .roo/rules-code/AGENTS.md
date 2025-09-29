# Project Coding Rules (Non-Obvious Only)

- AI flow files in src/ai/flows/ are machine-generated - edit with care as noted in file header
- All AI flows must be imported in src/ai/dev.ts to be registered with Genkit
- TipTap list items have custom CSS with dagger emoji bullets: ⚔️ (defined in listItem HTMLAttributes)
- Session prep notes are converted to markdown using TurndownService
- Map images are downloaded with specific naming format: `{mapType}-map-{prompt_snippet}.png`
- Campaign data is stored in localStorage with ACTIVE_CAMPAIGN_ID_KEY
- Custom utilities and patterns must be imported using @/ alias for src directory
- TypeScript build errors and ESLint warnings are ignored during builds (in next.config.ts)
- Remote images from placehold.co are the only external images allowed (in next.config.ts)
- Firebase integration requires NEXT_PUBLIC_ prefixed environment variables
- Google AI integration requires GOOGLE_GENAI_API_KEY environment variable
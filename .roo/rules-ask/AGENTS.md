# Project Documentation Rules (Non-Obvious Only)

- "docs/lazy_gm/" contains comprehensive lazy GM resources with 37+ guides and tools
- AI flows in "src/ai/flows/" are registered in "src/ai/dev.ts" through imports
- TipTap editor uses custom styling with dagger emoji (⚔️) for list items
- Campaign data is persisted in localStorage using ACTIVE_CAMPAIGN_ID_KEY
- Map images follow naming convention: {mapType}-map-{prompt_snippet}.png
- Rich text content is handled as HTML via TipTap editor, not plain text
- Genkit AI flows require GOOGLE_GENAI_API_KEY environment variable
- Firebase configuration requires multiple NEXT_PUBLIC_FIREBASE_* variables
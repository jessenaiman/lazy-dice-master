# Project Debug Rules (Non-Obvious Only)

- Development server runs on port 9002 (not the default Next.js port)
- Genkit development server requires GOOGLE_GENAI_API_KEY environment variable
- Firebase integration requires all NEXT_PUBLIC_FIREBASE_* variables to function
- TipTap editor state is managed internally and may not reflect external content changes immediately
- Map generation flow involves AI prompting and image downloading with specific naming conventions
- LocalStorage uses ACTIVE_CAMPAIGN_ID_KEY to track active campaign data
- Rich text content is stored as HTML strings, not plain text
- Turbopack is used for faster development builds
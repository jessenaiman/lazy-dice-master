# Project Requirements Document

## Project Overview
**Project Name:** Lazy Dice Master (Lazy GM Toolkit)  
**Description:** A web-based AI-powered toolkit designed for "lazy" Game Masters (GMs) in tabletop RPGs, particularly D&D 5e. It leverages the Lazy GM's Resource Document (LGMRD) from SlyFlourish.com to provide quick, generative tools for session preparation, including adventure ideas, NPCs, locations, puzzles, and more. The app aims to reduce prep time to under 30 minutes by automating content generation while integrating user-managed campaigns via Firebase.  

**Goals:**  
- Digitize and enhance the LGMRD with AI-driven generation for dynamic RPG content.  
- Provide an intuitive, responsive UI for GMs to manage campaigns, generate elements, and store outputs.  
- Ensure adherence to development standards: GitHub issues, branch-based development, conventional commits, PR reviews.  
- Support offline-like persistence for active campaigns and generated content.  

**Target Audience:** Tabletop RPG GMs seeking efficient prep tools, especially for 5e campaigns.  

**License:** Based on Creative Commons Attribution 4.0 (CC-BY-4.0) for LGMRD content; app code under standard open-source license (e.g., MIT, to be specified).  

## Functional Requirements

### Core Features
1. **Campaign Management:**  
   - Create, edit, delete, and list campaigns (name, description, characters with motivations).  
   - Set an active campaign (persisted via localStorage).  
   - Store campaigns in Firebase Firestore.  
   - Generate campaign context summaries using AI.  

2. **Generative AI Toolkit:**  
   - **Blocks for RPG Elements:** Modular UI components for generating:  
     - Adventure Ideas (title, summary, conflict, locations).  
     - Strong Starts (opening scenes/hooks).  
     - Plot Hooks with clues.  
     - Secrets & Clues.  
     - NPCs (name, description, mannerisms).  
     - Locations (description, secrets/clues).  
     - Puzzles/Riddles (with complexity levels: Simple/Common/Challenging).  
     - Magic Items (name, description, powers).  
     - Prophecies (with interpretations).  
     - Random Contents (e.g., chest, backpack; customizable container).  
     - Tavern Menus (food/drinks with prices).  
     - Bookshelf Contents (with interactive passage generation).  
   - AI Integration: Use Google Generative AI (Gemini) via Genkit flows. Each block supports optional campaign context injection.  
   - Output: Formatted HTML/Markdown for display; save to Firebase "Lore Library" under campaigns.  
   - Options: Some blocks (e.g., puzzles) include selectors for complexity.  

3. **Session Prep & Library:**  
   - Prep pages for specific sessions (load by ID).  
   - Library view: Tabbed interface to browse saved generated items (NPCs, locations, etc.) by type.  
   - Rich Text Editor: Tiptap-based editor for notes/prep with placeholder support and custom styling (e.g., dagger bullets for lists).  

4. **Mapping & Visuals:**  
   - Generate map images (via AI flow).  
   - Display generated images (e.g., maps, potentially others).  

5. **UI/UX:**  
   - Responsive design (mobile-first) with Tailwind CSS and shadcn/ui components.  
   - Theme support (system/light/dark via next-themes).  
   - Toast notifications for feedback (success/error).  
   - Header with navigation (Campaigns, Prep, Library, Maps).  
   - Footer with credits/links.  
   - Loading states with spinners.  
   - Tooltips for icons/buttons.  

### Non-Functional Requirements
- **Performance:** Dev server with Turbopack (port 9002); build with Next.js optimizations. Ignore TS/ESLint errors in builds for rapid iteration.  
- **Security:** Firebase auth/config via env vars (NEXT_PUBLIC_FIREBASE_*); API key for Google AI (GOOGLE_GENAI_API_KEY). Sanitize outputs with DOMPurify.  
- **Accessibility:** Use Radix UI primitives for ARIA compliance; ensure keyboard navigation.  
- **Scalability:** Firebase for backend; AI calls rate-limited via env.  
- **Testing:** Local testing via dev server; no automated tests specified yet.  
- **Deployment:** Standard Next.js build/start; potential Vercel/Netlify.  

## Development Workflow & Standards
Follow strictly for all contributions:  

1. **Create Issues First:** Open a GitHub issue for each task/feature/bug, including goals, requirements, context. Assign to team members.  

2. **Branch-Based Development:**  
   - Create branches from `main`: `feature/issue-#123-task-description` or `bugfix/issue-#124-fix`.  
   - Keep branches short-lived; rebase/merge via PR.  

3. **Commit Best Practices:**  
   - Reference issues: `git commit -m "feat: implement NPC generator as per #123"`.  
   - Use conventional commits: `feat:`, `fix:`, `docs:`, etc.  
   - Descriptive and concise messages.  

4. **Pull Requests (PRs):**  
   - Link to issue.  
   - Summarize changes.  
   - Include screenshots/tests/docs updates.  
   - Request review from at least one team member.  
   - Merge to `main` only after approval.  

5. **Outstanding Tasks Review:**  
   - No `project-tasks.md` file found; create issues for pending items as discovered (e.g., add env.example, config files if missing).  
   - Prioritize: Enhance AI flows, add more generators, improve mobile UX, implement user auth.  

## Dependencies & Integrations
- **Frontend:** Next.js 15, React 18, TypeScript 5.  
- **Styling/UI:** Tailwind CSS 4, shadcn/ui, Radix UI, Lucide icons.  
- **AI/Backend:** Genkit 1.14 with Google AI; Firebase 11.9 for storage/auth.  
- **Other:** Tiptap for editor, Recharts for visuals, date-fns, Zod for validation.  

## Risks & Assumptions
- **AI Costs:** Google AI API usage; monitor quotas.  
- **Firebase:** Requires setup; handle offline gracefully.  
- **Content Licensing:** Ensure all generated content complies with CC-BY-4.0 from LGMRD.  
- **Missing Files:** No `next.config.js`, `tailwind.config.js`, `.env.example` found; assume defaults or generate as needed.  

## Future Enhancements
- User authentication and multi-user campaigns.  
- Export generated content (PDF/Markdown).  
- More AI flows (e.g., full session outlines).  
- Integration with Lazy GM's 5e Monster Builder.  

Last Updated: 2025-09-29
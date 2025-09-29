# Implemented Features in Lazy Dice Master

## Overview

Lazy Dice Master is a modern web application designed for "lazy" Dungeon Masters (GMs) to generate and manage Dungeons & Dragons (D&D) content using AI-powered tools. The application is built with Next.js 15, React, TypeScript, Tailwind CSS, Radix UI for components, Genkit for AI integration with Google's Gemini model, and Firebase for data persistence. It helps GMs quickly create campaigns, session preparations, NPCs, locations, puzzles, and other elements essential for D&D sessions, reducing preparation time while maintaining creativity.

The app focuses on core functionality including campaign management, session preparation, AI-driven content generation, and persistent storage. A recent migration moved the active campaign ID from localStorage to Firebase Firestore user settings for improved cross-device synchronization and reliability. See [GitHub issue #1](https://github.com/jessenaiman/lazy-dice-master/issues/1) for details on persistence enhancements.

## Key Components and Their Roles

### Campaign Management (src/app/campaigns/page.tsx)

- **Role**: Allows users to create, list, select, update, and delete campaigns. Campaigns are the central entity, containing name, description, characters, and associated session preps/items.
- **Key Features**:
  - List all campaigns from Firebase Firestore.
  - Create new campaigns using AI-generated context (via generateCampaignContext flow).
  - Select an active campaign, previously stored in localStorage under the key 'lazy-gm-active-campaign-id', now migrated to Firebase user settings for persistence across sessions and devices.
  - Delete campaigns, which cascades to remove associated session preps.
- **Integration**: Uses Firebase CRUD operations from firebase-service.ts. The UI displays campaigns in a list with selection via dropdown or cards.

### Session Preparation (src/app/prep/[id]/page.tsx)

- **Role**: Provides a rich text editor for GMs to prepare session notes, integrated with the selected campaign.
- **Key Components**:
  - **TipTap Editor (src/components/tiptap-editor.tsx)**: A customizable rich text editor built with TipTap, allowing editable HTML content. It supports formatting like headings, lists, bold/italic, and custom extensions for D&D-specific elements (e.g., dagger emoji bullets for lists). The editor's content is saved as HTML to Firebase.
  - **Campaign Association**: Loads the associated campaign for context. Notes are saved automatically on change with debouncing.
- **Functionality**: 
  - Load session prep by ID from Firebase.
  - Edit notes in real-time using TipTap.
  - Save updates to Firebase Firestore.
  - Export notes as Markdown using TurndownService for external use.
  - Print functionality for physical notes.
- **Persistence**: Notes are stored in the 'sessionPreps' collection in Firestore, linked to the campaign ID.

### AI Flow Integration with Genkit (src/ai/dev.ts and src/ai/flows/)

- **Role**: Powers content generation using Google's Gemini AI via the Genkit framework. Flows are imported and registered in dev.ts for use in the UI.
- **Key AI Flows** (all in src/ai/flows/):
  - **generate-campaign-context.ts**: Generates initial campaign context including name, description, and characters.
  - **generate-strong-start.ts**: Creates exciting opening scenes for sessions.
  - **generate-secrets-and-clues.ts**: Produces secrets and clues for players.
  - **generate-plot-hook.ts**: Designs plot hooks with clues.
  - **generate-npc.ts**: Creates NPCs with descriptions and mannerisms.
  - **generate-location.ts**: Generates locations with secrets.
  - **generate-puzzle.ts**: Builds puzzles with solutions and clues (configurable complexity).
  - **generate-riddle.ts**: Crafts riddles with multiple interpretations (configurable complexity).
  - **generate-magic-item.ts**: Invents magic items with powers.
  - **generate-prophecy.ts**: Creates prophecies with meanings.
  - **generate-random-contents.ts**: Populates containers (e.g., chest, backpack) with items (configurable container type).
  - **generate-adventure-idea.ts**: Produces complete adventure concepts.
  - **generate-bookshelf-contents.ts**: Generates book titles and passages; supports interactive child flows for specific book content.
  - **generate-tavern-menu.ts**: Creates tavern menus with food and drinks.
  - **generate-map-image.ts**: Generates map images (implementation details not shown in provided code).
- **Integration**: Flows are used in the main cockpit page (src/app/page.tsx) via GenerativeBlock components. Each block provides a UI for input, optional campaign context, and generates content formatted as HTML for display and saving.
- **Usage**: Content is generated on-demand, optionally incorporating campaign context, and saved to Firebase as GeneratedItem objects in the 'generatedItems' collection.

### Firebase Integration (src/lib/firebase-service.ts)

- **Role**: Handles all data persistence using Firebase Firestore and Storage.
- **Collections and Operations**:
  - **Campaigns ('campaigns')**: CRUD operations (getCampaigns, getCampaign, addCampaign, updateCampaign, deleteCampaign). Deletion cascades to session preps.
  - **Session Preps ('sessionPreps')**: CRUD for session notes (addSessionPrep, getSessionPrep, updateSessionPrep, deleteSessionPrep), linked to campaigns.
  - **Generated Items ('generatedItems')**: Store AI-generated content (addGeneratedItem, getGeneratedItemsForCampaign, getAllGeneratedItems, getGeneratedItemsByType). Includes type, content, and optional campaign ID.
  - **User Settings ('userSettings')**: Stores user preferences, including activeCampaignId (migrated from localStorage).
  - **File Storage**: Upload files (e.g., images) to Firebase Storage and retrieve URLs.
- **Migration Note**: The active campaign ID was previously stored solely in localStorage. It has been migrated to Firebase user settings (getUserSettings, createUserSettings, updateUserSettings) for better synchronization across devices. LocalStorage is used as a fallback in some UI components, but the primary persistence is now Firebase-based.

### Other Key Components

- **Main Cockpit Page (src/app/page.tsx)**: Central dashboard with a grid of GenerativeBlocks for AI tools. Includes campaign selection dropdown, save button for campaigns, and toolkit blocks for quick generation.
- **Header and Footer (src/components/header.tsx, footer.tsx)**: Navigation and UI elements.
- **GenerativeBlock (src/components/generative-block.tsx)**: Reusable component for each AI flow, handling input, generation, formatting, and saving.
- **Theme Provider and UI Utils**: Tailwind CSS with custom themes; Radix UI for accessible components.

## Data Flow

### LocalStorage vs Firebase

- **LocalStorage Usage (Legacy/Fallback)**:
  - Used for quick client-side state, e.g., 'lazy-gm-active-campaign-id' to restore the active campaign on page load in src/app/page.tsx and src/app/campaigns/page.tsx.
  - Limited to client-side; not synced across devices or sessions.

- **Firebase Persistence**:
  - Primary storage for all data: Campaigns, session preps, generated items, and user settings.
  - Data flow: UI state changes trigger Firebase CRUD calls (e.g., updateSessionPrep on editor change).
  - All data is fetched on load (e.g., getCampaigns) and synced in real-time.

### Active Campaign ID Migration

- **Pre-Migration**: Active campaign ID stored in localStorage ('lazy-gm-active-campaign-id'). Selected in UI, used for context in AI flows, but lost on clear browser data or new device.
- **Post-Migration**: Moved to Firebase 'userSettings' collection.
  - On app load, check Firebase user settings for activeCampaignId.
  - Update localStorage as fallback for immediate UI state.
  - When selecting a campaign, update both localStorage and Firebase user settings.
  - Benefits: Syncs across devices; survives browser clears.
  - Implementation: Use updateUserSettings to set activeCampaignId; fallback to localStorage if not set.
  - From repair task analysis, no bugs were found in the implementation, confirming the migration is functional.

Data flows from UI components -> Firebase service calls -> Firestore/Storage. AI generations are saved immediately after creation.

## Setup and Running Instructions

### Prerequisites

- Node.js 22 or higher.
- pnpm or npm package manager.
- Firebase project set up with Firestore and Storage enabled.
- Google AI API key for Gemini (via Genkit).

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/jessenaiman/lazy-dice-master.git
   cd lazy-dice-master
   ```

2. Install dependencies:
   ```
   pnpm install
   # or
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google AI (Gemini)
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   ```

4. Run the development server:
   ```
   pnpm run dev
   # or
   npm run dev
   ```

5. Open http://localhost:9002 in your browser.

### Development Commands

- `pnpm run dev`: Start development server with Turbopack (port 9002).
- `pnpm run build`: Build for production.
- `pnpm run start`: Start production server.
- `pnpm run lint`: Run ESLint.
- `pnpm run typecheck`: Run TypeScript checks.
- `pnpm run genkit:dev`: Start Genkit dev server (required for AI flows).
- `pnpm run genkit:watch`: Run Genkit in watch mode for development.

Note: TypeScript and ESLint errors are ignored during builds for faster iteration.

## Feature List with Saving/Loading Persistence Details

### Core Features

1. **Campaign Management**:
   - Create campaigns with AI-generated context (name, description, characters).
   - List and select campaigns.
   - Save/load: Full CRUD via Firebase; active ID persisted in user settings (migrated from localStorage).

2. **Session Preparation**:
   - Create session preps linked to campaigns.
   - Rich text editing with TipTap (HTML storage in Firebase).
   - Auto-save on change; export to Markdown.
   - Save/load: Stored in 'sessionPreps' collection; loaded by ID.

3. **AI Content Generation (Genkit Integration)**:
   - 14+ flows for generating D&D elements (e.g., NPCs, puzzles, maps).
   - Optional campaign context for personalized output.
   - Formatted HTML display; saved to 'generatedItems' collection with type and campaign ID.
   - Save/load: Immediate save after generation; retrievable by campaign or type.

4. **Persistence and Loading**:
   - All data (campaigns, preps, items) stored in Firebase Firestore.
   - Files (e.g., map images) uploaded to Firebase Storage.
   - Active campaign sync: Firebase user settings ensure cross-device consistency.
   - Loading: On app start, fetch from Firebase; fallback to localStorage if offline or unset.
   - Offline handling: LocalStorage caches for UI state; sync on reconnect.

5. **UI and Usability**:
   - Responsive design with Tailwind CSS and Radix UI.
   - Campaign selector in header.
   - Print and export options for notes.
   - Toast notifications for save success/errors.

### Saving/Loading Workflow

- **Saving**:
  - Editor changes trigger updateSessionPrep (debounced).
  - AI generation calls addGeneratedItem after successful API response.
  - Campaign updates via updateCampaign.
  - Active ID: Update user settings on selection.

- **Loading**:
  - App load: Fetch campaigns, preps, items from Firebase.
  - Active campaign: Check user settings; fallback to localStorage.
  - Session prep: Load by ID from Firestore.

The migration ensures reliable persistence, addressing previous localStorage limitations (e.g., data loss on clear).

For more details, see the codebase in src/ and docs/lazy_gm/ for GM resources.
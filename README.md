# Lazy Dice Master

A modern web application for lazy Game Masters (GMs) to generate and manage Dungeons & Dragons content using AI-powered tools. Built with Next.js, ORM, and Google AI.

## Features

- **AI-Powered Content Generation**: Generate bookshelves, NPCs, encounters, and more using Google's Gemini AI
- **Rich Text Editing**: Built-in TipTap editor for creating and editing campaign content
- **Firebase Integration**: Real-time data storage and authentication
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **Comprehensive Documentation**: Extensive lazy GM resources and guides included

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jessenaiman/lazy-dice-master.git
   cd lazy-dice-master
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env.local` file with your Firebase and Google AI credentials:

   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google AI
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:9002](http://localhost:9002) in your browser.

### Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with watch mode

## Project Structure

```text
src/
├── ai/                 # AI flows and Genkit configuration
├── app/                # Next.js app router pages
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
└── lib/                # Utilities and Firebase services

docs/
└── lazy_gm/           # Comprehensive lazy GM resources
    ├── 01-index.md    # Getting started guide
    ├── 02-eightsteps.md # 8-step campaign creation
    └── ...            # Additional guides and tools
```

## Documentation

The `docs/lazy_gm/` folder contains extensive resources for lazy GMs, including:

- Campaign creation guides
- NPC and encounter generators
- Combat checklists
- Monster building tools
- World-building resources
- And much more!

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **AI**: Google Gemini AI via Genkit
- **Database**: Prisms ORM (sqlite)
- **Editor**: TipTap rich text editor

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and run tests
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

## License

This project is licensed under the Creative Commons Attribution 4.0 International License - see the [LICENSE.md](docs/lazy_gm/LICENSE.md) file for details.

## Acknowledgments

- Built on the principles of "The Lazy Dungeon Master" by Sly Flourish
- AI integration powered by Google's Gemini
- UI components from Radix UI and Tailwind CSS

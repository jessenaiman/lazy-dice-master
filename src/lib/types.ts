

export interface PlayerCharacter {
  id: string;
  name: string;
  motivation: string;
  details: string;
}

export interface StoredFile {
  name: string;
  url: string;
  path: string;
}

export interface Campaign {
  id:string;
  name: string;
  description: string;
  characters: PlayerCharacter[];
  sessionPrepIds: string[];
  fileUrls: StoredFile[]; // To store links to files in Firebase Storage
}

// Base type for all generated items
export interface GeneratedItem {
  id: string;
  campaignId: string | null; // Can be null if not associated with a specific campaign
  createdAt: number; // Storing as timestamp for Firestore
  content: any; // This will hold the specific data for each item type
  type: 'strong-start' | 'secret-clue' | 'npc' | 'location' | 'puzzle' | 'riddle' | 'magic-item' | 'prophecy' | 'random-contents' | 'plot-hook' | 'map' | 'adventure-idea' | 'bookshelf-contents' | 'tavern-menu';
}

export interface SessionPrep {
  id: string;
  campaignId: string;
  createdAt: number;
  name: string;
  notes: string; // All session notes as a single HTML string
export interface UserSettings {
  id: string; // User ID
  activeCampaignId?: string; // ID of the currently active campaign
  // Can be extended with other user preferences in the future
}
}

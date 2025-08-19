export interface PlayerCharacter {
    id: string;
    name: string;
    motivation: string;
    details: string;
  }
  
  export interface Secret {
    id: string;
    text: string;
    revealed: boolean;
    discoveryNotes?: string;
  }
  
  export interface MagicItem {
    id: string;
    name: string;
    description: string;
    traits: string[];
  }
  
  export interface SessionPrep {
    id: string;
    // Removed campaignId as we will manage this link differently
    date: string; // ISO string
    notes: string; // All session notes as a single HTML string
  }
  
  export interface Campaign {
    id: string;
    name: string;
    description: string; // This will be the main context
    characters: PlayerCharacter[];
    sessionPreps: SessionPrep[];
  }
  
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
    campaignId: string;
    strongStart: string;
    potentialScenes: string[];
    secrets: Secret[];
    fantasticLocations: string[]; // For simplicity, just strings for now
    importantNpcs: string[]; // For simplicity, just strings for now
    relevantMonsters: string[]; // For simplicity, just strings for now
    magicItems: MagicItem[];
  }
  
  export interface Campaign {
    id: string;
    name: string;
    description: string;
    characters: PlayerCharacter[];
    sessionPreps: SessionPrep[];
  }
  
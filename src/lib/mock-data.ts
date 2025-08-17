import type { Campaign, SessionPrep } from './types';

export const mockSessionPrep: SessionPrep = {
  id: 'session-1',
  campaignId: 'shadows-of-emberwood',
  strongStart: 'As you huddle around the campfire, a blood-curdling scream pierces the night from the direction of the ancient ruins you were warned to avoid. A lone figure stumbles out of the darkness, clutching a strange, glowing shard, and collapses before you.',
  potentialScenes: [
    'Investigating the ancient ruins.',
    'Interrogating the mysterious survivor.',
    'A moonlit chase through the Whispering Woods.',
    'Confronting the town elder who warned them away.',
    'A tense negotiation with the Gloomfang goblin tribe.',
  ],
  secrets: [
    { id: 'sec-1', text: 'The ruins are not abandoned; they are a prison for a forgotten entity.', revealed: false },
    { id: 'sec-2', text: 'The "survivor" is actually the entity\'s warden, trying to prevent its escape.', revealed: false },
    { id: 'sec-3', text: 'The glowing shard is a key to the prison.', revealed: false },
    { id: 'sec-4', text: 'The town elder made a pact with the entity long ago.', revealed: false },
    { id: 'sec-5', text: 'The Gloomfang goblins worship the entity and seek to release it.', revealed: false },
  ],
  fantasticLocations: [
    'The Sunken Citadel of Aerthos',
    'The Whispering Woods',
    'Gloomfang Warrens',
  ],
  importantNpcs: [
    'Elara, the panicked survivor/warden',
    'Old Man Hemlock, the secretive town elder',
    'Grak, the ambitious Gloomfang chieftain',
  ],
  relevantMonsters: [
    'Shadow Cursed Goblins',
    'Whisper-wraiths',
    'The Imprisoned One (Abyssal Horror)',
  ],
  magicItems: [
    { id: 'item-1', name: 'Shard of Containment', description: 'A piece of shimmering obsidian that hums with power.', traits: [] }
  ],
};

export const mockCampaigns: Campaign[] = [
  {
    id: 'shadows-of-emberwood',
    name: 'Shadows of Emberwood',
    description: 'A dark fantasy campaign set in a cursed forest. Ancient evils stir and forgotten secrets resurface.',
    characters: [
      { id: 'char-1', name: 'Valerius', motivation: 'To reclaim his family\'s lost honor.', details: 'A disgraced knight seeking redemption.' },
      { id: 'char-2', name: 'Lyra', motivation: 'To uncover the secrets of her arcane ancestry.', details: 'A hedge mage with a mysterious past.' },
      { id: 'char-3', name: 'Brog', motivation: 'To protect the innocent from the encroaching darkness.', details: 'A stoic dwarf warrior with a heart of gold.' },
    ],
    sessionPreps: [mockSessionPrep],
  },
];

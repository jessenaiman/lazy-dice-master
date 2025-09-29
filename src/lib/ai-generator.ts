// Centralized AI Content Generation Entry Point

import { generateAdventureIdea, GenerateAdventureIdeaInput, GenerateAdventureIdeaOutput } from '@/ai/flows/generate-adventure-idea';
import { generateNpc, GenerateNpcInput, GenerateNpcOutput } from '@/ai/flows/generate-npc';
import { generateMapImage, GenerateMapImageInput, GenerateMapImageOutput } from '@/ai/flows/generate-map-image';
import { generateSecretsAndClues, GenerateSecretsAndCluesInput, GenerateSecretsAndCluesOutput } from '@/ai/flows/generate-secrets-and-clues';
import { generateTavernMenu, GenerateTavernMenuInput, GenerateTavernMenuOutput } from '@/ai/flows/generate-tavern-menu';
import { generateStrongStart, GenerateStrongStartInput, GenerateStrongStartOutput } from '@/ai/flows/generate-strong-start';
import { generatePlotHook, GeneratePlotHookInput, GeneratePlotHookOutput } from '@/ai/flows/generate-plot-hook';
import { generateLocation, GenerateLocationInput, GenerateLocationOutput } from '@/ai/flows/generate-location';
import { generatePuzzle, GeneratePuzzleInput, GeneratePuzzleOutput } from '@/ai/flows/generate-puzzle';
import { generateRiddle, GenerateRiddleInput, GenerateRiddleOutput } from '@/ai/flows/generate-riddle';
import { generateBookshelfContents, GenerateBookshelfContentsInput, GenerateBookshelfContentsOutput } from '@/ai/flows/generate-bookshelf-contents';
import { generateMagicItem, GenerateMagicItemInput, GenerateMagicItemOutput } from '@/ai/flows/generate-magic-item';
import { generateProphecy, GenerateProphecyInput, GenerateProphecyOutput } from '@/ai/flows/generate-prophecy';
import { generateRandomContents, GenerateRandomContentsInput, GenerateRandomContentsOutput } from '@/ai/flows/generate-random-contents';

// Add more imports as new flows are added

export type AIContentType =
  | 'adventureIdea'
  | 'npc'
  | 'mapImage'
  | 'secretsAndClues'
  | 'tavernMenu'
  | 'strongStart'
  | 'plotHook'
  | 'location'
  | 'puzzle'
  | 'riddle'
  | 'bookshelfContents'
  | 'magicItem'
  | 'prophecy'
  | 'randomContents';
// Add more as needed

export type AIContentInput =
  | ({ type: 'adventureIdea' } & GenerateAdventureIdeaInput)
  | ({ type: 'npc' } & GenerateNpcInput)
  | ({ type: 'mapImage' } & GenerateMapImageInput)
  | ({ type: 'secretsAndClues' } & GenerateSecretsAndCluesInput)
  | ({ type: 'tavernMenu' } & GenerateTavernMenuInput)
  | ({ type: 'strongStart' } & GenerateStrongStartInput)
  | ({ type: 'plotHook' } & GeneratePlotHookInput)
  | ({ type: 'location' } & GenerateLocationInput)
  | ({ type: 'puzzle' } & GeneratePuzzleInput)
  | ({ type: 'riddle' } & GenerateRiddleInput)
  | ({ type: 'bookshelfContents' } & GenerateBookshelfContentsInput)
  | ({ type: 'magicItem' } & GenerateMagicItemInput)
  | ({ type: 'prophecy' } & GenerateProphecyInput)
  | ({ type: 'randomContents' } & GenerateRandomContentsInput);
// Add more as needed

export type AIContentOutput =
  | GenerateAdventureIdeaOutput
  | GenerateNpcOutput
  | GenerateMapImageOutput
  | GenerateSecretsAndCluesOutput
  | GenerateTavernMenuOutput
  | GenerateStrongStartOutput
  | GeneratePlotHookOutput
  | GenerateLocationOutput
  | GeneratePuzzleOutput
  | GenerateRiddleOutput
  | GenerateBookshelfContentsOutput
  | GenerateMagicItemOutput
  | GenerateProphecyOutput
  | GenerateRandomContentsOutput;
// Add more as needed

export async function generateContent(input: AIContentInput): Promise<AIContentOutput> {
  switch (input.type) {
    case 'adventureIdea':
      return await generateAdventureIdea(input);
    case 'npc':
      return await generateNpc(input);
    case 'mapImage':
      return await generateMapImage(input);
    case 'secretsAndClues':
      return await generateSecretsAndClues(input);
    case 'tavernMenu':
      return await generateTavernMenu(input);
    case 'strongStart':
      return await generateStrongStart(input);
    case 'plotHook':
      return await generatePlotHook(input);
    case 'location':
      return await generateLocation(input);
    case 'puzzle':
      return await generatePuzzle(input);
    case 'riddle':
      return await generateRiddle(input);
    case 'bookshelfContents':
      return await generateBookshelfContents(input);
    case 'magicItem':
      return await generateMagicItem(input);
    case 'prophecy':
      return await generateProphecy(input);
    case 'randomContents':
      return await generateRandomContents(input);
    // Add more cases as needed
    default:
      throw new Error(`Unknown AI content type: ${(input as any).type}`);
  }
}
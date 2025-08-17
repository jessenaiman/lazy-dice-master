// src/ai/flows/generate-strong-start.ts
'use server';

/**
 * @fileOverview AI-powered content generation for a 'Strong Start' opening scene.
 *
 * This file contains the Genkit flow to generate a compelling opening scene
 * based on the campaign setting and player characters, enabling Game Masters
 * to quickly create a hook for their players.
 *
 * @exports generateStrongStart - A function that triggers the strong start generation flow.
 * @exports GenerateStrongStartInput - The input type for the generateStrongStart function.
 * @exports GenerateStrongStartOutput - The return type for the generateStrongStart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrongStartInputSchema = z.object({
  campaignSetting: z.string().describe('The setting of the campaign.'),
  playerCharacters: z.string().describe('A description of the player characters in the campaign.'),
});
export type GenerateStrongStartInput = z.infer<typeof GenerateStrongStartInputSchema>;

const GenerateStrongStartOutputSchema = z.object({
  strongStart: z.string().describe('A compelling opening scene.'),
});
export type GenerateStrongStartOutput = z.infer<typeof GenerateStrongStartOutputSchema>;

export async function generateStrongStart(input: GenerateStrongStartInput): Promise<GenerateStrongStartOutput> {
  return generateStrongStartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrongStartPrompt',
  input: {schema: GenerateStrongStartInputSchema},
  output: {schema: GenerateStrongStartOutputSchema},
  prompt: `You are an experienced Game Master known for creating exciting opening scenes.
  Based on the campaign setting and player characters provided, generate a "Strong Start" to hook the players.

  Campaign Setting: {{{campaignSetting}}}
  Player Characters: {{{playerCharacters}}}

  Strong Start:`,
});

const generateStrongStartFlow = ai.defineFlow({
    name: 'generateStrongStartFlow',
    inputSchema: GenerateStrongStartInputSchema,
    outputSchema: GenerateStrongStartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

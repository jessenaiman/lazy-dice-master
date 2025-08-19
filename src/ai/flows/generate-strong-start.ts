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
  playerCharacters: z.string().describe('A description of the player characters in the campaign, and any specific user requests.'),
});
export type GenerateStrongStartInput = z.infer<typeof GenerateStrongStartInputSchema>;

const GenerateStrongStartOutputSchema = z.object({
  strongStart: z.array(z.string()).min(3).max(5).describe('An array of 3-5 compelling opening scene ideas as bullet points.'),
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
  Based on the campaign setting and player characters provided, generate 3 to 5 "Strong Start" bullet points to hook the players.
  Each bullet point should be a concise, actionable, and exciting situation that immediately involves the characters. Vary the length and style of each point.

  Campaign Setting: {{{campaignSetting}}}
  Player Characters & Context: {{{playerCharacters}}}
  `,
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

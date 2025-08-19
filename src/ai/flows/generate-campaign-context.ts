// src/ai/flows/generate-campaign-context.ts
'use server';

/**
 * @fileOverview AI-powered generator for a campaign context, including a name, description, and characters.
 *
 * - generateCampaignContext - A function that generates a campaign context.
 * - GenerateCampaignContextInput - The input type for the generateCampaignContext function.
 * - GenerateCampaignContextOutput - The return type for the generateCampaignContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCampaignContextInputSchema = z.object({
    theme: z.string().describe("Optional theme for the campaign (e.g., 'dark fantasy', 'pirate adventure')").optional(),
});
export type GenerateCampaignContextInput = z.infer<typeof GenerateCampaignContextInputSchema>;


const CharacterSchema = z.object({
    name: z.string().describe("The character's name."),
    details: z.string().describe("A brief, one-sentence description of the character."),
    motivation: z.string().describe("The character's primary motivation."),
});

const GenerateCampaignContextOutputSchema = z.object({
  name: z.string().describe('A catchy name for the campaign.'),
  description: z.string().describe('A two-paragraph description of the campaign setting and central conflict.'),
  characters: z.array(CharacterSchema).length(3).describe('An array of three distinct player characters.'),
});
export type GenerateCampaignContextOutput = z.infer<typeof GenerateCampaignContextOutputSchema>;

export async function generateCampaignContext(input: GenerateCampaignContextInput): Promise<GenerateCampaignContextOutput> {
  return generateCampaignContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCampaignContextPrompt',
  input: {schema: GenerateCampaignContextInputSchema},
  output: {schema: GenerateCampaignContextOutputSchema},
  prompt: `You are a creative world-builder for tabletop RPGs.
  
  {{#if theme}}The user wants a campaign with a "{{theme}}" theme.{{else}}The user has not specified a theme, so create a classic high fantasy campaign.{{/if}}

  Generate a compelling campaign context that includes:
  1. A unique and evocative campaign name.
  2. A rich, two-paragraph description of the world, its main conflict, and what makes it interesting.
  3. Three pre-made player characters, each with a name, a one-sentence description, and a clear motivation that ties them to the campaign's conflict.
  `,
});

const generateCampaignContextFlow = ai.defineFlow(
  {
    name: 'generateCampaignContextFlow',
    inputSchema: GenerateCampaignContextInputSchema,
    outputSchema: GenerateCampaignContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

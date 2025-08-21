
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
    campaignName: z.string().describe("An optional user-provided name for the campaign. If provided, the AI should use this name. If not, it should generate one.").optional(),
});
export type GenerateCampaignContextInput = z.infer<typeof GenerateCampaignContextInputSchema>;


const CharacterSchema = z.object({
    name: z.string().describe("The character's name."),
    details: z.string().describe("A brief, one-sentence description of the character."),
    motivation: z.string().describe("The character's primary motivation."),
});

const GenerateCampaignContextOutputSchema = z.object({
  name: z.string().describe('A catchy and highly original name for the campaign. Avoid common fantasy names like "Eldoria". If the user provided a name, use that.'),
  description: z.string().describe('A two-paragraph description of the campaign setting and central conflict. Make it unique and avoid cliches.'),
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
  prompt: `You are a creative world-builder for tabletop RPGs, known for your highly original and unique ideas.

  {{#if theme}}The user wants a campaign with a "{{theme}}" theme.{{else}}The user has not specified a theme, so create a classic high fantasy campaign, but make it feel fresh and new.{{/if}}

  {{#if campaignName}}
  The campaign name is "{{campaignName}}". Use this name.
  {{else}}
  Generate a unique and evocative campaign name. Do NOT use common or generic fantasy names (e.g., Eldoria, Silver-something, Dragon-something). Be creative and original.
  {{/if}}

  Generate a compelling campaign context that includes:
  1. The campaign name.
  2. A rich, two-paragraph description of the world, its main conflict, and what makes it interesting. Avoid tired fantasy tropes.
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

    

// src/ai/flows/generate-adventure-idea.ts
'use server';

/**
 * @fileOverview AI-powered generator for creating adventure ideas.
 *
 * - generateAdventureIdea - A function that generates an adventure idea.
 * - GenerateAdventureIdeaInput - The input type for the generateAdventureIdea function.
 * - GenerateAdventureIdeaOutput - The return type for the generateAdventureIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdventureIdeaInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign and any user-provided context.').optional(),
});
export type GenerateAdventureIdeaInput = z.infer<typeof GenerateAdventureIdeaInputSchema>;

const GenerateAdventureIdeaOutputSchema = z.object({
  title: z.string().describe('A catchy and evocative title for the adventure.'),
  summary: z.string().describe('A one-paragraph summary of the adventure\'s premise and what the players will be doing.'),
  conflict: z.string().describe('The central conflict or problem the players must resolve.'),
  locations: z.array(z.string()).length(3).describe('Three key locations that are likely to feature in the adventure.'),
});
export type GenerateAdventureIdeaOutput = z.infer<typeof GenerateAdventureIdeaOutputSchema>;

export async function generateAdventureIdea(input: GenerateAdventureIdeaInput): Promise<GenerateAdventureIdeaOutput> {
  return generateAdventureIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdventureIdeaPrompt',
  input: {schema: GenerateAdventureIdeaInputSchema},
  output: {schema: GenerateAdventureIdeaOutputSchema},
  prompt: `You are an expert adventure crafter for tabletop RPGs. Generate a complete adventure idea.

  {{#if campaignSetting}}
  Base the adventure on the following campaign setting:
  {{{campaignSetting}}}
  {{else}}
  The user has not provided a campaign setting, so create a generic fantasy adventure.
  {{/if}}

  The adventure idea should include:
  1. A creative title.
  2. A one-paragraph summary.
  3. A clear central conflict.
  4. Three distinct and interesting locations.
  `,
});

const generateAdventureIdeaFlow = ai.defineFlow(
  {
    name: 'generateAdventureIdeaFlow',
    inputSchema: GenerateAdventureIdeaInputSchema,
    outputSchema: GenerateAdventureIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
// src/ai/flows/generate-random-contents.ts
'use server';

/**
 * @fileOverview AI-powered generator for random contents of containers.
 *
 * - generateRandomContents - A function that generates a list of items.
 * - GenerateRandomContentsInput - The input type for the generateRandomContents function.
 * - GenerateRandomContentsOutput - The return type for the generateRandomContents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRandomContentsInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign.').optional(),
  container: z.string().describe('The type of container being searched (e.g., pocket, backpack, chest).'),
  context: z.string().describe('Additional context about the location or owner of the container (e.g., "a wizard\'s desk drawer", "a goblin\'s pouch").').optional(),
});
export type GenerateRandomContentsInput = z.infer<typeof GenerateRandomContentsInputSchema>;

const GenerateRandomContentsOutputSchema = z.object({
  container: z.string().describe('The container that was searched.'),
  contents: z.array(z.string()).min(3).max(7).describe('An array of 3 to 7 items found inside the container. The items should be a mix of mundane and interesting, with varied descriptions.'),
});
export type GenerateRandomContentsOutput = z.infer<typeof GenerateRandomContentsOutputSchema>;

export async function generateRandomContents(input: GenerateRandomContentsInput): Promise<GenerateRandomContentsOutput> {
  return generateRandomContentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRandomContentsPrompt',
  input: {schema: GenerateRandomContentsInputSchema},
  output: {schema: GenerateRandomContentsOutputSchema},
  prompt: `You are a Game Master's assistant, helping to quickly populate the world with interesting details. A player is searching a container.

  Container: {{{container}}}
  {{#if context}}Context: {{{context}}}{{/if}}
  {{#if campaignSetting}}Campaign Setting: {{{campaignSetting}}}{{/if}}

  Generate a list of 3 to 7 items that might be found inside. The list should be plausible for the container and context. Include a mix of mundane and at least one interesting or unusual item. Vary the length and detail of the descriptions for each item to make the list feel authentic.
  `,
});

const generateRandomContentsFlow = ai.defineFlow(
  {
    name: 'generateRandomContentsFlow',
    inputSchema: GenerateRandomContentsInputSchema,
    outputSchema: GenerateRandomContentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

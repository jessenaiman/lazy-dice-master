// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator for fantasy locations.
 *
 * - generateLocation - A function that generates a location description and clues.
 * - GenerateLocationInput - The input type for the generateLocation function.
 * - GenerateLocationOutput - The return type for the generateLocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLocationInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign (e.g., dark fantasy, high fantasy, post-apocalyptic).'),
});
export type GenerateLocationInput = z.infer<typeof GenerateLocationInputSchema>;

const GenerateLocationOutputSchema = z.object({
  name: z.string().describe('A unique and evocative name for the location.'),
  description: z.string().describe('A rich, two-paragraph description of the location, appealing to multiple senses.'),
  clues: z.array(z.string()).length(3).describe('Three bullet-point clues or secrets that players might discover at this location.'),
});
export type GenerateLocationOutput = z.infer<typeof GenerateLocationOutputSchema>;

export async function generateLocation(input: GenerateLocationInput): Promise<GenerateLocationOutput> {
  return generateLocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLocationPrompt',
  input: {schema: GenerateLocationInputSchema},
  output: {schema: GenerateLocationOutputSchema},
  prompt: `You are a world-building expert for tabletop RPGs. Create a compelling fantasy location based on the provided campaign setting.

  Campaign Setting: {{{campaignSetting}}}

  Generate a unique name, a detailed two-paragraph description, and three distinct clues or secrets associated with the location. The clues should be mysterious and provide hooks for further adventure.
  `,
});

const generateLocationFlow = ai.defineFlow(
  {
    name: 'generateLocationFlow',
    inputSchema: GenerateLocationInputSchema,
    outputSchema: GenerateLocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

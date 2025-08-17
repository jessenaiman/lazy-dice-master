// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator for fantasy prophecies.
 *
 * - generateProphecy - A function that generates a prophecy and its possible meanings.
 * - GenerateProphecyInput - The input type for the generateProphecy function.
 * - GenerateProphecyOutput - The return type for the generateProphecy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProphecyInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign and any user-provided context (e.g., "a prophecy about the return of a dragon").'),
});
export type GenerateProphecyInput = z.infer<typeof GenerateProphecyInputSchema>;

const GenerateProphecyOutputSchema = z.object({
  prophecy: z.string().describe('A cryptic, one-paragraph prophecy written in a poetic or archaic style.'),
  meanings: z.array(z.string()).length(3).describe('Three bullet-point interpretations or possible meanings of the prophecy, which could be true, false, or metaphorical.'),
});
export type GenerateProphecyOutput = z.infer<typeof GenerateProphecyOutputSchema>;

export async function generateProphecy(input: GenerateProphecyInput): Promise<GenerateProphecyOutput> {
  return generateProphecyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProphecyPrompt',
  input: {schema: GenerateProphecyInputSchema},
  output: {schema: GenerateProphecyOutputSchema},
  prompt: `You are a mysterious oracle, weaving cryptic prophecies for tabletop RPGs.

  Campaign Setting & Context: {{{campaignSetting}}}

  Generate a vague and poetic one-paragraph prophecy. Then, provide three different possible interpretations of what the prophecy could mean. These interpretations should be distinct and provide potential plot hooks.
  `,
});

const generateProphecyFlow = ai.defineFlow(
  {
    name: 'generateProphecyFlow',
    inputSchema: GenerateProphecyInputSchema,
    outputSchema: GenerateProphecyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

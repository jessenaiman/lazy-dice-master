// src/ai/flows/generate-riddle.ts
'use server';

/**
 * @fileOverview AI-powered generator for creating fantasy riddles.
 *
 * - generateRiddle - A function that generates a riddle with a solution and clues.
 * - GenerateRiddleInput - The input type for the generateRiddle function.
 * - GenerateRiddleOutput - The return type for the generateRiddle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiddleInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign and any user-provided context (e.g., "a riddle for a sphinx guarding a bridge").'),
  complexity: z.enum(['Simple', 'Common', 'Challenging']).default('Simple').describe('The complexity of the riddle.'),
});
export type GenerateRiddleInput = z.infer<typeof GenerateRiddleInputSchema>;

const GenerateRiddleOutputSchema = z.object({
  riddle: z.string().describe('The text of the riddle, written in a style fitting the fantasy setting.'),
  solution: z.string().describe('The answer to the riddle.'),
  clues: z.array(z.string()).length(3).describe('Three brief bullet-point clues the GM could drop if the players are struggling.'),
});
export type GenerateRiddleOutput = z.infer<typeof GenerateRiddleOutputSchema>;

export async function generateRiddle(input: GenerateRiddleInput): Promise<GenerateRiddleOutput> {
  return generateRiddleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiddlePrompt',
  input: {schema: GenerateRiddleInputSchema},
  output: {schema: GenerateRiddleOutputSchema},
  prompt: `You are a master of riddles and puzzles for tabletop RPGs. Create a riddle based on the provided context.

  Complexity: {{{complexity}}}
  {{#if campaignSetting}}Campaign Context: {{{campaignSetting}}}{{/if}}

  Generate a riddle, its solution, and three clues to help players who are stuck.
  The riddle's complexity should match the requested level:
  - Simple: Ages 8+ can figure this out pretty easily.
  - Common: A typical challenge for teens or adults (13+).
  - Challenging: A real head-scratcher for adults (18+).
  `,
});

const generateRiddleFlow = ai.defineFlow(
  {
    name: 'generateRiddleFlow',
    inputSchema: GenerateRiddleInputSchema,
    outputSchema: GenerateRiddleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

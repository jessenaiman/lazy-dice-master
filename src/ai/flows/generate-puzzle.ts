// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator for creating fantasy puzzles.
 *
 * - generatePuzzle - A function that generates a puzzle with a title, description, solution, and clues.
 * - GeneratePuzzleInput - The input type for the generatePuzzle function.
 * - GeneratePuzzleOutput - The return type for the generatePuzzle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePuzzleInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign (e.g., ancient ruins, wizard\'s tower, fey forest) and any user-provided context.'),
});
export type GeneratePuzzleInput = z.infer<typeof GeneratePuzzleInputSchema>;

const GeneratePuzzleOutputSchema = z.object({
  title: z.string().describe('An evocative title for the puzzle.'),
  description: z.string().describe('A detailed, one-paragraph description of the puzzle the players encounter.'),
  solution: z.string().describe('A clear and concise explanation of the puzzle\'s solution.'),
  clues: z.array(z.string()).length(3).describe('Three cryptic but helpful clues to guide the players toward the solution.'),
});
export type GeneratePuzzleOutput = z.infer<typeof GeneratePuzzleOutputSchema>;

export async function generatePuzzle(input: GeneratePuzzleInput): Promise<GeneratePuzzleOutput> {
  return generatePuzzleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePuzzlePrompt',
  input: {schema: GeneratePuzzleInputSchema},
  output: {schema: GeneratePuzzleOutputSchema},
  prompt: `You are a brilliant puzzle master for tabletop RPGs. Create a clever fantasy puzzle appropriate for the given setting.

  Campaign Setting & Context: {{{campaignSetting}}}

  Generate a title, a one-paragraph description of the puzzle, a clear solution, and three cryptic clues. The puzzle should be solvable with logic and observation, not just a single skill check.
  `,
});

const generatePuzzleFlow = ai.defineFlow(
  {
    name: 'generatePuzzleFlow',
    inputSchema: GeneratePuzzleInputSchema,
    outputSchema: GeneratePuzzleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

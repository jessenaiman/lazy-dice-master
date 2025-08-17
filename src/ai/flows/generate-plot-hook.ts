// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator for creating RPG plot hooks.
 *
 * - generatePlotHook - A function that generates a plot hook and related clues.
 * - GeneratePlotHookInput - The input type for the generatePlotHook function.
 * - GeneratePlotHookOutput - The return type for the generatePlotHook function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePlotHookInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign.'),
  playerCharacters: z.string().describe('A description of the player characters, their motivations, and any specific user requests.'),
});
export type GeneratePlotHookInput = z.infer<typeof GeneratePlotHookInputSchema>;

const GeneratePlotHookOutputSchema = z.object({
  hook: z.string().describe('A compelling, one-paragraph plot hook to engage the players.'),
  clues: z.array(z.string()).length(3).describe('Three bullet-point clues that can lead the players to investigate the hook.'),
});
export type GeneratePlotHookOutput = z.infer<typeof GeneratePlotHookOutputSchema>;

export async function generatePlotHook(input: GeneratePlotHookInput): Promise<GeneratePlotHookOutput> {
  return generatePlotHookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePlotHookPrompt',
  input: {schema: GeneratePlotHookInputSchema},
  output: {schema: GeneratePlotHookOutputSchema},
  prompt: `You are an expert Game Master who excels at creating engaging adventures.
  Based on the provided campaign setting and player characters, generate a compelling plot hook and three related clues.

  Campaign Setting: {{{campaignSetting}}}
  Player Characters & Context: {{{playerCharacters}}}

  The plot hook should be a single paragraph. The clues should be three distinct, actionable pieces of information that the players can discover.
  `,
});

const generatePlotHookFlow = ai.defineFlow(
  {
    name: 'generatePlotHookFlow',
    inputSchema: GeneratePlotHookInputSchema,
    outputSchema: GeneratePlotHookOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator for creating Non-Player Characters (NPCs).
 *
 * - generateNpc - A function that generates an NPC with a description, mannerisms, and a portrait prompt.
 * - GenerateNpcInput - The input type for the generateNpc function.
 * - GenerateNpcOutput - The return type for the generateNpc function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNpcInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign (e.g., dark fantasy, high fantasy, sci-fi).'),
});
export type GenerateNpcInput = z.infer<typeof GenerateNpcInputSchema>;

const GenerateNpcOutputSchema = z.object({
  name: z.string().describe('A unique and fitting name for the NPC.'),
  description: z.string().describe("A one-sentence description of the NPC's appearance and role."),
  mannerisms: z.array(z.string()).length(3).describe('Three distinct mannerisms or quirks the NPC exhibits.'),
});
export type GenerateNpcOutput = z.infer<typeof GenerateNpcOutputSchema>;

export async function generateNpc(input: GenerateNpcInput): Promise<GenerateNpcOutput> {
  return generateNpcFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNpcPrompt',
  input: {schema: GenerateNpcInputSchema},
  output: {schema: GenerateNpcOutputSchema},
  prompt: `You are a character designer for tabletop RPGs. Create a unique Non-Player Character (NPC) based on the campaign setting.

  Campaign Setting: {{{campaignSetting}}}

  Generate a name, a one-sentence description, and three distinct mannerisms for the NPC.
  `,
});

const generateNpcFlow = ai.defineFlow(
  {
    name: 'generateNpcFlow',
    inputSchema: GenerateNpcInputSchema,
    outputSchema: GenerateNpcOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator for fantasy magic items.
 *
 * - generateMagicItem - A function that generates a magic item with a name, description, and powers.
 * - GenerateMagicItemInput - The input type for the generateMagicItem function.
 * - GenerateMagicItemOutput - The return type for the generateMagicItem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMagicItemInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign and any user-provided context (e.g., "a holy sword for a paladin").'),
});
export type GenerateMagicItemInput = z.infer<typeof GenerateMagicItemInputSchema>;

const GenerateMagicItemOutputSchema = z.object({
  name: z.string().describe('A unique and evocative name for the magic item.'),
  description: z.string().describe('A one-paragraph description of the item\'s appearance and history.'),
  powers: z.array(z.string()).length(3).describe('Three bullet-point descriptions of the item\'s magical powers or properties.'),
});
export type GenerateMagicItemOutput = z.infer<typeof GenerateMagicItemOutputSchema>;

export async function generateMagicItem(input: GenerateMagicItemInput): Promise<GenerateMagicItemOutput> {
  return generateMagicItemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMagicItemPrompt',
  input: {schema: GenerateMagicItemInputSchema},
  output: {schema: GenerateMagicItemOutputSchema},
  prompt: `You are a legendary artificer who creates powerful magic items for tabletop RPGs.

  Campaign Setting & Context: {{{campaignSetting}}}

  Generate a unique magic item with a name, a one-paragraph description of its appearance and lore, and three distinct magical powers. The powers should be creative and offer interesting utility, not just combat bonuses.
  `,
});

const generateMagicItemFlow = ai.defineFlow(
  {
    name: 'generateMagicItemFlow',
    inputSchema: GenerateMagicItemInputSchema,
    outputSchema: GenerateMagicItemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

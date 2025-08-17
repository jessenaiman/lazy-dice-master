// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered generator of unique traits for magic items.
 *
 * - generateMagicItemTraits - A function that generates magic item traits.
 * - GenerateMagicItemTraitsInput - The input type for the generateMagicItemTraits function.
 * - GenerateMagicItemTraitsOutput - The return type for the generateMagicItemTraits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMagicItemTraitsInputSchema = z.object({
  itemType: z.string().describe('The type of magic item (e.g., sword, ring, amulet).'),
  itemTheme: z.string().describe('The theme or origin of the magic item (e.g., elven, dwarven, celestial).').optional(),
  numberOfTraits: z.number().describe('The number of traits to generate for the magic item.').default(3),
});
export type GenerateMagicItemTraitsInput = z.infer<typeof GenerateMagicItemTraitsInputSchema>;

const GenerateMagicItemTraitsOutputSchema = z.object({
  traits: z.array(z.string()).describe('An array of unique and interesting traits for the magic item.'),
});
export type GenerateMagicItemTraitsOutput = z.infer<typeof GenerateMagicItemTraitsOutputSchema>;

export async function generateMagicItemTraits(input: GenerateMagicItemTraitsInput): Promise<GenerateMagicItemTraitsOutput> {
  return generateMagicItemTraitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMagicItemTraitsPrompt',
  input: {schema: GenerateMagicItemTraitsInputSchema},
  output: {schema: GenerateMagicItemTraitsOutputSchema},
  prompt: `You are a creative fantasy writer, skilled at creating unique magic items for tabletop role-playing games.

  Generate {{numberOfTraits}} traits for a magic item of type "{{{itemType}}}".

  {% if itemTheme %}The item's theme is "{{{itemTheme}}}".{% endif %}

  Traits should be concise, evocative, and add interesting properties to the item, avoiding direct combat bonuses.  Focus on flavor and unique non-mechanical effects.

  Output the traits as a numbered list.

  Example Output:
  1.  Glows faintly when near treasure.
  2.  Whispers secrets to its wielder in Elvish.
  3.  Feels warm to the touch, even in cold environments.
  `,
});

const generateMagicItemTraitsFlow = ai.defineFlow(
  {
    name: 'generateMagicItemTraitsFlow',
    inputSchema: GenerateMagicItemTraitsInputSchema,
    outputSchema: GenerateMagicItemTraitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

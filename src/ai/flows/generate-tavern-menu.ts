
// src/ai/flows/generate-tavern-menu.ts
'use server';

/**
 * @fileOverview AI-powered generator for creating tavern menus.
 *
 * - generateTavernMenu - A function that generates a menu for a tavern.
 * - GenerateTavernMenuInput - The input type for the generateTavernMenu function.
 * - GenerateTavernMenuOutput - The return type for the generateTavernMenu function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTavernMenuInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign and any context about the tavern (e.g., "a rough dockside inn", "an elven bistro").').optional(),
});
export type GenerateTavernMenuInput = z.infer<typeof GenerateTavernMenuInputSchema>;

const MenuItemSchema = z.object({
    name: z.string().describe('The name of the food or drink item.'),
    price: z.string().describe('The price of the item (e.g., "5 cp", "2 sp").'),
    description: z.string().describe('A brief, flavorful description of the item.'),
});

const GenerateTavernMenuOutputSchema = z.object({
  name: z.string().describe('A creative name for the tavern or eatery.'),
  description: z.string().describe('A one-sentence description of the tavern\'s atmosphere.'),
  food: z.array(MenuItemSchema).min(3).max(5).describe('An array of 3 to 5 food items.'),
  drinks: z.array(MenuItemSchema).min(3).max(5).describe('An array of 3 to 5 drink items.'),
});
export type GenerateTavernMenuOutput = z.infer<typeof GenerateTavernMenuOutputSchema>;

export async function generateTavernMenu(input: GenerateTavernMenuInput): Promise<GenerateTavernMenuOutput> {
  return generateTavernMenuFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTavernMenuPrompt',
  input: {schema: GenerateTavernMenuInputSchema},
  output: {schema: GenerateTavernMenuOutputSchema},
  prompt: `You are a tavern keeper in a fantasy world. Create a menu for your establishment.

  {{#if campaignSetting}}
  The context for the tavern is: {{{campaignSetting}}}
  {{else}}
  The user has not provided any context, so create a menu for a typical, cozy fantasy tavern.
  {{/if}}

  Generate a menu that includes:
  1. A creative name for the tavern.
  2. A one-sentence description of its atmosphere.
  3. A list of 3-5 food items with prices and descriptions.
  4. A list of 3-5 drink items with prices and descriptions.
  `,
});

const generateTavernMenuFlow = ai.defineFlow(
  {
    name: 'generateTavernMenuFlow',
    inputSchema: GenerateTavernMenuInputSchema,
    outputSchema: GenerateTavernMenuOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
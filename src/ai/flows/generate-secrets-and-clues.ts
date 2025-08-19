// 'use server';

/**
 * @fileOverview AI flow for generating secrets and clues for a tabletop RPG session.
 *
 * - generateSecretsAndClues - A function that generates secrets and clues.
 * - GenerateSecretsAndCluesInput - The input type for the generateSecretsAndClues function.
 * - GenerateSecretsAndCluesOutput - The return type for the generateSecretsAndClues function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSecretsAndCluesInputSchema = z.object({
  campaignSetting: z
    .string()
    .describe('The campaign setting for the RPG session.'),
  potentialScenes: z
    .string()
    .describe('A list of potential scenes that might occur during the session and any other user-provided context.')
    .optional(),
  characterMotivations: z
    .string()
    .describe(
      'The motivations of the player characters in the campaign, which can be used to tailor the secrets and clues.'
    )
    .optional(),
  numSecrets: z
    .number()
    .min(3)
    .max(5)
    .default(3)
    .describe('The number of secrets and clues to generate.'),
});
export type GenerateSecretsAndCluesInput = z.infer<
  typeof GenerateSecretsAndCluesInputSchema
>;

const GenerateSecretsAndCluesOutputSchema = z.object({
  secrets: z
    .array(z.string()).min(3).max(5)
    .describe('An array of secrets and clues related to the campaign and scenes. Vary the length and complexity of each item.'),
});
export type GenerateSecretsAndCluesOutput = z.infer<
  typeof GenerateSecretsAndCluesOutputSchema
>;

export async function generateSecretsAndClues(
  input: GenerateSecretsAndCluesInput
): Promise<GenerateSecretsAndCluesOutput> {
  return generateSecretsAndCluesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSecretsAndCluesPrompt',
  input: {schema: GenerateSecretsAndCluesInputSchema},
  output: {schema: GenerateSecretsAndCluesOutputSchema},
  prompt: `You are an experienced Game Master, skilled at creating engaging mysteries and plot hooks for tabletop RPGs.

  Generate a list of {{numSecrets}} secrets and/or clues that the players might uncover during the session. These should be related to the overall campaign setting and character motivations provided. Focus on generating interesting and diverse items that can drive the plot forward. Do not number them. Vary the length and complexity of each item to resemble a list from a GM guide.

  Campaign Setting: {{{campaignSetting}}}
  {{#if potentialScenes}}Potential Scenes & Context: {{{potentialScenes}}}{{/if}}
  {{#if characterMotivations}}Character Motivations: {{{characterMotivations}}}{{/if}}
  `,
});

const generateSecretsAndCluesFlow = ai.defineFlow(
  {
    name: 'generateSecretsAndCluesFlow',
    inputSchema: GenerateSecretsAndCluesInputSchema,
    outputSchema: GenerateSecretsAndCluesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

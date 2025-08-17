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
    .describe('A list of potential scenes that might occur during the session and any other user-provided context.'),
  characterMotivations: z
    .string()
    .describe(
      'The motivations of the player characters in the campaign, which can be used to tailor the secrets and clues.'
    ),
  numSecrets: z
    .number()
    .min(3)
    .max(10)
    .default(5)
    .describe('The number of secrets and clues to generate.'),
});
export type GenerateSecretsAndCluesInput = z.infer<
  typeof GenerateSecretsAndCluesInputSchema
>;

const GenerateSecretsAndCluesOutputSchema = z.object({
  secrets: z
    .array(z.string())
    .describe('An array of secrets and clues related to the campaign and scenes.'),
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

  Generate a list of secrets and clues that the players might uncover during the session. These secrets and clues should be related to the overall campaign setting, the potential scenes that might occur, and the motivations of the player characters. Focus on generating interesting and diverse secrets that can drive the plot forward. Do not number the secrets and clues. Return them as a simple list. 

  Campaign Setting: {{{campaignSetting}}}
  Potential Scenes & Context: {{{potentialScenes}}}
  Character Motivations: {{{characterMotivations}}}

  Number of Secrets to generate: {{{numSecrets}}}

  Secrets and Clues:
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

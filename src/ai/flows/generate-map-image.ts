// src/ai/flows/generate-map-image.ts
'use server';

/**
 * @fileOverview AI-powered generator for fantasy map images.
 *
 * - generateMapImage - A function that generates a map image.
 * - GenerateMapImageInput - The input type for the generateMapImage function.
 * - GenerateMapImageOutput - The return type for the generateMapImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const GenerateMapImageInputSchema = z.object({
  mapType: z.enum(['World', 'City', 'Treasure', 'Battle']).describe('The type of map to generate.'),
  prompt: z.string().describe('A description of the map to generate.'),
});
export type GenerateMapImageInput = z.infer<typeof GenerateMapImageInputSchema>;

const GenerateMapImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated map image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateMapImageOutput = z.infer<typeof GenerateMapImageOutputSchema>;

const stylePrompts = {
    World: 'ancient, fantasy, cartography, detailed, epic, continents, oceans, mountains, forests',
    City: 'fantasy city map, bird\'s eye view, intricate details, medieval or fantasy architecture, streets, buildings, walls',
    Treasure: 'old parchment, hand-drawn, pirate map, dotted lines, compass rose, landmarks, X marks the spot',
    Battle: 'top-down, grid (optional), tactical, dungeon, forest clearing, battlefield, key terrain features',
};


export async function generateMapImage(input: GenerateMapImageInput): Promise<GenerateMapImageOutput> {
  return generateMapImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMapImagePrompt',
  input: {schema: GenerateMapImageInputSchema},
  prompt: `Generate an image of a fantasy {{mapType}} map.

  The user's description is: "{{prompt}}".

  Incorporate the following stylistic elements: {{style}}`,
});

const generateMapImageFlow = ai.defineFlow(
  {
    name: 'generateMapImageFlow',
    inputSchema: GenerateMapImageInputSchema,
    outputSchema: GenerateMapImageOutputSchema,
  },
  async ({mapType, prompt: userPrompt}) => {
    const fullPrompt = await prompt({ mapType, prompt: userPrompt, style: stylePrompts[mapType] });
    
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
      prompt: fullPrompt.text,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Image generation failed to produce an image.');
    }

    return { imageDataUri: media.url };
  }
);


// src/ai/flows/generate-bookshelf-contents.ts
'use server';

/**
 * @fileOverview AI-powered generator for the contents of a bookshelf and passages from books.
 *
 * - generateBookshelfContents - Generates a list of books with titles and descriptions.
 * - generateBookPassage - Generates a passage from a specific book.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Bookshelf Contents Flow
const GenerateBookshelfContentsInputSchema = z.object({
  campaignSetting: z.string().describe('The general setting of the campaign and any context about the bookshelf\'s location or owner.').optional(),
});
export type GenerateBookshelfContentsInput = z.infer<typeof GenerateBookshelfContentsInputSchema>;

const BookSchema = z.object({
    title: z.string().describe('The title of the book. Should be intriguing and unique.'),
    description: z.string().describe('A short, one-sentence description of the book\'s physical appearance and general subject matter.')
});

const GenerateBookshelfContentsOutputSchema = z.object({
  books: z.array(BookSchema).min(4).max(8).describe('An array of 4 to 8 books found on the shelf.'),
});
export type GenerateBookshelfContentsOutput = z.infer<typeof GenerateBookshelfContentsOutputSchema>;

export async function generateBookshelfContents(input: GenerateBookshelfContentsInput): Promise<GenerateBookshelfContentsOutput> {
  return generateBookshelfContentsFlow(input);
}

const bookshelfPrompt = ai.definePrompt({
  name: 'generateBookshelfContentsPrompt',
  input: {schema: GenerateBookshelfContentsInputSchema},
  output: {schema: GenerateBookshelfContentsOutputSchema},
  prompt: `You are a creative librarian for a fantasy world. A player is examining a bookshelf.
  
  {{#if campaignSetting}}Context: {{{campaignSetting}}}{{/if}}
  
  Generate a list of 4 to 8 interesting book titles and short descriptions. The books should be a mix of mundane and mysterious, fitting the context if provided.
  `,
});

const generateBookshelfContentsFlow = ai.defineFlow(
  {
    name: 'generateBookshelfContentsFlow',
    inputSchema: GenerateBookshelfContentsInputSchema,
    outputSchema: GenerateBookshelfContentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(bookshelfPrompt)(input);
    return output!;
  }
);


// Book Passage Flow
const GenerateBookPassageInputSchema = z.object({
    bookTitle: z.string().describe('The title of the book to generate a passage from.'),
});
export type GenerateBookPassageInput = z.infer<typeof GenerateBookPassageInputSchema>;

const GenerateBookPassageOutputSchema = z.object({
    passage: z.string().describe('A short, evocative passage (2-3 sentences) from the book. It should be written as prose, not a summary.')
});
export type GenerateBookPassageOutput = z.infer<typeof GenerateBookPassageOutputSchema>;

export async function generateBookPassage(input: GenerateBookPassageInput): Promise<GenerateBookPassageOutput> {
    return generateBookPassageFlow(input);
}

const passagePrompt = ai.definePrompt({
    name: 'generateBookPassagePrompt',
    input: {schema: GenerateBookPassageInputSchema},
    output: {schema: GenerateBookPassageOutputSchema},
    prompt: `You are an author. A reader has opened a book titled "{{bookTitle}}". Write a short, interesting prose passage (2-3 sentences) from somewhere inside this book. The passage should be intriguing and hint at the book's larger contents without summarizing it. Do not start with "This passage..." or similar, just write the passage itself.`
});

const generateBookPassageFlow = ai.defineFlow(
    {
        name: 'generateBookPassageFlow',
        inputSchema: GenerateBookPassageInputSchema,
        outputSchema: GenerateBookPassageOutputSchema
    },
    async input => {
        const {output} = await prompt(passagePrompt)(input);
        return output!;
    }
);

    
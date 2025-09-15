import { Book } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const bookshelfContentsBlock = {
  id: 'bookshelf-contents' as const,
  title: 'Bookshelf Contents',
  description: 'Populate a bookshelf with interesting books, then generate passages from within them.',
  icon: Book,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'bookshelfContents',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) => {
    const booksHtml = r.books.map((book: any) => `
      <div class="book-item mb-4 p-2 border-b">
        <strong class="book-title">${book.title}</strong>
        <p class="text-sm text-muted-foreground">${book.description}</p>
      </div>
    `).join('');
    return `<h2>On the Shelf</h2>${booksHtml}`;
  },
  options: undefined,
  hasInteractiveChildren: true,
};
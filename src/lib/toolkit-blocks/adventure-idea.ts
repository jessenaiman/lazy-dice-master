import { BookMarked } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const adventureIdeaBlock = {
  id: 'adventure-idea' as const,
  title: 'Adventure Idea',
  description: 'Generate a complete adventure concept with a title, summary, conflict, and key locations.',
  icon: BookMarked,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'adventureIdea',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) =>
    `<h2>Adventure: ${r.title}</h2><p><strong>Summary:</strong> ${r.summary}</p><p><strong>Conflict:</strong> ${r.conflict}</p><h3>Potential Locations:</h3><ul><li>${r.locations.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
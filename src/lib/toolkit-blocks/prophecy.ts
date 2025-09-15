import { ScrollText } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const prophecyBlock = {
  id: 'prophecy' as const,
  title: 'Prophecy',
  description: 'Craft a cryptic prophecy and come up with multiple possible interpretations.',
  icon: ScrollText,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'prophecy',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) =>
    `<h2>Prophecy</h2><p><em>${r.prophecy}</em></p><h3>Possible Meanings:</h3><ul><li>${r.meanings.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
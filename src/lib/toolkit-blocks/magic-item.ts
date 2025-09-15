import { Gem } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const magicItemBlock = {
  id: 'magic-item' as const,
  title: 'Magic Item',
  description: 'Invent a unique magic item with a name, description, and a list of its powers.',
  icon: Gem,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'magicItem',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) =>
    `<h2>Magic Item: ${r.name}</h2><p><em>${r.description}</em></p><h3>Powers:</h3><ul><li>${r.powers.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
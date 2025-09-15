import { Swords } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const strongStartBlock = {
  id: 'strong-start' as const,
  title: 'Strong Start',
  description: 'Create exciting opening scenes that immediately hook your players into the action.',
  icon: Swords,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    (
      await generateContent({
        type: 'strongStart',
        campaignSetting: useCampaignContext && options?.getCampaignContext
          ? `${options.getCampaignContext()}\n\n${userInput}`
          : userInput,
        playerCharacters: options?.activeCampaign?.characters?.map((c: any) => c.name).join(', ') || "",
      })
    ),
  format: (c: any) => `<h2>Strong Start</h2><ul><li>${c.strongStart.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
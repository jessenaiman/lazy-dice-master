import { Compass } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const plotHookBlock = {
  id: 'plot-hook' as const,
  title: 'Plot Hook',
  description: 'Design compelling plot hooks with related clues to draw players into your story.',
  icon: Compass,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'plotHook',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
      playerCharacters: options?.activeCampaign?.characters?.map((c: any) => c.name).join(', ') || "",
    }),
  format: (r: any) =>
    `<h2>Plot Hook</h2><h3>Hook</h3><p>${r.hook}</p><h3>Clues</h3><ul><li>${r.clues.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
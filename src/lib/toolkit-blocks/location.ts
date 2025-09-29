import { Map } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const locationBlock = {
  id: 'location' as const,
  title: 'Location',
  description: 'Generate a rich description of a new location, complete with discoverable secrets and clues.',
  icon: Map,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'location',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) =>
    `<h2>Location: ${r.name}</h2><p>${r.description}</p><h3>Secrets & Clues:</h3><ul><li>${r.clues.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
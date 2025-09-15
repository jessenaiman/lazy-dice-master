import { User } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const npcBlock = {
  id: 'npc' as const,
  title: 'NPC',
  description: 'Create a unique Non-Player Character with a name, description, and distinct mannerisms.',
  icon: User,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'npc',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) =>
    `<h2>NPC: ${r.name}</h2><p><em>${r.description}</em></p><h3>Mannerisms:</h3><ul><li>${r.mannerisms.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
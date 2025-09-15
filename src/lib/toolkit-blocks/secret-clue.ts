import { KeyRound } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const secretClueBlock = {
  id: 'secret-clue' as const,
  title: 'Secrets & Clues',
  description: 'Generate a list of secrets and clues for your players to uncover during a session.',
  icon: KeyRound,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'secretsAndClues',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
      numSecrets: 5,
    }),
  format: (r: any) => `<h2>Secrets & Clues</h2><ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
  options: undefined,
  hasInteractiveChildren: false,
};
import { Puzzle } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const puzzleBlock = {
  id: 'puzzle' as const,
  title: 'Puzzle',
  description: 'Design a fantasy puzzle with a title, description, solution, and helpful clues.',
  icon: Puzzle,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'puzzle',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
      complexity: options.complexity,
    }),
  format: (r: any) =>
    `<h2>Puzzle: ${r.title}</h2><p>${r.description}</p><h3>Solution:</h3><p>${r.solution}</p><h3>Clues:</h3><ul><li>${r.clues.join('</li><li>')}</li></ul>`,
  options: [
    { id: 'complexity', label: 'Complexity', type: 'select', values: ['Simple', 'Common', 'Challenging'], defaultValue: 'Common' }
  ],
  hasInteractiveChildren: false,
};
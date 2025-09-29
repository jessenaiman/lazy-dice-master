import { BrainCircuit } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const riddleBlock = {
  id: 'riddle' as const,
  title: 'Riddle',
  description: 'Create a clever riddle with a solution and clues, scaled to your desired complexity.',
  icon: BrainCircuit,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'riddle',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
      complexity: options.complexity,
    }),
  format: (r: any) =>
    `<h2>Riddle</h2><p><em>${r.riddle}</em></p><h3>Solution:</h3><p>${r.solution}</p><h3>Clues:</h3><ul><li>${r.clues.join('</li><li>')}</li></ul>`,
  options: [
    { id: 'complexity', label: 'Complexity', type: 'select', values: ['Simple', 'Common', 'Challenging'], defaultValue: 'Simple' }
  ],
  hasInteractiveChildren: false,
};
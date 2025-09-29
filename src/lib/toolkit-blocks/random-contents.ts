import { Box } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const randomContentsBlock = {
  id: 'random-contents' as const,
  title: 'Random Contents',
  description: 'Generate a list of random items found in a container like a pocket, chest, or backpack.',
  icon: Box,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'randomContents',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? options.getCampaignContext()
        : "",
      container: options.container,
      context: userInput
    }),
  format: (r: any) => `<h2>Contents of ${r.container}</h2><ul><li>${r.contents.join('</li><li>')}</li></ul>`,
  options: [
    { id: 'container', label: 'Container', type: 'select' as const, values: ['Pocket', 'Backpack', 'Chest', 'Drawer', 'Sack', 'Crate'], defaultValue: 'Chest', allowCustom: true }
  ],
  hasInteractiveChildren: false,
};
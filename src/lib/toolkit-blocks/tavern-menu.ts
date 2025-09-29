import { Utensils } from 'lucide-react';
import { generateContent } from '../ai-generator';

export const tavernMenuBlock = {
  id: 'tavern-menu' as const,
  title: "Tavern Menu",
  description: 'Quickly create a menu for a tavern or eatery, complete with food, drinks, and prices.',
  icon: Utensils,
  generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
    await generateContent({
      type: 'tavernMenu',
      campaignSetting: useCampaignContext && options?.getCampaignContext
        ? `${options.getCampaignContext()}\n\n${userInput}`
        : userInput,
    }),
  format: (r: any) => {
    const foodHtml = r.food.map((item: any) => `<li><strong>${item.name}</strong> (${item.price}): ${item.description}</li>`).join('');
    const drinksHtml = r.drinks.map((item: any) => `<li><strong>${item.name}</strong> (${item.price}): ${item.description}</li>`).join('');
    return `<h2>Menu: ${r.name}</h2><p><em>${r.description}</em></p><h3>Food</h3><ul>${foodHtml}</ul><h3>Drinks</h3><ul>${drinksHtml}</ul>`;
  },
  options: undefined,
  hasInteractiveChildren: false,
};

// src/app/page.tsx
'use client';

import {useState, useRef, useEffect, ChangeEvent} from 'react';
import {Header} from '@/components/header';
import {generateCampaignContext} from '@/ai/flows/generate-campaign-context';
import {generateStrongStart} from '@/ai/flows/generate-strong-start';
import {generateSecretsAndClues} from '@/ai/flows/generate-secrets-and-clues';
import {generatePlotHook} from '@/ai/flows/generate-plot-hook';
import {generateNpc} from '@/ai/flows/generate-npc';
import {generateLocation} from '@/ai/flows/generate-location';
import {generatePuzzle} from '@/ai/flows/generate-puzzle';
import {generateMagicItem} from '@/ai/flows/generate-magic-item';
import {generateProphecy} from '@/ai/flows/generate-prophecy';
import {generateRiddle} from '@/ai/flows/generate-riddle';
import {generateRandomContents} from '@/ai/flows/generate-random-contents';
import { generateAdventureIdea } from '@/ai/flows/generate-adventure-idea';
import { generateBookshelfContents, generateBookPassage } from '@/ai/flows/generate-bookshelf-contents';
import { generateTavernMenu } from '@/ai/flows/generate-tavern-menu';

import {GenerativeBlock} from '@/components/generative-block';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import {
  KeyRound,
  Map,
  Puzzle,
  Swords,
  User,
  Compass,
  ScrollText,
  Gem,
  Eye,
  BookOpen,
  Printer,
  Save,
  ChevronDown,
  BrainCircuit,
  Box,
  PlusCircle,
  Loader2,
  Upload,
  Book,
  Utensils,
  BookMarked,
  Shield,
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {TiptapEditor} from '@/components/tiptap-editor';
import TurndownService from 'turndown';
import type { Campaign, GeneratedItem } from '@/lib/types';
import { addCampaign, getCampaigns, updateCampaign, uploadFile, addGeneratedItem } from '@/lib/firebase-service';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Footer } from '@/components/footer';


export default function CockpitPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();


  // Load campaigns from firebase on initial render
  useEffect(() => {
    const fetchCampaigns = async () => {
      const fetchedCampaigns = await getCampaigns();
      setCampaigns(fetchedCampaigns);

      const activeId = localStorage.getItem('lazy-gm-active-campaign-id');
      if (activeId) {
        const foundCampaign = fetchedCampaigns.find(c => c.id === activeId);
        setActiveCampaign(foundCampaign || null);
      }
    };
    fetchCampaigns();
  }, []);

  const handleSetActiveCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setActiveCampaign(campaign);
      localStorage.setItem('lazy-gm-active-campaign-id', campaignId);
      toast({title: `Campaign set to: ${campaign.name}`});
    }
  };
  
  const getCampaignContext = () => {
    if (!activeCampaign) return "No campaign loaded.";
    const characterInfo = activeCampaign.characters.map(c => `- ${c.name}: ${c.motivation}`).join('\n');
    return `Campaign Name: ${activeCampaign.name}\n\n${activeCampaign.description}\n\n**Characters**:\n${characterInfo}`;
  };
  
  const handleContentGenerated = async (
    type: GeneratedItem['type'],
    title: string,
    htmlContent: string,
    rawContent: any,
  ) => {
    try {
      const campaignId = activeCampaign ? activeCampaign.id : null;
      await addGeneratedItem(campaignId, type, rawContent);
       toast({
        title: 'Content Saved',
        description: `New ${title} has been saved to the Lore Library.`,
      });
    } catch (error) {
        console.error("Failed to save generated item:", error);
        toast({
            variant: "destructive",
            title: 'Failed to Save Content',
            description: `The content could not be saved to the database.`,
        });
    }
  };

  const handleSaveActiveCampaign = async () => {
    if (!activeCampaign) return;
    try {
      await updateCampaign(activeCampaign.id, activeCampaign);
      toast({ title: "Campaign Saved!", description: `${activeCampaign.name} has been updated.`});
    } catch (error) {
      console.error("Failed to save campaign:", error);
      toast({ variant: "destructive", title: "Error Saving Campaign" });
    }
  };


  const toolkitBlocks = [
     {
      id: 'adventure-idea' as const,
      title: 'Adventure Idea',
      description: 'Generate a complete adventure concept with a title, summary, conflict, and key locations.',
      icon: BookMarked,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateAdventureIdea({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) =>
        `<h2>Adventure: ${r.title}</h2><p><strong>Summary:</strong> ${r.summary}</p><p><strong>Conflict:</strong> ${r.conflict}</p><h3>Potential Locations:</h3><ul><li>${r.locations.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'strong-start' as const,
      title: 'Strong Start',
      description: 'Create exciting opening scenes that immediately hook your players into the action.',
      icon: Swords,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        (
          await generateStrongStart({
            campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
            playerCharacters: activeCampaign?.characters.map(c => c.name).join(', ') || "",
          })
        ),
      format: (c: any) => `<h2>Strong Start</h2><ul><li>${c.strongStart.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'plot-hook' as const,
      title: 'Plot Hook',
      description: 'Design compelling plot hooks with related clues to draw players into your story.',
      icon: Compass,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generatePlotHook({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
          playerCharacters: activeCampaign?.characters.map(c => c.name).join(', ') || "",
        }),
      format: (r: any) =>
        `<h2>Plot Hook</h2><h3>Hook</h3><p>${r.hook}</p><h3>Clues</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'secret-clue' as const,
      title: 'Secrets & Clues',
      description: 'Generate a list of secrets and clues for your players to uncover during a session.',
      icon: KeyRound,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateSecretsAndClues({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) => `<h2>Secrets & Clues</h2><ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'npc' as const,
      title: 'NPC',
      description: 'Create a unique Non-Player Character with a name, description, and distinct mannerisms.',
      icon: User,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateNpc({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) =>
        `<h2>NPC: ${r.name}</h2><p><em>${r.description}</em></p><h3>Mannerisms:</h3><ul><li>${r.mannerisms.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'location' as const,
      title: 'Location',
      description: 'Generate a rich description of a new location, complete with discoverable secrets and clues.',
      icon: Map,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateLocation({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) =>
        `<h2>Location: ${r.name}</h2><p>${r.description}</p><h3>Secrets & Clues:</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'puzzle' as const,
      title: 'Puzzle',
      description: 'Design a fantasy puzzle with a title, description, solution, and helpful clues.',
      icon: Puzzle,
      generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
        await generatePuzzle({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
          complexity: options.complexity,
        }),
      format: (r: any) =>
        `<h2>Puzzle: ${r.title}</h2><p>${r.description}</p><h3>Solution:</h3><p>${r.solution}</p><h3>Clues:</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
      options: [
        { id: 'complexity', label: 'Complexity', type: 'select', values: ['Simple', 'Common', 'Challenging'], defaultValue: 'Common' }
      ]
    },
    {
      id: 'riddle' as const,
      title: 'Riddle',
      description: 'Create a clever riddle with a solution and clues, scaled to your desired complexity.',
      icon: BrainCircuit,
      generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
        await generateRiddle({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
          complexity: options.complexity,
        }),
      format: (r: any) =>
        `<h2>Riddle</h2><p><em>${r.riddle}</em></p><h3>Solution:</h3><p>${r.solution}</p><h3>Clues:</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
       options: [
        { id: 'complexity', label: 'Complexity', type: 'select', values: ['Simple', 'Common', 'Challenging'], defaultValue: 'Simple' }
      ]
    },
     {
      id: 'bookshelf-contents' as const,
      title: 'Bookshelf Contents',
      description: 'Populate a bookshelf with interesting books, then generate passages from within them.',
      icon: Book,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateBookshelfContents({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) => {
        const booksHtml = r.books.map((book: any) => `
          <div class="book-item mb-4 p-2 border-b">
            <strong class="book-title">${book.title}</strong>
            <p class="text-sm text-muted-foreground">${book.description}</p>
          </div>
        `).join('');
        return `<h2>On the Shelf</h2>${booksHtml}`;
      },
      hasInteractiveChildren: true,
    },
    {
      id: 'tavern-menu' as const,
      title: "Tavern Menu",
      description: 'Quickly create a menu for a tavern or eatery, complete with food, drinks, and prices.',
      icon: Utensils,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateTavernMenu({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) => {
        const foodHtml = r.food.map((item: any) => `<li><strong>${item.name}</strong> (${item.price}): ${item.description}</li>`).join('');
        const drinksHtml = r.drinks.map((item: any) => `<li><strong>${item.name}</strong> (${item.price}): ${item.description}</li>`).join('');
        return `<h2>Menu: ${r.name}</h2><p><em>${r.description}</em></p><h3>Food</h3><ul>${foodHtml}</ul><h3>Drinks</h3><ul>${drinksHtml}</ul>`;
      }
    },
    {
      id: 'magic-item' as const,
      title: 'Magic Item',
      description: 'Invent a unique magic item with a name, description, and a list of its powers.',
      icon: Gem,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateMagicItem({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) =>
        `<h2>Magic Item: ${r.name}</h2><p><em>${r.description}</em></p><h3>Powers:</h3><ul><li>${r.powers.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'prophecy' as const,
      title: 'Prophecy',
      description: 'Craft a cryptic prophecy and come up with multiple possible interpretations.',
      icon: ScrollText,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateProphecy({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) =>
        `<h2>Prophecy</h2><p><em>${r.prophecy}</em></p><h3>Possible Meanings:</h3><ul><li>${r.meanings.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'random-contents' as const,
      title: 'Random Contents',
      description: 'Generate a list of random items found in a container like a pocket, chest, or backpack.',
      icon: Box,
      generate: async (userInput: string, useCampaignContext: boolean, options: any) =>
        await generateRandomContents({
            campaignSetting: useCampaignContext ? getCampaignContext() : "",
            container: options.container,
            context: userInput
        }),
      format: (r: any) => `<h2>Contents of ${r.container}</h2><ul><li>${r.contents.join('</li><li>')}</li></ul>`,
      options: [
          { id: 'container', label: 'Container', type: 'select', values: ['Pocket', 'Backpack', 'Chest', 'Drawer', 'Sack', 'Crate'], defaultValue: 'Chest', allowCustom: true }
      ]
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-body transition-colors duration-300">
      <Header />
      <main className="flex-1 p-4 md:p-8">
         <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight">GM's Toolkit</h1>
           <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-48 justify-between">
                      <span>{activeCampaign ? activeCampaign.name : "No Campaign"}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                      {campaigns.map(c => (
                          <DropdownMenuItem key={c.id} onClick={() => handleSetActiveCampaign(c.id)}>
                              {c.name}
                          </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider>
                  <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={() => router.push('/campaigns')}>
                          <Shield />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Manage Campaigns</p>
                      </TooltipContent>
                  </Tooltip>
                   <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="ghost" onClick={handleSaveActiveCampaign} disabled={!activeCampaign}>
                          <Save />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save Campaign Changes</p>
                      </TooltipContent>
                  </Tooltip>
              </TooltipProvider>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toolkitBlocks.map(block => (
            <GenerativeBlock
              key={block.id}
              id={block.id}
              title={block.title}
              description={block.description}
              icon={block.icon}
              generate={block.generate}
              format={block.format}
              onGenerated={handleContentGenerated}
              options={block.options}
              isActionable={true}
              useCampaignContext={!!activeCampaign}
              hasInteractiveChildren={block.hasInteractiveChildren}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

    

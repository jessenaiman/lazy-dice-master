
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
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
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
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {TiptapEditor} from '@/components/tiptap-editor';
import TurndownService from 'turndown';
import type { Campaign, GeneratedItem } from '@/lib/types';
import { addCampaign, getCampaigns, updateCampaign, uploadFile, addGeneratedItem } from '@/lib/firebase-service';
import { useRouter } from 'next/navigation';


export default function CockpitPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      } else if (fetchedCampaigns.length > 0) {
        // Don't auto-select a campaign, let the user choose.
        // setActiveCampaign(fetchedCampaigns[0]);
        // if (fetchedCampaigns[0]?.id) {
        //   localStorage.setItem('lazy-gm-active-campaign-id', fetchedCampaigns[0].id);
        // }
      }
    };
    fetchCampaigns();
  }, []);

  const handleSetActiveCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setActiveCampaign(campaign);
      localStorage.setItem('lazy-gm-active-campaign-id', campaignId);
      // Reset session notes when switching campaigns
      setSessionNotes("");
      toast({title: `Campaign set to: ${campaign.name}`});
    }
  };
  
  const handleNewCampaign = async () => {
    setIsGeneratingCampaign(true);
    try {
        const context = await generateCampaignContext({ theme: 'fantasy', campaignName: newCampaignName.trim() || undefined });
        const finalName = newCampaignName.trim() || context.name;
        
        const newCampaign: Omit<Campaign, 'id'> = {
            name: finalName,
            description: context.description,
            characters: context.characters.map(c => ({...c, id: crypto.randomUUID()})),
            sessionPrepIds: [],
            fileUrls: [],
        };

        const newId = await addCampaign(newCampaign);
        const fullCampaign = { ...newCampaign, id: newId };

        const updatedCampaigns = [...campaigns, fullCampaign];
        setCampaigns(updatedCampaigns);
        setActiveCampaign(fullCampaign);
        localStorage.setItem('lazy-gm-active-campaign-id', newId);
        setNewCampaignName("");
        toast({ title: "Campaign Created!", description: `${fullCampaign.name} is ready.` });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Failed to generate campaign context." });
    } finally {
        setIsGeneratingCampaign(false);
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

  const handleCampaignDescriptionChange = (newDescription: string) => {
    if (activeCampaign) {
      setActiveCampaign({...activeCampaign, description: newDescription});
    }
  }
  
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
    // Session notes are now handled on the prep page.
    // setSessionNotes(prev => `${prev}${htmlContent}`);
    
    try {
      // Allow saving content without an active campaign
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


  const saveMarkdown = (content: string, filename: string) => {
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    const markdown = turndownService.turndown(content);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveFiles = () => {
    if (activeCampaign) {
       saveMarkdown(activeCampaign.description, `campaign-${activeCampaign.name.replace(/\s/g, '_')}.md`);
       toast({
         title: 'Campaign Saved',
         description: 'Your campaign context has been downloaded as a markdown file.',
       });
    } else {
        toast({
            variant: "destructive",
            title: 'No Active Campaign',
            description: `Please load a campaign to save its context.`,
        });
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeCampaign) return;

    if (!['text/plain', 'text/markdown'].includes(file.type)) {
       toast({variant: 'destructive', title: "Unsupported File Type", description: "Please upload a .txt or .md file."})
       return;
    }

    try {
        const { url, path } = await uploadFile(file, `campaigns/${activeCampaign.id}/${file.name}`);
        const newFile = { name: file.name, url, path };
        const updatedCampaign = {
            ...activeCampaign,
            fileUrls: [...(activeCampaign.fileUrls || []), newFile]
        };

        await updateCampaign(activeCampaign.id, updatedCampaign);
        setActiveCampaign(updatedCampaign);

        toast({title: "File Uploaded", description: `${file.name} has been added to the campaign.`});
    } catch (error) {
        console.error("File upload failed:", error);
        toast({variant: 'destructive', title: "Upload Failed", description: "Could not upload the file."});
    }
  };
  
  const toolkitBlocks = [
     {
      id: 'adventure-idea' as const,
      title: 'Adventure Idea',
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
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {/* Left Column: Toolkit */}
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4">
          <h2 className="font-headline text-2xl">GM's Toolkit</h2>
           <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                    <CardTitle className="text-base font-headline flex items-center gap-2">
                      <Swords className="h-5 w-5 text-accent"/>
                      <span>Campaign</span>
                    </CardTitle>
                     <div className="flex items-center gap-2">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline" disabled={campaigns.length === 0}>
                                    {activeCampaign ? activeCampaign.name.substring(0,15) + (activeCampaign.name.length > 15 ? '...' : '') : "Load..."}
                                    <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {campaigns.map(c => (
                                    <DropdownMenuItem key={c.id} onClick={() => handleSetActiveCampaign(c.id)}>
                                        {c.name}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/campaigns')}>
                                    Manage Campaigns
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                         <Button size="sm" onClick={() => router.push('/campaigns')}>
                           <PlusCircle className="h-4 w-4" />
                         </Button>
                     </div>
                </CardHeader>
            </Card>

          <ScrollArea className="flex-grow">
            <div className="grid grid-cols-1 gap-4 pr-4">
              {toolkitBlocks.map(block => (
                <GenerativeBlock
                  key={block.id}
                  id={block.id}
                  title={block.title}
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
          </ScrollArea>
        </div>

        {/* Right Column: Is now just a placeholder or could be used for scratchpad */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
           <Card className="flex-grow">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <BookOpen />
                        Welcome to the Cockpit
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <p>Select a tool from the GM's Toolkit on the left to start generating content for your game.</p>
                    <p className="mt-4">Load a campaign to provide the AI with specific context, or generate content freely without one.</p>
                    <p className="mt-4">All generated content is automatically saved to your <a href="/library" className="underline hover:text-primary">Lore Library</a>.</p>
                    <p className="mt-4">Use the <a href="/campaigns" className="underline hover:text-primary">Campaigns</a> page to manage your campaigns and their session notes.</p>
                </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}

    
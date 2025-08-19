// src/app/page.tsx
'use client';

import {useState, useRef, useEffect, ChangeEvent} from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {TiptapEditor} from '@/components/tiptap-editor';
import TurndownService from 'turndown';
import type { Campaign, SessionPrep } from '@/lib/types';

const CAMPAIGNS_STORAGE_KEY = 'lazy-gm-campaigns';
const ACTIVE_CAMPAIGN_ID_KEY = 'lazy-gm-active-campaign-id';


export default function CockpitPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  // Load campaigns from local storage on initial render
  useEffect(() => {
    const savedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    const allCampaigns: Campaign[] = savedCampaigns ? JSON.parse(savedCampaigns) : [];
    setCampaigns(allCampaigns);
    
    const activeId = localStorage.getItem(ACTIVE_CAMPAIGN_ID_KEY);
    if (activeId) {
      const foundCampaign = allCampaigns.find(c => c.id === activeId);
      setActiveCampaign(foundCampaign || null);
    } else if (allCampaigns.length > 0) {
      setActiveCampaign(allCampaigns[0]);
      localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, allCampaigns[0].id);
    }
  }, []);

  const saveCampaignsToStorage = (updatedCampaigns: Campaign[]) => {
    setCampaigns(updatedCampaigns);
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updatedCampaigns));
  }

  const handleSetActiveCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
      setActiveCampaign(campaign);
      localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, campaignId);
      // Reset session notes when switching campaigns
      setSessionNotes("");
    }
  };
  
  const handleNewCampaign = async () => {
    setIsGeneratingCampaign(true);
    try {
        const context = await generateCampaignContext({ theme: 'fantasy' });
        const finalName = newCampaignName.trim() || context.name;
        
        const newCampaign: Campaign = {
            id: crypto.randomUUID(),
            name: finalName,
            description: context.description,
            characters: context.characters.map(c => ({...c, id: crypto.randomUUID()})),
            sessionPreps: [],
        };
        const updatedCampaigns = [...campaigns, newCampaign];
        saveCampaignsToStorage(updatedCampaigns);
        setActiveCampaign(newCampaign);
        localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, newCampaign.id);
        setNewCampaignName("");
        toast({ title: "Campaign Created!", description: `${newCampaign.name} is ready.` });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Failed to generate campaign context." });
    } finally {
        setIsGeneratingCampaign(false);
    }
  };

  const handleSaveActiveCampaign = () => {
    if (!activeCampaign) return;
    const updatedCampaigns = campaigns.map(c => c.id === activeCampaign.id ? activeCampaign : c);
    saveCampaignsToStorage(updatedCampaigns);
    toast({ title: "Campaign Saved!", description: `${activeCampaign.name} has been updated.`});
  };

  const handleCampaignDescriptionChange = (newDescription: string) => {
    if (activeCampaign) {
      setActiveCampaign({...activeCampaign, description: newDescription});
    }
  }
  
  const getCampaignContext = () => {
    if (!activeCampaign) return "No campaign loaded.";
    const characterInfo = activeCampaign.characters.map(c => `- ${c.name}: ${c.motivation}`).join('\n');
    return `${activeCampaign.description}\n\n**Characters**:\n${characterInfo}`;
  };
  
  const handleContentGenerated = (
    _id: string,
    _title: string,
    content: string
  ) => {
    setSessionNotes(prev => `${prev}${content}`);
    toast({
      title: 'Content Added',
      description: `The new content has been added to your session notes.`,
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Session Notes</title>');
      const styles = Array.from(document.styleSheets)
        .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : '')
        .join('\n');
      printWindow.document.write(styles);
      printWindow.document.write(`<style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Open+Sans:wght@400;600&display=swap');
        body { 
            font-family: 'Open Sans', sans-serif;
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
        }
        .prose h1, .prose h2, .prose h3 { font-family: 'Cinzel', serif; }
        .prose ul { list-style: none; padding-left: 0; }
        .prose ul > li::before { 
          content: '⚔️'; 
          margin-right: 0.75em; 
          color: hsl(var(--accent));
        }
         .prose ul > li {
          padding-left: 1.5em; 
          text-indent: -1.5em; 
        }
      </style>`);
      printWindow.document.write('</head><body class="bg-background text-foreground">');
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = sessionNotes;
      contentDiv.className = 'prose dark:prose-invert max-w-none p-8';
      printWindow.document.body.appendChild(contentDiv);
      setTimeout(() => {
          printWindow.print();
          printWindow.close();
      }, 500);
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
    }
    saveMarkdown(sessionNotes, `session-notes-${new Date().toISOString().split('T')[0]}.md`);
    toast({
      title: 'Content Saved',
      description: 'Your campaign and session notes have been downloaded as markdown files.',
    });
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeCampaign) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleCampaignDescriptionChange(activeCampaign.description + '\n\n' + text);
      toast({title: "File Content Added", description: `Content from ${file.name} has been added to the campaign context.`});
    };
    
    if (file.type === 'text/plain' || file.type === 'text/markdown') {
        reader.readAsText(file);
    } else {
        toast({variant: 'destructive', title: "Unsupported File Type", description: "Please upload a .txt or .md file."})
    }
  };
  
  const toolkitBlocks = [
    {
      id: 'strong-start',
      title: 'Strong Start',
      icon: Swords,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        (
          await generateStrongStart({
            campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
            playerCharacters: activeCampaign?.characters.map(c => c.name).join(', ') || "",
          })
        ).strongStart,
      format: (c: any) => `<h2>Strong Start</h2><ul><li>${c.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'plot-hook',
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
      id: 'secrets',
      title: 'Secrets',
      icon: KeyRound,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateSecretsAndClues({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) => `<h2>Secrets</h2><ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'clues',
      title: 'Clues',
      icon: Eye,
      generate: async (userInput: string, useCampaignContext: boolean) =>
        await generateSecretsAndClues({
          campaignSetting: useCampaignContext ? `${getCampaignContext()}\n\n${userInput}` : userInput,
        }),
      format: (r: any) => `<h2>Clues</h2><ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'npc',
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
      id: 'location',
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
      id: 'puzzle',
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
      id: 'riddle',
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
      id: 'magic-item',
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
      id: 'prophecy',
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
      id: 'random-contents',
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
                  isActionable={!!activeCampaign}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Session Notes & Context */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                      <span>Campaign: {activeCampaign?.name || "No Active Campaign"}</span>
                    </CardTitle>
                     <div className="flex items-center gap-2">
                          <Input
                            placeholder="New campaign name..."
                            value={newCampaignName}
                            onChange={(e) => setNewCampaignName(e.target.value)}
                            className="w-48 h-9"
                            disabled={isGeneratingCampaign}
                          />
                         <Button size="sm" onClick={handleNewCampaign} disabled={isGeneratingCampaign}>
                           {isGeneratingCampaign ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                         </Button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline" disabled={campaigns.length === 0}>
                                    Load <ChevronDown className="ml-2 h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {campaigns.map(c => (
                                    <DropdownMenuItem key={c.id} onClick={() => handleSetActiveCampaign(c.id)}>
                                        {c.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                         </DropdownMenu>
                         <Button size="sm" variant="outline" onClick={handleSaveActiveCampaign} disabled={!activeCampaign}>
                            <Save />
                         </Button>
                         <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md" className="hidden" />
                         <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={!activeCampaign}>
                            <Upload />
                         </Button>
                     </div>
                </CardHeader>
                <CardContent>
                  <TiptapEditor
                    content={activeCampaign?.description || ""}
                    onChange={handleCampaignDescriptionChange}
                    placeholder="Create or load a campaign to begin..."
                    editable={!!activeCampaign}
                  />
                </CardContent>
            </Card>

          <div className="bg-card border rounded-lg shadow-sm h-full flex flex-col flex-grow">
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="font-headline text-2xl flex items-center gap-3">
                <BookOpen /> Session Notes
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSaveFiles} disabled={!activeCampaign}>
                  <Save className="mr-2 h-4 w-4" /> Save Files
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} disabled={!activeCampaign || !sessionNotes}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </div>
            </div>
            <div className="flex-grow p-1">
              <TiptapEditor
                content={sessionNotes}
                onChange={setSessionNotes}
                placeholder="Your generated content will appear here. Use the GM's Toolkit on the left to get started."
                editable={!!activeCampaign}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

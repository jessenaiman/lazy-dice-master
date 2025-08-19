// src/app/page.tsx
'use client';

import {useState, useRef, useEffect} from 'react';
import Link from 'next/link';
import {Header} from '@/components/header';
import {generateStrongStart} from '@/ai/flows/generate-strong-start';
import {generateSecretsAndClues} from '@/ai/flows/generate-secrets-and-clues';
import {generatePlotHook} from '@/ai/flows/generate-plot-hook';
import {generateNpc} from '@/ai/flows/generate-npc';
import {generateLocation} from '@/ai/flows/generate-location';
import {generatePuzzle} from '@/ai/flows/generate-puzzle';
import {generateMagicItem} from '@/ai/flows/generate-magic-item';
import {generateProphecy} from '@/ai/flows/generate-prophecy';
import {GenerativeBlock} from '@/components/generative-block';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  ChevronUp,
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {TiptapEditor} from '@/components/tiptap-editor';
import TurndownService from 'turndown';
import type { Campaign, SessionPrep } from '@/lib/types';

const CAMPAIGNS_STORAGE_KEY = 'lazy-gm-campaigns';
const ACTIVE_CAMPAIGN_ID_KEY = 'lazy-gm-active-campaign-id';

export default function CockpitPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const activeId = localStorage.getItem(ACTIVE_CAMPAIGN_ID_KEY);
    const allCampaignsJSON = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);

    if (allCampaignsJSON) {
      const allCampaigns: Campaign[] = JSON.parse(allCampaignsJSON);
      if (activeId) {
        const activeCampaign = allCampaigns.find(c => c.id === activeId);
        setCampaign(activeCampaign || allCampaigns[0] || null);
      } else if (allCampaigns.length > 0) {
        setCampaign(allCampaigns[0]);
        localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, allCampaigns[0].id);
      }
    }
  }, []);

  const getCampaignContext = () => {
    if (!campaign) return "No campaign loaded.";
    const characterInfo = campaign.characters.map(c => `- ${c.name}: ${c.motivation}`).join('\n');
    return `${campaign.description}\n\n**Characters**:\n${characterInfo}`;
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
      // A basic stylesheet for printing
      printWindow.document.write(`
        <style>
          body { font-family: sans-serif; }
          .prose { max-width: 100%; }
          h1, h2, h3 { font-family: serif; }
          ul { list-style: none; padding-left: 0; }
          li { display: flex; align-items: start; margin-bottom: 0.5em; }
          li::before { content: '⚔️'; margin-right: 0.75em; }
        </style>
      `);
      printWindow.document.write('</head><body>');
      const turndownService = new TurndownService();
      const sessionMarkdown = turndownService.turndown(sessionNotes);
      printWindow.document.write(`<div class="prose">${sessionMarkdown.replace(/\n/g, '<br>')}</div>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSave = () => {
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    
    if (campaign) {
      const campaignMarkdown = turndownService.turndown(getCampaignContext());
      saveMarkdown(campaignMarkdown, `campaign-${campaign.name.replace(/\s/g, '_')}.md`);
    }

    const sessionMarkdown = turndownService.turndown(sessionNotes);
    saveMarkdown(sessionMarkdown, `session-notes-${new Date().toISOString()}.md`);
    
    toast({
      title: 'Content Saved',
      description: 'Your campaign context and session notes have been downloaded as markdown files.',
    });
  };

  const saveMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toolkitBlocks = [
    {
      id: 'strong-start',
      title: 'Strong Start',
      icon: Swords,
      generate: async (userInput: string) =>
        (
          await generateStrongStart({
            campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
            playerCharacters: campaign?.characters.map(c => c.name).join(', ') || "",
          })
        ).strongStart,
      format: (c: string) => `<h2>Strong Start</h2><p>${c}</p>`,
    },
    {
      id: 'plot-hook',
      title: 'Plot Hook',
      icon: Compass,
      generate: async (userInput: string) =>
        await generatePlotHook({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
          playerCharacters: campaign?.characters.map(c => c.name).join(', ') || "",
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
      generate: async (userInput: string) =>
        await generateSecretsAndClues({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
          characterMotivations: 'Motivations from context',
          numSecrets: 5,
        }),
      format: (r: any) => `<h2>Secrets</h2><ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'clues',
      title: 'Clues',
      icon: Eye,
      generate: async (userInput: string) =>
        await generateSecretsAndClues({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
          characterMotivations: 'Motivations from context',
          numSecrets: 5,
        }),
      format: (r: any) => `<h2>Clues</h2><ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'npc',
      title: 'NPC',
      icon: User,
      generate: async (userInput: string) =>
        await generateNpc({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
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
      generate: async (userInput: string) =>
        await generateLocation({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
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
      generate: async (userInput: string) =>
        await generatePuzzle({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h2>Puzzle: ${r.title}</h2><p>${r.description}</p><h3>Solution:</h3><p>${r.solution}</p><h3>Clues:</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'magic-item',
      title: 'Magic Item',
      icon: Gem,
      generate: async (userInput: string) =>
        await generateMagicItem({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
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
      generate: async (userInput: string) =>
        await generateProphecy({
          campaignSetting: `${getCampaignContext()}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h2>Prophecy</h2><p><em>${r.prophecy}</em></p><h3>Possible Meanings:</h3><ul><li>${r.meanings.join(
          '</li><li>'
        )}</li></ul>`,
    },
  ];

  if (!campaign) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
          <Header />
          <main className="text-center">
            <h1 className="font-headline text-2xl mb-2">No Active Campaign</h1>
            <p className="text-muted-foreground mb-4">Please create or select an active campaign from the Campaigns page.</p>
            <Button asChild>
                <Link href="/campaigns">Go to Campaigns</Link>
            </Button>
          </main>
      </div>
    );
  }

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
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Session Notes & Context */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
          <Collapsible defaultOpen={true}>
            <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center justify-between">
                      <span>Campaign: {campaign.name}</span>
                       <Button variant="ghost" size="sm" className="data-[state=open]:rotate-180">
                         <ChevronUp className="h-4 w-4" />
                         <span className="sr-only">Toggle Context</span>
                       </Button>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <TiptapEditor
                    content={getCampaignContext()}
                    onChange={() => {}} // For now, this is read-only in the cockpit. Can be edited on campaign page.
                    placeholder="Campaign context appears here."
                    editable={false}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <div className="bg-card border rounded-lg shadow-sm h-full flex flex-col flex-grow">
            <div className="p-4 flex items-center justify-between border-b">
              <h2 className="font-headline text-2xl flex items-center gap-3">
                <BookOpen /> Session Notes
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </div>
            </div>
            <div className="flex-grow p-1">
              <TiptapEditor
                content={sessionNotes}
                onChange={setSessionNotes}
                placeholder="Your generated content will appear here. Use the GM's Toolkit on the left to get started."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

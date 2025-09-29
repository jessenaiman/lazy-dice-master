
// src/app/page.tsx
'use client';

import {useState, useRef, useEffect, ChangeEvent} from 'react';
import {Header} from '@/components/header';
import { generateContent, AIContentInput } from '@/lib/ai-generator';
// (If needed, import types for type safety)

import {GenerativeBlock} from '@/components/generative-block';
import { toolkitBlocks } from '@/lib/toolkit-blocks';
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
import { addCampaign, getCampaigns, updateCampaign, uploadFile, addGeneratedItem } from '@/lib/generated-content-service';
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


  // toolkitBlocks are now imported from '@/lib/toolkit-blocks'

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
              generate={(userInput, useCampaignContext, options) =>
                block.generate(userInput, useCampaignContext, {
                  ...options,
                  getCampaignContext,
                  activeCampaign,
                })
              }
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

    

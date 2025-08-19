// src/app/campaigns/page.tsx
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Swords, BookOpen, Shield, Trash2, Edit, Upload, Download, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Campaign } from "@/lib/types";
import { Header } from "@/components/header";
import Image from "next/image";
import { generateCampaignContext } from "@/ai/flows/generate-campaign-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const CAMPAIGNS_STORAGE_KEY = 'lazy-gm-campaigns';
const ACTIVE_CAMPAIGN_ID_KEY = 'lazy-gm-active-campaign-id';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    }
  }, []);

  const saveCampaigns = (updatedCampaigns: Campaign[]) => {
    setCampaigns(updatedCampaigns);
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(updatedCampaigns));
  };
  
  const setActiveCampaign = (campaignId: string) => {
    localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, campaignId);
    toast({ title: "Campaign Set as Active", description: "You can now manage it from the Cockpit." });
  }

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
        toast({ variant: "destructive", title: "Campaign name is required."});
        return;
    }
    setIsGenerating(true);
    try {
        const context = await generateCampaignContext({ theme: 'fantasy' });
        const newCampaign: Campaign = {
            id: crypto.randomUUID(),
            name: newCampaignName,
            description: context.description,
            characters: context.characters.map(c => ({...c, id: crypto.randomUUID()})),
            sessionPreps: [],
        };
        saveCampaigns([...campaigns, newCampaign]);
        setNewCampaignName("");
        setIsCreating(false);
        toast({ title: "Campaign Created!", description: `${newCampaign.name} is ready.` });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Failed to generate campaign context." });
    } finally {
        setIsGenerating(false);
    }
  };
  
  const deleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
    saveCampaigns(updatedCampaigns);
    toast({ title: "Campaign Deleted" });
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            My Campaigns
          </h1>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create a New Campaign</CardTitle>
              <CardDescription>Give your new adventure a name. The AI will generate a starting description and characters for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Campaign Name..."
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                disabled={isGenerating}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsCreating(false)} disabled={isGenerating}>Cancel</Button>
              <Button onClick={handleCreateCampaign} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Create & Generate
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline flex justify-between items-start">
                  {campaign.name}
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive -mr-2 -mt-2">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your campaign
                            and all of its associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCampaign(campaign.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardTitle>
                <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <div className="flex items-center justify-center rounded-md bg-muted/50 overflow-hidden mb-4">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt={`Image for ${campaign.name}`}
                        width={600}
                        height={400}
                        className="object-cover"
                        data-ai-hint="fantasy map"
                    />
                </div>
                <h3 className="text-sm font-semibold mb-2">Player Characters</h3>
                 <div className="flex flex-wrap gap-2">
                    {campaign.characters.map(char => (
                        <div key={char.id} className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs">
                            <Shield className="h-4 w-4 text-accent"/>
                            <span>{char.name}</span>
                        </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveCampaign(campaign.id)}>
                   <Edit className="mr-2 h-4 w-4" /> Set Active
                </Button>
                <Button asChild>
                  <Link href="/">
                    <Swords className="mr-2 h-4 w-4" /> Go to Cockpit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

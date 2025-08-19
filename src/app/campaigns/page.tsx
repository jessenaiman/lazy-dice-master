// src/app/campaigns/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import type { Campaign } from "@/lib/types";
import { Header } from "@/components/header";
import Image from "next/image";
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
  const { toast } = useToast();
  const router = useRouter();

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
    router.push('/');
  }
  
  const deleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
    saveCampaigns(updatedCampaigns);
    
    // If the deleted campaign was the active one, clear the active ID
    const activeId = localStorage.getItem(ACTIVE_CAMPAIGN_ID_KEY);
    if (activeId === campaignId) {
        localStorage.removeItem(ACTIVE_CAMPAIGN_ID_KEY);
    }
    
    toast({ title: "Campaign Deleted" });
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(campaigns, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'lazy-gm-campaigns.json';
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedCampaigns = JSON.parse(text);
        // Basic validation
        if (Array.isArray(importedCampaigns) && importedCampaigns.every(c => c.id && c.name && c.description)) {
          saveCampaigns(importedCampaigns);
          toast({ title: "Campaigns Imported Successfully" });
        } else {
          toast({ variant: "destructive", title: "Invalid File Format" });
        }
      } catch (error) {
        console.error("Import error:", error);
        toast({ variant: "destructive", title: "Failed to Import Campaigns" });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            My Campaigns
          </h1>
          <div className="flex gap-2">
             <Button onClick={() => router.push('/')}>
                <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export All
            </Button>
            <Button variant="outline" asChild>
                <label htmlFor="import-file">
                    <Upload className="mr-2 h-4 w-4" /> Import All
                    <input type="file" id="import-file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
            </Button>
          </div>
        </div>

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
                <CardDescription className="line-clamp-2">{campaign.description.substring(0, 200).replace(/<[^>]+>/g, '')}...</CardDescription>
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
                   <Edit className="mr-2 h-4 w-4" /> Set Active & Go to Cockpit
                </Button>
              </CardFooter>
            </Card>
          ))}
           {campaigns.length === 0 && (
             <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4"/>
                    <h3 className="text-xl font-headline mb-2">No Campaigns Yet</h3>
                    <p className="text-muted-foreground mb-4">Click "New Campaign" to start your first adventure.</p>
                     <Button onClick={() => router.push('/')}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Campaign
                    </Button>
                </CardContent>
             </Card>
           )}
        </div>
      </main>
    </div>
  );
}

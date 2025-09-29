
// src/app/campaigns/page.tsx
'use client';

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Swords, BookOpen, Shield, Trash2, Edit, Upload, Save, Loader2, FileText, Bot } from "lucide-react";
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
import type { Campaign, SessionPrep, UserSettings } from "@/lib/types";
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
import { getCampaigns, deleteCampaign as deleteCampaignFromDb, addCampaign, getSessionPrepsForCampaign, addSessionPrep, deleteSessionPrep } from "@/lib/firebase-service";
import { generateCampaignContext } from "@/ai/flows/generate-campaign-context";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Footer } from "@/components/footer";

const ACTIVE_CAMPAIGN_ID_KEY = 'lazy-gm-active-campaign-id';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [sessionPreps, setSessionPreps] = useState<SessionPrep[]>([]);
  const [newCampaignName, setNewCampaignName] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      const savedCampaigns = await getCampaigns();
      
      if (savedCampaigns.length === 0) {
        // If no campaigns exist, create one.
        await handleNewCampaign(true);
      } else {
        setCampaigns(savedCampaigns);
        const activeId = localStorage.getItem(ACTIVE_CAMPAIGN_ID_KEY);
        if (activeId) {
          const campaign = savedCampaigns.find(c => c.id === activeId);
          if (campaign) {
            setActiveCampaign(campaign);
            const preps = await getSessionPrepsForCampaign(campaign.id);
            setSessionPreps(preps);
          }
        }
      }
      setIsLoading(false);
    }
    fetchCampaigns();
  }, []);
  
  const selectActiveCampaign = async (campaign: Campaign) => {
    localStorage.setItem(ACTIVE_CAMPAIGN_ID_KEY, campaign.id);
    setActiveCampaign(campaign);
    const preps = await getSessionPrepsForCampaign(campaign.id);
    setSessionPreps(preps);
    toast({ title: "Campaign Loaded", description: `You are now managing "${campaign.name}".` });
  }
  
  const deleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaignFromDb(campaignId);
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
      setCampaigns(updatedCampaigns);
      
      const activeId = localStorage.getItem(ACTIVE_CAMPAIGN_ID_KEY);
      if (activeId === campaignId) {
          localStorage.removeItem(ACTIVE_CAMPAIGN_ID_KEY);
          setActiveCampaign(null);
          setSessionPreps([]);
      }
      
      toast({ title: "Campaign Deleted" });
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      toast({ variant: "destructive", title: "Error Deleting Campaign" });
    }
  }

  const handleNewCampaign = async (isInitial = false) => {
    setIsGenerating(true);
    try {
        const context = await generateCampaignContext({ campaignName: newCampaignName || undefined });
        const finalName = newCampaignName || context.name;

        const newCampaignData: Omit<Campaign, 'id'> = {
            name: finalName,
            description: context.description,
            characters: context.characters.map(c => ({...c, id: crypto.randomUUID()})),
            sessionPrepIds: [],
            fileUrls: [],
        };
        const newId = await addCampaign(newCampaignData);
        const newCampaign = { ...newCampaignData, id: newId };
        setCampaigns(prev => [...prev, newCampaign]);
        setNewCampaignName("");
        
        if (isInitial || !activeCampaign) {
          selectActiveCampaign(newCampaign);
        }

        toast({ title: "New Campaign Created!", description: `"${finalName}" is ready.` });
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Failed to create campaign." });
    } finally {
        setIsGenerating(false);
    }
  }
  
  const handleNewPrep = async () => {
      if (!activeCampaign) return;
      const prepName = `Session Prep - ${new Date().toLocaleDateString()}`;
      const newPrepData: Omit<SessionPrep, 'id'> = {
          campaignId: activeCampaign.id,
          createdAt: Date.now(),
          name: prepName,
          notes: `<h2>${prepName}</h2><p>Start your prep here...</p>`,
      };
      const newId = await addSessionPrep(newPrepData);
      router.push(`/prep/${newId}`);
  }

  const handleDeletePrep = async (prepId: string) => {
    await deleteSessionPrep(prepId);
    setSessionPreps(preps => preps.filter(p => p.id !== prepId));
    toast({ title: 'Session prep deleted.' });
  }

  if (isLoading) {
      return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </main>
            <Footer />
        </div>
      )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8 grid md:grid-cols-3 gap-8">
        <aside className="md:col-span-1">
            <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">My Campaigns</h1>
             <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter a name or leave blank for AI..."
                            value={newCampaignName}
                            onChange={(e) => setNewCampaignName(e.target.value)}
                            disabled={isGenerating}
                        />
                         <Button onClick={() => handleNewCampaign(false)} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="animate-spin"/> : <Bot />}
                        </Button>
                    </div>
                </CardContent>
             </Card>
            <div className="space-y-2">
            {campaigns.map((campaign) => (
                <Card 
                    key={campaign.id} 
                    onClick={() => selectActiveCampaign(campaign)}
                    className={`cursor-pointer transition-all ${activeCampaign?.id === campaign.id ? 'border-primary shadow-lg' : 'hover:border-primary/50'}`}
                >
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg flex justify-between items-start">
                        {campaign.name}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive -mr-2 -mt-2" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this campaign and all of its session preps. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCampaign(campaign.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </CardTitle>
                    </CardHeader>
                </Card>
            ))}
            </div>
             {campaigns.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                    <Shield className="mx-auto h-12 w-12 mb-4"/>
                    <p>No campaigns yet. Create one above to get started!</p>
                 </div>
             )}
        </aside>
        <section className="md:col-span-2">
            {activeCampaign ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{activeCampaign.name}</CardTitle>
                         <CardDescription>{activeCampaign.description.substring(0, 200).replace(/<[^>]+>/g, '')}...</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <h3 className="font-headline text-xl mb-4">Session Preps</h3>
                         <div className="space-y-3">
                            {sessionPreps.map(prep => (
                                <Card key={prep.id} className="flex items-center justify-between p-4">
                                    <div>
                                        <h4 className="font-semibold">{prep.name}</h4>
                                        <p className="text-sm text-muted-foreground">Created: {new Date(prep.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/prep/${prep.id}`)}>
                                            <Edit className="mr-2 h-4 w-4"/> Edit
                                        </Button>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Delete this session prep?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action is permanent and cannot be undone.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeletePrep(prep.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </Card>
                            ))}
                         </div>
                         {sessionPreps.length === 0 && (
                            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                                <FileText className="mx-auto h-12 w-12 mb-4"/>
                                <p>No session preps for this campaign yet.</p>
                            </div>
                         )}

                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleNewPrep}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Create New Session Prep
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground border-dashed border-2 rounded-lg">
                    <div >
                        <BookOpen className="mx-auto h-16 w-16 mb-4"/>
                        <h2 className="text-2xl font-headline">Select a campaign</h2>
                        <p>Choose a campaign from the list or create a new one to begin.</p>
                    </div>
                </div>
            )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

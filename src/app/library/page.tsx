
// src/app/library/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { getCampaigns, getGeneratedItemsForCampaign } from "@/lib/firebase-service";
import type { Campaign, GeneratedItem } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, BookOpen, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LibraryPage() {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryData = async () => {
      setIsLoading(true);
      const campaigns = await getCampaigns();
      const activeId = localStorage.getItem('lazy-gm-active-campaign-id');
      
      let currentCampaign = null;
      if (activeId) {
        currentCampaign = campaigns.find(c => c.id === activeId) || null;
      } else if (campaigns.length > 0) {
        currentCampaign = campaigns[0];
        if (currentCampaign.id) {
          localStorage.setItem('lazy-gm-active-campaign-id', currentCampaign.id);
        }
      }
      
      setActiveCampaign(currentCampaign);

      if (currentCampaign) {
        const generatedItems = await getGeneratedItemsForCampaign(currentCampaign.id);
        setItems(generatedItems);
      }
      setIsLoading(false);
    };

    fetchLibraryData();
  }, []);

  const filterItems = (type: GeneratedItem['type']) => {
    return items.filter(item => item.type === type);
  }

  const renderTable = (type: GeneratedItem['type'], columns: {key: string, label: string}[], data: any[]) => (
     <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map(col => <TableCell key={col.key}>{ typeof item.content[col.key] === 'object' ? JSON.stringify(item.content[col.key]) : item.content[col.key]}</TableCell>)}
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
         {data.length === 0 && <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">No {type.replace(/-/g, ' ')}s generated for this campaign yet.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </main>
        </div>
    );
  }

  if (!activeCampaign) {
      return (
         <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4"/>
                <h3 className="text-xl font-headline mb-2">No Campaign Loaded</h3>
                <p className="text-muted-foreground">Go to the Cockpit to create or load a campaign.</p>
            </main>
        </div>
      )
  }
  
  const secretsAndClues = items.filter(item => item.type === 'secret-clue').flatMap(item => item.content.secrets.map((secret: string) => ({...item, content: { secrets: secret}})));

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
            <Library className="h-8 w-8" />
            Lore Library
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
            Campaign: {activeCampaign.name}
        </p>
        
        <Tabs defaultValue="npcs" className="w-full">
            <TabsList>
                <TabsTrigger value="npcs">NPCs</TabsTrigger>
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="puzzles">Puzzles</TabsTrigger>
                <TabsTrigger value="magic-items">Magic Items</TabsTrigger>
                <TabsTrigger value="secrets-clues">Secrets & Clues</TabsTrigger>
            </TabsList>
            <TabsContent value="npcs">
                <Card>
                    <CardHeader><CardTitle>NPCs</CardTitle></CardHeader>
                    <CardContent>{renderTable('npc', [{key: 'name', label: 'Name'}, {key: 'description', label: 'Description'}], filterItems('npc'))}</CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="locations">
                <Card>
                    <CardHeader><CardTitle>Locations</CardTitle></CardHeader>
                    <CardContent>{renderTable('location', [{key: 'name', label: 'Name'}, {key: 'description', label: 'Description'}], filterItems('location'))}</CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="puzzles">
                <Card>
                    <CardHeader><CardTitle>Puzzles</CardTitle></CardHeader>
                    <CardContent>{renderTable('puzzle', [{key: 'title', label: 'Title'}, {key: 'complexity', label: 'Complexity'}], filterItems('puzzle'))}</CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="magic-items">
                <Card>
                    <CardHeader><CardTitle>Magic Items</CardTitle></CardHeader>
                    <CardContent>{renderTable('magic-item', [{key: 'name', label: 'Name'}, {key: 'description', label: 'Description'}], filterItems('magic-item'))}</CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="secrets-clues">
                <Card>
                    <CardHeader><CardTitle>Secrets & Clues</CardTitle></CardHeader>
                    <CardContent>{renderTable('secret-clue', [{key: 'secrets', label: 'Secret/Clue'}], secretsAndClues)}</CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </main>
    </div>
  );
}

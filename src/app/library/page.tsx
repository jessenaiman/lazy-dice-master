
// src/app/library/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { getAllGeneratedItems, getCampaigns } from "@/lib/firebase-service";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LibraryPage() {
  const [allItems, setAllItems] = useState<GeneratedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GeneratedItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibraryData = async () => {
      setIsLoading(true);
      const [items, campaigns] = await Promise.all([
        getAllGeneratedItems(),
        getCampaigns()
      ]);
      setAllItems(items);
      setFilteredItems(items);
      setCampaigns(campaigns);
      setIsLoading(false);
    };

    fetchLibraryData();
  }, []);
  
  useEffect(() => {
    if (selectedCampaignId === 'all') {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(item => item.campaignId === selectedCampaignId));
    }
  }, [selectedCampaignId, allItems]);


  const filterItemsByType = (type: GeneratedItem['type']) => {
    return filteredItems.filter(item => item.type === type);
  }
  
  const getCampaignName = (campaignId: string | null) => {
    if (!campaignId) return 'N/A';
    return campaigns.find(c => c.id === campaignId)?.name || 'Unknown';
  }

  const renderTable = (type: GeneratedItem['type'], columns: {key: string, label: string}[], data: any[]) => (
     <Table>
      <TableHeader>
        <TableRow>
          {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
          <TableHead>Campaign</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map(col => <TableCell key={col.key} className="max-w-xs truncate">{ typeof item.content[col.key] === 'object' ? JSON.stringify(item.content[col.key]) : item.content[col.key]}</TableCell>)}
            <TableCell>{getCampaignName(item.campaignId)}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
         {data.length === 0 && <TableRow><TableCell colSpan={columns.length + 2} className="text-center text-muted-foreground h-24">No {type.replace(/-/g, ' ')}s found.</TableCell></TableRow>}
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
  
  const itemTypes: {value: GeneratedItem['type'], label: string, columns: {key: string, label: string}[]}[] = [
    { value: 'npc', label: 'NPCs', columns: [{key: 'name', label: 'Name'}, {key: 'description', label: 'Description'}] },
    { value: 'location', label: 'Locations', columns: [{key: 'name', label: 'Name'}, {key: 'description', label: 'Description'}] },
    { value: 'puzzle', label: 'Puzzles', columns: [{key: 'title', label: 'Title'}, {key: 'complexity', label: 'Complexity'}] },
    { value: 'magic-item', label: 'Magic Items', columns: [{key: 'name', label: 'Name'}, {key: 'description', label: 'Description'}] },
    { value: 'adventure-idea', label: 'Adventure Ideas', columns: [{key: 'title', label: 'Title'}, {key: 'summary', label: 'Summary'}] },
    { value: 'plot-hook', label: 'Plot Hooks', columns: [{key: 'hook', label: 'Hook'}] },
    { value: 'prophecy', label: 'Prophecies', columns: [{key: 'prophecy', label: 'Prophecy'}] },
    { value: 'riddle', label: 'Riddles', columns: [{key: 'riddle', label: 'Riddle'}, {key: 'solution', label: 'Solution'}] },
    { value: 'secret-clue', label: 'Secrets & Clues', columns: [{key: 'secrets', label: 'Secret/Clue'}] },
    { value: 'bookshelf-contents', label: 'Bookshelves', columns: [{key: 'books', label: 'Books'}] },
    { value: 'tavern-menu', label: 'Tavern Menus', columns: [{key: 'name', label: 'Tavern Name'}] },
    { value: 'random-contents', label: 'Random Contents', columns: [{key: 'container', label: 'Container'}, {key: 'contents', label: 'Contents'}] },
  ];
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
            <Library className="h-8 w-8" />
            Lore Library
          </h1>
            <div className="w-64">
               <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                <SelectTrigger>
                    <SelectValue placeholder="Filter by campaign..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </div>
        
        <Tabs defaultValue="npc" className="w-full">
            <TabsList className="flex-wrap h-auto justify-start">
                {itemTypes.map(type => (
                     <TabsTrigger key={type.value} value={type.value}>{type.label}</TabsTrigger>
                ))}
            </TabsList>
            {itemTypes.map(type => (
                 <TabsContent key={type.value} value={type.value}>
                    <Card>
                        <CardHeader><CardTitle>{type.label}</CardTitle></CardHeader>
                        <CardContent>{renderTable(type.value, type.columns, filterItemsByType(type.value))}</CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>

      </main>
    </div>
  );
}

    
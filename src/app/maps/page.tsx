
// src/app/maps/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, MapIcon, Save, Image as ImageIcon } from 'lucide-react';
import { generateMapImage } from '@/ai/flows/generate-map-image';
import { addGeneratedItem, getGeneratedItemsByType } from '@/lib/firebase-service';
import type { GeneratedItem } from '@/lib/types';


type MapType = 'World' | 'City' | 'Treasure' | 'Battle';

export default function MapMakerPage() {
  const [mapType, setMapType] = useState<MapType>('World');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMaps, setSavedMaps] = useState<GeneratedItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaps = async () => {
        const maps = await getGeneratedItemsByType('map');
        setSavedMaps(maps);
    }
    fetchMaps();
  }, []);

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        variant: 'destructive',
        title: 'Prompt is required',
        description: 'Please describe the map you want to create.',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const result = await generateMapImage({
        mapType,
        prompt,
      });
      if (result?.imageDataUri) {
        setGeneratedImage(result.imageDataUri);
        toast({
          title: 'Map Generated!',
          description: 'Your new map is ready. Save it to add it to your library.',
        });
      } else {
        throw new Error('No image data returned from the flow.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Map',
        description: 'Could not generate map. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (generatedImage) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `${mapType.toLowerCase()}-map-${prompt.substring(0, 20).replace(/\s/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }

  const handleSave = async () => {
    if (!generatedImage) return;
    setIsSaving(true);
    try {
        const newMapItem = {
            mapType,
            prompt,
            imageDataUri: generatedImage
        };
        const newId = await addGeneratedItem(null, 'map', newMapItem);
        setSavedMaps(prev => [{id: newId, type: 'map', content: newMapItem, createdAt: Date.now(), campaignId: null}, ...prev]);
        toast({
            title: "Map Saved!",
            description: "The map has been added to your library."
        });
    } catch (error) {
        console.error("Failed to save map:", error);
        toast({
            variant: "destructive",
            title: "Error Saving Map",
            description: "There was an issue saving your map to the database."
        });
    } finally {
        setIsSaving(false);
    }
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="w-full max-w-7xl mx-auto grid gap-8">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                <Card>
                    <CardHeader>
                    <CardTitle className="font-headline text-2xl">Map Maker</CardTitle>
                    <CardDescription>
                        Create a unique map for your world using AI.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="map-type">Map Type</label>
                        <Select
                        value={mapType}
                        onValueChange={(value: MapType) => setMapType(value)}
                        >
                        <SelectTrigger id="map-type">
                            <SelectValue placeholder="Select a map type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="World">World Map</SelectItem>
                            <SelectItem value="City">City Map</SelectItem>
                            <SelectItem value="Treasure">Treasure Map</SelectItem>
                            <SelectItem value="Battle">Battle Map</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="map-prompt">Prompt</label>
                        <Input
                        id="map-prompt"
                        placeholder="e.g., A desert city built in a canyon"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    </CardContent>
                    <CardFooter>
                    <Button onClick={handleGenerate} disabled={isLoading}>
                        {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Generate Map
                    </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col items-center justify-center">
                    <CardContent className="p-6 w-full h-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full aspect-square">
                        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">Generating your map...</p>
                        </div>
                    ) : generatedImage ? (
                        <div className="relative aspect-square w-full group">
                            <Image
                            src={generatedImage}
                            alt="Generated Map"
                            fill
                            className="object-contain rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6 text-white" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleDownload}>
                                    <Download className="h-6 w-6 text-white" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground aspect-square">
                        <MapIcon className="h-16 w-16" />
                        <p className="mt-4">Your generated map will appear here.</p>
                        </div>
                    )}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Saved Maps</CardTitle>
                    <CardDescription>A library of all the maps you have generated and saved.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[64px]">Preview</TableHead>
                                <TableHead>Map Type</TableHead>
                                <TableHead>Prompt</TableHead>
                                <TableHead>Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {savedMaps.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                            <Image src={item.content.imageDataUri} alt={item.content.prompt} fill className="object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.content.mapType}</TableCell>
                                    <TableCell className="max-w-sm truncate">{item.content.prompt}</TableCell>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                            {savedMaps.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                        You haven't saved any maps yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  );
}

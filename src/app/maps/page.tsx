// src/app/maps/page.tsx
'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Download, MapIcon } from 'lucide-react';
import { generateMapImage } from '@/ai/flows/generate-map-image';

type MapType = 'World' | 'City' | 'Treasure' | 'Battle';

export default function MapMakerPage() {
  const [mapType, setMapType] = useState<MapType>('World');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
          description: 'Your new map is ready.',
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

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl grid gap-8 grid-cols-1 md:grid-cols-2">
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
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Generating your map...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative aspect-square w-full">
                    <Image
                      src={generatedImage}
                      alt="Generated Map"
                      layout="fill"
                      className="object-contain rounded-md"
                    />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MapIcon className="h-16 w-16" />
                  <p className="mt-4">Your generated map will appear here.</p>
                </div>
              )}
            </CardContent>
            {generatedImage && !isLoading && (
                 <CardFooter>
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

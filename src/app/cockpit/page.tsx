"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { mockCampaigns } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dices, Mic } from "lucide-react";

export default function CockpitPage() {
  const campaign = mockCampaigns[0];
  const sessionPrepData = campaign.sessionPreps[0];
  const [secrets, setSecrets] = useState(sessionPrepData.secrets);

  const toggleSecret = (id: string) => {
    setSecrets(
      secrets.map((secret) =>
        secret.id === id ? { ...secret, revealed: !secret.revealed } : secret
      )
    );
  };

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomNames = ["Elias Vance", "Lyra Swiftwind", "Grommash Hellscream", "Seraphina Quill"];
  const randomTavernQuirks = ["Always a sleeping dog by the fire", "All drinks are served in skulls", "The bartender is a retired adventurer", "Has a secret fight club in the basement"];
  const randomMonuments = ["A crumbling statue of a forgotten king", "A shimmering crystal that hums with power", "An ancient, moss-covered monolith", "A fountain that flows with glowing water"];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 p-4 md:p-8">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Strong Start</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{sessionPrepData.strongStart}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Potential Scenes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {sessionPrepData.potentialScenes.map((scene, index) => (
                  <li key={index}>{scene}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Tabs defaultValue="secrets">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="secrets">Secrets</TabsTrigger>
                <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
              </TabsList>
              <TabsContent value="secrets">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Secrets & Clues</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {secrets.map((secret) => (
                      <div key={secret.id} className="flex items-start gap-2">
                        <Checkbox
                          id={`secret-${secret.id}`}
                          checked={secret.revealed}
                          onCheckedChange={() => toggleSecret(secret.id)}
                          aria-labelledby={`label-secret-${secret.id}`}
                        />
                        <Label htmlFor={`secret-${secret.id}`} id={`label-secret-${secret.id}`} className={`flex-1 text-sm ${secret.revealed ? 'line-through text-muted-foreground' : ''}`}>
                          {secret.text}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="toolkit">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Improvisation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" variant="outline"><Dices className="mr-2 h-4 w-4"/>Random Name</Button>
                    <Button className="w-full" variant="outline"><Dices className="mr-2 h-4 w-4"/>Random Tavern Quirk</Button>
                    <Button className="w-full" variant="outline"><Dices className="mr-2 h-4 w-4"/>Random Monument</Button>
                    <h4 className="font-headline text-lg pt-4 border-t">Quick-Add NPC</h4>
                    <Input placeholder="NPC Name" aria-label="New NPC Name"/>
                    <Textarea placeholder="NPC details..." aria-label="New NPC Details"/>
                    <Button className="w-full">Save NPC</Button>
                     <h4 className="font-headline text-lg pt-4 border-t">Voice Note</h4>
                     <Button className="w-full" variant="secondary"><Mic className="mr-2 h-4 w-4"/>Start Recording</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

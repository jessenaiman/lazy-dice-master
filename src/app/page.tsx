"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { mockCampaigns } from "@/lib/mock-data";
import { generateStrongStart } from "@/ai/flows/generate-strong-start";
import { generateSecretsAndClues } from "@/ai/flows/generate-secrets-and-clues";
import { generatePlotHook } from "@/ai/flows/generate-plot-hook";
import { generateNpc } from "@/ai/flows/generate-npc";
import { generateLocation } from "@/ai/flows/generate-location";
import { generatePuzzle } from "@/ai/flows/generate-puzzle";
import { GenerativeBlock } from "@/components/generative-block";
import { BrainCircuit, KeyRound, Map, Puzzle, Swords, User, Compass, Dices, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CockpitPage() {
  const campaign = mockCampaigns[0];
  const sessionPrepData = campaign.sessionPreps[0];
  
  const campaignContext = {
    campaignSetting: campaign.description,
    playerCharacters: campaign.characters.map(c => `${c.name}: ${c.details}`).join('\n'),
    characterMotivations: campaign.characters.map(c => `${c.name}'s motivation: ${c.motivation}`).join('\n'),
    potentialScenes: sessionPrepData.potentialScenes.join('\n'),
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 p-4 md:p-8">
        <div className="lg:col-span-3 space-y-6">
          <GenerativeBlock
            title="Strong Start"
            icon={Swords}
            initialContent={sessionPrepData.strongStart}
            generate={async () => {
              const result = await generateStrongStart({
                campaignSetting: campaignContext.campaignSetting,
                playerCharacters: campaignContext.playerCharacters,
              });
              return result.strongStart;
            }}
          />
          <GenerativeBlock
            title="Plot Hook"
            icon={Compass}
            generate={async () => {
              const result = await generatePlotHook({
                campaignSetting: campaignContext.campaignSetting,
                playerCharacters: campaignContext.playerCharacters,
              });
              return `**Hook:** ${result.hook}\n\n**Clues:**\n- ${result.clues[0]}\n- ${result.clues[1]}\n- ${result.clues[2]}`;
            }}
          />
           <GenerativeBlock
            title="Secrets & Clues"
            icon={KeyRound}
            generate={async () => {
              const result = await generateSecretsAndClues({
                ...campaignContext,
                numSecrets: 3,
              });
              return result.secrets.map(s => `- ${s}`).join('\n');
            }}
          />
          <GenerativeBlock
            title="NPC"
            icon={User}
            generate={async () => {
                const result = await generateNpc({ campaignSetting: campaignContext.campaignSetting });
                return `**${result.name}**\n*${result.description}*\n\n**Mannerisms:**\n- ${result.mannerisms.join('\n- ')}\n\n**Portrait:**\n![NPC Portrait](https://placehold.co/400x400.png?text=${encodeURIComponent(result.name)})`;
            }}
          />
          <GenerativeBlock
            title="Location"
            icon={Map}
            generate={async () => {
              const result = await generateLocation({ campaignSetting: campaignContext.campaignSetting });
              return `**${result.name}**\n*${result.description}*\n\n**Clues:**\n- ${result.clues[0]}\n- ${result.clues[1]}\n- ${result.clues[2]}`;
            }}
          />
          <GenerativeBlock
            title="Puzzle"
            icon={Puzzle}
            generate={async () => {
              const result = await generatePuzzle({ campaignSetting: campaignContext.campaignSetting });
              return `**${result.title}**\n*${result.description}*\n\n**Solution:** ${result.solution}\n\n**Clues:**\n- ${result.clues[0]}\n- ${result.clues[1]}\n- ${result.clues[2]}`;
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Tabs defaultValue="toolkit">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="toolkit">Toolkit</TabsTrigger>
              </TabsList>
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

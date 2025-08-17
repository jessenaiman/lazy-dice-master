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
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-6">
          <GenerativeBlock
            title="Strong Start"
            fileName="strong-start"
            icon={Swords}
            initialContent={sessionPrepData.strongStart}
            generate={async (userInput) => {
              const result = await generateStrongStart({
                campaignSetting: campaignContext.campaignSetting,
                playerCharacters: `${campaignContext.playerCharacters}\n\n${userInput}`,
              });
              return result.strongStart;
            }}
          />
          <GenerativeBlock
            title="Plot Hook"
            fileName="plot-hook"
            icon={Compass}
            generate={async (userInput) => {
              const result = await generatePlotHook({
                campaignSetting: campaignContext.campaignSetting,
                playerCharacters: `${campaignContext.playerCharacters}\n\n${userInput}`,
              });
              return `**Hook:** ${result.hook}\n\n**Clues:**\n- ${result.clues[0]}\n- ${result.clues[1]}\n- ${result.clues[2]}`;
            }}
          />
           <GenerativeBlock
            title="Secrets & Clues"
            fileName="secrets-and-clues"
            icon={KeyRound}
            generate={async (userInput) => {
              const result = await generateSecretsAndClues({
                ...campaignContext,
                potentialScenes: `${campaignContext.potentialScenes}\n\n${userInput}`,
                numSecrets: 3,
              });
              return result.secrets.map(s => `- ${s}`).join('\n');
            }}
          />
          <GenerativeBlock
            title="NPC"
            fileName="npc"
            icon={User}
            generate={async (userInput) => {
                const result = await generateNpc({ campaignSetting: `${campaignContext.campaignSetting}\n\n${userInput}` });
                return `**${result.name}**\n*${result.description}*\n\n**Mannerisms:**\n- ${result.mannerisms.join('\n- ')}\n\n**Portrait:**\n![NPC Portrait](https://placehold.co/400x400.png?text=${encodeURIComponent(result.name)})`;
            }}
          />
          <GenerativeBlock
            title="Location"
            fileName="location"
            icon={Map}
            generate={async (userInput) => {
              const result = await generateLocation({ campaignSetting: `${campaignContext.campaignSetting}\n\n${userInput}` });
              return `**${result.name}**\n*${result.description}*\n\n**Clues:**\n- ${result.clues[0]}\n- ${result.clues[1]}\n- ${result.clues[2]}`;
            }}
          />
          <GenerativeBlock
            title="Puzzle"
            fileName="puzzle"
            icon={Puzzle}
            generate={async (userInput) => {
              const result = await generatePuzzle({ campaignSetting: `${campaignContext.campaignSetting}\n\n${userInput}` });
              return `**${result.title}**\n*${result.description}*\n\n**Solution:** ${result.solution}\n\n**Clues:**\n- ${result.clues[0]}\n- ${result.clues[1]}\n- ${result.clues[2]}`;
            }}
          />
        </div>
      </main>
    </div>
  );
}

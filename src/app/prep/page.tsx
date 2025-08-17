import { Header } from "@/components/header";
import { CharacterPanel } from "@/components/character-panel";
import { mockCampaigns } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpenCheck,
  Sparkles,
  ListTree,
  KeyRound,
  Map,
  Users,
  Shield,
  Gem,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StrongStartStep } from "@/components/prep/strong-start-step";
import { SecretsCluesStep } from "@/components/prep/secrets-clues-step";
import { MagicItemStep } from "@/components/prep/magic-item-step";
import { Button } from "@/components/ui/button";

export default function SessionPrepPage() {
  const campaign = mockCampaigns[0];
  const sessionPrep = campaign.sessionPreps[0];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 p-4 md:p-8">
        <div className="lg:col-span-3">
          <h1 className="font-headline text-3xl font-bold tracking-tight mb-2">
            Session Prep
          </h1>
          <p className="text-muted-foreground mb-6">
            Campaign: {campaign.name}
          </p>

          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-headline">
                <BookOpenCheck className="mr-3 h-5 w-5 text-accent" />
                Step 1: Review the Characters
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6 grid gap-4 md:grid-cols-3">
                    {campaign.characters.map((char) => (
                      <div key={char.id}>
                        <h4 className="font-bold">{char.name}</h4>
                        <p className="text-sm text-muted-foreground italic mb-1">
                          "{char.motivation}"
                        </p>
                        <p className="text-sm">{char.details}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-headline">
                <Sparkles className="mr-3 h-5 w-5 text-accent" />
                Step 2: Create a Strong Start
              </AccordionTrigger>
              <AccordionContent>
                <StrongStartStep 
                  campaignSetting={campaign.description} 
                  playerCharacters={campaign.characters.map(c => `${c.name}: ${c.details}`).join('\n')} 
                  initialValue={sessionPrep.strongStart}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-headline">
                <ListTree className="mr-3 h-5 w-5 text-accent" />
                Step 3: Outline Potential Scenes
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-6">
                    <Textarea 
                      placeholder="List potential scenes, one per line..." 
                      defaultValue={sessionPrep.potentialScenes.join('\n')}
                      className="min-h-[150px]" 
                      aria-label="Potential Scenes"
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-headline">
                <KeyRound className="mr-3 h-5 w-5 text-accent" />
                Step 4: Define Secrets and Clues
              </AccordionTrigger>
              <AccordionContent>
                <SecretsCluesStep
                    campaignSetting={campaign.description}
                    potentialScenes={sessionPrep.potentialScenes.join('\n')}
                    characterMotivations={campaign.characters.map(c => `${c.name}'s motivation: ${c.motivation}`).join('\n')}
                    initialSecrets={sessionPrep.secrets}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-headline">
                <Map className="mr-3 h-5 w-5 text-accent" />
                Step 5: Develop Fantastic Locations
              </AccordionTrigger>
              <AccordionContent>
                 <Card>
                  <CardContent className="p-6">
                    <Textarea 
                      placeholder="Describe fantastic locations..." 
                      defaultValue={sessionPrep.fantasticLocations.join('\n')}
                      className="min-h-[150px]"
                      aria-label="Fantastic Locations"
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-headline">
                <Users className="mr-3 h-5 w-5 text-accent" />
                Step 6: Outline Important NPCs
              </AccordionTrigger>
              <AccordionContent>
                 <Card>
                  <CardContent className="p-6">
                    <Textarea 
                      placeholder="Outline important NPCs..." 
                      defaultValue={sessionPrep.importantNpcs.join('\n')}
                      className="min-h-[150px]"
                      aria-label="Important NPCs"
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-headline">
                <Shield className="mr-3 h-5 w-5 text-accent" />
                Step 7: Choose Relevant Monsters
              </AccordionTrigger>
              <AccordionContent>
                 <Card>
                  <CardContent className="p-6">
                    <Textarea 
                      placeholder="List relevant monsters..." 
                      defaultValue={sessionPrep.relevantMonsters.join('\n')}
                      className="min-h-[150px]"
                      aria-label="Relevant Monsters"
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-headline">
                <Gem className="mr-3 h-5 w-5 text-accent" />
                Step 8: Select Magic Item Rewards
              </AccordionTrigger>
              <AccordionContent>
                <MagicItemStep initialItems={sessionPrep.magicItems} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" size="lg">Save Prep</Button>
            <Button size="lg">Go to Cockpit</Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CharacterPanel characters={campaign.characters} />
        </div>
      </main>
    </div>
  );
}

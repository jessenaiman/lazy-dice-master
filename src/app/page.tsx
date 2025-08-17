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
import { generateMagicItem } from "@/ai/flows/generate-magic-item";
import { generateProphecy } from "@/ai/flows/generate-prophecy";
import { GenerativeBlock } from "@/components/generative-block";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  KeyRound, 
  Map, 
  Puzzle, 
  Swords, 
  User, 
  Compass, 
  ScrollText,
  Gem,
  Eye,
  BookOpen,
  Printer,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface GeneratedContent {
  id: string;
  title: string;
  content: string;
}

const renderContentWithFantasyIcons = (content: string) => {
  const listItems = content.replace(/\\n- /g, '<br />- ').split('<br />- ').map(item => {
    if (content.includes('- ')) { // It is a list
      return item.startsWith('- ') || item.startsWith('<li>') ? `<li><span class="mr-2 text-accent">⚔</span>${item.substring(item.startsWith('- ') ? 2 : 4)}</li>` : item;
    }
    return item;
  }).join('');
  
  const processedContent = listItems
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\\n/g, '<br />');

  if (content.includes('- ')) {
     return `<ul>${processedContent}</ul>`;
  }
  return processedContent;
};

export default function CockpitPage() {
  const campaign = mockCampaigns[0];
  
  const [globalContext, setGlobalContext] = useState(
    `Campaign: ${campaign.description}\n\nCharacters:\n${campaign.characters.map(c => `- ${c.name} (${c.details}): Motivation: ${c.motivation}`).join('\n')}`
  );

  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const { toast } = useToast();

  const handleContentGenerated = (id: string, title: string, content: string) => {
    setGeneratedContents(prevContents => {
      const existingIndex = prevContents.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        const newContents = [...prevContents];
        newContents[existingIndex] = { id, title, content };
        return newContents;
      }
      return [...prevContents, { id, title, content }];
    });
    toast({
        title: `${title} Added`,
        description: `The content has been added to your session notes.`
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const markdownContent = generatedContents.map(item => `## ${item.title}\n\n${item.content}`).join('\n\n---\n\n');
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `session-notes-${new Date().toISOString()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Session Notes Saved",
      description: "Your session notes have been downloaded as a markdown file.",
    });
  };
  
  const toolkitBlocks = [
    { id: 'strong-start', title: 'Strong Start', icon: Swords, generate: async (userInput: string) => (await generateStrongStart({ campaignSetting: `${globalContext}\n\n${userInput}`, playerCharacters: campaign.characters.map(c => c.name).join(', ') })).strongStart, format: (c: string) => c },
    { id: 'plot-hook', title: 'Plot Hook', icon: Compass, generate: async (userInput: string) => await generatePlotHook({ campaignSetting: `${globalContext}\n\n${userInput}`, playerCharacters: campaign.characters.map(c => c.name).join(', ') }), format: (r: any) => `**Hook:** ${r.hook}\n\n**Clues:**\n- ${r.clues.join('\n- ')}` },
    { id: 'secrets', title: 'Secrets', icon: KeyRound, generate: async (userInput: string) => await generateSecretsAndClues({ campaignSetting: `${globalContext}\n\n${userInput}`, characterMotivations: campaign.characters.map(c => c.motivation).join('\n'), numSecrets: 5 }), format: (r: any) => r.secrets.map((s: string) => `- ${s}`).join('\n') },
    { id: 'clues', title: 'Clues', icon: Eye, generate: async (userInput: string) => await generateSecretsAndClues({ campaignSetting: `${globalContext}\n\n${userInput}`, characterMotivations: campaign.characters.map(c => c.motivation).join('\n'), numSecrets: 5 }), format: (r: any) => r.secrets.map((s: string) => `- ${s}`).join('\n') },
    { id: 'npc', title: 'NPC', icon: User, generate: async (userInput: string) => await generateNpc({ campaignSetting: `${globalContext}\n\n${userInput}` }), format: (r: any) => `**${r.name}**\n*${r.description}*\n\n**Mannerisms:**\n- ${r.mannerisms.join('\n- ')}` },
    { id: 'location', title: 'Location', icon: Map, generate: async (userInput: string) => await generateLocation({ campaignSetting: `${globalContext}\n\n${userInput}` }), format: (r: any) => `**${r.name}**\n${r.description}\n\n**Clues:**\n- ${r.clues.join('\n- ')}` },
    { id: 'puzzle', title: 'Puzzle', icon: Puzzle, generate: async (userInput: string) => await generatePuzzle({ campaignSetting: `${globalContext}\n\n${userInput}` }), format: (r: any) => `**${r.title}**\n${r.description}\n\n**Solution:** ${r.solution}\n\n**Clues:**\n- ${r.clues.join('\n- ')}` },
    { id: 'magic-item', title: 'Magic Item', icon: Gem, generate: async (userInput: string) => await generateMagicItem({ campaignSetting: `${globalContext}\n\n${userInput}` }), format: (r: any) => `**${r.name}**\n*${r.description}*\n\n**Powers:**\n- ${r.powers.join('\n- ')}` },
    { id: 'prophecy', title: 'Prophecy', icon: ScrollText, generate: async (userInput: string) => await generateProphecy({ campaignSetting: `${globalContext}\n\n${userInput}` }), format: (r: any) => `*${r.prophecy}*\n\n**Meanings:**\n- ${r.meanings.join('\n- ')}` },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-body transition-colors duration-300">
      <Header />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {/* Left Column: Toolkit */}
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4">
          <h2 className="font-headline text-2xl">GM's Toolkit</h2>
          <ScrollArea className="flex-grow">
            <div className="grid grid-cols-1 gap-4 pr-4">
              {toolkitBlocks.map(block => (
                <GenerativeBlock
                  key={block.id}
                  id={block.id}
                  title={block.title}
                  icon={block.icon}
                  generate={block.generate}
                  format={block.format}
                  onGenerated={handleContentGenerated}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column: Session Notes */}
        <div className="md:col-span-2 lg:col-span-3">
           <div className="bg-card border rounded-lg shadow-sm h-full flex flex-col">
            <div className="p-6 flex items-center justify-between border-b">
                <h2 className="font-headline text-3xl flex items-center gap-3"><BookOpen /> Session Notes</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleSave}><Save className="mr-2"/> Save Session</Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2"/> Print Session</Button>
                </div>
            </div>
            <div className="p-6 border-b">
                <Label htmlFor="global-context" className="text-lg font-headline">Campaign & Player Context</Label>
                <Textarea 
                  id="global-context"
                  placeholder="Provide general context about the campaign, players, and current situation..."
                  value={globalContext}
                  onChange={(e) => setGlobalContext(e.target.value)}
                  className="mt-2 min-h-[120px] text-sm"
                />
            </div>
            <ScrollArea className="h-[calc(100vh-21rem)]">
              <div className="p-8 prose prose-sm max-w-none prose-p:text-foreground/90 prose-headings:text-primary prose-strong:text-foreground prose-em:text-foreground/80 font-body prose-ul:list-none prose-ul:p-0 prose-li:flex prose-li:items-start">
                {generatedContents.length > 0 ? (
                  generatedContents.map(item => (
                    <div key={item.id} className="mb-6">
                      <h3 className="font-headline text-2xl mb-2">{item.title}</h3>
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: renderContentWithFantasyIcons(item.content) }}
                      ></div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground pt-16">
                    <p>Your generated content will appear here.</p>
                    <p>Use the GM's Toolkit on the left to get started.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
           </div>
        </div>
      </main>
    </div>
  );
}

// src/app/page.tsx
'use client';

import {useState, useRef, useEffect} from 'react';
import {Header} from '@/components/header';
import {generateStrongStart} from '@/ai/flows/generate-strong-start';
import {generateSecretsAndClues} from '@/ai/flows/generate-secrets-and-clues';
import {generatePlotHook} from '@/ai/flows/generate-plot-hook';
import {generateNpc} from '@/ai/flows/generate-npc';
import {generateLocation} from '@/ai/flows/generate-location';
import {generatePuzzle} from '@/ai/flows/generate-puzzle';
import {generateMagicItem} from '@/ai/flows/generate-magic-item';
import {generateProphecy} from '@/ai/flows/generate-prophecy';
import {generateCampaignContext} from '@/ai/flows/generate-campaign-context';
import {GenerativeBlock} from '@/components/generative-block';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
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
  Save,
  Upload,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {TiptapEditor} from '@/components/tiptap-editor';
import TurndownService from 'turndown';
import { mockCampaigns } from '@/lib/mock-data';

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
}

const renderContentWithFantasyIcons = (content: string) => {
  const processedContent = content
    .replace(/<h3>/g, '<h3 class="font-headline text-xl mt-4 mb-2 text-primary">')
    .replace(/<ul>/g, '<ul class="list-none p-0">')
    .replace(
      /<li>/g,
      '<li class="flex items-start mb-1"><span class="mr-3 mt-1 text-accent shrink-0">⚔️</span>'
    );

  return processedContent;
};

export default function CockpitPage() {
  const campaign = mockCampaigns[0];
  const [globalContext, setGlobalContext] = useState('');
  const [isContextLoading, setIsContextLoading] = useState(true);

  const [generatedContents, setGeneratedContents] = useState<
    GeneratedContent[]
  >([]);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateContext = async () => {
    setIsContextLoading(true);
    try {
      const result = await generateCampaignContext({});
      const formattedContext = `<h2>${
        result.name
      }</h2><p>${result.description.replace(
        /\n/g,
        '</p><p>'
      )}</p><h3>Characters:</h3><ul>${result.characters
        .map(
          (c: any) =>
            `<li><strong>${c.name}:</strong> <em>${c.details}</em> - Motivation: ${c.motivation}</li>`
        )
        .join('')}</ul>`;
      setGlobalContext(formattedContext);
    } catch (error) {
      console.error('Error generating context:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Context',
        description: 'Could not generate campaign context. Please try again.',
      });
    } finally {
      setIsContextLoading(false);
    }
  };

  useEffect(() => {
    handleGenerateContext();
  }, []);

  const handleContentGenerated = (
    id: string,
    title: string,
    content: string
  ) => {
    setGeneratedContents(prevContents => {
      const existingIndex = prevContents.findIndex(item => item.id === id);
      if (existingIndex > -1) {
        const newContents = [...prevContents];
        newContents[existingIndex] = {id, title, content};
        return newContents;
      }
      return [...prevContents, {id, title, content}];
    });
    toast({
      title: `${title} Added`,
      description: `The content has been added to your session notes.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const saveMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const turndownService = new TurndownService({headingStyle: 'atx'});
    
    // Save Campaign Context
    const campaignMarkdown = turndownService.turndown(globalContext);
    saveMarkdown(campaignMarkdown, `campaign-context-${campaign.id}.md`);

    // Save Session Notes
    const sessionMarkdown = generatedContents
      .map(
        item =>
          `## ${item.title}\n\n${turndownService.turndown(item.content)}`
      )
      .join('\n\n---\n\n');
    saveMarkdown(sessionMarkdown, `session-notes-${new Date().toISOString()}.md`);
    
    toast({
      title: 'Content Saved',
      description: 'Your campaign context and session notes have been downloaded as markdown files.',
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        // For simplicity, appending to existing HTML. A more robust solution
        // might convert markdown to HTML here.
        setGlobalContext(prev => `${prev}<p>--- Uploaded Content ---</p><p>${text.replace(/\n/g, '<br />')}</p>`);
        toast({
          title: 'File Uploaded',
          description: `Content from ${file.name} has been added to the context.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const toolkitBlocks = [
    {
      id: 'strong-start',
      title: 'Strong Start',
      icon: Swords,
      generate: async (userInput: string) =>
        (
          await generateStrongStart({
            campaignSetting: `${globalContext}\n\n${userInput}`,
            playerCharacters: 'Players from context',
          })
        ).strongStart,
      format: (c: string) => `<p>${c}</p>`,
    },
    {
      id: 'plot-hook',
      title: 'Plot Hook',
      icon: Compass,
      generate: async (userInput: string) =>
        await generatePlotHook({
          campaignSetting: `${globalContext}\n\n${userInput}`,
          playerCharacters: 'Players from context',
        }),
      format: (r: any) =>
        `<h3>Hook</h3><p>${r.hook}</p><h3>Clues</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'secrets',
      title: 'Secrets',
      icon: KeyRound,
      generate: async (userInput: string) =>
        await generateSecretsAndClues({
          campaignSetting: `${globalContext}\n\n${userInput}`,
          characterMotivations: 'Motivations from context',
          numSecrets: 5,
        }),
      format: (r: any) => `<ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'clues',
      title: 'Clues',
      icon: Eye,
      generate: async (userInput: string) =>
        await generateSecretsAndClues({
          campaignSetting: `${globalContext}\n\n${userInput}`,
          characterMotivations: 'Motivations from context',
          numSecrets: 5,
        }),
      format: (r: any) => `<ul><li>${r.secrets.join('</li><li>')}</li></ul>`,
    },
    {
      id: 'npc',
      title: 'NPC',
      icon: User,
      generate: async (userInput: string) =>
        await generateNpc({
          campaignSetting: `${globalContext}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h3>${r.name}</h3><p><em>${r.description}</em></p><h3>Mannerisms:</h3><ul><li>${r.mannerisms.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'location',
      title: 'Location',
      icon: Map,
      generate: async (userInput: string) =>
        await generateLocation({
          campaignSetting: `${globalContext}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h3>${r.name}</h3><p>${r.description}</p><h3>Clues:</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'puzzle',
      title: 'Puzzle',
      icon: Puzzle,
      generate: async (userInput: string) =>
        await generatePuzzle({
          campaignSetting: `${globalContext}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h3>${r.title}</h3><p>${r.description}</p><h3>Solution:</h3><p>${r.solution}</p><h3>Clues:</h3><ul><li>${r.clues.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'magic-item',
      title: 'Magic Item',
      icon: Gem,
      generate: async (userInput: string) =>
        await generateMagicItem({
          campaignSetting: `${globalContext}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h3>${r.name}</h3><p><em>${r.description}</em></p><h3>Powers:</h3><ul><li>${r.powers.join(
          '</li><li>'
        )}</li></ul>`,
    },
    {
      id: 'prophecy',
      title: 'Prophecy',
      icon: ScrollText,
      generate: async (userInput: string) =>
        await generateProphecy({
          campaignSetting: `${globalContext}\n\n${userInput}`,
        }),
      format: (r: any) =>
        `<h3>Prophecy</h3><p><em>${r.prophecy}</em></p><h3>Possible Meanings:</h3><ul><li>${r.meanings.join(
          '</li><li>'
        )}</li></ul>`,
    },
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

        {/* Right Column: Session Notes & Context */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center justify-between">
                <span>Campaign &amp; GM Context</span>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="icon" onClick={handleGenerateContext} disabled={isContextLoading}>
                      {isContextLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      <span className="sr-only">Regenerate Context</span>
                    </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".md,.txt"
                    className="hidden"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
               <TiptapEditor
                  content={globalContext}
                  onChange={setGlobalContext}
                  placeholder="Campaign context will be generated here. You can also edit it or upload your own notes."
                  isLoading={isContextLoading}
                />
            </CardContent>
          </Card>

          <div className="bg-card border rounded-lg shadow-sm h-full flex flex-col flex-grow">
            <div className="p-6 flex items-center justify-between border-b">
              <h2 className="font-headline text-3xl flex items-center gap-3">
                <BookOpen /> Session Notes
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="mr-2" /> Save Session
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2" /> Print Session
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-grow">
              <div className="p-8 prose prose-sm max-w-none prose-p:text-foreground/90 prose-h3:text-primary prose-strong:text-foreground prose-em:text-foreground/80 font-body">
                {generatedContents.length > 0 ? (
                  generatedContents.map(item => (
                    <div key={item.id} className="mb-6">
                      <h2 className="font-headline text-2xl mb-2">
                        {item.title}
                      </h2>
                      <div
                        className="text-base leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: renderContentWithFantasyIcons(item.content),
                        }}
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

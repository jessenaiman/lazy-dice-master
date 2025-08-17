"use client";

import { useState, type ElementType, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Loader2, Edit3, Sparkles, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface GenerativeBlockProps {
  id: string;
  title: string;
  icon: ElementType;
  initialContent?: string;
  generate: (userInput: string) => Promise<any>;
  format: (response: any) => string;
  onGenerated: (id: string, title: string, content: string) => void;
}

export function GenerativeBlock({ id, title, icon: Icon, initialContent = "", generate, format, onGenerated }: GenerativeBlockProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();
  const hasGeneratedOnce = useRef(false);

  const handleGenerate = async (isRegeneration = false) => {
    // Only set loading if we are actually going to fetch new data.
    if (!initialContent || isRegeneration) {
        setIsLoading(true);
        hasGeneratedOnce.current = true;
        try {
          const result = await generate(userInput);
          const formattedContent = format(result);
          setContent(formattedContent);
          onGenerated(id, title, formattedContent);
        } catch (error) {
          console.error(error);
          toast({
            variant: "destructive",
            title: `Error Generating ${title}`,
            description: "Could not generate content. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
    }
  };
  
  const handleSave = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Content Saved",
      description: `"${title.replace(/\s+/g, '-').toLowerCase()}.md" has been downloaded.`,
    });
  };

  useEffect(() => {
    if (initialContent && !hasGeneratedOnce.current) {
        setContent(initialContent);
        onGenerated(id, title, initialContent);
        hasGeneratedOnce.current = true;
    }
  }, [initialContent, id, title, onGenerated]);


  return (
    <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-3">
            <CardTitle className="font-headline text-lg flex items-center gap-2">
              <Icon className="h-5 w-5 text-accent" />
              {title}
            </CardTitle>
            {hasGeneratedOnce.current &&
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="user-input" className="border-b-0">
                          <AccordionTrigger className="p-2 text-muted-foreground hover:no-underline hover:text-foreground rounded-md data-[state=open]:bg-muted/50 [&>svg]:hidden">
                              <Edit3 className="h-4 w-4" />
                          </AccordionTrigger>
                          </AccordionItem>
                      </Accordion>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Detail</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                 <Button variant="ghost" size="icon" onClick={() => handleGenerate(true)} disabled={isLoading} aria-label={`Regenerate ${title}`}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSave} disabled={!content || isLoading} aria-label="Save content">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            }
        </CardHeader>
        <div className="px-3 pb-3">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="user-input" className="border-b-0">
              <AccordionContent>
                  <Textarea 
                  placeholder="Provide a specific detail..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="mt-1 text-xs"
                  aria-label="Optional user input"
                  />
              </AccordionContent>
              </AccordionItem>
          </Accordion>
        </div>

        {!hasGeneratedOnce.current &&
          <CardFooter className="p-3 pt-0">
             <Button onClick={() => handleGenerate(false)} disabled={isLoading} size="sm" className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate {title}
            </Button>
          </CardFooter>
        }
    </Card>
  );
}

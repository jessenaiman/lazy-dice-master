"use client";

import { useState, type ElementType, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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

interface GenerativeBlockProps {
  title: string;
  fileName: string;
  icon: ElementType;
  initialContent?: string;
  generate: (userInput: string) => Promise<string>;
}

export function GenerativeBlock({ title, fileName, icon: Icon, initialContent = "", generate }: GenerativeBlockProps) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();
  const hasGeneratedOnce = useRef(!!initialContent);

  const handleGenerate = async () => {
    setIsLoading(true);
    hasGeneratedOnce.current = true;
    try {
      const result = await generate(userInput);
      setContent(result);
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
  };
  
  const handleSave = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Content Saved",
      description: `"${fileName}.md" has been downloaded.`,
    });
  };

  useEffect(() => {
    if (initialContent && !hasGeneratedOnce.current) {
        hasGeneratedOnce.current = true;
    }
  }, [initialContent]);

  const renderContent = () => {
    if (isLoading) {
      return (
         <div className="space-y-2">
          <p className="h-4 w-full animate-pulse rounded-md bg-muted"></p>
          <p className="h-4 w-4/5 animate-pulse rounded-md bg-muted"></p>
          <p className="h-4 w-full animate-pulse rounded-md bg-muted"></p>
         </div>
      );
    }
    if (!content) {
        return <p className="text-sm text-muted-foreground">Click "Generate" to create content.</p>
    }
    // A simple markdown to html renderer
    const htmlContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
      .replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" class="rounded-md border" />') // image
      .replace(/(\n- .*?)+/g, (match) => `<ul>${match.replace(/\n- (.*)/g, '<li>$1</li>')}</ul>`) // lists
      .replace(/\n/g, '<br />'); // newlines

    return <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
  }

  const ContentWrapper = hasGeneratedOnce.current ? Card : Accordion;
  const TriggerWrapper = hasGeneratedOnce.current ? 'div' : AccordionTrigger;
  const ItemWrapper = hasGeneratedOnce.current ? 'div' : AccordionItem;
  const ContentContainer = hasGeneratedOnce.current ? CardContent : AccordionContent;

  return (
    <ContentWrapper type="single" collapsible className="w-full" defaultValue={hasGeneratedOnce.current ? "item-1" : undefined}>
      <ItemWrapper value="item-1" className={hasGeneratedOnce.current ? '' : 'border-b-0'}>
        <Card className={`${!hasGeneratedOnce.current ? "border-0 shadow-none" : ""} flex flex-col h-full`}>
          <CardHeader className="flex flex-row items-center justify-between p-4">
              <TriggerWrapper className={!hasGeneratedOnce.current ? "font-headline text-2xl flex items-center gap-2 w-full" : ''}>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent" />
                  {title}
                </CardTitle>
              </TriggerWrapper>
              {hasGeneratedOnce.current &&
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" onClick={handleGenerate} disabled={isLoading} aria-label={`Regenerate ${title}`}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleSave} disabled={!content || isLoading} aria-label="Save content">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              }
          </CardHeader>
          <ContentContainer className="p-4 pt-0 flex-grow">
            {renderContent()}
          </ContentContainer>
           <CardFooter className="p-4 pt-0 mt-auto">
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="user-input" className="border-b-0">
                <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline py-1 pt-2 justify-start">
                    <Edit3 className="mr-2 h-3 w-3" />
                    Add Detail (Optional)
                </AccordionTrigger>
                <AccordionContent>
                    <Textarea 
                    placeholder="Provide a specific detail to guide the AI, e.g., 'The players are in a tavern called The Prancing Pony.'"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="mt-2"
                    aria-label="Optional user input"
                    />
                </AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardFooter>
          {!hasGeneratedOnce.current &&
            <CardFooter className="p-4 pt-0">
               <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate {title}
              </Button>
            </CardFooter>
          }
        </Card>
      </ItemWrapper>
    </ContentWrapper>
  );
}

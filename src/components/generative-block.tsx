"use client";

import { useState, type ElementType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerativeBlockProps {
  title: string;
  icon: ElementType;
  initialContent?: string;
  generate: () => Promise<string>;
}

export function GenerativeBlock({ title, icon: Icon, initialContent = "", generate }: GenerativeBlockProps) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generate();
      setContent(result);
      toast({
        title: `${title} Generated`,
        description: "The content has been updated.",
      });
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
  
  // Automatically generate content if there is no initial content
  useState(() => {
    if (!initialContent) {
      handleGenerate();
    }
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Icon className="h-6 w-6 text-accent" />
          {title}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleGenerate} disabled={isLoading} aria-label={`Regenerate ${title}`}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCw className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && !content ? (
           <div className="space-y-2">
            <p className="h-4 w-full animate-pulse rounded-md bg-muted"></p>
            <p className="h-4 w-4/5 animate-pulse rounded-md bg-muted"></p>
            <p className="h-4 w-full animate-pulse rounded-md bg-muted"></p>
           </div>
        ) : (
          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" class="rounded-md border" />') }}></div>
        )}
      </CardContent>
    </Card>
  );
}

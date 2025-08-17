"use client";

import { useState, type ElementType } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Loader2, Sparkles, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GenerativeBlockProps {
  id: string;
  title: string;
  icon: ElementType;
  generate: (userInput: string) => Promise<any>;
  format: (response: any) => string;
  onGenerated: (id: string, title: string, content: string) => void;
}

export function GenerativeBlock({
  id,
  title,
  icon: Icon,
  generate,
  format,
  onGenerated,
}: GenerativeBlockProps) {
  const [modalContent, setModalContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generate(userInput);
      const formattedContent = format(result);
      setModalContent(formattedContent);
      if (!isModalOpen) {
        setIsModalOpen(true);
      }
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
    onGenerated(id, title, modalContent);
    setIsModalOpen(false);
    setUserInput("");
  };

  return (
    <>
      <Card className="flex flex-col justify-center">
        <CardHeader className="flex-row items-center justify-between p-4">
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Icon className="h-5 w-5 text-accent" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleGenerate}
            disabled={isLoading && !isModalOpen}
            size="sm"
            className="w-full"
          >
            {isLoading && !isModalOpen ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate {title}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <Icon className="h-6 w-6 text-accent" />
              Generate {title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Add a specific detail to guide the generation..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="mb-4 text-sm"
              aria-label="Optional user input"
            />
            <div className="relative">
              <Textarea
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
                className="min-h-[250px] bg-muted/50"
                aria-label="Generated content"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSave}><Save className="mr-2" />Add to Notes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

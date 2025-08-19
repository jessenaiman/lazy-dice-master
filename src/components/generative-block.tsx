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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TiptapEditor } from "./tiptap-editor";

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
      <Card
        className="flex flex-col justify-center cursor-pointer group hover:bg-accent/50 transition-colors duration-200"
        onClick={handleGenerate}
      >
        <CardContent className="p-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-200" />
            <h3 className="font-headline text-base group-hover:text-accent-foreground transition-colors duration-200">
              {isLoading && !isModalOpen ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                title
              )}
            </h3>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-full mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl flex items-center gap-2">
              <Icon className="h-6 w-6 text-accent" />
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TiptapEditor
              content={modalContent}
              onChange={setModalContent}
              isLoading={isLoading}
            />
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
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Add to Notes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

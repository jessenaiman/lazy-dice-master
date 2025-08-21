
// src/components/generative-block.tsx
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
import { RefreshCw, Loader2, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TiptapEditor } from "./tiptap-editor";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


interface Option {
    id: string;
    label: string;
    type: 'select' | 'text' | 'textarea';
    values?: string[];
    defaultValue?: string;
    allowCustom?: boolean;
}

interface GenerativeBlockProps {
  id: GeneratedItem['type'];
  title: string;
  icon: ElementType;
  generate: (userInput: string, useCampaignContext: boolean, options: any) => Promise<any>;
  format: (response: any) => string;
  onGenerated: (id: GeneratedItem['type'], title: string, htmlContent: string, rawContent: any) => void;
  options?: Option[];
  isActionable?: boolean;
}

export function GenerativeBlock({
  id,
  title,
  icon: Icon,
  generate,
  format,
  onGenerated,
  options: blockOptions = [],
  isActionable = false,
}: GenerativeBlockProps) {
  const [modalContent, setModalContent] = useState("");
  const [rawContent, setRawContent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [useCampaignContext, setUseCampaignContext] = useState(true);
  const { toast } = useToast();
  
  const [currentOptions, setCurrentOptions] = useState<Record<string, any>>(() => {
    const initialOptions: Record<string, any> = {};
    blockOptions.forEach(opt => {
        initialOptions[opt.id] = opt.defaultValue || (opt.allowCustom ? 'Custom' : opt.values?.[0]);
    });
    return initialOptions;
  });
  const [customOptionValues, setCustomOptionValues] = useState<Record<string, string>>({});


  const handleGenerate = async () => {
    setIsLoading(true);
    setModalContent("");
    setRawContent(null);
    try {
        const finalOptions = {...currentOptions};
        for (const key in finalOptions) {
            if (finalOptions[key] === 'Custom') {
                finalOptions[key] = customOptionValues[key] || '';
            }
        }
      
      const result = await generate(userInput, useCampaignContext, finalOptions);
      const formattedContent = format(result);
      setRawContent(result);
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
    if (rawContent) {
      onGenerated(id, title, modalContent, rawContent);
      setIsModalOpen(false);
      // Reset user input but keep options
      setUserInput("");
    } else {
        toast({
            variant: "destructive",
            title: "No Content to Save",
            description: "Please generate content before saving.",
        });
    }
  };

  const handleOptionChange = (optionId: string, value: string) => {
    setCurrentOptions(prev => ({...prev, [optionId]: value }));
  }
  
  const handleCustomOptionChange = (optionId: string, value: string) => {
    setCustomOptionValues(prev => ({...prev, [optionId]: value }));
  }

  return (
    <>
      <Card
        className="flex flex-col justify-center cursor-pointer group hover:border-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={isActionable ? handleGenerate : undefined}
        aria-disabled={!isActionable}
      >
        <CardContent className="p-4 flex items-center justify-center">
          <div className="flex items-center gap-3 text-center">
            <Icon className="h-5 w-5 text-accent transition-colors duration-200" />
            <h3 className="font-headline text-base text-foreground transition-colors duration-200">
              {isLoading && !isModalOpen ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                title
              )}
            </h3>
             <Sparkles className="h-5 w-5 text-accent/50 group-hover:text-primary transition-colors duration-200" />
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
          <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
             <div className="space-y-4">
                 {blockOptions.map(opt => (
                    <div key={opt.id} className="space-y-2">
                        <Label htmlFor={opt.id}>{opt.label}</Label>
                        {opt.type === 'select' && (
                            <Select onValueChange={(value) => handleOptionChange(opt.id, value)} defaultValue={currentOptions[opt.id]}>
                                <SelectTrigger id={opt.id}>
                                    <SelectValue placeholder={`Select ${opt.label}...`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {opt.values?.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}
                                    {opt.allowCustom && <SelectItem value="Custom">Custom...</SelectItem>}
                                </SelectContent>
                            </Select>
                        )}
                        {opt.allowCustom && currentOptions[opt.id] === 'Custom' && (
                            <Input 
                                placeholder={`Enter custom ${opt.label.toLowerCase()}...`}
                                value={customOptionValues[opt.id] || ''}
                                onChange={(e) => handleCustomOptionChange(opt.id, e.target.value)}
                            />
                        )}
                    </div>
                ))}

                <div className="space-y-2">
                    <Label htmlFor="user-input">Specific Request (Optional)</Label>
                    <Textarea 
                        id="user-input"
                        placeholder="Any additional details or context to guide the AI..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="use-campaign-context" 
                        checked={useCampaignContext}
                        onCheckedChange={(checked) => setUseCampaignContext(Boolean(checked))}
                    />
                    <Label htmlFor="use-campaign-context" className="text-sm font-normal">Use Campaign Context</Label>
                </div>
                
                 <div className="border-t pt-4 mt-4">
                     <TiptapEditor
                        content={modalContent}
                        onChange={setModalContent}
                        isLoading={isLoading}
                        placeholder={`Generated ${title} will appear here...`}
                    />
                 </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between items-center">
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
              <Button onClick={handleSave} disabled={isLoading || !rawContent}><Save className="mr-2 h-4 w-4" />Add to Notes & Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

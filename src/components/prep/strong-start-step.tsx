"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateStrongStart } from "@/ai/flows/generate-strong-start";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface StrongStartStepProps {
  campaignSetting: string;
  playerCharacters: string;
  initialValue: string;
}

export function StrongStartStep({ campaignSetting, playerCharacters, initialValue }: StrongStartStepProps) {
  const [strongStart, setStrongStart] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateStrongStart({ campaignSetting, playerCharacters });
      setStrongStart(result.strongStart);
      toast({
        title: "Strong Start Generated",
        description: "A new opening scene has been created.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Content",
        description: "Could not generate a strong start. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Textarea
          placeholder="Describe the opening scene of the adventure..."
          value={strongStart}
          onChange={(e) => setStrongStart(e.target.value)}
          className="min-h-[150px] mb-4"
          aria-label="Strong Start"
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate with AI
        </Button>
      </CardContent>
    </Card>
  );
}

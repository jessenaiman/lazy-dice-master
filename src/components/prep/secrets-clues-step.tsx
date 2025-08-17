"use client";

import { useState } from "react";
import type { Secret } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { generateSecretsAndClues } from "@/ai/flows/generate-secrets-and-clues";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, PlusCircle, Trash2 } from "lucide-react";

interface SecretsCluesStepProps {
    campaignSetting: string;
    potentialScenes: string;
    characterMotivations: string;
    initialSecrets: Secret[];
}

export function SecretsCluesStep({ campaignSetting, potentialScenes, characterMotivations, initialSecrets }: SecretsCluesStepProps) {
  const [secrets, setSecrets] = useState<Secret[]>(initialSecrets);
  const [newSecret, setNewSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateSecretsAndClues({ 
        campaignSetting, 
        potentialScenes,
        characterMotivations,
        numSecrets: 5,
      });
      const newSecrets = result.secrets.map(s => ({ id: crypto.randomUUID(), text: s, revealed: false }));
      setSecrets(prev => [...prev, ...newSecrets]);
      toast({
        title: "Secrets Generated",
        description: `${result.secrets.length} new secrets and clues have been added.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Secrets",
        description: "Could not generate secrets. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSecret = () => {
    if (newSecret.trim() === "") return;
    setSecrets([...secrets, { id: crypto.randomUUID(), text: newSecret, revealed: false }]);
    setNewSecret("");
  };

  const removeSecret = (id: string) => {
    setSecrets(secrets.filter(s => s.id !== id));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
            {secrets.map((secret) => (
                <div key={secret.id} className="flex items-center gap-2">
                    <Input value={secret.text} readOnly className="flex-grow bg-muted/50" aria-label="Secret or clue"/>
                    <Button variant="ghost" size="icon" onClick={() => removeSecret(secret.id)} aria-label="Remove secret">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
        <div className="flex items-center gap-2">
            <Input 
                placeholder="Add a new secret or clue manually..."
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSecret()}
                aria-label="New secret or clue"
            />
            <Button onClick={addSecret} aria-label="Add secret">
                <PlusCircle className="h-4 w-4" />
            </Button>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate 5 with AI
        </Button>
      </CardContent>
    </Card>
  );
}

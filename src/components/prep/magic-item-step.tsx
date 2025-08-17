"use client";

import { useState } from "react";
import type { MagicItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { generateMagicItemTraits } from "@/ai/flows/generate-magic-item-traits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, PlusCircle, Trash2 } from "lucide-react";

interface MagicItemStepProps {
  initialItems: MagicItem[];
}

export function MagicItemStep({ initialItems }: MagicItemStepProps) {
  const [items, setItems] = useState<MagicItem[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateTraits = async (item: MagicItem) => {
    setLoadingItemId(item.id);
    try {
      const result = await generateMagicItemTraits({
        itemType: item.name,
        numberOfTraits: 3,
      });
      setItems(prevItems =>
        prevItems.map(i =>
          i.id === item.id ? { ...i, traits: [...i.traits, ...result.traits] } : i
        )
      );
      toast({
        title: "Magic Item Traits Generated",
        description: `New traits added to ${item.name}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Traits",
        description: "Could not generate traits. Please try again.",
      });
    } finally {
      setLoadingItemId(null);
    }
  };

  const addItem = () => {
    if (newItemName.trim() === "") return;
    const newItem: MagicItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      description: "",
      traits: [],
    };
    setItems([...items, newItem]);
    setNewItemName("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>
                {item.description || "A mysterious magic item."}
              </CardDescription>
            </div>
             <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Remove item">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent>
            {item.traits.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                {item.traits.map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            )}
            <Button onClick={() => handleGenerateTraits(item)} disabled={loadingItemId === item.id}>
              {loadingItemId === item.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Traits
            </Button>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className="p-6">
            <div className="flex items-center gap-2">
                <Input 
                    placeholder="Add a new magic item..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    aria-label="New magic item name"
                />
                <Button onClick={addItem} aria-label="Add magic item">
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

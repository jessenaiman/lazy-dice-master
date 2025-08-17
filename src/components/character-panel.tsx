import type { PlayerCharacter } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface CharacterPanelProps {
  characters: PlayerCharacter[];
}

export function CharacterPanel({ characters }: CharacterPanelProps) {
  return (
    <div className="sticky top-24">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <User className="h-5 w-5" />
            Characters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {characters.map((char) => (
            <div key={char.id}>
              <h4 className="font-bold">{char.name}</h4>
              <p className="text-sm text-muted-foreground italic">
                "{char.motivation}"
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

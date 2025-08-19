// src/app/library/page.tsx
import { Header } from "@/components/header";
import { mockCampaigns } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function LibraryPage() {
  const campaign = mockCampaigns[0];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight flex items-center gap-3">
            <Library className="h-8 w-8" />
            Lore Library
          </h1>
        </div>
        <p className="text-muted-foreground mb-6">
            Campaign: {campaign.name}
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Session Notes Archive</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Strong Start</TableHead>
                  <TableHead>Secrets & Clues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.sessionPreps.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.id}</TableCell>
                    <TableCell>{session.strongStart.substring(0, 100)}...</TableCell>
                    <TableCell>{session.secrets.length} secrets</TableCell>
                  </TableRow>
                ))}
                {/* Add more rows for a real implementation */}
                 <TableRow>
                    <TableCell className="font-medium text-muted-foreground">session-2 (example)</TableCell>
                    <TableCell className="text-muted-foreground">A mysterious caravan arrives, offering exotic goods but hiding a dark secret...</TableCell>
                    <TableCell className="text-muted-foreground">4 secrets</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell className="font-medium text-muted-foreground">session-3 (example)</TableCell>
                    <TableCell className="text-muted-foreground">A child goes missing from the village, last seen near the old haunted mill...</TableCell>
                    <TableCell className="text-muted-foreground">5 secrets</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

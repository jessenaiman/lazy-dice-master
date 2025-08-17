import Link from "next/link";
import { PlusCircle, Swords, BookOpen, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockCampaigns } from "@/lib/mock-data";
import { Header } from "@/components/header";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            My Campaigns
          </h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center justify-center rounded-md bg-muted/50 overflow-hidden">
                    <Image
                        src="https://placehold.co/600x400.png"
                        alt={`Image for ${campaign.name}`}
                        width={600}
                        height={400}
                        className="object-cover"
                        data-ai-hint="fantasy map"
                    />
                </div>
                <Separator className="my-4" />
                <h3 className="text-sm font-semibold mb-2">Player Characters</h3>
                <div className="flex flex-wrap gap-2">
                    {campaign.characters.map(char => (
                        <div key={char.id} className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs">
                            <Shield className="h-4 w-4 text-accent"/>
                            <span>{char.name}</span>
                        </div>
                    ))}
                </div>

              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link href="/prep">
                    <BookOpen className="mr-2 h-4 w-4" /> Session Prep
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/cockpit">
                    <Swords className="mr-2 h-4 w-4" /> GM's Cockpit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
            <h2 className="font-headline text-2xl mb-2">Want to support the toolkit?</h2>
            <p className="text-muted-foreground mb-4">Help us keep the tools sharp and the servers running.</p>
            <Button variant="secondary" size="lg">Support on Patreon</Button>
        </div>
      </main>
    </div>
  );
}

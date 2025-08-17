import Link from "next/link";
import { BookDashed, Library, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <BookDashed className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-bold">Lazy GM Toolkit</span>
      </Link>
      <nav className="flex-1">
        <ul className="flex items-center justify-end gap-2">
          <li>
            <Button variant="ghost" asChild>
              <Link href="/">
                <Swords className="mr-2 h-4 w-4" />
                Campaigns
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link href="#">
                <Library className="mr-2 h-4 w-4" />
                Library
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/cockpit">
                <Swords className="mr-2 h-4 w-4" />
                Cockpit
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

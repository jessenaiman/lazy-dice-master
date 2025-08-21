
import Link from 'next/link';
import {BookDashed, Library, Swords, Shield, Map as MapIcon, BookOpen} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ThemeToggle} from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6 no-print">
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
                Cockpit
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/campaigns">
                <Shield className="mr-2 h-4 w-4" />
                Campaigns
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/library">
                <Library className="mr-2 h-4 w-4" />
                Lore Library
              </Link>
            </Button>
          </li>
           <li>
            <Button variant="ghost" asChild>
              <Link href="/maps">
                <MapIcon className="mr-2 h-4 w-4" />
                Map Maker
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link href="/resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Resources
              </Link>
            </Button>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}

// src/components/footer.tsx
import Link from 'next/link';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background/80 p-4 backdrop-blur-sm no-print">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          Based on the work of Michael E. Shea. Learn more at{' '}
          <Link href="https://slyflourish.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            slyflourish.com
          </Link>.
        </p>
        <Button asChild>
          <Link href="https://shop.slyflourish.com/products/return-of-the-lazy-dungeon-master" target="_blank" rel="noopener noreferrer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Return of the Lazy Dungeon Master
          </Link>
        </Button>
      </div>
    </footer>
  );
}

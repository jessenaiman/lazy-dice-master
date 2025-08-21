// src/app/resources/page.tsx
import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Resource {
  slug: string;
  title: string;
  html: string;
}

async function getResources(): Promise<Resource[]> {
  const docsDir = path.join(process.cwd(), 'docs', 'lazy_gm');
  const filenames = await fs.readdir(docsDir);

  const markdownFiles = filenames
    .filter((filename) => filename.endsWith('.md') && !filename.startsWith('5e_Monster_Builder'))
    .sort();

  const resources = await Promise.all(
    markdownFiles.map(async (filename) => {
      const filePath = path.join(docsDir, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      
      const match = fileContents.match(/^#\s(.+)/);
      const title = match ? match[1] : filename.replace(/\.md$/, '').replace(/^\d+-/, '').replace(/-/g, ' ');

      const slug = filename.replace(/\.md$/, '');
      const html = marked(fileContents);

      return {
        slug,
        title,
        html,
      };
    })
  );

  return resources;
}

export default async function ResourcesPage() {
    const resources = await getResources();

    return (
    <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex-1 md:grid md:grid-cols-[280px_1fr] md:gap-8 p-4 md:p-8">
            <aside className="hidden md:flex flex-col gap-4">
                 <h2 className="font-headline text-2xl">Contents</h2>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                    <Card>
                        <CardContent className="p-2">
                             <ul className="space-y-1">
                                {resources.map(resource => (
                                    <li key={resource.slug}>
                                        <Link href={`/resources#${resource.slug}`} className="block p-2 text-sm rounded-md hover:bg-muted transition-colors">
                                            {resource.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </ScrollArea>
            </aside>
            <main>
                <ScrollArea className="h-[calc(100vh-10rem)] pr-6">
                    <div className="prose dark:prose-invert max-w-none">
                        {resources.map(resource => (
                        <section key={resource.slug} id={resource.slug} className="mb-12 scroll-mt-20">
                            <div dangerouslySetInnerHTML={{ __html: resource.html }} />
                        </section>
                        ))}
                    </div>
                </ScrollArea>
            </main>
        </div>
        <Footer />
    </div>
    );
}
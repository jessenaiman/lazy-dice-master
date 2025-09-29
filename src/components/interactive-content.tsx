// src/components/interactive-content.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateBookPassage } from "@/ai/flows/generate-bookshelf-contents";
import type { GeneratedItem } from "@/lib/types";

function InteractiveContent({ htmlContent, id }: { htmlContent: string, id: GeneratedItem['type'] }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const [passageLoading, setPassageLoading] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        if (id === 'bookshelf-contents' && contentRef.current) {
            const buttons = contentRef.current.querySelectorAll('.generate-passage-btn');

            const handleClick = async (event: Event) => {
                const button = event.currentTarget as HTMLButtonElement;
                const bookTitle = button.dataset.bookTitle;
                if (!bookTitle) return;

                setPassageLoading(prev => ({ ...prev, [bookTitle]: true }));

                try {
                    const result = await generateBookPassage({ bookTitle });
                    const passageP = document.createElement('p');
                    passageP.className = 'text-sm mt-2 italic border-l-2 pl-2';
                    passageP.innerHTML = result.passage;

                    const parentDiv = button.closest('.book-item');
                    // Remove old passage if it exists
                    const oldPassage = parentDiv?.querySelector('.passage-content');
                    if (oldPassage) {
                        oldPassage.remove();
                    }
                    
                    const passageContainer = document.createElement('div');
                    passageContainer.className = 'passage-content';
                    passageContainer.appendChild(passageP);
                    
                    parentDiv?.appendChild(passageContainer);

                } catch (error) {
                    console.error('Failed to generate passage', error);
                    toast({
                        variant: 'destructive',
                        title: 'Error Generating Passage',
                    });
                } finally {
                     setPassageLoading(prev => ({ ...prev, [bookTitle]: false }));
                }
            };

            buttons.forEach(button => {
                button.addEventListener('click', handleClick);
            });

            return () => {
                buttons.forEach(button => {
                    button.removeEventListener('click', handleClick);
                });
            };
        }
    }, [htmlContent, id, toast]);
    
    // Add loading state to button text
    useEffect(() => {
        if (id === 'bookshelf-contents' && contentRef.current) {
            Object.entries(passageLoading).forEach(([title, isLoading]) => {
                const button = contentRef.current?.querySelector(`button[data-book-title="${title}"]`) as HTMLButtonElement;
                if (button) {
                    button.innerHTML = isLoading ? '<div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>' : 'Read Passage';
                    button.disabled = isLoading;
                }
            });
        }
    }, [passageLoading, htmlContent, id]);


    if (id === 'bookshelf-contents') {
        const contentWithButtons = htmlContent.replace(
            /<div class="book-item mb-4 p-2 border-b">/g,
            `$&<button class="generate-passage-btn text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md mt-2 flex items-center gap-1" data-book-title="$1">Read Passage</button>`
        ).replace(/<strong class="book-title">(.*?)<\/strong>/g, (match, bookTitle) => {
             return `<button class="generate-passage-btn hidden" data-book-title="${bookTitle}"></button><strong class="book-title">${bookTitle}</strong>`;
        });

         const finalHtml = htmlContent.replace(
            /(<strong class="book-title">)([^<]+)(<\/strong>)/g,
            (match, p1, p2, p3) => {
                return `${p1}${p2}${p3}<button class="generate-passage-btn text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md mt-2 flex items-center gap-1" data-book-title="${p2}" aria-label="Read passage for ${p2}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>Read Passage</button>`;
            }
        );
        return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: finalHtml }} />;
    }


    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export { InteractiveContent };
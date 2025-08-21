
// src/app/prep/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSessionPrep, updateSessionPrep, getCampaign } from '@/lib/firebase-service';
import type { SessionPrep, Campaign } from '@/lib/types';
import { Header } from '@/components/header';
import { TiptapEditor } from '@/components/tiptap-editor';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TurndownService from 'turndown';


export default function PrepPage() {
    const [prep, setPrep] = useState<SessionPrep | null>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const id = params.id as string;

    const saveNotes = useCallback(async (notes: string) => {
        if (!id || !prep) return;
        setIsSaving(true);
        try {
            await updateSessionPrep(id, { notes });
            toast({ title: 'Notes Saved!' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Failed to save notes.' });
        } finally {
            setIsSaving(false);
        }
    }, [id, prep, toast]);

    useEffect(() => {
        if (!id) return;
        const fetchPrep = async () => {
            setIsLoading(true);
            const sessionPrep = await getSessionPrep(id);
            setPrep(sessionPrep);
            if (sessionPrep) {
                const associatedCampaign = await getCampaign(sessionPrep.campaignId);
                setCampaign(associatedCampaign);
            }
            setIsLoading(false);
        };
        fetchPrep();
    }, [id]);
    
    const handleNotesChange = (newNotes: string) => {
        if (prep) {
            setPrep({...prep, notes: newNotes});
        }
    };

    const handlePrint = () => {
        if (!prep) return;
        const printWindow = window.open('', '', 'height=800,width=1200');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Session Notes</title>');
            const styles = Array.from(document.styleSheets)
            .map(s => s.href ? `<link rel="stylesheet" href="${s.href}">` : '')
            .join('\n');
            printWindow.document.write(styles);
            printWindow.document.write(`<style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Open+Sans:wght@400;600&display=swap');
            body { 
                font-family: 'Open Sans', sans-serif;
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
            }
            .prose h1, .prose h2, .prose h3 { font-family: 'Cinzel', serif; }
            .prose ul > li::before { 
            content: '⚔️'; 
            margin-right: 0.75em; 
            color: hsl(var(--accent));
            }
            .prose ul > li {
            padding-left: 0 !important;
            text-indent: -1.5em; 
            margin-left: 1.5em;
            }
        </style>`);
        printWindow.document.write('</head><body class="bg-background text-foreground">');
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = prep.notes;
        contentDiv.className = 'prose dark:prose-invert max-w-none p-8';
        printWindow.document.body.appendChild(contentDiv);
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        }
    };

    const saveMarkdown = () => {
        if (!prep) return;
        const turndownService = new TurndownService({ headingStyle: 'atx' });
        const markdown = turndownService.turndown(prep.notes);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `session-notes-${prep.name.replace(/\s/g, '_')}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin"/></div>;
    }

    if (!prep) {
        return <div className="flex h-screen items-center justify-center">Session Prep not found.</div>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <Button variant="outline" onClick={() => router.push('/campaigns')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Campaigns
                    </Button>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button onClick={() => saveNotes(prep.notes)} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                            Save Notes
                        </Button>
                     </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">{prep.name}</CardTitle>
                        <CardDescription>Campaign: {campaign?.name || 'N/A'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TiptapEditor
                            content={prep.notes}
                            onChange={handleNotesChange}
                            placeholder="Start your session prep here..."
                            editable={true}
                        />
                    </CardContent>
                </Card>
            </main>
        </div>
    );

}

// src/components/tiptap-editor.tsx
"use client";

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Bold, Italic, Strikethrough, Code, Pilcrow, List, ListOrdered } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function TiptapEditor({ content, onChange, placeholder, isLoading }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5',
          },
        },
        heading: {
          levels: [2, 3],
          HTMLAttributes: {
            class: 'font-headline text-primary',
          }
        }
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm dark:prose-invert max-w-none font-body',
          'min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
        ),
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editable: !isLoading,
  });
  
  // Update content when the prop changes, but only if it's different from the editor's current state
  // This is important for AI-generated content updates
  if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content);
  }

  if (isLoading) {
    return (
        <div className="space-y-2 rounded-md border border-input p-3 min-h-[250px]">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
        </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
       {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-background border border-border shadow-lg rounded-md p-1 flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><Strikethrough className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} >H2</Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} >H3</Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List className="h-4 w-4"/></Button>
        <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered className="h-4 w-4"/></Button>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  )
}

// src/components/tiptap-editor.tsx
"use client";

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) {
    return null;
  }

  return (
     <div className="border border-input bg-transparent rounded-t-md p-1 flex gap-1">
      <Button variant={editor.isActive('bold') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4"/></Button>
      <Button variant={editor.isActive('italic') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4"/></Button>
      <Button variant={editor.isActive('strike') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4"/></Button>
      <Button variant={editor.isActive('heading', { level: 2 }) ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4"/></Button>
      <Button variant={editor.isActive('heading', { level: 3 }) ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4"/></Button>
      <Button variant={editor.isActive('bulletList') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4"/></Button>
      <Button variant={editor.isActive('orderedList') ? "secondary" : "ghost"} size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4"/></Button>
    </div>
  )
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
          'min-h-[250px] w-full rounded-b-md border border-input bg-background px-3 py-2 text-base ring-offset-background border-t-0',
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

  useEffect(() => {
    if (editor && !editor.isFocused && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);
  

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
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

// admin\src\components\TipTap\Toolbar.tsx
"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, Heading1, Heading2, Heading3, Heading4, Highlighter, Italic, LinkIcon, List, ListOrdered, Redo, Strikethrough, Underline, Undo, } from 'lucide-react';
import { Toggle } from "@/components/TipTap/ui/toggle";

export default function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  
  const setLink = () => {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt("Enter URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setImageWidth = (percent: number) => {
    if (!editor) return;
    editor.chain().focus().updateAttributes('image', { width: `${percent}%`, }).run();
  };
  
  const setCellHeight = () => {
    if (!editor) return;
    
    const height = window.prompt('Enter cell height (px):', '50');
    if (!height) return;
  
    const { from, to } = editor.state.selection;
    let updated = false;
  
    editor.state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
        const currentStyle = node.attrs.style || '';
        const newStyle = currentStyle.replace(/height:\s*\d+px;?/, '') + ` height: ${height}px;`;
        editor.chain().focus().setNodeSelection(pos).updateAttributes(node.type.name, { style: newStyle.trim() }).run();
        updated = true;
      }
    });

    if (!updated) {
      alert('Please select a table cell first');
    }
  };

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1}).run(),
      pressed: editor.isActive("heading", { level: 1}),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2}).run(),
      pressed: editor.isActive("heading", { level: 2}),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3}).run(),
      pressed: editor.isActive("heading", { level: 3}),
    },
    {
      icon: <Heading4 className="size-4" />,
      onclick: () => editor.chain().focus().toggleHeading({ level: 4}).run(),
      pressed: editor.isActive("heading", { level: 4}),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Underline className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("underline"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      pressed: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      pressed: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      pressed: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <AlignJustify className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      pressed: editor.isActive({ textAlign: 'justify' }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
    {
      icon: <Undo className="size-4" />,
      onClick: () => editor.chain().focus().undo().run(),
      pressed: false,
    },
    {
      icon: <Redo className="size-4" />,
      onClick: () => editor.chain().focus().redo().run(),
      pressed: false,
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("codeBlock"),
    },
    {
      icon: <LinkIcon className="size-4" />,
      onClick: setLink,
      pressed: editor.isActive("link"),
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-1bg-slate-50 space-x-2 z-50">
      {Options.map((option, index) => (
        <Toggle key={index} pressed={option.pressed} onPressedChange={option.onClick} >
          {option.icon}
        </Toggle>
      ))}

      <button type="button" onClick={setCellHeight}>Set Cell Height</button>

      <input
        type="number"
        min={10}
        max={100}
        placeholder="width %"
        className="w-16 border px-1 text-sm"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();     // ⬅ stops form submit
            e.stopPropagation();    // ⬅ stops bubbling
            const value = Number((e.target as HTMLInputElement).value);
            if (value >= 10 && value <= 100) { setImageWidth(value); }
          }
        }}
      />
    </div>
  );
}

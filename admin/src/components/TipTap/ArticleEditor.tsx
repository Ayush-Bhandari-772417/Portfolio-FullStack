// admin\src\components\TipTap\ArticleEditor.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
// Core
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Mathematics from '@tiptap/extension-mathematics';
// Tables
import {Table} from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
// Custom extensions
import Toolbar from './Toolbar';
import { Reference } from './extensions/Reference';
import { Caption, Figure, LabeledTable, Equation } from './extensions';
import { AutoNumbering, autoNumberingPluginKey } from './extensions/AutoNumbering';
import { CaptionPlaceholderExtension } from './extensions/CaptionPlaceholderExtension';
import { CustomTableCell } from './extensions/CustomTableCell';
import { uploadEditorImage } from './utils/editorImageUpload';
import { handleImagePaste } from './utils/handleImagePaste';
import { Image } from './extensions/Image';

export default function ArticleEditor({ valueJSON, valueHTML, onChange }: any) {
  const [refMenuOpen, setRefMenuOpen] = React.useState(false);
  const isInitialized = useRef(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: { HTMLAttributes: { class: 'list-disc ml-3' }, },
        orderedList: { HTMLAttributes: { class: 'list-decimal ml-3' }, },
        link: { openOnClick: false, },
      }),
      Image,      // ✅ your custom image
      Caption,    // ✅ caption
      Figure,     // ✅ figure
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ HTMLAttributes: { class: 'hover:bg-red-200' } }),
      Link.configure({ openOnClick: true, linkOnPaste: true }),
      Mathematics.configure({
        // Optional: configure KaTeX
        katexOptions: {
          throwOnError: false,
        },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      CustomTableCell,
      TableHeader,
      LabeledTable,
      Equation,
      Reference,
      AutoNumbering,
      CaptionPlaceholderExtension,
    ],

    content: valueHTML || '<p></p>',
    immediatelyRender: false,

    onUpdate: ({ editor }) => { onChange(editor.getJSON(), editor.getHTML()); },

    editorProps: {
      attributes: { class: 'min-h-[150px] border rounded-md bg-slate-50 py-2 px-3 prose max-w-none', },
      handlePaste(view, event) {
        return handleImagePaste(view, event as ClipboardEvent);
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files || []);
        const image = files.find(file => file.type.startsWith('image/'));
        if (!image) return false;
        event.preventDefault();
        
        uploadEditorImage(image).then(relativePath => {
          const absoluteUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${relativePath}`;
          const node = view.state.schema.nodes.image.create({ src: absoluteUrl });
          view.dispatch(view.state.tr.replaceSelectionWith(node));
        });
        return true;
      },
    },
  });

  const referenceOptions = React.useMemo(() => {
    if (!editor) return [];
    const refs: {
      id: string;
      label: string;
    }[] = [];
    editor.state.doc.descendants((node) => {
      if ( node.type.name === "figure" || node.type.name === "labeledTable" || node.type.name === "equation" ) {
        if (!node.attrs.refId || !node.attrs.label) return;
        refs.push({ id: node.attrs.refId, label: node.attrs.label, });
      }
    });
    return refs;
  }, [editor, editor?.state]);

  // Load JSON from server and trigger auto-numbering
  useEffect(() => {
    if (!editor) return;
    if (isInitialized.current) return;
    if (!valueJSON) return;

    const json = structuredClone(valueJSON);
    
    const SUPABASE_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/media/";
    
    function rebuild(node: any) {
      if (!node) return;
      if (node.type === "image" && node.attrs?.origin === "uploaded") {
        const src = node.attrs.src;
        // If stored as relative → rebuild
        if (src && !src.startsWith("http")) {
          node.attrs.src = SUPABASE_BASE + src;
        }
      }
      
      if (node.content) {
        node.content.forEach(rebuild);
      }
    }
    rebuild(json);
    editor.commands.setContent(json);
    const tr = editor.state.tr;
    tr.setMeta(autoNumberingPluginKey, "renumber");
    editor.view.dispatch(tr);
    isInitialized.current = true;
  }, [editor, valueJSON]);

  // Insert Figure
  const insertFigure = () => {
    const src = window.prompt('Image URL:');
    if (!src) return;
    const caption = window.prompt('Caption:') || '';
    const label = `fig-${Date.now()}`; // simple unique ID for now
    editor?.chain().focus().insertFigure({ src, caption, label }).run();
  };

  // Insert Table
  const insertTable = () => {
    const rows = Number(window.prompt('Rows:', '3') || 3);
    const cols = Number(window.prompt('Cols:', '3') || 3);
    const caption = window.prompt('Caption:') || '';
    const label = `tbl-${Date.now()}`; // simple unique ID for now
    editor?.chain().focus().insertLabeledTable({ rows, cols, caption, label }).run();
  };

  // Insert Equation
  const insertEquation = () => {
    const latex = window.prompt('LaTeX source:');
    if (!latex) return;
    const caption = window.prompt('Caption:') || '';
    const label = `eq-${Date.now()}`; // simple unique ID for now
    editor?.chain().focus().insertEquation({ latex, caption, label }).run();
  };
  
  // Edit caption for current selection
  const editCaption = () => {
    const { from, to } = editor!.state.selection;
    let found = false;
    editor!.state.doc.nodesBetween(from, to, (node) => {
      if (found) return;
      if (['figure', 'labeledTable', 'equation'].includes(node.type.name)) {
        const existing = node.textContent || '';
        const newCaption = window.prompt('New caption:', existing) || '';
        if (node.type.name === 'figure')
          editor?.chain().focus().setFigureCaption(newCaption).run();
        if (node.type.name === 'labeledTable')
          editor?.chain().focus().setTableCaption(newCaption).run();
        if (node.type.name === 'equation')
          editor?.chain().focus().setEquationCaption(newCaption).run();
        found = true;
      }
    });
    if (!found) alert('Select a figure/table/equation');
  };

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <button type="button" onClick={insertEquation}>Insert Equation</button>
        <button type="button" onClick={insertTable}>Insert Table</button>
        <button type="button" onClick={insertFigure}>Insert Figure</button>
        <button type="button" onClick={editCaption}>Edit Caption</button>
        <div className="relative">
          <button type="button" onClick={() => setRefMenuOpen((v) => !v)} >
            Insert Reference
          </button>
          {refMenuOpen && (
            <div className="absolute bg-white border shadow z-50 mt-1">
              {referenceOptions.length === 0 && (
                <div className="p-2 text-sm text-gray-500">
                  No references available
                </div>
              )}
              {referenceOptions.map((ref) => (
                <div
                  key={ref.id}
                  className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    editor?.chain().focus().insertReference(ref.id, ref.label).run();
                    setRefMenuOpen(false);
                  }}
                >
                  {ref.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="bg-white p-4 border rounded" />
    </div>
  );
}

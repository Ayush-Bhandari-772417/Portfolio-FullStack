// admin\src\components\TipTap\extensions\CaptionPlaceholderExtension.ts
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

const captionPlaceholderKey = new PluginKey('captionPlaceholder');

export const CaptionPlaceholderExtension = Extension.create({
  name: 'captionPlaceholder',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: captionPlaceholderKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name !== 'caption') return;

              const isEmpty = node.content.size === 0 || (node.textContent.trim().length === 0);
              if (!isEmpty) return;
              
              const $pos = state.doc.resolve(pos);
              const parent = $pos.parent;
              let placeholder = 'Enter caption here';

              if (parent.type.name === 'figure') { placeholder = 'Enter figure caption'; }
              if (parent.type.name === 'labeledTable') { placeholder = 'Enter table caption'; }
              if (parent.type.name === 'equation') { placeholder = 'Enter equation caption'; }
              
              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: 'caption-placeholder',
                  'data-placeholder': placeholder,
                })
              );
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});

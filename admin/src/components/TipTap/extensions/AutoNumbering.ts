// admin\src\components\TipTap\extensions\AutoNumbering.ts
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Extension } from '@tiptap/core';

export const autoNumberingPluginKey = new PluginKey('autoNumbering');

export const AutoNumbering = Extension.create({
  name: 'autoNumbering',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: autoNumberingPluginKey,
        // appendTransaction so we can modify doc after other transactions
        appendTransaction: (transactions, oldState, newState): Transaction | null => {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) return null;

          const tr = newState.tr;
          let changed = false;

          let figCount = 1;
          let tableCount = 1;
          let eqCount = 1;

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'figure') {
              const newRefId = `fig-${figCount}`;
              const newLabel = `Figure ${figCount}`;

              if (node.attrs.refId !== newRefId || node.attrs.label !== newLabel) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, refId: newRefId, label: newLabel });
                changed = true;
              }
              figCount++;
            }

            if (node.type.name === 'labeledTable') {
              const newRefId = `tbl-${tableCount}`;
              const newLabel = `Table ${tableCount}`;

              if (node.attrs.refId !== newRefId || node.attrs.label !== newLabel) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, refId: newRefId, label: newLabel });
                changed = true;
              }
              tableCount++;
            }

            if (node.type.name === 'equation') {
              const newRefId = `eq-${eqCount}`;
              const newLabel = `Equation ${eqCount}`;

              if (node.attrs.refId !== newRefId || node.attrs.label !== newLabel) {
                tr.setNodeMarkup(pos, undefined, { ...node.attrs, refId: newRefId, label: newLabel });
                changed = true;
              }
              eqCount++;
            }
          });

          return changed ? tr : null;
        },
      }),
    ];
  },
});

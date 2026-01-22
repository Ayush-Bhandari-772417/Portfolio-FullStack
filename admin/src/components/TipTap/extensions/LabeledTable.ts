// admin\src\components\TipTap\extensions\LabeledTable.ts
import { Node, mergeAttributes } from '@tiptap/core';

// 1. Extend Tiptap commands
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    labeledTable: {
      insertLabeledTable: (options: { rows: number; cols: number; caption?: string; label?: string }) => ReturnType;
      setTableCaption: (caption: string) => ReturnType;
    };
  }
}

export const LabeledTable = Node.create({
  name: 'labeledTable',
  group: 'block',
  content: 'table caption?', // must have exactly one table + optional caption
  isolating: true,
  selectable: true,

  addAttributes() {
    return {
      label: { default: '' },
      refId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-labeled-table]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        HTMLAttributes,
        {
          'data-labeled-table': '',
          'data-label': node.attrs.label || '',
          'data-ref-id': node.attrs.refId || '',
        }
      ),
      0, // content will include table + caption
    ];
  },

  addCommands() {
    return {
      insertLabeledTable:
        ({ rows, cols, caption = '', label = '' }) =>
          ({ chain, state }) => {
            const { schema } = state;

            // Build table rows/cells
            // build table rows properly
            const tableRows = [...Array(rows)].map(() => {
              const cells = [...Array(cols)].map(() =>
                schema.node('tableCell', {}, [schema.node('paragraph')])
              );
              return schema.node('tableRow', {}, cells);
            });

            // now table node
            const tableNode = schema.node('table', {}, tableRows);

            // caption node
            const captionNode = schema.node('caption', {}, caption ? [schema.text(caption)] : []);
            
            // labeledTable node
            const labeledTableNode = schema.node('labeledTable', { label }, [tableNode, captionNode]);

            return chain().focus().insertContent(labeledTableNode).run();
          },

      setTableCaption:
        (caption: string) =>
          ({ state, tr, dispatch }) => {
            const { from, to } = state.selection;
            const schema = state.schema;
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (node.type.name === 'labeledTable') {
                // Ensure the node has at least 2 children: table + caption
                if (node.childCount < 2) return;
                const tableNode = node.child(0); // first child is the table
                const captionNode = node.child(1); // second child is the caption
                // Build new caption node
                const newCaptionNode = schema.node( 'caption', {}, caption ? [schema.text(caption)] : []);

                // Replace old caption with new one
                const captionPosStart = pos + tableNode.nodeSize;
                const captionPosEnd = captionPosStart + captionNode.nodeSize;
                
                tr.replaceWith(captionPosStart, captionPosEnd, newCaptionNode);
              }
            });
            if (dispatch) dispatch(tr);
            return true;
          },
    };
  },
});

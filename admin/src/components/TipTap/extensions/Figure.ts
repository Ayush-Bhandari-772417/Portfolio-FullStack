// admin\src\components\TipTap\extensions\Figure.ts
import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      insertFigure: (options: { src: string; caption?: string; label?: string }) => ReturnType;
      setFigureCaption: (caption: string) => ReturnType;
    };
  }
}

export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'image caption',
  isolating: true,

  addAttributes() {
    return {
      src: { default: '' },
      label: { default: '' },  // auto-generated, never edited by user
      refId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-figure]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(HTMLAttributes, {
        'data-figure': '',
        'data-src': node.attrs.src,
        'data-label': node.attrs.label,
        'data-ref-id': node.attrs.refId || '',
      }),
      ['img', { src: node.attrs.src }],
      ['figcaption', 0],
    ];
  },

  addCommands() {
    return {
      insertFigure:
        ({ src, caption = '', label = '' }) =>
        ({ chain }) => {
          return chain().insertContent({
            type: 'figure',
            attrs: { src, label },
            content: [
              { type: 'image', attrs: { src } },
              { type: 'caption', content: caption ? [{ type: 'text', text: caption }] : [] },
            ],
          }).run();
        },

      setFigureCaption:
        (caption: string) =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection;
          const schema = state.schema;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name === 'figure') {
              const captionNode = schema.nodeFromJSON({
                type: 'caption',
                content: [{ type: 'text', text: caption }],
              });
              const start = pos + 1; // first child
              const end = pos + node.nodeSize - 1; // end of content
              tr.replaceWith(start, end, captionNode);
            }
          });
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});

// admin\src\components\TipTap\extensions\Equation.ts
import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    equation: {
      insertEquation: (options: { latex: string; caption?: string; label?: string; }) => ReturnType;
      setEquationCaption: (caption: string) => ReturnType;
    };
  }
}

export const Equation = Node.create({
  name: 'equation',
  group: 'block',
  content: 'paragraph caption?',
  isolating: true,
  selectable: true,

  addAttributes() {
    return {
      label: { default: '' },
      refId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-equation]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-equation': '',
        'data-label': node.attrs.label || '',
        'data-ref-id': node.attrs.refId || '',
        class: 'equation-block',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertEquation:
        ({ latex, caption = '', label = '' }) =>
          ({ chain, state }) => {
            const { schema } = state;
            const latexNode = schema.node( 'paragraph', {}, latex ? [schema.text(latex)] : [], );
            const captionNode = schema.node( 'caption', {}, caption ? [schema.text(caption)] : [], );
            const equationNode = schema.node( 'equation', { label }, caption ? [latexNode, captionNode] : [latexNode], );

            return chain().focus().insertContent(equationNode).run();
          },

      setEquationCaption:
        (caption: string) =>
          ({ state, tr, dispatch }) => {
            const { from, to } = state.selection;
            const { schema } = state;
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (node.type.name !== 'equation') return;
              // Must have at least a paragraph
              if (node.childCount === 0) return;
              const latexNode = node.child(0);
              const oldCaptionNode = node.childCount > 1 ? node.child(1) : null;
              const newCaptionNode = schema.node( 'caption', {}, caption ? [schema.text(caption)] : [], );
              const captionStart = pos + latexNode.nodeSize;
              const captionEnd = oldCaptionNode ? captionStart + oldCaptionNode.nodeSize : captionStart;

              tr.replaceWith(captionStart, captionEnd, newCaptionNode);
            });
            if (dispatch) dispatch(tr);
            return true;
          },
    };
  },
});

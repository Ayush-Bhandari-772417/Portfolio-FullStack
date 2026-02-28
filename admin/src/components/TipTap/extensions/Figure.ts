// admin\src\components\TipTap\extensions\Figure.ts
import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      insertFigure: (options: {
        src: string;
        caption?: string;
        label?: string;
        origin?: "external" | "uploaded";
        width?: number;
      }) => ReturnType;

      setFigureCaption: (caption: string) => ReturnType;
    };
  }
}

export const Figure = Node.create({
  name: "figure",
  group: "block",
  content: "image caption",
  isolating: true,

  addAttributes() {
    return {
      label: { default: "", },
      refId: { default: null, },
    };
  },

  parseHTML() {
    return [
      { tag: "figure[data-figure]", },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-figure": "",
        "data-label": node.attrs.label,
        "data-ref-id": node.attrs.refId || "",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertFigure:
        ({ src, caption = "", label = "", origin = "external", width = 100, }) =>
          ({ chain }) => {
            return chain()
              .insertContent({
                type: "figure",
                attrs: { label, },
                content: [
                {
                  type: "image",
                  attrs: { src, origin, width, },
                },
                {
                  type: "caption",
                  content: caption
                    ? [
                        {
                          type: "text",
                          text: caption,
                        },
                      ]
                    : [],
                },
              ],
            })
            .run();
        },

      setFigureCaption:
        (caption: string) =>
        ({ state, tr, dispatch }) => {
          const { from, to } = state.selection;
          const schema = state.schema;
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (node.type.name !== "figure") return;

            const captionNode = schema.nodes.caption.create(
              {},
              caption
                ? schema.text(caption)
                : null
            );

            const start = pos + 1;
            const end = pos + node.nodeSize - 1;

            tr.replaceWith(start, end, captionNode);
          });
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});

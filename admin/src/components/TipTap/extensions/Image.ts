// admin\src\components\TipTap\extensions\Image.ts
import { Node, mergeAttributes } from "@tiptap/core";

export const Image = Node.create({
  name: "image",
  group: "block",
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null, },
      origin: { default: "external", },
      width: { default: 100, },
    };
  },

  parseHTML() {
    return [
      { tag: "img", },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...rest } = HTMLAttributes;

    return [
      "img",
      mergeAttributes(rest, {
        style: `width:${width}%; height:auto; display:block; margin:auto;`,
      }),
    ];
  },
});

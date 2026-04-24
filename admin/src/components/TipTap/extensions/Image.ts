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
    const { width, src, origin, ...rest } = HTMLAttributes;
    const fullSrc = origin === "uploaded" && src ? `${process.env.NEXT_PUBLIC_MEDIA_URL || 'https://whhdkzesrfkmtrsmfcut.supabase.co/storage/v1/object/public/media/'}${src}` : src;
    return [
      "img",
      mergeAttributes({ src: fullSrc, ...rest }, {
        style: `width:${width}%; height:auto; display:block; margin:auto;`,
      }),
    ];
  },
});
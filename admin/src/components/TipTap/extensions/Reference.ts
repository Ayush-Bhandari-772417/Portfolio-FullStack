// admin\src\components\TipTap\extensions\Reference.ts
import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    reference: {
      insertReference: (targetId: string, text: string) => ReturnType;
    };
  }
}

export const Reference = Node.create({
  name: "reference",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      target: { default: null },
      text: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-ref]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-ref": HTMLAttributes.target,
        class: "reference-link text-blue-600 underline cursor-pointer",
      }),
      `[${HTMLAttributes.text}]`,
    ];
  },

  addCommands() {
    return {
      insertReference:
        (targetId: string, text: string) =>
          ({ chain }) => {
            return chain().focus().insertContent({ type: this.name, attrs: { target: targetId, text }, }).run();
          },
    };
  },
});

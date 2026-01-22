// admin\src\components\TipTap\utils\getReferences.ts
import { Editor } from "@tiptap/react";

export type ReferenceItem = {
  id: string;
  label: string;
  type: "Figure" | "Table" | "Equation";
};

export function getReferences(editor: Editor): ReferenceItem[] {
  const refs: ReferenceItem[] = [];

  editor.state.doc.descendants((node) => {
    if (
      node.type.name === "figure" ||
      node.type.name === "labeledTable" ||
      node.type.name === "equation"
    ) {
      if (!node.attrs.refId || !node.attrs.label) return;

      const type =
        node.type.name === "figure"
          ? "Figure"
          : node.type.name === "labeledTable"
          ? "Table"
          : "Equation";

      refs.push({
        id: node.attrs.refId,
        label: node.attrs.label,
        type,
      });
    }
  });

  return refs;
}

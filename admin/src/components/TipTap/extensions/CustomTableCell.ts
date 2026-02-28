// admin\src\components\TipTap\extensions\CustomTableCell.ts
import TableCell from '@tiptap/extension-table-cell';

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style,
          };
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style');
          const match = style?.match(/height:\s*(\d+)px/);
          return match ? match[1] : null;
        },
        renderHTML: attributes => {
          if (!attributes.height) {
            return {};
          }
          return {
            style: `height: ${attributes.height}px`,
          };
        },
      },
    };
  },
});
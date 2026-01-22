// admin\src\components\TipTap\extensions\Caption.ts
import { Node } from '@tiptap/core';

export const Caption = Node.create({
  name: 'caption',
  content: 'inline*',
  isolating: true,

  parseHTML() {
    return [{ tag: 'figcaption' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figcaption',
      {
        ...HTMLAttributes,
        'data-caption': '',
      },
      0,
    ];
  },
});

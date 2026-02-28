// admin\src\components\TipTap\handlers\pasteHandler.ts
import { uploadEditorImage } from '@/services/editorImageUpload';

export function handleImagePaste(editor: any) {
  return (view: any, event: ClipboardEvent) => {
    const item = Array.from(event.clipboardData?.items || [])
      .find(i => i.type.startsWith('image/'));

    if (!item) return false;

    event.preventDefault();

    const file = item.getAsFile();
    if (!file) return false;

    uploadEditorImage(file).then((path) => {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'figure',
          content: [
            {
              type: 'image',
              attrs: {
                src: path,
                origin: 'uploaded',
              },
            },
            {
              type: 'caption',
              content: [],
            },
          ],
        })
        .run();
    });

    return true;
  };
}

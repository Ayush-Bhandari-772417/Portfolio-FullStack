// admin\src\components\TipTap\utils\handleImagePaste.ts
import { EditorView } from 'prosemirror-view';
import { uploadEditorImage } from './editorImageUpload';

export function handleImagePaste(view: EditorView, event: ClipboardEvent): boolean {
  const items = Array.from(event.clipboardData?.items || []);
  const imageItem = items.find(i => i.type.startsWith('image/'));

  if (!imageItem) return false;

  event.preventDefault();

  const file = imageItem.getAsFile();
  if (!file) return false;

  uploadEditorImage(file)
    .then(relativePath => {

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${relativePath}`;

      const { state, dispatch } = view;

      const figure = state.schema.nodes.figure.create(
        {},
        [
          state.schema.nodes.image.create({
            src: url,
            origin: "uploaded",
            width: 100,
          }),

          state.schema.nodes.caption.create(),
        ]
      );

      dispatch(state.tr.replaceSelectionWith(figure));
    })
    .catch(console.error);

  return true;
}

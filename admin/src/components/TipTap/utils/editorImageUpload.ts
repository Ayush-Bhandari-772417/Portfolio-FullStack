// admin\src\components\TipTap\utils\editorImageUpload.ts
import { supabase } from '@/lib/supabase';

export async function uploadEditorImage(file: File): Promise<string> {
  const id = crypto.randomUUID(); // ✅ native
  const fileName = `${id}_${file.name}`;
  const relativePath = `media/editor/${fileName}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(`editor/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }

  // IMPORTANT: return RELATIVE PATH ONLY
  return relativePath;
}

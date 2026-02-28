// admin\src\services\editorImageUpload.ts
import { supabase } from '@/lib/supabase';
import { v4 as uuid } from 'uuid';

export async function uploadEditorImage(file: File): Promise<string> {
  const fileName = `${uuid()}_${file.name}`;
  const path = `media/editor/${fileName}`;

  const { error } = await supabase.storage
    .from('media')
    .upload(`editor/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // ⚠️ RETURN RELATIVE PATH ONLY
  return path;
}

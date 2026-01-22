// admin\src\components\TipTap\extensions\uploadImage.ts
import api from "@/lib/axios";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await api.post('/upload-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.url;
}

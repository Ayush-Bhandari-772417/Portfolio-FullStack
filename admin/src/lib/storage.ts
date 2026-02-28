// admin\src\lib\storage.ts
export const STORAGE_CONFIG = {
  publicBaseUrl: import.meta.env.VITE_STORAGE_PUBLIC_BASE,
  editorPrefix: 'media/editor',
  featurePrefix: 'media/feature_images',
};

export type AssetOrigin = 'uploaded' | 'external';

export function resolveAssetUrl(
  src: string,
  origin: AssetOrigin
): string {
  if (!src) return '';
  if (origin === 'external') return src;
  return `${STORAGE_CONFIG.publicBaseUrl}/${src}`;
}

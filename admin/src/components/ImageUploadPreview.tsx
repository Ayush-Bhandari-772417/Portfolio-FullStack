// admin\src\components\ImageUploadPreview.tsx
'use client';

import { useState, useEffect } from "react";
import { FiUploadCloud, FiX, FiFileText } from "react-icons/fi";

// ========================
// 1. Single Image Upload (Featured Image)
// ========================
interface SingleImageUploadProps {
  label?: string;
  currentImageUrl?: string | null;
  currentImageName?: string | null;
  onFileChange: (file: File | null) => void;
  className?: string;
}

export function SingleImageUpload({
  label = "Featured Image",
  currentImageUrl,
  currentImageName,
  onFileChange,
  className = "",
}: SingleImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [fileName, setFileName] = useState<string | null>(currentImageName || null);

  useEffect(() => {
    setPreview(currentImageUrl || null);
    setFileName(currentImageName || null);
  }, [currentImageUrl, currentImageName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    onFileChange(null);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      {preview ? (
        <div className="relative inline-block group">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg border" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-600 mt-2 truncate max-w-full">{fileName}</p>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <FiUploadCloud className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-sm text-gray-600">Click to upload image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleChange} />
        </label>
      )}
    </div>
  );
}

// ========================
// 2. Multiple Image Gallery Upload
// ========================

interface GalleryImage {
  id?: number | string;
  image_url: string;
  caption?: string;
}

export function GalleryImageUpload({
  label = "Project Gallery",
  existingImages = [],  // now: array of { id, image_url, caption }
  onFilesChange,
  onRemoveExisting,
  onCaptionChange,
  maxFiles = 15,
  className = "",
}: {
  label?: string;
  existingImages: GalleryImage[];
  onFilesChange: (files: File[]) => void;
  onRemoveExisting?: (id: number | string) => void;
  onCaptionChange?: (id: number | string, caption: string) => void;
  maxFiles?: number;
  className?: string;
}) {
  const [previews, setPreviews] = useState<(GalleryImage & { file?: File; tempId?: string })[]>([]);

  useEffect(() => {
    setPreviews(existingImages.map(img => ({ ...img, file: undefined })));
  }, [existingImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews = Array.from(files).map(file => ({
      id: undefined,
      image_url: URL.createObjectURL(file),
      caption: "",
      file,
      tempId: `temp-${Date.now()}-${Math.random()}`, // unique key
    }));

    const updated = [...previews.filter(p => p.id), ...newPreviews].slice(0, maxFiles);
    setPreviews(updated);

    const newFiles = updated.filter(p => p.file).map(p => p.file!);
    onFilesChange(newFiles);
  };

  const removeImage = (index: number) => {
    const item = previews[index];
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (item.file) URL.revokeObjectURL(item.image_url);
    if (item.id && onRemoveExisting) onRemoveExisting(item.id);
    const newFiles = updated.filter(p => p.file).map(p => p.file!);
    onFilesChange(newFiles);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {previews.map((img, i) => (
          <div key={img.id || img.tempId} className="relative group">
            <img
              src={img.image_url}
              alt={img.caption || "Gallery"}
              className="w-full h-40 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
            >
              <FiX className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Caption (optional)"
              value={img.caption || ""}
              onChange={(e) => {
                const updated = [...previews];
                updated[i].caption = e.target.value;
                setPreviews(updated);
                if (onCaptionChange && img.id) { onCaptionChange(img.id, e.target.value); }
              }}
              className="w-full text-xs mt-2 px-2 py-1 border rounded"
            />
          </div>
        ))}
      </div>

      {previews.length < maxFiles && (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <FiUploadCloud className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">Add images ({previews.length}/{maxFiles})</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}

// ========================
// 3. Single PDF Upload (Eg. CV File)
// ========================

interface SingleFileUploadProps {
  label?: string;
  accept?: string; // e.g. ".pdf"
  currentFileUrl?: string | null;
  currentFileName?: string | null;
  onFileChange: (file: File | null) => void;
  className?: string;
}

export function SingleFileUpload({
  label = "Upload File",
  accept = ".pdf",
  currentFileUrl,
  currentFileName,
  onFileChange,
  className = "",
}: SingleFileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(currentFileName || null);

  useEffect(() => {
    setFileName(currentFileName || null);
  }, [currentFileName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleRemove = () => {
    setFileName(null);
    onFileChange(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {fileName ? (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-3">
            <FiFileText className="w-6 h-6 text-gray-500" />
            <div className="text-sm">
              <p className="font-medium truncate max-w-xs">{fileName}</p>
              {currentFileUrl && (
                <a
                  href={currentFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs"
                >
                  View current file
                </a>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <FiUploadCloud className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600">
            Click to upload file
          </span>
          <span className="text-xs text-gray-400">
            Accepted: {accept}
          </span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
        </label>
      )}
    </div>
  );
}

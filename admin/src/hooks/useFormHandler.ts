// aadmin\src\hooks\useFormHandler.ts
import { useState, useEffect } from "react";

export function useFormHandler<T extends Record<string, any>>(
  initialValues: T,
  editingData?: T
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"add" | "edit">("add");

  // Handle edit mode (auto-load)
  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
      setMode("edit");
    } else {
      setFormData(initialValues);
      setMode("add");
    }
  }, [editingData]);

  // Generic text, textarea, select input handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, type } = target as HTMLInputElement;

    let value: any = target.value;

    if (type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Special handler for comma-separated array fields
  const handleArrayChange = (field: keyof T, textValue: string) => {
    const arrayValue = textValue
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    setFormData(prev => ({
      ...prev,
      [field]: arrayValue,
    }));
  };

  // Special handler for files
  const handleFileChange = (field: keyof T, files: FileList | null) => {
    if (!files) return;

    const fileValue =
      files.length === 1 ? files[0] : Array.from(files);

    setFormData(prev => ({
      ...prev,
      [field]: fileValue,
    }));
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setMode("add");
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    mode,
    handleChange,
    handleArrayChange,
    handleFileChange,
    resetForm,
  };
}

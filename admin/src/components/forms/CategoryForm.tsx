// admin\src\components\forms\CategoryForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, TextInput } from "@/components/Inputs"

interface Category {
  id?: number;
  name: string;
  is_public: boolean;
}

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SkillForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Category>(
    {
      name: "",
      is_public: false,
    },
    category ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      name: formData.name || "",
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && category?.id) {
        await api.put(`/categorys/${category.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/categorys/`, payload);
        toast.success("Created successfully.");
      }

      onSuccess();
      history.replaceState(null, "", window.location.pathname);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection>
          <TextInput label="Name *" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

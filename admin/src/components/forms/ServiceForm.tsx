// admin\src\components\forms\ServiceForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, TextInput } from "@/components/Inputs"

interface Service {
  id?: number;
  title: string;
  description: string;
  icon: string;
  is_public: boolean;
}

interface ServiceFormProps {
  service?: Service | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Service>(
    {
      title: "",
      description: "",
      icon: "",
      is_public: false,
    },
    service ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    if (!formData.icon.trim()) newErrors.icon = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      title: formData.title || "",
      description: formData.description || "",
      icon: formData.icon || "",
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && service?.id) {
        await api.put(`/services/${service.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/services/`, payload);
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
          <TextInput label="Title *" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
          <TextInput label="Description *" name="description" value={formData.description} onChange={handleChange} error={errors.description} />
          <TextInput label="Icon" name="icon" value={formData.icon} onChange={handleChange} error={errors.icon} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

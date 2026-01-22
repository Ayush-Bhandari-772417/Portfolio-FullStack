// admin\src\components\forms\SettingForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, SelectInput, TextInput } from "@/components/Inputs"

interface Setting {
  id?: number;
  type: string;
  key: string;
  value: string;
  description: string | null;
  is_public: boolean;
}

interface SettingFormProps {
  setting?: Setting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SettingForm({ setting, onSuccess, onCancel }: SettingFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Setting>(
    {
      type: "",
      key: "",
      value: "",
      description: "",
      is_public: false,
    },
    setting ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.type.trim()) newErrors.type = "Required";
    if (!formData.key.trim()) newErrors.key = "Required";
    if (!formData.value.trim()) newErrors.value = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      type: formData.type || "",
      key: formData.key || "",
      value: formData.value || "",
      description: formData.description || "",
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && setting?.id) {
        await api.put(`/settings/${setting.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/settings/`, payload);
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
          <SelectInput
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={{
              text: "Text",
              textarea: "Textarea",
              boolean: "Boolean",
              number: "Number",
              color: "Color",
            }}
            error={errors.type}
          />
          <TextInput label="Key *" name="key" value={formData.key} onChange={handleChange} error={errors.key} />
          <TextInput label="Value *" name="value" value={formData.value} onChange={handleChange} error={errors.value} />
          <TextInput label="Description *" name="description" value={formData.description} onChange={handleChange} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

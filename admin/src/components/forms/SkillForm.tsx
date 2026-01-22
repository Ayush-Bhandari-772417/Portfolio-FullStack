// admin\src\components\forms\SkillForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, TextInput } from "@/components/Inputs"

interface Skill {
  id?: number;
  name: string;
  icon: string;
  is_public: boolean;
}

interface SkillFormProps {
  skill?: Skill | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SkillForm({ skill, onSuccess, onCancel }: SkillFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Skill>(
    {
      name: "",
      icon: "",
      is_public: false,
    },
    skill ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.icon.trim()) newErrors.icon = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      name: formData.name || "",
      icon: formData.icon || "",
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && skill?.id) {
        await api.put(`/skills/${skill.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/skills/`, payload);
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
          <TextInput label="Icon *" name="icon" value={formData.icon} onChange={handleChange} error={errors.icon} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

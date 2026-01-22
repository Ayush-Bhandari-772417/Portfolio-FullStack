// admin\src\components\forms\SkillForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, DateInput, EnterSeparatedInput, TextInput, UrlInput } from "@/components/Inputs"

interface Experience {
  id?: number;
  title: string;
  organization: string;
  organization_url: string;
  location: string;
  location_url: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
  is_public: boolean;
}

interface ExperienceFormProps {
  experience?: Experience | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ExperienceForm({ experience, onSuccess, onCancel }: ExperienceFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Experience>(
    {
      title: "",
      organization: "",
      organization_url: "",
      location: "",
      location_url: "",
      start_date: "",
      end_date: "",
      responsibilities: [],
      is_public: false,
    },
    experience ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.organization.trim()) newErrors.organization = "Required";
    if (!formData.location.trim()) newErrors.location = "Required";
    if (!formData.start_date.trim()) newErrors.start_date = "Required";
    if (!formData.responsibilities) newErrors.responsibilities = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      title: formData.title || "",
      organization: formData.organization || "",
      location: formData.location || "",
      start_date: formData.start_date || "",
      responsibilities: formData.responsibilities || "",
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && experience?.id) {
        await api.put(`/experiences/${experience.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/experiences/`, payload);
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
          <TextInput label="Organization *" name="organization" value={formData.organization} onChange={handleChange} error={errors.organization} />
          <UrlInput label="Organization Link" name="organization_url" value={formData.organization_url || ""} onChange={handleChange} />
          <TextInput label="Location *" name="location" value={formData.location} onChange={handleChange} error={errors.location} />
          <UrlInput label="Location Link" name="location_url" value={formData.location_url || ""} onChange={handleChange} />
          <DateInput label="Start Date *" name="start_date" value={formData.start_date || ""} onChange={handleChange} error={errors.start_date} />
          <DateInput
            label="Ended Date"
            name="end_date"
            // disabled={formData.status === "ongoing"}
            value={formData.end_date || ""}
            onChange={handleChange}
          />
          <EnterSeparatedInput label="Responsibilities" name="responsibilities" value={formData.responsibilities}  onChange={(arr) => setFormData({ ...formData, responsibilities: arr })} rows={3} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

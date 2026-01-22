// admin\src\components\forms\SeoSettingForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, SelectInput } from "@/components/Inputs"

interface SeoSetting {
  id?: number;
  page: string;
  index: boolean;
  follow: boolean;
  is_public: boolean;
}

interface SeoSettingFormProps {
  seosetting?: SeoSetting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SeoSettingForm({ seosetting, onSuccess, onCancel }: SeoSettingFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<SeoSetting>(
    {
      page: "",
      index: false,
      follow: false,
      is_public: false,
    },
    seosetting ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.page.trim()) newErrors.page = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      page: formData.page || "",
      index: formData.index || false,
      follow: formData.follow || false,
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && seosetting?.id) {
        await api.put(`/seosettings/${seosetting.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/seosettings/`, payload);
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
            label="Page"
            name="page"
            value={formData.page}
            onChange={handleChange}
            options={{
              home: "Home",
              projects: "Projects",
              project_detail: "Project Detail",
              creations: "Creations",
              creations_category: "Creations Category",
              creations_type: "Creations Type",
              creation_detail: "Creation Detail",
              experience: "Experience",
              skills: "Skills",
              qualifications: "Qualifications",
              services: "Services",
            }}
            error={errors.page}
          />
          <CheckBox label="Index" name="index" value={formData.index} checked={formData.index || false} onChange={handleChange} />
          <CheckBox label="Follow" name="follow" value={formData.follow} checked={formData.follow || false} onChange={handleChange} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

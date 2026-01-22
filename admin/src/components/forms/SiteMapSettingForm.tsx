// admin\src\components\forms\SiteMapSettingForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, NumberInput, SelectInput, TextInput } from "@/components/Inputs"

interface SiteMapSetting {
  id?: number;
  page: string;
  include: boolean;
  priority: number;
  changefreq: string;
  is_public: boolean;
}

interface SiteMapSettingFormProps {
  siteMapSetting?: SiteMapSetting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SiteMapSettingForm({ siteMapSetting, onSuccess, onCancel }: SiteMapSettingFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<SiteMapSetting>(
    {
      page: "",
      include: false,
      priority: 0,
      changefreq: "",
      is_public: false,
    },
    siteMapSetting ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.page.trim()) newErrors.page = "Required";
    if (!formData.changefreq.trim()) newErrors.changefreq = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      page: formData.page || "",
      include: formData.include || false,
      priority: formData.priority || 0,
      changefreq: formData.changefreq || "",
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && siteMapSetting?.id) {
        await api.put(`/sitemapsettings/${siteMapSetting.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/sitemapsettings/`, payload);
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
          <CheckBox label="Include" name="include" checked={formData.include || false} onChange={handleChange} />
          <NumberInput label="Priority" name="priority" value={formData.priority} onChange={handleChange} />
          <SelectInput
            label="Change Frequency"
            name="changefreq"
            value={formData.changefreq}
            onChange={handleChange}
            options={{
              always: "Always",
              hourly: "Every hour",
              daily: "Every day",
              weekly: "Every week",
              monthly: "every month",
              yearly: "every year",
              never: "Never",
            }}
            error={errors.changefreq}
          />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

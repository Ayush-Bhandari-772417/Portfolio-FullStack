// admin\src\components\forms\DisplaySettingForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, NumberInput, SelectInput, TextInput } from "@/components/Inputs"

interface DisplaySetting {
  id?: number;
  context: string;
  item_type: string;
  limit: number;
  is_public: boolean;
}

interface DisplaySettingFormProps {
  displaySetting?: DisplaySetting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DisplaySettingForm({ displaySetting, onSuccess, onCancel }: DisplaySettingFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<DisplaySetting>(
    {
      context: "",
      item_type: "",
      limit: 0,
      is_public: false,
    },
    displaySetting ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.context.trim()) newErrors.context = "Required";
    if (!formData.item_type.trim()) newErrors.item_type = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      context: formData.context || "",
      item_type: formData.item_type || "",
      limit: formData.limit || 0,
      is_public: formData.is_public || false,
    };

    try {
      if (mode === "edit" && displaySetting?.id) {
        await api.put(`/displaysettings/${displaySetting.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/displaysettings/`, payload);
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
            label="Context"
            name="context"
            value={formData.context}
            onChange={handleChange}
            options={{
              home: "Home Page",
              portfolio: "Portfolio Page",
              project_category: "Project Category",
              creation_page: "Creation Page",
              project: "Project",
              creations_category: "Creations Category",
              creations_type: "Creations Type",
            }}
            error={errors.context}
          />
          <SelectInput
            label="Item Type"
            name="item_type"
            value={formData.item_type}
            onChange={handleChange}
            options={{
              creations: "Creations",
              experience: "Experience",
              project: "Project",
              qualifications: "Qualifications",
              services: "Services",
              skills: "Skills",
              socialmedias: "Social Medias",
            }}
            error={errors.item_type}
          />
          <NumberInput label="Limit" name="limit" value={formData.limit} onChange={handleChange} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

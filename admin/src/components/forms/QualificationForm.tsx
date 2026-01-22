// admin\src\components\forms\QualificationForm.tsx
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import FormSection from "@/components/FormSection";
import FormActions from "@/components/FormActions";
import { useFormHandler } from "@/hooks/useFormHandler";
import { CheckBox, TextArea, TextInput, UrlInput, YearInput } from "@/components/Inputs";

interface Qualification {
  id?: number;
  board_name: string;
  school_name: string;
  school_url?: string | null;
  location: string;
  location_url?: string | null;
  enrolled_year?: number | string;
  passed_year?: number | string | null;
  grade?: string | null;
  description?: string;
  is_public?: boolean;
}

interface QualificationFormProps {
  qualification?: Qualification | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function QualificationForm({ qualification, onSuccess, onCancel }: QualificationFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Qualification>(
    {
      board_name: "",
      school_name: "",
      school_url: "",
      location: "",
      location_url: "",
      enrolled_year: "",
      passed_year: "",
      grade: "",
      description: "",
      is_public: false,
    },
    qualification ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.board_name.trim()) newErrors.board_name = "Required";
    if (!formData.school_name.trim()) newErrors.school_name = "Required";
    if (!formData.enrolled_year) newErrors.enrolled_year = "Required";
    if (!formData.location.trim()) newErrors.location = "Required";
    if (formData.passed_year && isNaN(Number(formData.passed_year))) newErrors.passed_year = "Invalid year";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      enrolled_year: Number(formData.enrolled_year),
      passed_year: formData.passed_year ? Number(formData.passed_year) : null,
      school_url: formData.school_url || null,
      location_url: formData.location_url || null,
      grade: formData.grade || null,
    };

    try {
      if (mode === "edit" && qualification?.id) {
        await api.put(`/qualifications/${qualification.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/qualifications/`, payload);
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
          <TextInput label="Board Name *" name="board_name" value={formData.board_name} onChange={handleChange} error={errors.board_name} />
          <TextInput label="School Name *" name="school_name" value={formData.school_name} onChange={handleChange} error={errors.school_name} />
          <UrlInput label="School URL" name="school_url" value={formData.school_url || ""} onChange={handleChange} />
          <TextInput label="Location" name="location" value={formData.location} onChange={handleChange} error={errors.location} />
          <UrlInput label="Location URL" name="location_url" value={formData.location_url || ""} onChange={handleChange} />
          <YearInput label="Enrolled Year *" name="enrolled_year" value={formData.enrolled_year || ""} onChange={handleChange} error={errors.enrolled_year} />
          <YearInput label="Passed Year" name="passed_year" value={formData.passed_year || ""} onChange={handleChange} error={errors.passed_year} />
          <TextInput label="Grade" name="grade" value={formData.grade || ""} onChange={handleChange} />
          <TextArea label="Description" name="description" value={formData.description || ""} onChange={handleChange} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>

        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

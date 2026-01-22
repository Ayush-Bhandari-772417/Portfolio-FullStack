// admin\src\components\forms\SubSkillForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, NumberInput, SelectInput, TextInput } from "@/components/Inputs"
import { useEffect, useState } from "react"

interface SubSkill {
  id?: number;
  skill: string;
  name: string;
  icon: string;
  level: string;
  rating: number;
  is_public: boolean;
}

interface SkillOption {
  id?: number;
  name: string;
  icon: string;
  is_public: boolean;
}

interface SubSkillFormProps {
  subskill?: SubSkill | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SkillForm({ subskill, onSuccess, onCancel }: SubSkillFormProps) {
  const [skills, setSkills] = useState<SkillOption[]>([]); // Store fetched skills
  const [skillLoading, setSkillLoading] = useState(true); // Loading state for skills
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<SubSkill>(
    {
      skill: "",
      name: "",
      icon: "",
      level: "",
      rating: 0,
      is_public: false,
    },
    subskill ?? undefined
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
      if (mode === "edit" && subskill?.id) {
        await api.put(`/subskills/${subskill.id}/`, payload);
        toast.success("Updated successfully.");
      } else {
        await api.post(`/subskills/`, payload);
        toast.success("Created successfully.");
      }

      onSuccess();
      history.replaceState(null, "", window.location.pathname);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoriesResponse = await api.get("/skills/");
        const data = categoriesResponse.data;
        setSkills(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        toast.error("Failed to load skills. Check console.");
      } finally {
        setSkillLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <section>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection>
          <SelectInput
            label="Skill"
            name="skill"
            value={formData.skill || ""}
            onChange={handleChange}
            options={skills.reduce((acc, c) => {
              acc[String(c.id)] = c.name;
              return acc;
            }, {} as Record<string, string>)}
          />
          <TextInput label="Name *" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
          <TextInput label="Icon *" name="icon" value={formData.icon} onChange={handleChange} error={errors.icon} />
          <SelectInput
            label="Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            options={{
              Beginner: "Beginner",
              Intermediate: "Intermediate",
              Pro: "Pro",
              Expert: "Expert",
            }}
          />
          <NumberInput label="Rating" name="rating" value={formData.rating} onChange={handleChange} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

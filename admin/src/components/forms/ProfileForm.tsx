// admin\src\components\forms\ProfileForm.tsx
'use client'
import { toast } from "react-hot-toast"
import api from "@/lib/axios"
import FormSection from "@/components/FormSection"
import FormActions from "@/components/FormActions"
import { useFormHandler } from "@/hooks/useFormHandler"
import { CheckBox, EnterSeparatedInput, NumberInput, TextArea, TextInput } from "@/components/Inputs"
import { SingleFileUpload, SingleImageUpload } from "@/components/ImageUploadPreview";

interface Profile {
  id?: number;
  name: string;
  tagline: string;
  headline: string;
  short_intro: string;
  profile_image: File | null;
  profile_image_alt: string;
  profile_image_url: string;
  resume: File | null;
  resume_alt: string;
  resume_url: string;
  about_image: File | null;
  about_image_alt: string;
  about_image_url: string;
  about_text: string;
  years_of_experience: number;
  projects_completed: number;
  logo: File | null;
  logo_alt: string;
  logo_url: string;
  named_logo: File | null;
  named_logo_alt: string;
  named_logo_url: string;
  keywords: string[];
  is_public: boolean;
}

interface ProfileFormProps {
  profile?: Profile | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProfileForm({ profile, onSuccess, onCancel }: ProfileFormProps) {
  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<Profile>(
    {
      name: "",
      tagline: "",
      headline: "",
      short_intro: "",
      profile_image: null,
      profile_image_alt: "",
      profile_image_url: "",
      resume: null,
      resume_alt: "",
      resume_url: "",
      about_image: null,
      about_image_alt: "",
      about_image_url: "",
      about_text: "",
      years_of_experience: 0,
      projects_completed: 0,
      logo: null,
      logo_alt: "",
      logo_url: "",
      named_logo: null,
      named_logo_alt: "",
      named_logo_url: "",
      keywords: [],
      is_public: false,
    },
    profile ?? undefined
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.tagline.trim()) newErrors.tagline = "Required";
    if (!formData.headline.trim()) newErrors.headline = "Required";
    if (!formData.short_intro.trim()) newErrors.short_intro = "Required";
    if (!formData.about_text.trim()) newErrors.about_text = "Required";
    if (formData.years_of_experience === null || formData.years_of_experience < 0) newErrors.years_of_experience = "Required";
    if (formData.projects_completed === null || formData.projects_completed < 0) newErrors.projects_completed = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const Payload = new FormData();

    // ---- TEXT FIELDS ----
    Payload.append("name", formData.name);
    Payload.append("tagline", formData.tagline);
    Payload.append("headline", formData.headline);
    Payload.append("short_intro", formData.short_intro);
    Payload.append("about_text", formData.about_text);
    Payload.append("years_of_experience", String(formData.years_of_experience));
    Payload.append("projects_completed", String(formData.projects_completed));
    Payload.append("is_public", String(formData.is_public));
    Payload.append("keywords", JSON.stringify(formData.keywords));

    // ---- IMAGE FILES ----
    if (formData.profile_image instanceof File) {
      Payload.append("profile_image", formData.profile_image);
      Payload.append("profile_image_alt", formData.profile_image_alt);
    }

    if (formData.about_image instanceof File) {
      Payload.append("about_image", formData.about_image);
      Payload.append("about_image_alt", formData.about_image_alt);
    }

    if (formData.logo instanceof File) {
      Payload.append("logo", formData.logo);
      Payload.append("logo_alt", formData.logo_alt);
    }

    if (formData.named_logo instanceof File) {
      Payload.append("named_logo", formData.named_logo);
      Payload.append("named_logo_alt", formData.named_logo_alt);
    }

    // ---- RESUME FILE ----
    if (formData.resume instanceof File) {
      Payload.append("resume", formData.resume);
      Payload.append("resume_alt", formData.resume_alt);
    }

    try {
      if (mode === "edit" && profile?.id) {
        await api.put(`/profile/${profile.id}/`, Payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Updated successfully.");
      } else {
        await api.post(`/profile/`, Payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
          <TextInput label="Tagline *" name="tagline" value={formData.tagline} onChange={handleChange} error={errors.tagline} />
          <TextArea label="Headline *" name="headline" value={formData.headline} onChange={handleChange} error={errors.headline} />
          <TextArea label="Short Intro *" name="short_intro" value={formData.short_intro} onChange={handleChange} error={errors.short_intro} />
          <div className="md:col-span-2">
            <SingleImageUpload
              label="Profile Image"
              currentImageUrl={profile?.profile_image_url || null}
              currentImageName={profile?.profile_image_url?.split("/").pop() || null}
              onFileChange={(file) => setFormData({ ...formData, profile_image: file })}
            />
          </div>
          <TextInput label="Alt text for profile image" name="profile_image_alt" value={formData.profile_image_alt} onChange={handleChange} />
          <SingleFileUpload
            label="Resume (PDF)"
            accept=".pdf"
            currentFileUrl={profile?.resume_url || null}
            currentFileName={profile?.resume_url?.split("/").pop() || null}
            onFileChange={(file) =>
              setFormData({ ...formData, resume: file })
            }
          />
          <TextInput label="Alt text for CV" name="resume_alt" value={formData.resume_alt} onChange={handleChange} />
          <div className="md:col-span-2">
            <SingleImageUpload
              label="About Image"
              currentImageUrl={profile?.about_image_url || null}
              currentImageName={profile?.about_image_url?.split("/").pop() || null}
              onFileChange={(file) => setFormData({ ...formData, about_image: file })}
            />
          </div>
          <TextInput label="Alt text for about image" name="about_image_alt" value={formData.about_image_alt} onChange={handleChange} />
          <TextArea label="About Text *" name="about_text" value={formData.about_text} onChange={handleChange} error={errors.about_text} />
          <EnterSeparatedInput label="Keywords" name="keywords" value={formData.keywords} onChange={(arr) => setFormData({ ...formData, keywords: arr })} />
          <NumberInput label="No. of Years of Experience *" name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} error={errors.years_of_experience} />
          <NumberInput label="No. of Projects Completed *" name="projects_completed" value={formData.projects_completed} onChange={handleChange} error={errors.projects_completed} />
          <div className="md:col-span-2">
            <SingleImageUpload
              label="Logo"
              currentImageUrl={profile?.logo_url || null}
              currentImageName={profile?.logo_url?.split("/").pop() || null}
              onFileChange={(file) => setFormData({ ...formData, logo: file })}
            />
          </div>
          <TextInput label="Alt text for logo" name="logo_alt" value={formData.logo_alt} onChange={handleChange} />
          <div className="md:col-span-2">
            <SingleImageUpload
              label="Named logo"
              currentImageUrl={profile?.named_logo_url || null}
              currentImageName={profile?.named_logo_url?.split("/").pop() || null}
              onFileChange={(file) => setFormData({ ...formData, named_logo: file })}
            />
          </div>
          <TextInput label="Alt text for named logo" name="named_logo_alt" value={formData.named_logo_alt} onChange={handleChange} />
          <CheckBox label="Show on public website" name="is_public" checked={formData.is_public || false} onChange={handleChange} />
        </FormSection>
        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

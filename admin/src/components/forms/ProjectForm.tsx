// admin\src\components\forms\ProjectForm.tsx
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import FormSection from "@/components/FormSection";
import FormActions from "@/components/FormActions";
import { useFormHandler } from "@/hooks/useFormHandler";
import { CheckBox, CommaSeparatedInput, DateInput, EnterSeparatedInput, TextArea, TextInput, SelectInput, UrlInput } from "@/components/Inputs";
import { GalleryImageUpload, SingleImageUpload } from "@/components/ImageUploadPreview";
import { useMemo } from "react";

interface Project {
  id?: number;
  slug?: string;
  title: string;
  category?: string;
  excerpt?: string;
  abstract?: string;
  features: string[];
  technologies: string[];
  keywords: string[];
  tags: string[];
  featured_image?: File | null;
  featured_image_alt: string;
  featured_image_url?: string | null;
  gallery_images?: Array<{ id: number; image_url: string; caption?: string }>;
  repository_link?: string;
  live_link?: string;
  demo?: string;
  contributors: string[];
  status: "ongoing" | "completed" | "paused";
  project_type: "academic" | "personal" | "client";
  is_public: boolean;
  featured: boolean;
  client_feedback?: string;
  started_date: string;
  completed_date?: string;
  images_to_delete?: number[];
  gallery?: File[];
}

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const initialEditData = useMemo(() => {
    if (!project) return undefined;
    return { ...project, gallery: [], images_to_delete: [] };
  }, [project] );

  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<
    Project & { gallery: File[]; images_to_delete: number[] }
  >(
    {
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      abstract: "",
      features: [],
      technologies: [],
      keywords: [],
      tags: [],
      contributors: [],
      featured_image: null,
      featured_image_alt: "",
      featured_image_url: null,
      gallery_images: [],
      gallery: [],
      images_to_delete: [],
      repository_link: "",
      live_link: "",
      demo: "",
      status: "completed",
      project_type: "personal",
      is_public: false,
      featured: false,
      client_feedback: "",
      started_date: "",
      completed_date: "",
    },
    initialEditData
  );

  // --- VALIDATION ---
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.slug?.trim()) newErrors.slug = "Required";
    if (!formData.category?.trim()) newErrors.category = "Required";
    if (!formData.excerpt?.trim()) newErrors.excerpt = "Required";
    if (!formData.abstract?.trim()) newErrors.abstract = "Required";
    if (!formData.started_date?.trim()) newErrors.started_date = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();

    // Basic fields
    data.append("title", formData.title);
    data.append("slug", formData.slug || "");
    data.append("category", formData.category || "");
    data.append("excerpt", formData.excerpt || "");
    data.append("abstract", formData.abstract || "");
    data.append("features", JSON.stringify(formData.features));
    data.append("technologies", JSON.stringify(formData.technologies));
    data.append("keywords", JSON.stringify(formData.keywords));
    data.append("tags", JSON.stringify(formData.tags));
    data.append("contributors", JSON.stringify(formData.contributors));
    data.append("repository_link", formData.repository_link || "");
    data.append("live_link", formData.live_link || "");
    data.append("demo", formData.demo || "");
    data.append("status", formData.status);
    data.append("project_type", formData.project_type);
    data.append("is_public", String(formData.is_public));
    data.append("featured", String(formData.featured));
    data.append("client_feedback", formData.client_feedback || "");
    data.append("started_date", formData.started_date || "");
    if (formData.completed_date) data.append("completed_date", formData.completed_date);

    // Featured Image
    if (formData.featured_image instanceof File) data.append("featured_image", formData.featured_image);
    if (formData.featured_image instanceof File) data.append("featured_image_alt", formData.featured_image_alt);

    // Gallery new files
    formData.gallery?.forEach((file) => data.append("gallery", file));

    // Gallery delete IDs
    formData.images_to_delete?.forEach((id) => data.append("delete_gallery", String(id)));

    try {
      if (mode === "edit" && project?.id) {
        await api.put(`/projects/${project.id}/`, data);
        toast.success("Project updated successfully!");
      } else {
        await api.post("/projects/", data);
        toast.success("Project created successfully!");
      }
      onSuccess();
      history.replaceState(null, "", window.location.pathname);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save project.");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection>
          <TextInput label="Title *" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
          <TextInput label="Slug *" name="slug" value={formData.slug || ""} onChange={handleChange} error={errors.slug} />
          <TextInput label="Category *" name="category" value={formData.category || ""} onChange={handleChange} error={errors.category} />

          <TextArea label="Excerpt *" name="excerpt" value={formData.excerpt || ""} onChange={handleChange} error={errors.excerpt} />
          <TextArea label="Abstract *" name="abstract" value={formData.abstract || ""} onChange={handleChange} error={errors.abstract} />

          <EnterSeparatedInput label="Features" name="features" value={formData.features}  onChange={(arr) => setFormData({ ...formData, features: arr })} rows={3} />
          <EnterSeparatedInput label="Technologies" name="technologies" value={formData.technologies} onChange={(arr) => setFormData({ ...formData, technologies: arr })} />
          <CommaSeparatedInput label="Keywords" name="keywords" value={formData.keywords} onChange={(arr) => setFormData({ ...formData, keywords: arr })} />
          <CommaSeparatedInput label="Tags" name="tags" value={formData.tags} onChange={(arr) => setFormData({ ...formData, tags: arr })} />
          <CommaSeparatedInput label="Contributors" name="contributors" value={formData.contributors} onChange={(arr) => setFormData({ ...formData, contributors: arr })} />

          {/* Featured Image */}
          <div className="md:col-span-2">
            <SingleImageUpload
              label="Featured Image"
              currentImageUrl={project?.featured_image_url || null}
              currentImageName={project?.featured_image_url?.split("/").pop() || null}
              onFileChange={(file) => setFormData({ ...formData, featured_image: file })}
            />
          </div>

          <TextInput label="Alt text for featured image" name="featured_image_alt" value={formData.featured_image_alt || ""} onChange={handleChange} />

          {/* Gallery */}
          <div className="md:col-span-2">
            <GalleryImageUpload
              label="Project Gallery"
              existingImages={project?.gallery_images || []}
              onFilesChange={(files) => setFormData({ ...formData, gallery: files })}
              onRemoveExisting={(id) =>
                setFormData({
                  ...formData,
                  images_to_delete: [...(formData.images_to_delete || []), Number(id)],
                })
              }
              maxFiles={15}
            />
          </div>

          <UrlInput label="Repository Link" name="repository_link" value={formData.repository_link || ""} onChange={handleChange} />
          <UrlInput label="Live Link" name="live_link" value={formData.live_link || ""} onChange={handleChange} />
          <UrlInput label="Demo Link" name="demo" value={formData.demo || ""} onChange={handleChange} />

          <SelectInput label="Status" name="status" value={formData.status} onChange={handleChange} options={["Ongoing", "Completed", "Paused"]} />
          <SelectInput label="Project Type" name="project_type" value={formData.project_type} onChange={handleChange} options={["Academic", "Personal", "Client / Freelance"]} />

          <CheckBox label="Public Project" name="is_public" checked={formData.is_public} onChange={handleChange} />
          <CheckBox label="Featured Project" name="featured" checked={formData.featured} onChange={handleChange} />

          <TextArea label="Client Feedback" name="client_feedback" value={formData.client_feedback || ""} onChange={handleChange} />

          <DateInput label="Start Date *" name="started_date" value={formData.started_date || ""} onChange={handleChange} error={errors.started_date} />
          <DateInput label="Completion Date" name="completed_date" disabled={formData.status === "ongoing"} value={formData.completed_date || ""} onChange={handleChange} />
        </FormSection>

        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}

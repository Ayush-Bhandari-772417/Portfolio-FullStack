// admin\src\components\forms\CreationForm.tsx
"use client";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import FormSection from "@/components/FormSection";
import FormActions from "@/components/FormActions";
import { useFormHandler } from "@/hooks/useFormHandler";
import { CheckBox, CommaSeparatedInput, DateInput, SelectInput, TextArea, TextInput } from "@/components/Inputs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SingleImageUpload } from "@/components/ImageUploadPreview";
import ArticleEditor from "@/components/TipTap/ArticleEditor";

interface Creation {
  title: string;
  slug: string;
  is_public: boolean;
  language: string;
  translation_key: string;
  featured_image?: File | null;
  featured_image_alt: string;
  type: "blog" | "poem" | "story" | "article";
  category: string; // Will be category ID
  keywords: string[];
  excerpt: string;
  written_date: string;
  published_date: string;
  published_in: string;
  featured_image_url?: string | null;
  content_json?: JSON;
  content_html?: string;
}

interface CategoryOption {
  id: number;
  name: string;
}

interface CreationFormProps {
  creation?: Creation | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateCreationPage({ creation, onSuccess, onCancel }: CreationFormProps) {
  const initialEditData = useMemo(() => {
    if (!creation) return undefined;
    return { ...creation };
  }, [creation] );
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]); // Store fetched categories
  const [categoryLoading, setCategoryLoading] = useState(true); // Loading state for categories

  const { formData, setFormData, errors, setErrors, mode, handleChange } = useFormHandler<
    Creation
  >(
    {
      title: "",
      slug: "",
      is_public: false,
      language: "",
      translation_key: "",
      featured_image: null,
      featured_image_url: null,
      featured_image_alt: "",
      type: "blog",
      category: "", // Default to empty for null
      keywords: [],
      excerpt: "",
      written_date: "",
      published_date: "",
      published_in: "",
      content_json: undefined,
      content_html: "",
    },
    initialEditData
  );


  // --- VALIDATION ---
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.slug?.trim()) newErrors.slug = "Required";
    if (!formData.excerpt?.trim()) newErrors.excerpt = "Required";
    if (!formData.translation_key?.trim()) newErrors.translation_key = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
// --- SIMPLIFIED SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors above.");
      return;
    }

    const data = new FormData();

    // Basic fields
    data.append("title", formData.title);
    data.append("slug", formData.slug);
    data.append("is_public", String(formData.is_public));
    data.append("language", formData.language);
    data.append("translation_key", formData.translation_key);
    data.append("type", formData.type);
    if (formData.category) data.append("category", formData.category);
    data.append("keywords", JSON.stringify(formData.keywords));
    data.append("excerpt", formData.excerpt);
    data.append("written_date", formData.written_date || "");
    data.append("published_date", formData.published_date || "");
    data.append("published_in", formData.published_in || "");
    data.append("content_json", JSON.stringify(formData.content_json || {}));
    data.append("content_html", formData.content_html || "");

    // Featured Image
    if (formData.featured_image instanceof File) {
      data.append("featured_image", formData.featured_image);
      data.append("featured_image_alt", formData.featured_image_alt);
    }

    try {
      if (mode === "edit" && creation?.slug) {
        // UPDATE mode
        await api.put(`/creations/${creation.slug}/`, data);
        toast.success("Creation updated successfully!");
        onSuccess();
      } else {
        // CREATE mode
        const createResp = await api.post("/creations/", data);
        toast.success("Creation created successfully!");
        router.push(`/creations/${createResp.data.slug}`);
        onSuccess?.();
      }
    } catch (err: any) {
      console.error("❌ Creation failed:", err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.non_field_errors?.[0] || 
                          Object.values(err.response?.data || {}).flat().join(", ") || 
                          "Failed to save creation";
      toast.error(errorMessage);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get("/categories/");
        const data = categoriesResponse.data;
        setCategories(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        toast.error("Failed to load categories. Check console.");
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchInitialData();
  }, []);


  return (
    <section>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection>
          <TextInput label="Title *" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
          <TextInput label="Slug *" name="slug" value={formData.slug || ""} onChange={handleChange} error={errors.slug} />
          <CheckBox label="Public Project" name="is_public" checked={formData.is_public} onChange={handleChange} />
          <SelectInput
            label="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            options={{
              en: "English",
              ne: "Nepali",
            }}
          />
          <TextInput label="Translation key *" name="translation_key" value={formData.translation_key} onChange={handleChange} error={errors.translation_key} />
          
          {/* Featured Image */}
          <div className="md:col-span-2">
            <SingleImageUpload
              label="Featured Image"
              currentImageUrl={creation?.featured_image_url || null}
              currentImageName={creation?.featured_image_url?.split("/").pop() || null}
              onFileChange={(file) => setFormData({ ...formData, featured_image: file })}
            />
          </div>

          <TextInput label="Alt text for featured image" name="featured_image_alt" value={formData.featured_image_alt || ""} onChange={handleChange} />

          <SelectInput
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={{
              blog: "Blog",
              poem: "Poem",
              story: "Story",
              article: "Article",
            }}
          />

          <SelectInput
            label="Category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            options={categories.reduce((acc, c) => {
              acc[String(c.id)] = c.name;
              return acc;
            }, {} as Record<string, string>)}
          />

          <CommaSeparatedInput label="Keywords" name="keywords" value={formData.keywords} onChange={(arr) => setFormData({ ...formData, keywords: arr })} />
          <TextArea label="Excerpt *" name="excerpt" value={formData.excerpt || ""} onChange={handleChange} error={errors.excerpt} />

          <DateInput label="Written Date" name="written_date" value={formData.written_date || ""} onChange={handleChange} />
          <DateInput label="Published Date" name="published_date" value={formData.published_date || ""} onChange={handleChange} />
          <TextInput label="Published In" name="published_in" value={formData.published_in || ""} onChange={handleChange} />
          
        </FormSection>
        
        <ArticleEditor
          valueJSON={formData.content_json}
          valueHTML={formData.content_html}
          onChange={(json: any, html: any) => setFormData({ ...formData, content_json: json, content_html: html, }) }
        />

        <FormActions loading={false} onCancel={onCancel} />
      </form>
    </section>
  );
}
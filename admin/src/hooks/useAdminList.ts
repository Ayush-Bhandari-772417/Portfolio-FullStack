// admin\src\hooks\useAdminList.ts
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";

interface UseAdminListOptions<T> {
  endpoint: string;
  searchFn: (item: T, query: string) => boolean;
  itemsPerPage?: number;
}

export function useAdminList<T>({
  endpoint,
  searchFn,
  itemsPerPage = 5,
}: UseAdminListOptions<T>) {
  // const [items, setItems] = useState<T[]>([]);
  const [items, setItems] = useState<T[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint);
      const data = Array.isArray(res.data) ? res.data : res.data.results || res.data.items || [];
      setItems(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setCurrentItem(null);
    setShowForm(true);
    window.location.hash = "#add";
  };

  const handleEdit = (item: T) => {
    setCurrentItem(item);
    setShowForm(true);
    window.location.hash = "#edit";
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`${endpoint}${id}/`);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    window.location.hash = "";
    fetchItems();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    window.location.hash = "";
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const filtered = items.filter((item) =>
    searchFn(item, searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(start, start + itemsPerPage);

  return {
    // state
    loading,
    error,
    showForm,
    currentItem,

    // data
    currentItems,
    totalPages,
    currentPage,
    searchQuery,

    // handlers
    setCurrentPage,
    handleAdd,
    handleEdit,
    handleDelete,
    handleFormSuccess,
    handleFormCancel,
    handleSearch,
  };
}

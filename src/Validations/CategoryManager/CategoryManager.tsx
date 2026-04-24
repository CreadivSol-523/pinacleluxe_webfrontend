"use client";

import { useState, useMemo } from "react";
import { Category, CategoryFormData } from "@/Types/Category/Category";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK: Category[] = [
   { id: "c1", name: "Totes", slug: "totes", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200", isActive: true, parentId: null },
   { id: "c2", name: "Shoulder Bags", slug: "shoulder-bags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200", isActive: true, parentId: null },
   { id: "c3", name: "Small Leather Goods", slug: "small-leather-goods", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", isActive: true, parentId: null },
   { id: "c4", name: "Hobo", slug: "hobo", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200", isActive: false, parentId: null },
   { id: "c5", name: "Leather Totes", slug: "leather-totes", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200", isActive: true, parentId: "c1" },
   { id: "c6", name: "Canvas Totes", slug: "canvas-totes", image: "https://images.unsplash.com/photo-1594938298603-c8148f4f4d8e?w=200", isActive: true, parentId: "c1" },
   { id: "c7", name: "Mini Shoulder", slug: "mini-shoulder", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200", isActive: true, parentId: "c2" },
   { id: "c8", name: "Wallets", slug: "wallets", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", isActive: true, parentId: "c3" },
   { id: "c9", name: "Card Holders", slug: "card-holders", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", isActive: false, parentId: "c3" },
];

const emptyForm = (parentId: string | null = null): CategoryFormData => ({
   name: "",
   slug: "",
   image: "",
   isActive: true,
   parentId,
});

function toSlug(name: string) {
   return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
}

// Build tree from flat list
export function buildTree(flat: Category[]): Category[] {
   const map = new Map<string, Category>();
   flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
   const roots: Category[] = [];
   map.forEach((cat) => {
      if (cat.parentId && map.has(cat.parentId)) {
         map.get(cat.parentId)!.children!.push(cat);
      } else {
         roots.push(cat);
      }
   });
   return roots;
}

export type CategoryFormErrors = Partial<Record<keyof CategoryFormData, string>>;

export function useCategoryManager() {
   const [categories, setCategories] = useState<Category[]>(MOCK);
   const [expanded, setExpanded] = useState<Set<string>>(new Set(["c1", "c2", "c3"]));
   const [search, setSearch] = useState("");

   // Modal state
   const [modalOpen, setModalOpen] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [form, setForm] = useState<CategoryFormData>(emptyForm());
   const [errors, setErrors] = useState<CategoryFormErrors>({});
   const [loading, setLoading] = useState(false);

   // ── Tree ─────────────────────────────────────────────────────────────────
   const filtered = useMemo(() => {
      if (!search.trim()) return categories;
      const q = search.toLowerCase();
      return categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q));
   }, [categories, search]);

   const tree = useMemo(() => buildTree(filtered), [filtered]);

   // ── Expand/collapse ───────────────────────────────────────────────────────
   const toggleExpand = (id: string) => {
      setExpanded((prev) => {
         const next = new Set(prev);
         next.has(id) ? next.delete(id) : next.add(id);
         return next;
      });
   };

   const expandAll = () => setExpanded(new Set(categories.filter((c) => !c.parentId).map((c) => c.id)));
   const collapseAll = () => setExpanded(new Set());

   // ── Modal helpers ─────────────────────────────────────────────────────────
   const openAdd = (parentId: string | null = null) => {
      setEditingId(null);
      setForm(emptyForm(parentId));
      setErrors({});
      setModalOpen(true);
   };

   const openEdit = (cat: Category) => {
      setEditingId(cat.id);
      setForm({ name: cat.name, slug: cat.slug, image: cat.image, isActive: cat.isActive, parentId: cat.parentId });
      setErrors({});
      setModalOpen(true);
   };

   const closeModal = () => {
      setModalOpen(false);
      setEditingId(null);
   };

   // ── Form field setters ────────────────────────────────────────────────────
   const setField = <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) => {
      setForm((prev: CategoryFormData) => ({ ...prev, [key]: value }));
      setErrors((prev: CategoryFormErrors) => ({ ...prev, [key]: undefined }));
   };

   const handleNameChange = (name: string) => {
      setForm((prev: CategoryFormData) => ({ ...prev, name, slug: toSlug(name) }));
      setErrors((prev: CategoryFormErrors) => ({ ...prev, name: undefined, slug: undefined }));
   };

   // ── Validate ──────────────────────────────────────────────────────────────
   const validate = (): boolean => {
      const e: CategoryFormErrors = {};
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.slug.trim()) e.slug = "Slug is required";
      const slugTaken = categories.some((c) => c.slug === form.slug && c.id !== editingId);
      if (slugTaken) e.slug = "Slug already exists";
      setErrors(e);
      return Object.keys(e).length === 0;
   };

   // ── CRUD ──────────────────────────────────────────────────────────────────
   const handleSubmit = async () => {
      if (!validate()) return;
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500)); // replace with API call
      if (editingId) {
         setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...form } : c)));
      } else {
         const newCat: Category = {
            ...form,
            id: `c_${Date.now()}`,
            createdAt: new Date().toISOString(),
         };
         setCategories((prev) => [...prev, newCat]);
         if (form.parentId) {
            setExpanded((prev) => new Set([...prev, form.parentId!]));
         }
      }
      setLoading(false);
      closeModal();
   };

   const toggleActive = (id: string) => {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
   };

   const deleteCategory = (id: string) => {
      // also delete children
      const toDelete = new Set<string>();
      const collect = (cid: string) => {
         toDelete.add(cid);
         categories.filter((c) => c.parentId === cid).forEach((c) => collect(c.id));
      };
      collect(id);
      setCategories((prev) => prev.filter((c) => !toDelete.has(c.id)));
   };

   // ── Top-level categories (for parent dropdown) ────────────────────────────
   const topLevelCats = categories.filter((c) => !c.parentId);

   return {
      tree,
      search,
      setSearch,
      expanded,
      toggleExpand,
      expandAll,
      collapseAll,
      modalOpen,
      editingId,
      form,
      errors,
      loading,
      openAdd,
      openEdit,
      closeModal,
      setField,
      handleNameChange,
      handleSubmit,
      toggleActive,
      deleteCategory,
      topLevelCats,
      totalCount: categories.length,
      activeCount: categories.filter((c) => c.isActive).length,
   };
}

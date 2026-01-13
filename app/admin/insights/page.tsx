"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search, Plus, Trash2, Calendar, Image } from "lucide-react";

type ContentItem = {
  id: string;
  image?: string;
  title: string;
  description: string;
  file?: File | null;
  preview?: string | null;
};

type CenteredContentItem = {
  id: string;
  image?: string;
  title: string;
  description: string;
  file?: File | null;
  preview?: string | null;
};

type Insight = {
  id: string;
  title: string;
  reference: string;
  category: string;
  cmpdate: string;
  centeredimage: string;
  fact: {
    image: string;
    boldtext: string;
  };
  content: ContentItem[];
  centeredcontent: CenteredContentItem[];
  created_at: string;
};

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [search, setSearch] = useState("");

  // form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Basic fields
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [category, setCategory] = useState("");
  const [cmpdate, setCmpdate] = useState("");
  
  // Centered image
  const [centeredImageFile, setCenteredImageFile] = useState<File | null>(null);
  const [centeredImagePreview, setCenteredImagePreview] = useState<string | null>(null);
  
  // Fact section
  const [factImageFile, setFactImageFile] = useState<File | null>(null);
  const [factImagePreview, setFactImagePreview] = useState<string | null>(null);
  const [factBoldText, setFactBoldText] = useState("");
  
  // Content array
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: Date.now().toString(), title: "", description: "" }
  ]);
  
  // Centered content array
  const [centeredContentItems, setCenteredContentItems] = useState<CenteredContentItem[]>([
    { id: Date.now().toString(), title: "", description: "" }
  ]);

  // progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchInsights() {
    setLoading(true);
    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .order("cmpdate", { ascending: false });
    
    if (error) {
      console.error("Fetch insights error:", error);
    } else {
      // Parse JSON strings if needed
      const parsedData = data.map(item => ({
        ...item,
        fact: typeof item.fact === 'string' ? JSON.parse(item.fact) : item.fact,
        content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content,
        centeredcontent: typeof item.centeredcontent === 'string' ? JSON.parse(item.centeredcontent) : item.centeredcontent
      }));
      setInsights(parsedData as Insight[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchInsights();
  }, []);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setTitle("");
    setReference("");
    setCategory("");
    setCmpdate("");
    setCenteredImageFile(null);
    setCenteredImagePreview(null);
    setFactImageFile(null);
    setFactImagePreview(null);
    setFactBoldText("");
    setContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    setCenteredContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    setOpen(true);
  }

  function openEdit(insight: Insight) {
    setIsEdit(true);
    setEditingId(insight.id);
    setTitle(insight.title);
    setReference(insight.reference || "");
    setCategory(insight.category);
    setCmpdate(insight.cmpdate);
    
    // Set centered image preview
    if (insight.centeredimage) {
      setCenteredImagePreview(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/insight-images/${insight.centeredimage}`
      );
    }
    
    // Set fact section
    if (insight.fact?.image) {
      setFactImagePreview(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/insight-images/${insight.fact.image}`
      );
    }
    setFactBoldText(insight.fact?.boldtext || "");
    
    // Set content items
    if (insight.content && insight.content.length > 0) {
      setContentItems(insight.content.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/insight-images/${item.image}` 
          : null
      })));
    } else {
      setContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    }
    
    // Set centered content items
    if (insight.centeredcontent && insight.centeredcontent.length > 0) {
      setCenteredContentItems(insight.centeredcontent.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/insight-images/${item.image}` 
          : null
      })));
    } else {
      setCenteredContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    }
    
    setOpen(true);
  }

  // Content array handlers
  const addContentItem = () => {
    setContentItems([
      ...contentItems,
      { id: Date.now().toString() + Math.random(), title: "", description: "" }
    ]);
  };

  const removeContentItem = (id: string) => {
    if (contentItems.length > 1) {
      setContentItems(contentItems.filter(item => item.id !== id));
    }
  };

  const updateContentItem = (id: string, field: keyof ContentItem, value: any) => {
    setContentItems(contentItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleContentImage = (id: string, file: File | null) => {
    setContentItems(contentItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          file: file,
          preview: file ? URL.createObjectURL(file) : item.preview
        };
      }
      return item;
    }));
  };

  // Centered content array handlers
  const addCenteredContentItem = () => {
    setCenteredContentItems([
      ...centeredContentItems,
      { id: Date.now().toString() + Math.random(), title: "", description: "" }
    ]);
  };

  const removeCenteredContentItem = (id: string) => {
    if (centeredContentItems.length > 1) {
      setCenteredContentItems(centeredContentItems.filter(item => item.id !== id));
    }
  };

  const updateCenteredContentItem = (id: string, field: keyof CenteredContentItem, value: any) => {
    setCenteredContentItems(centeredContentItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleCenteredContentImage = (id: string, file: File | null) => {
    setCenteredContentItems(centeredContentItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          file: file,
          preview: file ? URL.createObjectURL(file) : item.preview
        };
      }
      return item;
    }));
  };

  function submitForm() {
    if (!title.trim() || !category.trim() || !cmpdate) {
      alert("Title, category and date are required");
      return;
    }

    // Validate content items
    for (const item of contentItems) {
      if (!item.title.trim() || !item.description.trim()) {
        alert("All content items must have both title and description");
        return;
      }
    }

    // Validate centered content items
    for (const item of centeredContentItems) {
      if (!item.title.trim() || !item.description.trim()) {
        alert("All centered content items must have both title and description");
        return;
      }
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("reference", reference);
    fd.append("category", category);
    fd.append("cmpdate", cmpdate);
    fd.append("factBoldText", factBoldText);
    
    // Prepare content items for JSON (remove file and preview fields)
    const contentForJson = contentItems.map(({ file, preview, ...rest }) => rest);
    fd.append("content", JSON.stringify(contentForJson));
    
    // Prepare centered content items for JSON
    const centeredContentForJson = centeredContentItems.map(({ file, preview, ...rest }) => rest);
    fd.append("centeredcontent", JSON.stringify(centeredContentForJson));
    
    fd.append("isEdit", String(isEdit));
    
    if (isEdit && editingId) fd.append("id", editingId);
    if (centeredImageFile) fd.append("centeredImage", centeredImageFile);
    if (factImageFile) fd.append("factImage", factImageFile);
    
    // Add content item files
    contentItems.forEach((item) => {
      if (item.file) {
        fd.append(`contentImage_${item.id}`, item.file);
      }
    });
    
    // Add centered content files
    centeredContentItems.forEach((item) => {
      if (item.file) {
        fd.append(`centeredContentImage_${item.id}`, item.file);
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/insights");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(pct);
      }
    };
    xhr.onload = async () => {
      setUploadProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          alert("Saved successfully");
          setOpen(false);
          fetchInsights();
        } else {
          alert("Server error: " + (res.error || "Unknown"));
          console.error(res);
        }
      } else {
        alert("Upload failed: " + xhr.statusText);
      }
    };
    xhr.onerror = () => {
      setUploadProgress(0);
      alert("Upload request failed");
    };
    xhr.send(fd);
  }

  async function handleDelete(insight: Insight) {
    if (!confirm("Delete this insight?")) return;
    const resp = await fetch("/api/admin/insights-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: insight.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchInsights();
    } else {
      alert("Delete failed: " + (json.error || ""));
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="adminSearchbar">
      <div className="flex items-center justify-between mb-4 bg-[#242424] py-3 px-5 rounded-lg">
        <div className="searchparent">
          <Search size={18} />
          <input
            placeholder="Search insights..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded buttonstyles flex items-center gap-2"
        >
          <Plus size={18} />
          Add Insight
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading insights...</div>
      ) : (
        <div className="space-y-3">
          {insights
            .filter((i) => 
              i.title.toLowerCase().includes(search.toLowerCase()) ||
              i.category.toLowerCase().includes(search.toLowerCase()) ||
              i.reference?.toLowerCase().includes(search.toLowerCase())
            )
            .map((i) => (
              <div
                key={i.id}
                className="p-4 flex justify-between items-center bg-[#242424] text-white rounded"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {i.centeredimage && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/insight-images/${i.centeredimage}`}
                      alt={i.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 text-xs bg-gray-700 rounded">
                        {i.category}
                      </span>
                      <div className="font-semibold text-lg">{i.title}</div>
                    </div>
                    {i.reference && (
                      <div className="text-sm text-gray-300 mb-1">
                        Ref: {i.reference}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(i.cmpdate)}
                      </span>
                      <span>Content Items: {i.content?.length || 0}</span>
                      <span>Centered Content: {i.centeredcontent?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded buttonstyles"
                    onClick={() => openEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 buttonstyles"
                    onClick={() => handleDelete(i)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-black p-6 w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg">
            <h2 className="text-2xl mb-4 font-bold">{isEdit ? "Edit Insight" : "Add Insight"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-white">Title *</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Insight Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-white">Category *</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-white">Reference</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Reference (optional)"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-white">Date *</label>
                <input
                  type="date"
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  value={cmpdate}
                  onChange={(e) => setCmpdate(e.target.value)}
                />
              </div>
            </div>

            {/* Centered Image */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <label className="block mb-2 text-white font-semibold flex items-center gap-2">
                <Image size={18} />
                Centered Image
              </label>
              {centeredImagePreview && (
                <img
                  src={centeredImagePreview}
                  className="w-full h-48 object-cover mb-2 rounded"
                  alt="Preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setCenteredImageFile(f);
                  if (f) setCenteredImagePreview(URL.createObjectURL(f));
                }}
                className="text-white w-full"
              />
            </div>

            {/* Fact Section */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <label className="block mb-2 text-white font-semibold flex items-center gap-2">
                <Image size={18} />
                Fact Section
              </label>
              
              <div className="mb-3">
                <label className="block mb-1 text-white">Fact Image</label>
                {factImagePreview && (
                  <img
                    src={factImagePreview}
                    className="w-full h-32 object-cover mb-2 rounded"
                    alt="Fact Preview"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFactImageFile(f);
                    if (f) setFactImagePreview(URL.createObjectURL(f));
                  }}
                  className="text-white w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-white">Bold Text</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Bold text for fact section"
                  value={factBoldText}
                  onChange={(e) => setFactBoldText(e.target.value)}
                />
              </div>
            </div>

            {/* Content Items */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-white font-semibold flex items-center gap-2">
                  <Image size={18} />
                  Content Items
                </label>
                <button
                  type="button"
                  onClick={addContentItem}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              
              {contentItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Content Item {index + 1}</span>
                    {contentItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentItem(item.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block mb-1 text-white">Image (Optional)</label>
                    {item.preview && (
                      <img
                        src={item.preview}
                        className="w-full h-32 object-cover mb-2 rounded"
                        alt="Preview"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleContentImage(item.id, e.target.files?.[0] || null)}
                      className="text-white w-full"
                    />
                  </div>
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded mb-2"
                    placeholder="Title *"
                    value={item.title}
                    onChange={(e) => updateContentItem(item.id, 'title', e.target.value)}
                  />
                  
                  <textarea
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Description *"
                    value={item.description}
                    onChange={(e) => updateContentItem(item.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Centered Content Items */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-white font-semibold flex items-center gap-2">
                  <Image size={18} />
                  Centered Content Items
                </label>
                <button
                  type="button"
                  onClick={addCenteredContentItem}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
              
              {centeredContentItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Centered Item {index + 1}</span>
                    {centeredContentItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCenteredContentItem(item.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block mb-1 text-white">Image (Optional)</label>
                    {item.preview && (
                      <img
                        src={item.preview}
                        className="w-full h-32 object-cover mb-2 rounded"
                        alt="Preview"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCenteredContentImage(item.id, e.target.files?.[0] || null)}
                      className="text-white w-full"
                    />
                  </div>
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded mb-2"
                    placeholder="Title *"
                    value={item.title}
                    onChange={(e) => updateCenteredContentItem(item.id, 'title', e.target.value)}
                  />
                  
                  <textarea
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Description *"
                    value={item.description}
                    onChange={(e) => updateCenteredContentItem(item.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 h-3 rounded mb-4">
                <div
                  className="h-full bg-[#C31616] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
                <div className="text-center text-white mt-1">{uploadProgress}%</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded hover:bg-red-700 transition"
                style={{ background: "#C31616", color: "white" }}
                onClick={submitForm}
                disabled={uploadProgress > 0}
              >
                {isEdit ? "Update Insight" : "Save Insight"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
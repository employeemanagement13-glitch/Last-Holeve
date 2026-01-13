"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search } from "lucide-react";
import { Update } from "@/types/datatypes";

export default function AdminUpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [search, setSearch] = useState("");

  // form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // progress
  const [uploadProgress, setUploadProgress] = useState(0);

  async function fetchUpdates() {
    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch updates error:", error);
    } else {
      setUpdates(data as Update[]);
    }
  }

  useEffect(() => {
    fetchUpdates();
  }, []);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setCategory("");
    setTitle("");
    setDescription("");
    setLink("");
    setImageFile(null);
    setImagePreview(null);
    setOpen(true);
  }

  function openEdit(update: Update) {
    setIsEdit(true);
    setEditingId(update.id);
    setCategory(update.category);
    setTitle(update.title);
    setDescription(update.description);
    setLink(update.link || "");
    setImageFile(null);
    setImagePreview(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/update-images/${update.image}`
    );
    setOpen(true);
  }

  function submitForm() {
    if (!category.trim() || !title.trim() || !description.trim()) {
      alert("Category, title & description are required");
      return;
    }
    if (!imageFile && !isEdit) {
      alert("Image is required for new update");
      return;
    }

    const fd = new FormData();
    fd.append("category", category);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("link", link);
    fd.append("isEdit", String(isEdit));
    if (isEdit && editingId) fd.append("id", editingId);
    if (imageFile) fd.append("image", imageFile);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/updates");
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
          fetchUpdates();
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

  async function handleDelete(update: Update) {
    if (!confirm("Delete this update?")) return;
    const resp = await fetch("/api/admin/updates-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: update.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchUpdates();
    } else {
      alert("Delete failed: " + (json.error || ""));
    }
  }

  return (
    <div className="adminSearchbar">
      <div className="flex items-center justify-between mb-4 bg-[#242424] py-3 px-5 rounded-lg">
        <div className="searchparent">
          <Search size={18} />
          <input
            placeholder="Search updates..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded buttonstyles"
        >
          Add Update
        </button>
      </div>

      <div className="space-y-3">
        {updates
          .filter((u) => 
            u.title.toLowerCase().includes(search.toLowerCase()) ||
            u.category.toLowerCase().includes(search.toLowerCase()) ||
            u.description.toLowerCase().includes(search.toLowerCase())
          )
          .map((u) => (
            <div
              key={u.id}
              className="p-4 flex justify-between items-center bg-[#242424] text-white rounded"
            >
              <div className="flex items-center space-x-4">
                {u.image && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/update-images/${u.image}`}
                    alt={u.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-gray-700 rounded">
                      {u.category}
                    </span>
                    <div className="font-semibold">{u.title}</div>
                  </div>
                  <div className="text-sm opacity-80 mt-1">{u.description}</div>
                  {u.link && (
                    <div className="text-sm mt-1">
                      <a href={u.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {u.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded buttonstyles"
                  onClick={() => openEdit(u)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 buttonstyles"
                  onClick={() => handleDelete(u)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-black p-6 w-200 max-h-[90vh] overflow-auto rounded">
            <h2 className="text-xl mb-3">{isEdit ? "Edit Update" : "Add Update"}</h2>
            
            <input
              className="w-full border p-2 mb-2 bg-gray-900 text-white"
              placeholder="Category (e.g., News, Event, Announcement)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            
            <input
              className="w-full border p-2 mb-2 bg-gray-900 text-white"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <textarea
              className="w-full border p-2 mb-2 bg-gray-900 text-white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            
            <input
              className="w-full border p-2 mb-2 bg-gray-900 text-white"
              placeholder="Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <div className="mb-3">
              <label className="block mb-1 text-white">Update Image</label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="w-full h-40 object-cover mb-2 rounded"
                  alt="Preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setImageFile(f);
                  if (f) setImagePreview(URL.createObjectURL(f));
                }}
                className="text-white"
              />
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 h-2 rounded mb-2">
                <div
                  className="h-full bg-[#C31616]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded"
                style={{ background: "#C31616", color: "white" }}
                onClick={submitForm}
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
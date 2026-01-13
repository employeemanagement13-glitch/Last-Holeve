"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search, Plus, Trash2, Image, MessageSquare, User, Link } from "lucide-react";

// Type definitions
type FeedbackItem = {
  id: string;
  image?: string;
  description: string;
  person: string;
  designation: string;
  linktext: string;
  link: string;
  file?: File | null;
  preview?: string | null;
};

type Feedback = {
  id: string;
  sectiontitle: string;
  feedbacks: FeedbackItem[];
  created_at: string;
};

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [search, setSearch] = useState("");

  // Form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Basic fields
  const [sectiontitle, setSectiontitle] = useState("");

  // Feedback items array
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([
    { 
      id: Date.now().toString(), 
      description: "", 
      person: "", 
      designation: "", 
      linktext: "", 
      link: "" 
    }
  ]);

  // Progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch feedbacks
  async function fetchFeedbacks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Fetch feedbacks error:", error);
    } else {
      const parsedData = data.map(item => ({
        ...item,
        feedbacks: typeof item.feedbacks === 'string' ? JSON.parse(item.feedbacks) : item.feedbacks
      }));
      setFeedbacks(parsedData as Feedback[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Form reset
  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    resetForm();
    setOpen(true);
  }

  function resetForm() {
    setSectiontitle("");
    setFeedbackItems([
      { 
        id: Date.now().toString(), 
        description: "", 
        person: "", 
        designation: "", 
        linktext: "", 
        link: "" 
      }
    ]);
  }

  // Edit feedback
  function openEdit(feedback: Feedback) {
    setIsEdit(true);
    setEditingId(feedback.id);
    setSectiontitle(feedback.sectiontitle);
    
    // Set feedback items
    if (feedback.feedbacks && feedback.feedbacks.length > 0) {
      setFeedbackItems(feedback.feedbacks.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/feedback-images/${item.image}` 
          : null
      })));
    } else {
      setFeedbackItems([
        { 
          id: Date.now().toString(), 
          description: "", 
          person: "", 
          designation: "", 
          linktext: "", 
          link: "" 
        }
      ]);
    }
    
    setOpen(true);
  }

  // Feedback items array handlers
  const addFeedbackItem = () => {
    setFeedbackItems([
      ...feedbackItems,
      { 
        id: Date.now().toString() + Math.random(), 
        description: "", 
        person: "", 
        designation: "", 
        linktext: "", 
        link: "" 
      }
    ]);
  };

  const removeFeedbackItem = (id: string) => {
    if (feedbackItems.length > 1) {
      setFeedbackItems(feedbackItems.filter(item => item.id !== id));
    }
  };

  const updateFeedbackItem = (id: string, field: keyof FeedbackItem, value: any) => {
    setFeedbackItems(feedbackItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleFeedbackImage = (id: string, file: File | null) => {
    setFeedbackItems(feedbackItems.map(item => {
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

  // Submit form
  function submitForm() {
    if (!sectiontitle.trim()) {
      alert("Section title is required");
      return;
    }

    // Validate feedback items
    for (const item of feedbackItems) {
      if (!item.description.trim()) {
        alert("All feedback items must have a description");
        return;
      }
      if (!item.person.trim()) {
        alert("All feedback items must have a person name");
        return;
      }
    }

    const fd = new FormData();
    fd.append("sectiontitle", sectiontitle);
    
    // Prepare feedback items for JSON (remove file and preview fields)
    const feedbacksForJson = feedbackItems.map(({ file, preview, ...rest }) => rest);
    fd.append("feedbacks", JSON.stringify(feedbacksForJson));
    
    fd.append("isEdit", String(isEdit));
    
    if (isEdit && editingId) fd.append("id", editingId);
    
    // Add feedback item files
    feedbackItems.forEach((item) => {
      if (item.file) {
        fd.append(`feedbackImage_${item.id}`, item.file);
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/feedbacks");
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
          fetchFeedbacks();
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

  // Delete feedback
  async function handleDelete(feedback: Feedback) {
    if (!confirm("Delete this feedback section?")) return;
    const resp = await fetch("/api/admin/feedbacks-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: feedback.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchFeedbacks();
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
            placeholder="Search feedbacks..."
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
          Add Feedback Section
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading feedbacks...</div>
      ) : (
        <div className="space-y-3">
          {feedbacks
            .filter((f) => 
              f.sectiontitle.toLowerCase().includes(search.toLowerCase())
            )
            .map((f) => (
              <div
                key={f.id}
                className="p-4 flex justify-between items-center bg-[#242424] text-white rounded"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-gray-700 rounded">
                    <MessageSquare size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">{f.sectiontitle}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        Feedback Items: {f.feedbacks?.length || 0}
                      </span>
                      <span>
                        Created: {new Date(f.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded buttonstyles"
                    onClick={() => openEdit(f)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 buttonstyles"
                    onClick={() => handleDelete(f)}
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
            <h2 className="text-2xl mb-4 font-bold">{isEdit ? "Edit Feedback Section" : "Add Feedback Section"}</h2>
            
            {/* Section Title */}
            <div className="mb-6">
              <label className="block mb-1 text-white">Section Title *</label>
              <input
                className="w-full border p-2 bg-gray-900 text-white rounded"
                placeholder="e.g., Client Testimonials, Customer Feedback"
                value={sectiontitle}
                onChange={(e) => setSectiontitle(e.target.value)}
              />
            </div>

            {/* Feedback Items */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare size={18} />
                  Feedback Items
                </h3>
                <button
                  type="button"
                  onClick={addFeedbackItem}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Feedback
                </button>
              </div>
              
              {feedbackItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Feedback Item {index + 1}</span>
                    {feedbackItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeedbackItem(item.id)}
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
                        className="w-24 h-24 object-cover mb-2 rounded-full"
                        alt="Preview"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFeedbackImage(item.id, e.target.files?.[0] || null)}
                      className="text-white w-full"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block mb-1 text-white">Description *</label>
                    <textarea
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Feedback text"
                      value={item.description}
                      onChange={(e) => updateFeedbackItem(item.id, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block mb-1 text-white">Person *</label>
                      <input
                        className="w-full border p-2 bg-gray-800 text-white rounded"
                        placeholder="Name"
                        value={item.person}
                        onChange={(e) => updateFeedbackItem(item.id, 'person', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-white">Designation</label>
                      <input
                        className="w-full border p-2 bg-gray-800 text-white rounded"
                        placeholder="e.g., CEO, Manager"
                        value={item.designation}
                        onChange={(e) => updateFeedbackItem(item.id, 'designation', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block mb-1 text-white flex items-center gap-1">
                        <Link size={14} />
                        Link Text
                      </label>
                      <input
                        className="w-full border p-2 bg-gray-800 text-white rounded"
                        placeholder="e.g., Read More, View Project"
                        value={item.linktext}
                        onChange={(e) => updateFeedbackItem(item.id, 'linktext', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-white flex items-center gap-1">
                        <Link size={14} />
                        Link URL
                      </label>
                      <input
                        className="w-full border p-2 bg-gray-800 text-white rounded"
                        placeholder="https://example.com"
                        value={item.link}
                        onChange={(e) => updateFeedbackItem(item.id, 'link', e.target.value)}
                      />
                    </div>
                  </div>
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
                {isEdit ? "Update Feedback" : "Save Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
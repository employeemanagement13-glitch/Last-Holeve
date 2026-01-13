"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search, Plus, Trash2, Image, Phone, MapPin, User, Briefcase } from "lucide-react";

type ContentItem = {
  id: string;
  image?: string;
  title: string;
  description: string;
  file?: File | null;
  preview?: string | null;
};

type LeaderItem = {
  id: string;
  image?: string;
  name: string;
  designation: string;
  link: string;
  file?: File | null;
  preview?: string | null;
};

type WorkByItem = {
  id: string;
  image?: string;
  name: string;
  location: string;
  link: string;
  file?: File | null;
  preview?: string | null;
};

type Studio = {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // New field
  socials: {
    facebook: string;
    x: string;
    instagram: string;
    linkedin: string;
  };
  projectname: string;
  location: string;
  phone: string[];
  content: ContentItem[];
  leaders: LeaderItem[];
  workby: WorkByItem[];
  created_at: string;
};

export default function AdminStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [search, setSearch] = useState("");

  // form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectname, setProjectname] = useState("");
  const [location, setLocation] = useState("");
  
  // Main image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Social media fields
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  
  // Phone numbers
  const [phones, setPhones] = useState<string[]>([""]);
  
  // Content array
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: Date.now().toString(), title: "", description: "" }
  ]);
  
  // Leaders array
  const [leaderItems, setLeaderItems] = useState<LeaderItem[]>([
    { id: Date.now().toString(), name: "", designation: "", link: "" }
  ]);
  
  // Work by array
  const [workByItems, setWorkByItems] = useState<WorkByItem[]>([
    { id: Date.now().toString(), name: "", location: "", link: "" }
  ]);

  // progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchStudios() {
    setLoading(true);
    const { data, error } = await supabase
      .from("studios")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Fetch studios error:", error);
    } else {
      // Parse JSON strings if needed
      const parsedData = data.map(item => ({
        ...item,
        socials: typeof item.socials === 'string' ? JSON.parse(item.socials) : item.socials,
        content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content,
        leaders: typeof item.leaders === 'string' ? JSON.parse(item.leaders) : item.leaders,
        workby: typeof item.workby === 'string' ? JSON.parse(item.workby) : item.workby
      }));
      setStudios(parsedData as Studio[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStudios();
  }, []);

  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setProjectname("");
    setLocation("");
    setImageFile(null);
    setImagePreview(null);
    setFacebook("");
    setTwitter("");
    setInstagram("");
    setLinkedin("");
    setPhones([""]);
    setContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    setLeaderItems([{ id: Date.now().toString(), name: "", designation: "", link: "" }]);
    setWorkByItems([{ id: Date.now().toString(), name: "", location: "", link: "" }]);
    setOpen(true);
  }

  function openEdit(studio: Studio) {
    setIsEdit(true);
    setEditingId(studio.id);
    setTitle(studio.title);
    setDescription(studio.description);
    setProjectname(studio.projectname || "");
    setLocation(studio.location);
    
    // Set main image preview
    if (studio.imageUrl) {
      setImagePreview(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${studio.imageUrl}`
      );
    }
    
    // Set social media
    setFacebook(studio.socials?.facebook || "");
    setTwitter(studio.socials?.x || "");
    setInstagram(studio.socials?.instagram || "");
    setLinkedin(studio.socials?.linkedin || "");
    
    // Set phone numbers
    setPhones(studio.phone && studio.phone.length > 0 ? studio.phone : [""]);
    
    // Set content items
    if (studio.content && studio.content.length > 0) {
      setContentItems(studio.content.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${item.image}` 
          : null
      })));
    } else {
      setContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    }
    
    // Set leader items
    if (studio.leaders && studio.leaders.length > 0) {
      setLeaderItems(studio.leaders.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${item.image}` 
          : null
      })));
    } else {
      setLeaderItems([{ id: Date.now().toString(), name: "", designation: "", link: "" }]);
    }
    
    // Set work by items
    if (studio.workby && studio.workby.length > 0) {
      setWorkByItems(studio.workby.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${item.image}` 
          : null
      })));
    } else {
      setWorkByItems([{ id: Date.now().toString(), name: "", location: "", link: "" }]);
    }
    
    setOpen(true);
  }

  // Phone array handlers
  const addPhone = () => {
    setPhones([...phones, ""]);
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

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

  // Leaders array handlers
  const addLeaderItem = () => {
    setLeaderItems([
      ...leaderItems,
      { id: Date.now().toString() + Math.random(), name: "", designation: "", link: "" }
    ]);
  };

  const removeLeaderItem = (id: string) => {
    if (leaderItems.length > 1) {
      setLeaderItems(leaderItems.filter(item => item.id !== id));
    }
  };

  const updateLeaderItem = (id: string, field: keyof LeaderItem, value: any) => {
    setLeaderItems(leaderItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleLeaderImage = (id: string, file: File | null) => {
    setLeaderItems(leaderItems.map(item => {
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

  // Work by array handlers
  const addWorkByItem = () => {
    setWorkByItems([
      ...workByItems,
      { id: Date.now().toString() + Math.random(), name: "", location: "", link: "" }
    ]);
  };

  const removeWorkByItem = (id: string) => {
    if (workByItems.length > 1) {
      setWorkByItems(workByItems.filter(item => item.id !== id));
    }
  };

  const updateWorkByItem = (id: string, field: keyof WorkByItem, value: any) => {
    setWorkByItems(workByItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleWorkByImage = (id: string, file: File | null) => {
    setWorkByItems(workByItems.map(item => {
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
    if (!title.trim() || !description.trim() || !location.trim()) {
      alert("Title, description and location are required");
      return;
    }

    // For new studio, image is required
    if (!isEdit && !imageFile) {
      alert("Main studio image is required for new studio");
      return;
    }

    // Validate phone numbers
    for (const phone of phones) {
      if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
        alert("Please enter valid phone numbers");
        return;
      }
    }

    // Validate content items
    for (const item of contentItems) {
      if (!item.title.trim() || !item.description.trim()) {
        alert("All content items must have both title and description");
        return;
      }
    }

    // Validate leader items
    for (const item of leaderItems) {
      if (!item.name.trim() || !item.designation.trim()) {
        alert("All leader items must have both name and designation");
        return;
      }
    }

    // Validate work by items
    for (const item of workByItems) {
      if (!item.name.trim() || !item.location.trim()) {
        alert("All work by items must have both name and location");
        return;
      }
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("projectname", projectname);
    fd.append("location", location);
    
    // Social media
    const socials = {
      facebook: facebook.trim(),
      x: twitter.trim(),
      instagram: instagram.trim(),
      linkedin: linkedin.trim()
    };
    fd.append("socials", JSON.stringify(socials));
    
    // Phone numbers (filter empty strings)
    fd.append("phone", JSON.stringify(phones.filter(p => p.trim())));
    
    // Prepare arrays for JSON (remove file and preview fields)
    const contentForJson = contentItems.map(({ file, preview, ...rest }) => rest);
    fd.append("content", JSON.stringify(contentForJson));
    
    const leadersForJson = leaderItems.map(({ file, preview, ...rest }) => rest);
    fd.append("leaders", JSON.stringify(leadersForJson));
    
    const workbyForJson = workByItems.map(({ file, preview, ...rest }) => rest);
    fd.append("workby", JSON.stringify(workbyForJson));
    
    fd.append("isEdit", String(isEdit));
    
    if (isEdit && editingId) fd.append("id", editingId);
    
    // Add main image file
    if (imageFile) {
      fd.append("image", imageFile);
    }
    
    // Add content item files
    contentItems.forEach((item) => {
      if (item.file) {
        fd.append(`contentImage_${item.id}`, item.file);
      }
    });
    
    // Add leader item files
    leaderItems.forEach((item) => {
      if (item.file) {
        fd.append(`leaderImage_${item.id}`, item.file);
      }
    });
    
    // Add work by item files
    workByItems.forEach((item) => {
      if (item.file) {
        fd.append(`workbyImage_${item.id}`, item.file);
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/studios");
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
          fetchStudios();
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

  async function handleDelete(studio: Studio) {
    if (!confirm("Delete this studio?")) return;
    const resp = await fetch("/api/admin/studios-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: studio.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchStudios();
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
            placeholder="Search studios..."
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
          Add Studio
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading studios...</div>
      ) : (
        <div className="space-y-3">
          {studios
            .filter((s) => 
              s.title.toLowerCase().includes(search.toLowerCase()) ||
              s.location.toLowerCase().includes(search.toLowerCase()) ||
              s.projectname?.toLowerCase().includes(search.toLowerCase())
            )
            .map((s) => (
              <div
                key={s.id}
                className="p-4 flex justify-between items-center bg-[#242424] text-white rounded"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {s.imageUrl && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-images/${s.imageUrl}`}
                      alt={s.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 text-xs bg-gray-700 rounded flex items-center gap-1">
                        <MapPin size={12} />
                        {s.location}
                      </span>
                      <div className="font-semibold text-lg">{s.title}</div>
                    </div>
                    <div className="text-sm text-gray-300 mb-1 line-clamp-2">
                      {s.description}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {s.projectname && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {s.projectname}
                        </span>
                      )}
                      <span>Content: {s.content?.length || 0}</span>
                      <span>Leaders: {s.leaders?.length || 0}</span>
                      <span>Work: {s.workby?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded buttonstyles"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 buttonstyles"
                    onClick={() => handleDelete(s)}
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
            <h2 className="text-2xl mb-4 font-bold">{isEdit ? "Edit Studio" : "Add Studio"}</h2>
            
            {/* Main Image */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <label className="block mb-2 text-white font-semibold flex items-center gap-2">
                <Image size={18} />
                Main Studio Image {!isEdit && "*"}
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="w-full h-48 object-cover mb-2 rounded"
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
                className="text-white w-full"
              />
              {!isEdit && (
                <p className="text-sm text-gray-400 mt-1">
                  * Required for new studio
                </p>
              )}
            </div>

            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-white">Title *</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Studio Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Location *</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-white">Project Name</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Project Name (optional)"
                  value={projectname}
                  onChange={(e) => setProjectname(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-white">Description *</label>
                <textarea
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Studio description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                <Image size={18} />
                Social Media
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-white">Facebook</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Facebook URL"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Twitter/X</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Twitter/X URL"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Instagram</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Instagram URL"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">LinkedIn</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="LinkedIn URL"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Phone size={18} />
                  Phone Numbers
                </h3>
                <button
                  type="button"
                  onClick={addPhone}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Phone
                </button>
              </div>
              
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded flex items-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Content Items */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Image size={18} />
                  Content Items
                </h3>
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

            {/* Leaders */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User size={18} />
                  Leaders
                </h3>
                <button
                  type="button"
                  onClick={addLeaderItem}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Leader
                </button>
              </div>
              
              {leaderItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Leader {index + 1}</span>
                    {leaderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLeaderItem(item.id)}
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
                      onChange={(e) => handleLeaderImage(item.id, e.target.files?.[0] || null)}
                      className="text-white w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Name *"
                      value={item.name}
                      onChange={(e) => updateLeaderItem(item.id, 'name', e.target.value)}
                    />
                    
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Designation *"
                      value={item.designation}
                      onChange={(e) => updateLeaderItem(item.id, 'designation', e.target.value)}
                    />
                  </div>
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Link (optional)"
                    value={item.link}
                    onChange={(e) => updateLeaderItem(item.id, 'link', e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Work By */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Briefcase size={18} />
                  Work By
                </h3>
                <button
                  type="button"
                  onClick={addWorkByItem}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Work
                </button>
              </div>
              
              {workByItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Work {index + 1}</span>
                    {workByItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkByItem(item.id)}
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
                      onChange={(e) => handleWorkByImage(item.id, e.target.files?.[0] || null)}
                      className="text-white w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Name *"
                      value={item.name}
                      onChange={(e) => updateWorkByItem(item.id, 'name', e.target.value)}
                    />
                    
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Location *"
                      value={item.location}
                      onChange={(e) => updateWorkByItem(item.id, 'location', e.target.value)}
                    />
                  </div>
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Link (optional)"
                    value={item.link}
                    onChange={(e) => updateWorkByItem(item.id, 'link', e.target.value)}
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
                {isEdit ? "Update Studio" : "Save Studio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
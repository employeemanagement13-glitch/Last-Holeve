"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Search, Plus, Trash2, Calendar, Image, MapPin, User, Award, Quote, Building } from "lucide-react";

// Type definitions
type Studio = {
  id: string;
  title: string;
};

type Person = {
  id: string;
  name: string;
  designation: string;
  imageUrl?: string;
  link: string;
  file?: File | null;
  preview?: string | null;
};

type ContentItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageContent?: string;
  file?: File | null;
  preview?: string | null;
};

type NotedItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  linkcontent: string;
};

type CenteredContentItem = {
  id: string;
  image?: string;
  title: string;
  description: string;
  file?: File | null;
  preview?: string | null;
};

type QuoteType = {
  quotecontent: string;
  quotereference: string;
};

type Work = {
  id: string;
  title: string;
  location: string;
  projectimage: string;
  bannerimage: string; // Changed from bannerImage to bannerimage
  bannerheading: string;
  bannercontent: string;
  client: string;
  size: string;
  sustainability: string;
  cmpdate: string;
  studioid: string;
  people: Person[];
  awards: string[];
  content: ContentItem[];
  noted: NotedItem[];
  centeredcontent: CenteredContentItem[]; // Changed from centeredContent to centeredcontent
  quote: QuoteType;
  created_at: string;
};

export default function AdminWorkPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [search, setSearch] = useState("");

  // Form state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Basic fields
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [size, setSize] = useState("");
  const [sustainability, setSustainability] = useState("");
  const [cmpdate, setCmpdate] = useState("");
  const [bannerheading, setBannerheading] = useState("");
  const [bannercontent, setBannercontent] = useState("");
  const [selectedStudioId, setSelectedStudioId] = useState<string>("");

  // Main images
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  // Arrays
  const [people, setPeople] = useState<Person[]>([
    { id: Date.now().toString(), name: "", designation: "", link: "" }
  ]);
  const [awards, setAwards] = useState<string[]>([""]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: Date.now().toString(), title: "", description: "" }
  ]);
  const [notedItems, setNotedItems] = useState<NotedItem[]>([
    { id: Date.now().toString(), title: "", description: "", link: "", linkcontent: "" }
  ]);
  const [centeredContentItems, setCenteredContentItems] = useState<CenteredContentItem[]>([
    { id: Date.now().toString(), title: "", description: "" }
  ]);

  // Quote
  const [quote, setQuote] = useState<QuoteType>({
    quotecontent: "",
    quotereference: ""
  });

  // Progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStudios, setLoadingStudios] = useState(true);

  // Fetch works
  async function fetchWorks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("cmpdate", { ascending: false });
    
    if (error) {
      console.error("Fetch works error:", error);
    } else {
      const parsedData = data.map(item => ({
        ...item,
        people: typeof item.people === 'string' ? JSON.parse(item.people) : item.people,
        awards: typeof item.awards === 'string' ? JSON.parse(item.awards) : item.awards,
        content: typeof item.content === 'string' ? JSON.parse(item.content) : item.content,
        noted: typeof item.noted === 'string' ? JSON.parse(item.noted) : item.noted,
        centeredcontent: typeof item.centeredcontent === 'string' ? JSON.parse(item.centeredcontent) : item.centeredcontent,
        quote: typeof item.quote === 'string' ? JSON.parse(item.quote) : item.quote
      }));
      setWorks(parsedData as Work[]);
    }
    setLoading(false);
  }

  // Fetch studios
  async function fetchStudios() {
    setLoadingStudios(true);
    const { data, error } = await supabase
      .from("studios")
      .select("id, title")
      .order("title");
    
    if (error) {
      console.error("Fetch studios error:", error);
    } else {
      setStudios(data || []);
    }
    setLoadingStudios(false);
  }

  useEffect(() => {
    fetchWorks();
    fetchStudios();
  }, []);

  // Form reset
  function openAdd() {
    setIsEdit(false);
    setEditingId(null);
    resetForm();
    setOpen(true);
  }

  function resetForm() {
    setTitle("");
    setLocation("");
    setClient("");
    setSize("");
    setSustainability("");
    setCmpdate("");
    setBannerheading("");
    setBannercontent("");
    setSelectedStudioId("");
    setProjectImageFile(null);
    setProjectImagePreview(null);
    setBannerImageFile(null);
    setBannerImagePreview(null);
    setPeople([{ id: Date.now().toString(), name: "", designation: "", link: "" }]);
    setAwards([""]);
    setContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    setNotedItems([{ id: Date.now().toString(), title: "", description: "", link: "", linkcontent: "" }]);
    setCenteredContentItems([{ id: Date.now().toString(), title: "", description: "" }]);
    setQuote({ quotecontent: "", quotereference: "" });
  }

  // Edit work
  function openEdit(work: Work) {
    setIsEdit(true);
    setEditingId(work.id);
    setTitle(work.title);
    setLocation(work.location);
    setClient(work.client || "");
    setSize(work.size || "");
    setSustainability(work.sustainability || "");
    setCmpdate(work.cmpdate);
    setBannerheading(work.bannerheading || "");
    setBannercontent(work.bannercontent || "");
    setSelectedStudioId(work.studioid || "");
    
    // Set image previews
    if (work.projectimage) {
      setProjectImagePreview(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${work.projectimage}`
      );
    }
    
    if (work.bannerimage) {
      setBannerImagePreview(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${work.bannerimage}`
      );
    }
    
    // Set people
    if (work.people && work.people.length > 0) {
      setPeople(work.people.map(person => ({
        ...person,
        id: person.id || Date.now().toString() + Math.random(),
        preview: person.imageUrl ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${person.imageUrl}` 
          : null
      })));
    }
    
    // Set arrays
    setAwards(work.awards && work.awards.length > 0 ? work.awards : [""]);
    setContentItems(work.content && work.content.length > 0 ? work.content.map(item => ({
      ...item,
      id: item.id || Date.now().toString() + Math.random(),
      preview: item.imageUrl ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${item.imageUrl}` 
        : null
    })) : [{ id: Date.now().toString(), title: "", description: "" }]);
    
    setNotedItems(work.noted && work.noted.length > 0 ? work.noted : 
      [{ id: Date.now().toString(), title: "", description: "", link: "", linkcontent: "" }]);
    
    setCenteredContentItems(work.centeredcontent && work.centeredcontent.length > 0 ? 
      work.centeredcontent.map(item => ({
        ...item,
        id: item.id || Date.now().toString() + Math.random(),
        preview: item.image ? 
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${item.image}` 
          : null
      })) : [{ id: Date.now().toString(), title: "", description: "" }]);
    
    setQuote(work.quote || { quotecontent: "", quotereference: "" });
    setOpen(true);
  }

  // Array handlers for People
  const addPerson = () => {
    setPeople([...people, { id: Date.now().toString() + Math.random(), name: "", designation: "", link: "" }]);
  };

  const removePerson = (id: string) => {
    if (people.length > 1) {
      setPeople(people.filter(person => person.id !== id));
    }
  };

  const updatePerson = (id: string, field: keyof Person, value: any) => {
    setPeople(people.map(person =>
      person.id === id ? { ...person, [field]: value } : person
    ));
  };

  const handlePersonImage = (id: string, file: File | null) => {
    setPeople(people.map(person => {
      if (person.id === id) {
        return {
          ...person,
          file: file,
          preview: file ? URL.createObjectURL(file) : person.preview
        };
      }
      return person;
    }));
  };

  // Array handlers for Awards
  const addAward = () => {
    setAwards([...awards, ""]);
  };

  const removeAward = (index: number) => {
    if (awards.length > 1) {
      setAwards(awards.filter((_, i) => i !== index));
    }
  };

  const updateAward = (index: number, value: string) => {
    const newAwards = [...awards];
    newAwards[index] = value;
    setAwards(newAwards);
  };

  // Array handlers for Content Items
  const addContentItem = () => {
    setContentItems([...contentItems, { 
      id: Date.now().toString() + Math.random(), 
      title: "", 
      description: "" 
    }]);
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

  // Array handlers for Noted Items
  const addNotedItem = () => {
    setNotedItems([...notedItems, { 
      id: Date.now().toString() + Math.random(), 
      title: "", 
      description: "", 
      link: "", 
      linkcontent: "" 
    }]);
  };

  const removeNotedItem = (id: string) => {
    if (notedItems.length > 1) {
      setNotedItems(notedItems.filter(item => item.id !== id));
    }
  };

  const updateNotedItem = (id: string, field: keyof NotedItem, value: any) => {
    setNotedItems(notedItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Array handlers for Centered Content
  const addCenteredContentItem = () => {
    setCenteredContentItems([...centeredContentItems, { 
      id: Date.now().toString() + Math.random(), 
      title: "", 
      description: "" 
    }]);
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

  // Submit form
  function submitForm() {
    if (!title.trim() || !location.trim() || !cmpdate) {
      alert("Title, location and date are required");
      return;
    }

    // For new work, project image is required
    if (!isEdit && !projectImageFile) {
      alert("Project image is required for new work");
      return;
    }

    // Validate required fields in arrays
    for (const person of people) {
      if (!person.name.trim()) {
        alert("All people must have a name");
        return;
      }
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("location", location);
    fd.append("client", client);
    fd.append("size", size);
    fd.append("sustainability", sustainability);
    fd.append("cmpdate", cmpdate);
    fd.append("bannerheading", bannerheading);
    fd.append("bannercontent", bannercontent);
    fd.append("studioid", selectedStudioId);
    
    // Prepare arrays for JSON - use centeredcontent (lowercase) for form data
    const peopleForJson = people.map(({ file, preview, ...rest }) => rest);
    fd.append("people", JSON.stringify(peopleForJson));
    
    // Filter empty awards
    fd.append("awards", JSON.stringify(awards.filter(a => a.trim())));
    
    const contentForJson = contentItems.map(({ file, preview, ...rest }) => rest);
    fd.append("content", JSON.stringify(contentForJson));
    
    fd.append("noted", JSON.stringify(notedItems));
    
    const centeredContentForJson = centeredContentItems.map(({ file, preview, ...rest }) => rest);
    fd.append("centeredcontent", JSON.stringify(centeredContentForJson)); // lowercase!
    
    fd.append("quote", JSON.stringify(quote));
    fd.append("isEdit", String(isEdit));
    
    if (isEdit && editingId) fd.append("id", editingId);
    
    // Add main images
    if (projectImageFile) fd.append("projectImage", projectImageFile);
    if (bannerImageFile) fd.append("bannerImage", bannerImageFile);
    
    // Add people images
    people.forEach((person) => {
      if (person.file) {
        fd.append(`personImage_${person.id}`, person.file);
      }
    });
    
    // Add content images
    contentItems.forEach((item) => {
      if (item.file) {
        fd.append(`contentImage_${item.id}`, item.file);
      }
    });
    
    // Add centered content images
    centeredContentItems.forEach((item) => {
      if (item.file) {
        fd.append(`centeredContentImage_${item.id}`, item.file);
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/work");
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
          fetchWorks();
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

  // Delete work
  async function handleDelete(work: Work) {
    if (!confirm("Delete this work?")) return;
    const resp = await fetch("/api/admin/work-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: work.id }),
    });
    const json = await resp.json();
    if (json.success) {
      fetchWorks();
    } else {
      alert("Delete failed: " + (json.error || ""));
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filtered works for search
  const filteredWorks = works.filter((w) => 
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.location.toLowerCase().includes(search.toLowerCase()) ||
    w.client?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adminSearchbar">
      <div className="flex items-center justify-between mb-4 bg-[#242424] py-3 px-5 rounded-lg">
        <div className="searchparent">
          <Search size={18} />
          <input
            placeholder="Search works..."
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
          Add Work
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading works...</div>
      ) : (
        <div className="space-y-3">
          {filteredWorks.map((w) => (
            <div
              key={w.id}
              className="p-4 flex justify-between items-center bg-[#242424] text-white rounded"
            >
              <div className="flex items-center space-x-4 flex-1">
                {w.projectimage && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/work-images/${w.projectimage}`}
                    alt={w.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 text-xs bg-gray-700 rounded flex items-center gap-1">
                      <MapPin size={12} />
                      {w.location}
                    </span>
                    <div className="font-semibold text-lg">{w.title}</div>
                  </div>
                  <div className="text-sm text-gray-300 mb-1">
                    {w.client && <span className="mr-4">Client: {w.client}</span>}
                    {w.size && <span className="mr-4">Size: {w.size}</span>}
                    {w.studioid && (
                      <span className="mr-4 flex items-center gap-1">
                        <Building size={12} />
                        Studio: {studios.find(s => s.id === w.studioid)?.title || "Unknown"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(w.cmpdate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      People: {w.people?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={14} />
                      Awards: {w.awards?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded buttonstyles"
                  onClick={() => openEdit(w)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 buttonstyles"
                  onClick={() => handleDelete(w)}
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
            <h2 className="text-2xl mb-4 font-bold">{isEdit ? "Edit Work" : "Add Work"}</h2>
            
            {/* Project Image */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <label className="mb-2 text-white font-semibold flex items-center gap-2">
                <Image size={18} />
                Project Image {!isEdit && "*"}
              </label>
              {projectImagePreview && (
                <img
                  src={projectImagePreview}
                  className="w-full h-48 object-cover mb-2 rounded"
                  alt="Preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setProjectImageFile(f);
                  if (f) setProjectImagePreview(URL.createObjectURL(f));
                }}
                className="text-white w-full"
              />
            </div>

            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">Basic Information</h3>
              
              {/* Studio Selection */}
              <div className="mb-4">
                <label className="mb-1 text-white flex items-center gap-2">
                  <Building size={16} />
                  Studio (Optional)
                </label>
                <select
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  value={selectedStudioId}
                  onChange={(e) => setSelectedStudioId(e.target.value)}
                >
                  <option value="">Select a studio</option>
                  {loadingStudios ? (
                    <option disabled>Loading studios...</option>
                  ) : (
                    studios.map((studio) => (
                      <option key={studio.id} value={studio.id}>
                        {studio.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-white">Title *</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Work Title"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-white">Client</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Size</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Size (e.g., 10,000 sq ft)"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-white">Sustainability</label>
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Sustainability rating"
                    value={sustainability}
                    onChange={(e) => setSustainability(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-white">Completion Date *</label>
                  <input
                    type="date"
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    value={cmpdate}
                    onChange={(e) => setCmpdate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Banner Section */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                <Image size={18} />
                Banner Section
              </h3>
              
              <div className="mb-4">
                <label className="block mb-1 text-white">Banner Image</label>
                {bannerImagePreview && (
                  <img
                    src={bannerImagePreview}
                    className="w-full h-48 object-cover mb-2 rounded"
                    alt="Banner Preview"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setBannerImageFile(f);
                    if (f) setBannerImagePreview(URL.createObjectURL(f));
                  }}
                  className="text-white w-full"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1 text-white">Banner Heading</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Banner heading"
                  value={bannerheading}
                  onChange={(e) => setBannerheading(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-white">Banner Content</label>
                <textarea
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Banner content"
                  value={bannercontent}
                  onChange={(e) => setBannercontent(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* People */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User size={18} />
                  People
                </h3>
                <button
                  type="button"
                  onClick={addPerson}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Person
                </button>
              </div>
              
              {people.map((person, index) => (
                <div key={person.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Person {index + 1}</span>
                    {people.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePerson(person.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label className="block mb-1 text-white">Image (Optional)</label>
                    {person.preview && (
                      <img
                        src={person.preview}
                        className="w-24 h-24 object-cover mb-2 rounded-full"
                        alt="Preview"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePersonImage(person.id, e.target.files?.[0] || null)}
                      className="text-white w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Name *"
                      value={person.name}
                      onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                    />
                    
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Designation"
                      value={person.designation}
                      onChange={(e) => updatePerson(person.id, 'designation', e.target.value)}
                    />
                  </div>
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Link (optional)"
                    value={person.link}
                    onChange={(e) => updatePerson(person.id, 'link', e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Awards */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award size={18} />
                  Awards
                </h3>
                <button
                  type="button"
                  onClick={addAward}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Award
                </button>
              </div>
              
              {awards.map((award, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    className="w-full border p-2 bg-gray-900 text-white rounded"
                    placeholder="Award name"
                    value={award}
                    onChange={(e) => updateAward(index, e.target.value)}
                  />
                  {awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
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
                  <Plus size={16} /> Add Content
                </button>
              </div>
              
              {contentItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Content {index + 1}</span>
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
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateContentItem(item.id, 'title', e.target.value)}
                  />
                  
                  <textarea
                    className="w-full border p-2 bg-gray-800 text-white rounded mb-2"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateContentItem(item.id, 'description', e.target.value)}
                    rows={2}
                  />
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Image Content (optional)"
                    value={item.imageContent || ''}
                    onChange={(e) => updateContentItem(item.id, 'imageContent', e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* Noted Items */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Image size={18} />
                  Noted Items
                </h3>
                <button
                  type="button"
                  onClick={addNotedItem}
                  className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                >
                  <Plus size={16} /> Add Note
                </button>
              </div>
              
              {notedItems.map((item, index) => (
                <div key={item.id} className="mb-6 p-3 bg-gray-900 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Note {index + 1}</span>
                    {notedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeNotedItem(item.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  
                  <input
                    className="w-full border p-2 bg-gray-800 text-white rounded mb-2"
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateNotedItem(item.id, 'title', e.target.value)}
                  />
                  
                  <textarea
                    className="w-full border p-2 bg-gray-800 text-white rounded mb-2"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateNotedItem(item.id, 'description', e.target.value)}
                    rows={2}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Link"
                      value={item.link}
                      onChange={(e) => updateNotedItem(item.id, 'link', e.target.value)}
                    />
                    
                    <input
                      className="w-full border p-2 bg-gray-800 text-white rounded"
                      placeholder="Link Content"
                      value={item.linkcontent}
                      onChange={(e) => updateNotedItem(item.id, 'linkcontent', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Centered Content */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Image size={18} />
                  Centered Content
                </h3>
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
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => updateCenteredContentItem(item.id, 'title', e.target.value)}
                  />
                  
                  <textarea
                    className="w-full border p-2 bg-gray-800 text-white rounded"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateCenteredContentItem(item.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mb-6 p-4 border border-gray-700 rounded">
              <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                <Quote size={18} />
                Quote
              </h3>
              
              <div className="mb-4">
                <label className="block mb-1 text-white">Quote Content</label>
                <textarea
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Quote text"
                  value={quote.quotecontent}
                  onChange={(e) => setQuote({...quote, quotecontent: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block mb-1 text-white">Quote Reference</label>
                <input
                  className="w-full border p-2 bg-gray-900 text-white rounded"
                  placeholder="Who said it"
                  value={quote.quotereference}
                  onChange={(e) => setQuote({...quote, quotereference: e.target.value})}
                />
              </div>
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
                {isEdit ? "Update Work" : "Save Work"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form data
    const title = (formData.get("title") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const client = (formData.get("client") as string)?.trim();
    const size = (formData.get("size") as string)?.trim();
    const sustainability = (formData.get("sustainability") as string)?.trim();
    const cmpdate = (formData.get("cmpdate") as string);
    const bannerheading = (formData.get("bannerheading") as string)?.trim();
    const bannercontent = (formData.get("bannercontent") as string)?.trim();
    const studioid = (formData.get("studioid") as string)?.trim() || null;
    const isEdit = formData.get("isEdit") === "true";
    const id = (formData.get("id") as string) || null;

    // Parse JSON data - note: centeredcontent not centeredContent
    const people = JSON.parse(formData.get("people") as string || "[]");
    const awards = JSON.parse(formData.get("awards") as string || "[]");
    const content = JSON.parse(formData.get("content") as string || "[]");
    const noted = JSON.parse(formData.get("noted") as string || "[]");
    const centeredcontent = JSON.parse(formData.get("centeredcontent") as string || "[]"); // lowercase!
    const quote = JSON.parse(formData.get("quote") as string || "{}");

    // Validation
    if (!title || !location || !cmpdate) {
      return NextResponse.json(
        { success: false, error: "Title, location and date are required" },
        { status: 400 }
      );
    }

    if (isEdit && !id) {
      return NextResponse.json(
        { success: false, error: "ID is required for edit" },
        { status: 400 }
      );
    }

    // Upload and get paths
    let projectimage: string | null = null;
    let bannerimage: string | null = null;
    const uploadedPersonImages: { [key: string]: string } = {};
    const uploadedContentImages: { [key: string]: string } = {};
    const uploadedCenteredContentImages: { [key: string]: string } = {};

    // Helper function to upload image
    const uploadImage = async (file: File, folder: string): Promise<string> => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      
      const { error } = await supabaseAdmin
        .storage
        .from("work-images")
        .upload(fileName, file);

      if (error) throw error;
      return fileName;
    };

    // Upload project image
    const projectImageFile = formData.get("projectImage") as File | null;
    if (projectImageFile && projectImageFile.size > 0) {
      projectimage = await uploadImage(projectImageFile, "project");
    }

    // Upload banner image
    const bannerImageFile = formData.get("bannerImage") as File | null;
    if (bannerImageFile && bannerImageFile.size > 0) {
      bannerimage = await uploadImage(bannerImageFile, "banner");
    }

    // Upload person images
    for (const person of people) {
      const file = formData.get(`personImage_${person.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "people");
        uploadedPersonImages[person.id] = path;
      }
    }

    // Upload content images
    for (const item of content) {
      const file = formData.get(`contentImage_${item.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "content");
        uploadedContentImages[item.id] = path;
      }
    }

    // Upload centered content images
    for (const item of centeredcontent) {
      const file = formData.get(`centeredContentImage_${item.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "centered-content");
        uploadedCenteredContentImages[item.id] = path;
      }
    }

    if (isEdit) {
      // Fetch old work
      const { data: oldWork, error: fetchErr } = await supabaseAdmin
        .from("works")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr) {
        return NextResponse.json(
          { success: false, error: "Work not found" },
          { status: 404 }
        );
      }

      // Parse old JSON fields
      const oldPeople = typeof oldWork.people === 'string' ? JSON.parse(oldWork.people) : oldWork.people;
      const oldContent = typeof oldWork.content === 'string' ? JSON.parse(oldWork.content) : oldWork.content;
      const oldCenteredcontent = typeof oldWork.centeredcontent === 'string' 
        ? JSON.parse(oldWork.centeredcontent) 
        : oldWork.centeredcontent;

      // Delete old images if new ones uploaded
      if (projectimage && oldWork.projectimage) {
        await supabaseAdmin.storage
          .from("work-images")
          .remove([oldWork.projectimage])
          .catch(console.error);
      }

      if (bannerimage && oldWork.bannerimage) {
        await supabaseAdmin.storage
          .from("work-images")
          .remove([oldWork.bannerimage])
          .catch(console.error);
      }

      // Delete old person images
      for (const oldPerson of oldPeople) {
        const newPerson = people.find((p: any) => p.id === oldPerson.id);
        if (!newPerson && oldPerson.imageUrl) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove([oldPerson.imageUrl])
            .catch(console.error);
        } else if (newPerson && uploadedPersonImages[newPerson.id] && oldPerson.imageUrl) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove([oldPerson.imageUrl])
            .catch(console.error);
        }
      }

      // Delete old content images
      for (const oldItem of oldContent) {
        const newItem = content.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.imageUrl) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove([oldItem.imageUrl])
            .catch(console.error);
        } else if (newItem && uploadedContentImages[newItem.id] && oldItem.imageUrl) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove([oldItem.imageUrl])
            .catch(console.error);
        }
      }

      // Delete old centered content images
      for (const oldItem of oldCenteredcontent) {
        const newItem = centeredcontent.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedCenteredContentImages[newItem.id] && oldItem.image) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Prepare data with image paths
      const updatedPeople = people.map((person: any) => ({
        ...person,
        imageUrl: uploadedPersonImages[person.id] || person.imageUrl || null
      }));

      const updatedContent = content.map((item: any) => ({
        ...item,
        imageUrl: uploadedContentImages[item.id] || item.imageUrl || null
      }));

      const updatedCenteredcontent = centeredcontent.map((item: any) => ({
        ...item,
        image: uploadedCenteredContentImages[item.id] || item.image || null
      }));

      // Update work - use exact column names from database
      const updateData: any = {
        title,
        location,
        client: client || null,
        size: size || null,
        sustainability: sustainability || null,
        cmpdate,
        bannerheading: bannerheading || null,
        bannercontent: bannercontent || null,
        studioid: studioid || null,
        people: updatedPeople,
        awards,
        content: updatedContent,
        noted,
        centeredcontent: updatedCenteredcontent, // lowercase!
        quote,
        updated_at: new Date().toISOString()
      };

      if (projectimage) updateData.projectimage = projectimage;
      if (bannerimage) updateData.bannerimage = bannerimage; // lowercase!

      const { data: updated, error: updateErr } = await supabaseAdmin
        .from("works")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateErr) {
        console.error("DB update error:", updateErr);
        return NextResponse.json(
          { success: false, error: "Failed to update work" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, work: updated });
    } else {
      // New work - validate project image
      if (!projectImageFile) {
        return NextResponse.json(
          { success: false, error: "Project image is required" },
          { status: 400 }
        );
      }

      // Prepare data with image paths
      const newPeople = people.map((person: any) => ({
        ...person,
        imageUrl: uploadedPersonImages[person.id] || null
      }));

      const newContent = content.map((item: any) => ({
        ...item,
        imageUrl: uploadedContentImages[item.id] || null
      }));

      const newCenteredcontent = centeredcontent.map((item: any) => ({
        ...item,
        image: uploadedCenteredContentImages[item.id] || null
      }));

      // Insert new work - use exact column names
      const { data, error: insertErr } = await supabaseAdmin
        .from("works")
        .insert({
          title,
          location,
          projectimage: projectimage!,
          bannerimage: bannerimage || null, // lowercase!
          bannerheading: bannerheading || null,
          bannercontent: bannercontent || null,
          client: client || null,
          size: size || null,
          sustainability: sustainability || null,
          cmpdate,
          studioid: studioid || null,
          people: newPeople,
          awards,
          content: newContent,
          noted,
          centeredcontent: newCenteredcontent, // lowercase!
          quote
        })
        .select()
        .single();

      if (insertErr) {
        console.error("DB insert error:", insertErr);
        // Clean up uploaded images
        const pathsToDelete: string[] = [];
        if (projectimage) pathsToDelete.push(projectimage);
        if (bannerimage) pathsToDelete.push(bannerimage);
        Object.values(uploadedPersonImages).forEach(path => pathsToDelete.push(path));
        Object.values(uploadedContentImages).forEach(path => pathsToDelete.push(path));
        Object.values(uploadedCenteredContentImages).forEach(path => pathsToDelete.push(path));
        
        if (pathsToDelete.length > 0) {
          await supabaseAdmin.storage
            .from("work-images")
            .remove(pathsToDelete)
            .catch(console.error);
        }
        
        return NextResponse.json(
          { success: false, error: "Failed to create work" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, work: data });
    }
  } catch (error: any) {
    console.error("Error processing work:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
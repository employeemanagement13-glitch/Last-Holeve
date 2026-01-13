import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form data
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const projectname = (formData.get("projectname") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const isEdit = formData.get("isEdit") === "true";
    const id = (formData.get("id") as string) || null;

    // Parse JSON data
    const socials = JSON.parse(formData.get("socials") as string || "{}");
    const phone = JSON.parse(formData.get("phone") as string || "[]");
    const content = JSON.parse(formData.get("content") as string || "[]");
    const leaders = JSON.parse(formData.get("leaders") as string || "[]");
    const workby = JSON.parse(formData.get("workby") as string || "[]");

    // Validation
    if (!title || !description || !location) {
      return NextResponse.json(
        { success: false, error: "Title, description and location are required" },
        { status: 400 }
      );
    }

    if (isEdit && !id) {
      return NextResponse.json(
        { success: false, error: "ID is required for edit" },
        { status: 400 }
      );
    }

    // Upload and get paths for images
    let imageUrl: string | null = null;
    const uploadedContentImages: { [key: string]: string } = {};
    const uploadedLeaderImages: { [key: string]: string } = {};
    const uploadedWorkbyImages: { [key: string]: string } = {};

    // Helper function to upload image
    const uploadImage = async (file: File, folder: string): Promise<string> => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      
      const { error } = await supabaseAdmin
        .storage
        .from("studio-images")
        .upload(fileName, file);

      if (error) throw error;
      return fileName;
    };

    // Upload main image
    const mainImageFile = formData.get("image") as File | null;
    if (mainImageFile && mainImageFile.size > 0) {
      imageUrl = await uploadImage(mainImageFile, "main");
    }

    // Upload content item images
    for (const item of content) {
      const file = formData.get(`contentImage_${item.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "content");
        uploadedContentImages[item.id] = path;
      }
    }

    // Upload leader images
    for (const item of leaders) {
      const file = formData.get(`leaderImage_${item.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "leaders");
        uploadedLeaderImages[item.id] = path;
      }
    }

    // Upload work by images
    for (const item of workby) {
      const file = formData.get(`workbyImage_${item.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "workby");
        uploadedWorkbyImages[item.id] = path;
      }
    }

    if (isEdit) {
      // Fetch old studio
      const { data: oldStudio, error: fetchErr } = await supabaseAdmin
        .from("studios")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr) {
        return NextResponse.json(
          { success: false, error: "Studio not found" },
          { status: 404 }
        );
      }

      // Parse old JSON fields
      const oldContent = typeof oldStudio.content === 'string' ? JSON.parse(oldStudio.content) : oldStudio.content;
      const oldLeaders = typeof oldStudio.leaders === 'string' ? JSON.parse(oldStudio.leaders) : oldStudio.leaders;
      const oldWorkby = typeof oldStudio.workby === 'string' ? JSON.parse(oldStudio.workby) : oldStudio.workby;

      // Delete old main image if new one uploaded
      if (imageUrl && oldStudio.imageUrl) {
        await supabaseAdmin.storage
          .from("studio-images")
          .remove([oldStudio.imageUrl])
          .catch(console.error);
      }

      // Delete old content images that are being replaced or removed
      for (const oldItem of oldContent) {
        const newItem = content.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          // Item was removed, delete its image
          await supabaseAdmin.storage
            .from("studio-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedContentImages[newItem.id] && oldItem.image) {
          // Item has new image, delete old one
          await supabaseAdmin.storage
            .from("studio-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Delete old leader images that are being replaced or removed
      for (const oldItem of oldLeaders) {
        const newItem = leaders.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          // Item was removed, delete its image
          await supabaseAdmin.storage
            .from("studio-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedLeaderImages[newItem.id] && oldItem.image) {
          // Item has new image, delete old one
          await supabaseAdmin.storage
            .from("studio-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Delete old workby images that are being replaced or removed
      for (const oldItem of oldWorkby) {
        const newItem = workby.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          // Item was removed, delete its image
          await supabaseAdmin.storage
            .from("studio-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedWorkbyImages[newItem.id] && oldItem.image) {
          // Item has new image, delete old one
          await supabaseAdmin.storage
            .from("studio-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Prepare arrays with image paths
      const updatedContent = content.map((item: any) => ({
        ...item,
        image: uploadedContentImages[item.id] || item.image || null
      }));

      const updatedLeaders = leaders.map((item: any) => ({
        ...item,
        image: uploadedLeaderImages[item.id] || item.image || null
      }));

      const updatedWorkby = workby.map((item: any) => ({
        ...item,
        image: uploadedWorkbyImages[item.id] || item.image || null
      }));

      // Build update object
      const updateData: any = {
        title,
        description,
        projectname: projectname || null,
        location,
        socials,
        phone,
        content: updatedContent,
        leaders: updatedLeaders,
        workby: updatedWorkby,
        updated_at: new Date().toISOString()
      };

      // Only update imageUrl if a new image was uploaded
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      // Update studio
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from("studios")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (updateErr) {
        console.error("DB update error:", updateErr);
        return NextResponse.json(
          { success: false, error: "Failed to update studio" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, studio: updated });
    } else {
      // New studio - validate main image
      if (!mainImageFile) {
        return NextResponse.json(
          { success: false, error: "Main studio image is required" },
          { status: 400 }
        );
      }

      // Prepare arrays with image paths
      const newContent = content.map((item: any) => ({
        ...item,
        image: uploadedContentImages[item.id] || null
      }));

      const newLeaders = leaders.map((item: any) => ({
        ...item,
        image: uploadedLeaderImages[item.id] || null
      }));

      const newWorkby = workby.map((item: any) => ({
        ...item,
        image: uploadedWorkbyImages[item.id] || null
      }));

      // Insert new studio
      const { data, error: insertErr } = await supabaseAdmin
        .from("studios")
        .insert({
          title,
          description,
          imageUrl: imageUrl!,
          projectname: projectname || null,
          location,
          socials,
          phone,
          content: newContent,
          leaders: newLeaders,
          workby: newWorkby
        })
        .select()
        .single();

      if (insertErr) {
        console.error("DB insert error:", insertErr);
        // Clean up uploaded images
        const pathsToDelete: string[] = [];
        if (imageUrl) pathsToDelete.push(imageUrl);
        Object.values(uploadedContentImages).forEach(path => pathsToDelete.push(path));
        Object.values(uploadedLeaderImages).forEach(path => pathsToDelete.push(path));
        Object.values(uploadedWorkbyImages).forEach(path => pathsToDelete.push(path));
        
        if (pathsToDelete.length > 0) {
          await supabaseAdmin.storage
            .from("studio-images")
            .remove(pathsToDelete)
            .catch(console.error);
        }
        
        return NextResponse.json(
          { success: false, error: "Failed to create studio" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, studio: data });
    }
  } catch (error: any) {
    console.error("Error processing studio:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
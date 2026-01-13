import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  const formData = await req.formData();

  const category = (formData.get("category") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const link = (formData.get("link") as string)?.trim();
  const isEdit = formData.get("isEdit") === "true";
  const id = (formData.get("id") as string) || null;

  const imageFile = formData.get("image") as File | null;

  // Validation
  if (!category || !title || !description) {
    return NextResponse.json(
      { success: false, error: "Category, title and description are required" },
      { status: 400 }
    );
  }

  if (!isEdit && !imageFile) {
    return NextResponse.json(
      { success: false, error: "Image is required for new update" },
      { status: 400 }
    );
  }

  if (isEdit && !id) {
    return NextResponse.json(
      { success: false, error: "ID is required for edit" },
      { status: 400 }
    );
  }

  let imagePath: string | null = null;

  // Upload image if provided
  if (imageFile) {
    const ext = imageFile.name.split('.').pop();
    imagePath = `updates/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from("update-images")
      .upload(imagePath, imageFile);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload image" },
        { status: 500 }
      );
    }
  }

  if (isEdit) {
    // Fetch old record to delete old image
    const { data: oldUpdate, error: fetchErr } = await supabaseAdmin
      .from("updates")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchErr) {
      return NextResponse.json(
        { success: false, error: "Update not found" },
        { status: 404 }
      );
    }

    // Delete old image if new one uploaded
    if (imagePath && oldUpdate?.image) {
      await supabaseAdmin
        .storage
        .from("update-images")
        .remove([oldUpdate.image])
        .catch(console.error);
    }

    // Build update object
    const updateData: any = {
      category,
      title,
      description,
      link: link || null,
    };
    if (imagePath) updateData.image = imagePath;

    // Update in database
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("updates")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("DB update error:", updateErr);
      return NextResponse.json(
        { success: false, error: "Failed to update update" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, update: updated });
  } else {
    // Insert new update
    const { data, error: insertErr } = await supabaseAdmin
      .from("updates")
      .insert({
        category,
        title,
        description,
        link: link || null,
        image: imagePath!,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);
      // Clean up uploaded image if insert fails
      if (imagePath) {
        await supabaseAdmin
          .storage
          .from("update-images")
          .remove([imagePath])
          .catch(console.error);
      }
      return NextResponse.json(
        { success: false, error: "Failed to create update" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, update: data });
  }
}
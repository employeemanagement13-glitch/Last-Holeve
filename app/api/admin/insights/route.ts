import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form data
    const title = (formData.get("title") as string)?.trim();
    const reference = (formData.get("reference") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const cmpdate = (formData.get("cmpdate") as string);
    const factBoldText = (formData.get("factBoldText") as string)?.trim();
    const isEdit = formData.get("isEdit") === "true";
    const id = (formData.get("id") as string) || null;

    // Parse JSON arrays
    const content = JSON.parse(formData.get("content") as string || "[]");
    const centeredcontent = JSON.parse(formData.get("centeredcontent") as string || "[]");

    // Validation
    if (!title || !category || !cmpdate) {
      return NextResponse.json(
        { success: false, error: "Title, category and date are required" },
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
    let centeredImagePath: string | null = null;
    let factImagePath: string | null = null;
    const uploadedContentImages: { [key: string]: string } = {};
    const uploadedCenteredContentImages: { [key: string]: string } = {};

    // Helper function to upload image
    const uploadImage = async (file: File, folder: string): Promise<string> => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      
      const { error } = await supabaseAdmin
        .storage
        .from("insight-images")
        .upload(fileName, file);

      if (error) throw error;
      return fileName;
    };

    // Upload centered image
    const centeredImageFile = formData.get("centeredImage") as File | null;
    if (centeredImageFile && centeredImageFile.size > 0) {
      centeredImagePath = await uploadImage(centeredImageFile, "centered");
    }

    // Upload fact image
    const factImageFile = formData.get("factImage") as File | null;
    if (factImageFile && factImageFile.size > 0) {
      factImagePath = await uploadImage(factImageFile, "fact");
    }

    // Upload content item images
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
      // Fetch old insight
      const { data: oldInsight, error: fetchErr } = await supabaseAdmin
        .from("insights")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr) {
        return NextResponse.json(
          { success: false, error: "Insight not found" },
          { status: 404 }
        );
      }

      // Parse old JSON fields
      const oldFact = typeof oldInsight.fact === 'string' ? JSON.parse(oldInsight.fact) : oldInsight.fact;
      const oldContent = typeof oldInsight.content === 'string' ? JSON.parse(oldInsight.content) : oldInsight.content;
      const oldCenteredContent = typeof oldInsight.centeredcontent === 'string' 
        ? JSON.parse(oldInsight.centeredcontent) 
        : oldInsight.centeredcontent;

      // Delete old images if new ones uploaded
      if (centeredImagePath && oldInsight.centeredimage) {
        await supabaseAdmin.storage
          .from("insight-images")
          .remove([oldInsight.centeredimage])
          .catch(console.error);
      }

      if (factImagePath && oldFact?.image) {
        await supabaseAdmin.storage
          .from("insight-images")
          .remove([oldFact.image])
          .catch(console.error);
      }

      // Delete old content item images that are being replaced or removed
      for (const oldItem of oldContent) {
        const newItem = content.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          // Item was removed, delete its image
          await supabaseAdmin.storage
            .from("insight-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedContentImages[newItem.id] && oldItem.image) {
          // Item has new image, delete old one
          await supabaseAdmin.storage
            .from("insight-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Delete old centered content images that are being replaced or removed
      for (const oldItem of oldCenteredContent) {
        const newItem = centeredcontent.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          // Item was removed, delete its image
          await supabaseAdmin.storage
            .from("insight-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedCenteredContentImages[newItem.id] && oldItem.image) {
          // Item has new image, delete old one
          await supabaseAdmin.storage
            .from("insight-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Prepare content items with image paths
      const updatedContent = content.map((item: any) => ({
        ...item,
        image: uploadedContentImages[item.id] || item.image || null
      }));

      // Prepare centered content with image paths
      const updatedCenteredContent = centeredcontent.map((item: any) => ({
        ...item,
        image: uploadedCenteredContentImages[item.id] || item.image || null
      }));

      // Prepare fact object
      const fact = {
        image: factImagePath || oldFact?.image || null,
        boldtext: factBoldText || oldFact?.boldtext || ""
      };

      // Update insight
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from("insights")
        .update({
          title,
          reference: reference || null,
          category,
          cmpdate,
          centeredimage: centeredImagePath || oldInsight.centeredimage,
          fact,
          content: updatedContent,
          centeredcontent: updatedCenteredContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (updateErr) {
        console.error("DB update error:", updateErr);
        return NextResponse.json(
          { success: false, error: "Failed to update insight" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, insight: updated });
    } else {
      // New insight - validate required files
      if (!centeredImageFile) {
        return NextResponse.json(
          { success: false, error: "Centered image is required for new insight" },
          { status: 400 }
        );
      }

      // Prepare content items with image paths
      const newContent = content.map((item: any) => ({
        ...item,
        image: uploadedContentImages[item.id] || null
      }));

      // Prepare centered content with image paths
      const newCenteredContent = centeredcontent.map((item: any) => ({
        ...item,
        image: uploadedCenteredContentImages[item.id] || null
      }));

      // Prepare fact object
      const fact = {
        image: factImagePath || null,
        boldtext: factBoldText || ""
      };

      // Insert new insight
      const { data, error: insertErr } = await supabaseAdmin
        .from("insights")
        .insert({
          title,
          reference: reference || null,
          category,
          cmpdate,
          centeredimage: centeredImagePath!,
          fact,
          content: newContent,
          centeredcontent: newCenteredContent
        })
        .select()
        .single();

      if (insertErr) {
        console.error("DB insert error:", insertErr);
        // Clean up uploaded images
        const pathsToDelete: string[] = [];
        if (centeredImagePath) pathsToDelete.push(centeredImagePath);
        if (factImagePath) pathsToDelete.push(factImagePath);
        Object.values(uploadedContentImages).forEach(path => pathsToDelete.push(path));
        Object.values(uploadedCenteredContentImages).forEach(path => pathsToDelete.push(path));
        
        if (pathsToDelete.length > 0) {
          await supabaseAdmin.storage
            .from("insight-images")
            .remove(pathsToDelete)
            .catch(console.error);
        }
        
        return NextResponse.json(
          { success: false, error: "Failed to create insight" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, insight: data });
    }
  } catch (error: any) {
    console.error("Error processing insight:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form data
    const sectiontitle = (formData.get("sectiontitle") as string)?.trim();
    const isEdit = formData.get("isEdit") === "true";
    const id = (formData.get("id") as string) || null;

    // Parse JSON array
    const feedbacks = JSON.parse(formData.get("feedbacks") as string || "[]");

    // Validation
    if (!sectiontitle) {
      return NextResponse.json(
        { success: false, error: "Section title is required" },
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
    const uploadedFeedbackImages: { [key: string]: string } = {};

    // Helper function to upload image
    const uploadImage = async (file: File, folder: string): Promise<string> => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      
      const { error } = await supabaseAdmin
        .storage
        .from("feedback-images")
        .upload(fileName, file);

      if (error) throw error;
      return fileName;
    };

    // Upload feedback item images
    for (const feedback of feedbacks) {
      const file = formData.get(`feedbackImage_${feedback.id}`) as File | null;
      if (file && file.size > 0) {
        const path = await uploadImage(file, "feedback");
        uploadedFeedbackImages[feedback.id] = path;
      }
    }

    if (isEdit) {
      // Fetch old feedback
      const { data: oldFeedback, error: fetchErr } = await supabaseAdmin
        .from("feedbacks")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr) {
        return NextResponse.json(
          { success: false, error: "Feedback not found" },
          { status: 404 }
        );
      }

      // Parse old JSON field
      const oldFeedbacks = typeof oldFeedback.feedbacks === 'string' 
        ? JSON.parse(oldFeedback.feedbacks) 
        : oldFeedback.feedbacks;

      // Delete old feedback images that are being replaced or removed
      for (const oldItem of oldFeedbacks) {
        const newItem = feedbacks.find((item: any) => item.id === oldItem.id);
        if (!newItem && oldItem.image) {
          // Item was removed, delete its image
          await supabaseAdmin.storage
            .from("feedback-images")
            .remove([oldItem.image])
            .catch(console.error);
        } else if (newItem && uploadedFeedbackImages[newItem.id] && oldItem.image) {
          // Item has new image, delete old one
          await supabaseAdmin.storage
            .from("feedback-images")
            .remove([oldItem.image])
            .catch(console.error);
        }
      }

      // Prepare feedbacks with image paths
      const updatedFeedbacks = feedbacks.map((item: any) => ({
        ...item,
        image: uploadedFeedbackImages[item.id] || item.image || null
      }));

      // Update feedback
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from("feedbacks")
        .update({
          sectiontitle,
          feedbacks: updatedFeedbacks,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (updateErr) {
        console.error("DB update error:", updateErr);
        return NextResponse.json(
          { success: false, error: "Failed to update feedback" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, feedback: updated });
    } else {
      // New feedback - prepare with image paths
      const newFeedbacks = feedbacks.map((item: any) => ({
        ...item,
        image: uploadedFeedbackImages[item.id] || null
      }));

      // Insert new feedback
      const { data, error: insertErr } = await supabaseAdmin
        .from("feedbacks")
        .insert({
          sectiontitle,
          feedbacks: newFeedbacks
        })
        .select()
        .single();

      if (insertErr) {
        console.error("DB insert error:", insertErr);
        // Clean up uploaded images
        const pathsToDelete: string[] = [];
        Object.values(uploadedFeedbackImages).forEach(path => pathsToDelete.push(path));
        
        if (pathsToDelete.length > 0) {
          await supabaseAdmin.storage
            .from("feedback-images")
            .remove(pathsToDelete)
            .catch(console.error);
        }
        
        return NextResponse.json(
          { success: false, error: "Failed to create feedback" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, feedback: data });
    }
  } catch (error: any) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    // Fetch the feedback to get all image paths
    const { data: feedback, error: fetchErr } = await supabaseAdmin
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

    // Parse JSON field
    const feedbacks = typeof feedback.feedbacks === 'string' 
      ? JSON.parse(feedback.feedbacks) 
      : feedback.feedbacks;

    // Collect all image paths to delete
    const pathsToDelete: string[] = [];

    // Add feedback item images
    if (feedbacks && Array.isArray(feedbacks)) {
      feedbacks.forEach((item: any) => {
        if (item.image) {
          pathsToDelete.push(item.image);
        }
      });
    }

    // Delete images from storage
    if (pathsToDelete.length > 0) {
      await supabaseAdmin
        .storage
        .from("feedback-images")
        .remove(pathsToDelete)
        .catch(console.error);
    }

    // Delete from database
    const { error: deleteErr } = await supabaseAdmin
      .from("feedbacks")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("DB delete error:", deleteErr);
      return NextResponse.json(
        { success: false, error: "Failed to delete feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
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

    // Fetch the insight to get all image paths
    const { data: insight, error: fetchErr } = await supabaseAdmin
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

    // Parse JSON fields
    const fact = typeof insight.fact === 'string' ? JSON.parse(insight.fact) : insight.fact;
    const content = typeof insight.content === 'string' ? JSON.parse(insight.content) : insight.content;
    const centeredcontent = typeof insight.centeredcontent === 'string' 
      ? JSON.parse(insight.centeredcontent) 
      : insight.centeredcontent;

    // Collect all image paths to delete
    const pathsToDelete: string[] = [];

    // Add centered image
    if (insight.centeredimage) {
      pathsToDelete.push(insight.centeredimage);
    }

    // Add fact image
    if (fact?.image) {
      pathsToDelete.push(fact.image);
    }

    // Add content item images
    if (content && Array.isArray(content)) {
      content.forEach((item: any) => {
        if (item.image) {
          pathsToDelete.push(item.image);
        }
      });
    }

    // Add centered content images
    if (centeredcontent && Array.isArray(centeredcontent)) {
      centeredcontent.forEach((item: any) => {
        if (item.image) {
          pathsToDelete.push(item.image);
        }
      });
    }

    // Delete images from storage
    if (pathsToDelete.length > 0) {
      await supabaseAdmin
        .storage
        .from("insight-images")
        .remove(pathsToDelete)
        .catch(console.error);
    }

    // Delete from database
    const { error: deleteErr } = await supabaseAdmin
      .from("insights")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("DB delete error:", deleteErr);
      return NextResponse.json(
        { success: false, error: "Failed to delete insight" },
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
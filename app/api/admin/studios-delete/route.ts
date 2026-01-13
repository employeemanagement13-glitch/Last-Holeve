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

    // Fetch the studio to get all image paths
    const { data: studio, error: fetchErr } = await supabaseAdmin
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

    // Parse JSON fields
    const content = typeof studio.content === 'string' ? JSON.parse(studio.content) : studio.content;
    const leaders = typeof studio.leaders === 'string' ? JSON.parse(studio.leaders) : studio.leaders;
    const workby = typeof studio.workby === 'string' ? JSON.parse(studio.workby) : studio.workby;

    // Collect all image paths to delete
    const pathsToDelete: string[] = [];

    // Add main image
    if (studio.imageUrl) {
      pathsToDelete.push(studio.imageUrl);
    }

    // Add content images
    if (content && Array.isArray(content)) {
      content.forEach((item: any) => {
        if (item.image) {
          pathsToDelete.push(item.image);
        }
      });
    }

    // Add leader images
    if (leaders && Array.isArray(leaders)) {
      leaders.forEach((item: any) => {
        if (item.image) {
          pathsToDelete.push(item.image);
        }
      });
    }

    // Add workby images
    if (workby && Array.isArray(workby)) {
      workby.forEach((item: any) => {
        if (item.image) {
          pathsToDelete.push(item.image);
        }
      });
    }

    // Delete images from storage
    if (pathsToDelete.length > 0) {
      await supabaseAdmin
        .storage
        .from("studio-images")
        .remove(pathsToDelete)
        .catch(console.error);
    }

    // Delete from database
    const { error: deleteErr } = await supabaseAdmin
      .from("studios")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("DB delete error:", deleteErr);
      return NextResponse.json(
        { success: false, error: "Failed to delete studio" },
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
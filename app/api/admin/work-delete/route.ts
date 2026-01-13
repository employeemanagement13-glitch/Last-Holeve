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

    // Fetch the work to get all image paths
    const { data: work, error: fetchErr } = await supabaseAdmin
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

    // Parse JSON fields
    const people = typeof work.people === 'string' ? JSON.parse(work.people) : work.people;
    const content = typeof work.content === 'string' ? JSON.parse(work.content) : work.content;
    const centeredcontent = typeof work.centeredcontent === 'string' 
      ? JSON.parse(work.centeredcontent) 
      : work.centeredcontent; // lowercase!

    // Collect all image paths to delete
    const pathsToDelete: string[] = [];

    // Add main images
    if (work.projectimage) pathsToDelete.push(work.projectimage);
    if (work.bannerimage) pathsToDelete.push(work.bannerimage); // lowercase!

    // Add people images
    if (people && Array.isArray(people)) {
      people.forEach((person: any) => {
        if (person.imageUrl) {
          pathsToDelete.push(person.imageUrl);
        }
      });
    }

    // Add content images
    if (content && Array.isArray(content)) {
      content.forEach((item: any) => {
        if (item.imageUrl) {
          pathsToDelete.push(item.imageUrl);
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
        .from("work-images")
        .remove(pathsToDelete)
        .catch(console.error);
    }

    // Delete from database
    const { error: deleteErr } = await supabaseAdmin
      .from("works")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("DB delete error:", deleteErr);
      return NextResponse.json(
        { success: false, error: "Failed to delete work" },
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
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

    // Fetch the update to get image path
    const { data: update, error: fetchErr } = await supabaseAdmin
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

    // Delete image from storage
    if (update?.image) {
      await supabaseAdmin
        .storage
        .from("update-images")
        .remove([update.image])
        .catch(console.error);
    }

    // Delete from database
    const { error: deleteErr } = await supabaseAdmin
      .from("updates")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("DB delete error:", deleteErr);
      return NextResponse.json(
        { success: false, error: "Failed to delete update" },
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
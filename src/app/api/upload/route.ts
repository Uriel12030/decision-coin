import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const leadId = form.get("lead_id") as string | null;
    const fileType = form.get("file_type") as string | null;

    if (!file || !leadId) {
      return NextResponse.json(
        { error: "Missing file or lead_id" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Upload to Storage
    const ext = file.name.split(".").pop() || "bin";
    const storagePath = `${leadId}/${crypto.randomUUID()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("lead-files")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Insert file metadata
    const { error: dbError } = await supabase.from("files").insert({
      lead_id: leadId,
      file_type: fileType || "other",
      original_filename: file.name,
      storage_path: storagePath,
      mime_type: file.type,
      size_bytes: file.size,
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

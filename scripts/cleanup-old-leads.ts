/**
 * Cleanup script: delete leads and associated files older than 60 days.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npx tsx scripts/cleanup-old-leads.ts
 *
 * Or via npm script:
 *   npm run cleanup
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, key);
const DAYS = 60;

async function main() {
  const cutoff = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
  console.log(`Deleting leads older than ${DAYS} days (before ${cutoff})...`);

  // 1. Get old leads
  const { data: oldLeads, error: fetchErr } = await supabase
    .from("leads")
    .select("id")
    .lt("created_at", cutoff);

  if (fetchErr) {
    console.error("Error fetching old leads:", fetchErr.message);
    process.exit(1);
  }

  if (!oldLeads || oldLeads.length === 0) {
    console.log("No leads to clean up.");
    return;
  }

  console.log(`Found ${oldLeads.length} leads to delete.`);

  for (const lead of oldLeads) {
    // Get files for this lead
    const { data: files } = await supabase
      .from("files")
      .select("storage_path")
      .eq("lead_id", lead.id);

    // Delete files from storage
    if (files && files.length > 0) {
      const paths = files
        .map((f) => f.storage_path)
        .filter(Boolean) as string[];
      if (paths.length > 0) {
        const { error: storageErr } = await supabase.storage
          .from("lead-files")
          .remove(paths);
        if (storageErr) {
          console.warn(
            `Warning: failed to delete storage files for lead ${lead.id}:`,
            storageErr.message
          );
        }
      }
    }

    // Delete lead (cascade deletes file rows)
    const { error: delErr } = await supabase
      .from("leads")
      .delete()
      .eq("id", lead.id);

    if (delErr) {
      console.error(`Error deleting lead ${lead.id}:`, delErr.message);
    } else {
      console.log(`Deleted lead ${lead.id} + ${files?.length ?? 0} files`);
    }
  }

  console.log("Cleanup complete.");
}

main();

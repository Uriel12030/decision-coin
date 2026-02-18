import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";
import type { Lead, LeadFlag } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("lead_id", params.id);

  const typedLead = lead as Lead;
  const flags = (typedLead.lead_flags ?? []) as LeadFlag[];

  // Build PDF
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Case Pack Summary", 105, y, { align: "center" });
  y += 15;

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 105, y, {
    align: "center",
  });
  y += 5;
  doc.text("Automated screening. Not legal advice.", 105, y, {
    align: "center",
  });
  y += 15;

  doc.setFontSize(12);
  doc.text(`Name: ${typedLead.full_name}`, 20, y);
  y += 7;
  doc.text(`Phone: ${typedLead.phone}`, 20, y);
  y += 7;
  doc.text(`Email: ${typedLead.email}`, 20, y);
  y += 7;
  doc.text(`City: ${typedLead.city}`, 20, y);
  y += 7;
  doc.text(`Lead Score: ${typedLead.lead_score ?? 0} / 100`, 20, y);
  y += 7;
  doc.text(`Status: ${typedLead.status}`, 20, y);
  y += 12;

  // Flags
  if (flags.length > 0) {
    doc.setFontSize(13);
    doc.text("Flags:", 20, y);
    y += 8;
    doc.setFontSize(11);
    for (const f of flags) {
      doc.text(`  - ${f.label} (+${f.points})`, 20, y);
      y += 6;
    }
    y += 6;
  }

  // Employment
  doc.setFontSize(13);
  doc.text("Employment:", 20, y);
  y += 8;
  doc.setFontSize(11);
  const empLines = [
    `Employer: ${typedLead.employer_name || "N/A"}`,
    `Role: ${typedLead.role_title || "N/A"}`,
    `Type: ${typedLead.employment_type || "N/A"}`,
    `Start: ${typedLead.start_date || "N/A"}`,
    `End: ${typedLead.still_employed ? "Still employed" : typedLead.end_date || "N/A"}`,
    `Avg Salary: ${typedLead.avg_monthly_salary ?? "N/A"}`,
  ];
  for (const line of empLines) {
    doc.text(`  ${line}`, 20, y);
    y += 6;
  }
  y += 6;

  // Benefits
  doc.setFontSize(13);
  doc.text("Benefits & Issues:", 20, y);
  y += 8;
  doc.setFontSize(11);
  const benLines = [
    `Pension provided: ${typedLead.pension_provided || "N/A"}`,
    `Paid overtime: ${typedLead.paid_overtime || "N/A"}`,
    `OT hours est: ${typedLead.overtime_hours_estimate || "N/A"}`,
    `Travel reimbursement: ${typedLead.travel_reimbursement || "N/A"}`,
    `Vacation issue: ${typedLead.vacation_balance_issue || "N/A"}`,
    `Sick days issue: ${typedLead.sick_days_issue || "N/A"}`,
  ];
  for (const line of benLines) {
    doc.text(`  ${line}`, 20, y);
    y += 6;
  }
  y += 6;

  // Termination
  if (typedLead.termination_type) {
    doc.setFontSize(13);
    doc.text("Termination:", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`  Type: ${typedLead.termination_type}`, 20, y);
    y += 6;
    doc.text(`  Date: ${typedLead.termination_date || "N/A"}`, 20, y);
    y += 6;
    doc.text(`  Reason: ${typedLead.reason_for_check || "N/A"}`, 20, y);
    y += 10;
  }

  // Files
  if (files && files.length > 0) {
    doc.setFontSize(13);
    doc.text(`Files (${files.length}):`, 20, y);
    y += 8;
    doc.setFontSize(11);
    for (const f of files) {
      doc.text(
        `  - ${f.original_filename} (${f.file_type})`,
        20,
        y
      );
      y += 6;
    }
    y += 6;
  }

  // Admin notes
  if (typedLead.admin_notes) {
    doc.setFontSize(13);
    doc.text("Admin Notes:", 20, y);
    y += 8;
    doc.setFontSize(11);
    const noteLines = doc.splitTextToSize(typedLead.admin_notes, 170);
    doc.text(noteLines, 20, y);
  }

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="case-pack-${params.id.slice(0, 8)}.pdf"`,
    },
  });
}

import { createAuthClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Lead, LeadFile, LeadFlag } from "@/lib/types";
import LeadActions from "./LeadActions";

export default async function LeadDetail({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createAuthClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !lead) return notFound();

  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("lead_id", params.id)
    .order("created_at");

  // Generate signed URLs for files
  const filesWithUrls: (LeadFile & { url?: string })[] = [];
  if (files) {
    for (const f of files) {
      let url: string | undefined;
      if (f.storage_path) {
        const { data: signed } = await supabase.storage
          .from("lead-files")
          .createSignedUrl(f.storage_path, 3600);
        url = signed?.signedUrl;
      }
      filesWithUrls.push({ ...f, url });
    }
  }

  const typedLead = lead as Lead;
  const flags = (typedLead.lead_flags ?? []) as LeadFlag[];

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        href="/admin/leads"
        className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Back to leads
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {typedLead.full_name}
          </h1>
          <p className="text-sm text-gray-500">
            {typedLead.email} &bull; {typedLead.phone} &bull; {typedLead.city}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Created {new Date(typedLead.created_at).toLocaleString()} &bull; ID:{" "}
            {typedLead.id.slice(0, 8)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {typedLead.lead_score ?? 0}
          </div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
        Automated screening. Not legal advice.
      </div>

      {/* Flags */}
      {flags.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Flags</h2>
          <div className="flex flex-wrap gap-2">
            {flags.map((f) => (
              <span
                key={f.key}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700"
              >
                {f.label} (+{f.points})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Details grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Section title="Employment">
          <Row label="Employer" value={typedLead.employer_name} />
          <Row label="Role" value={typedLead.role_title} />
          <Row label="Type" value={typedLead.employment_type} />
          <Row label="Start" value={typedLead.start_date} />
          <Row
            label="End"
            value={
              typedLead.still_employed ? "Still employed" : typedLead.end_date
            }
          />
          <Row
            label="Avg Salary"
            value={typedLead.avg_monthly_salary?.toString()}
          />
        </Section>

        <Section title="Hours & Overtime">
          <Row label="Paid OT" value={typedLead.paid_overtime} />
          <Row label="OT Hours Est." value={typedLead.overtime_hours_estimate} />
          <Row label="Attendance" value={typedLead.attendance_tracking} />
        </Section>

        <Section title="Benefits">
          <Row label="Pension" value={typedLead.pension_provided} />
          <Row label="Pension Rate Known" value={typedLead.pension_rate_known} />
          <Row label="Travel" value={typedLead.travel_reimbursement} />
          <Row label="Vacation Issue" value={typedLead.vacation_balance_issue} />
          <Row label="Sick Days Issue" value={typedLead.sick_days_issue} />
        </Section>

        <Section title="Termination">
          <Row label="Type" value={typedLead.termination_type} />
          <Row label="Date" value={typedLead.termination_date} />
          <Row label="Reason" value={typedLead.reason_for_check} />
        </Section>
      </div>

      {/* Files */}
      <div className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">
          Files ({filesWithUrls.length})
        </h2>
        {filesWithUrls.length > 0 ? (
          <ul className="space-y-2">
            {filesWithUrls.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div>
                  <span className="text-sm font-medium">
                    {f.original_filename}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {f.file_type} &bull;{" "}
                    {f.size_bytes ? `${(f.size_bytes / 1024).toFixed(0)} KB` : ""}
                  </span>
                </div>
                {f.url && (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                  >
                    View / Download
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No files uploaded</p>
        )}
      </div>

      {/* Admin actions */}
      <LeadActions
        leadId={typedLead.id}
        currentStatus={typedLead.status}
        currentNotes={typedLead.admin_notes ?? ""}
      />

      {/* PDF export */}
      <div className="mt-4">
        <a
          href={`/api/admin/case-pack/${typedLead.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Generate Case Pack PDF
        </a>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex justify-between border-b border-gray-50 py-1 text-sm last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

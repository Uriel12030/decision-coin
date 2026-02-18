import { createAuthClient } from "@/lib/supabase/server";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  rejected: "Rejected",
  accepted: "Accepted",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  accepted: "bg-green-100 text-green-700",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; min_score?: string; max_score?: string };
}) {
  const supabase = createAuthClient();

  let query = supabase
    .from("leads")
    .select("id, created_at, full_name, phone, status, lead_score, city, employment_type")
    .order("created_at", { ascending: false });

  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }
  if (searchParams.min_score) {
    query = query.gte("lead_score", parseInt(searchParams.min_score));
  }
  if (searchParams.max_score) {
    query = query.lte("lead_score", parseInt(searchParams.max_score));
  }

  const { data: leads, error } = await query.limit(100);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading leads: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <span className="text-sm text-gray-500">{leads?.length ?? 0} results</span>
      </div>

      {/* Filters */}
      <form className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Status
          </label>
          <select
            name="status"
            defaultValue={searchParams.status ?? ""}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Min Score
          </label>
          <input
            name="min_score"
            type="number"
            defaultValue={searchParams.min_score ?? ""}
            placeholder="0"
            className="w-20 rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Max Score
          </label>
          <input
            name="max_score"
            type="number"
            defaultValue={searchParams.max_score ?? ""}
            placeholder="100"
            className="w-20 rounded border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Filter
        </button>
        <Link
          href="/admin/leads"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Reset
        </Link>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                City
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Score
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads?.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {lead.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-500">{lead.city}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold">
                    {lead.lead_score ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-400"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

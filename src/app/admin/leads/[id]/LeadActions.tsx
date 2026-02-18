"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/lib/actions";

interface Props {
  leadId: string;
  currentStatus: string;
  currentNotes: string;
}

const STATUSES = ["new", "reviewing", "accepted", "rejected"];

export default function LeadActions({
  leadId,
  currentStatus,
  currentNotes,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    const result = await updateLeadStatus(leadId, status, notes);
    setSaving(false);
    if (result.error) {
      setMsg(`Error: ${result.error}`);
    } else {
      setMsg("Saved!");
      router.refresh();
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        Admin Actions
      </h2>
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-600">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm text-gray-600">Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {msg && (
          <span
            className={`text-sm ${msg.startsWith("Error") ? "text-red-600" : "text-green-600"}`}
          >
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}

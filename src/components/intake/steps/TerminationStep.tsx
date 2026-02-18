"use client";

import type { IntakeFormData } from "@/lib/types";

interface Props {
  data: IntakeFormData;
  onChange: (patch: Partial<IntakeFormData>) => void;
  errors: Record<string, string[] | undefined>;
}

const TYPES = [
  { v: "resigned", l: "התפטרתי" },
  { v: "fired", l: "פוטרתי" },
  { v: "laid_off", l: "צומצמתי" },
  { v: "mutual", l: "הסכמה הדדית" },
  { v: "contract_ended", l: "סיום חוזה" },
  { v: "other", l: "אחר" },
];

export default function TerminationStep({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">פרטי סיום העסקה</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">
          סוג סיום ההעסקה *
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TYPES.map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => onChange({ termination_type: t.v })}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                data.termination_type === t.v
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>
        {errors.termination_type && (
          <p className="mt-1 text-xs text-red-600">
            {errors.termination_type[0]}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          תאריך סיום העסקה
        </label>
        <input
          type="date"
          value={data.termination_date}
          onChange={(e) => onChange({ termination_date: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir="ltr"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          הסיבה לפנייה (אופציונלי)
        </label>
        <textarea
          value={data.reason_for_check}
          onChange={(e) => onChange({ reason_for_check: e.target.value })}
          rows={3}
          placeholder="ספר/י בקצרה מה הביא אותך לבדוק..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

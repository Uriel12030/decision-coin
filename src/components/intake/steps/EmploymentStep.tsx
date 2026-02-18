"use client";

import type { IntakeFormData } from "@/lib/types";

interface Props {
  data: IntakeFormData;
  onChange: (patch: Partial<IntakeFormData>) => void;
  errors: Record<string, string[] | undefined>;
}

const TYPES = [
  { value: "hourly", label: "שעתי" },
  { value: "monthly", label: "חודשי" },
  { value: "global", label: "גלובלי" },
  { value: "contractor", label: "קבלן / פרילנסר" },
  { value: "unknown", label: "לא יודע/ת" },
];

export default function EmploymentStep({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">פרטי העסקה</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">שם המעסיק</label>
        <input
          type="text"
          value={data.employer_name}
          onChange={(e) => onChange({ employer_name: e.target.value })}
          placeholder="אופציונלי"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">תפקיד *</label>
        <input
          type="text"
          value={data.role_title}
          onChange={(e) => onChange({ role_title: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.role_title && (
          <p className="mt-1 text-xs text-red-600">{errors.role_title[0]}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">סוג העסקה *</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange({ employment_type: t.value })}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                data.employment_type === t.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {errors.employment_type && (
          <p className="mt-1 text-xs text-red-600">
            {errors.employment_type[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            תאריך התחלה
          </label>
          <input
            type="date"
            value={data.start_date}
            onChange={(e) => onChange({ start_date: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            dir="ltr"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">תאריך סיום</label>
          <input
            type="date"
            value={data.end_date}
            onChange={(e) => onChange({ end_date: e.target.value })}
            disabled={data.still_employed}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            dir="ltr"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.still_employed}
          onChange={(e) =>
            onChange({ still_employed: e.target.checked, end_date: "" })
          }
          className="h-4 w-4 rounded border-gray-300"
        />
        עדיין מועסק/ת
      </label>
    </div>
  );
}

"use client";

import type { IntakeFormData } from "@/lib/types";

interface Props {
  data: IntakeFormData;
  onChange: (patch: Partial<IntakeFormData>) => void;
}

export default function HoursStep({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">שעות עבודה ושעות נוספות</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">
          שכר חודשי ממוצע (ברוטו)
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={data.avg_monthly_salary}
          onChange={(e) => onChange({ avg_monthly_salary: e.target.value })}
          placeholder="לדוגמה: 8000"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir="ltr"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          האם קיבלת תשלום עבור שעות נוספות?
        </label>
        <div className="flex gap-3">
          {[
            { v: "yes", l: "כן" },
            { v: "no", l: "לא" },
            { v: "partial", l: "חלקי" },
            { v: "unknown", l: "לא יודע/ת" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange({ paid_overtime: o.v })}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                data.paid_overtime === o.v
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {(data.paid_overtime === "no" || data.paid_overtime === "partial") && (
        <div>
          <label className="mb-1 block text-sm font-medium">
            כמה שעות נוספות בערך בשבוע?
          </label>
          <input
            type="text"
            value={data.overtime_hours_estimate}
            onChange={(e) =>
              onChange({ overtime_hours_estimate: e.target.value })
            }
            placeholder="לדוגמה: 10"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            dir="ltr"
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          איך מתועדת הנוכחות?
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { v: "clock", l: "שעון נוכחות" },
            { v: "manual", l: "ידני / דוח" },
            { v: "none", l: "אין תיעוד" },
            { v: "unknown", l: "לא יודע/ת" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange({ attendance_tracking: o.v })}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                data.attendance_tracking === o.v
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

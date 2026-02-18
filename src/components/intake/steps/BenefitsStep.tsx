"use client";

import type { IntakeFormData } from "@/lib/types";

interface Props {
  data: IntakeFormData;
  onChange: (patch: Partial<IntakeFormData>) => void;
  errors: Record<string, string[] | undefined>;
}

function RadioGroup({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: { v: string; l: string }[];
  onChange: (v: string) => void;
  error?: string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              value === o.v
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

const YES_NO_UNKNOWN = [
  { v: "yes", l: "כן" },
  { v: "no", l: "לא" },
  { v: "unknown", l: "לא יודע/ת" },
];

export default function BenefitsStep({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">הטבות וזכויות</h2>

      <RadioGroup
        label="האם מופרשת פנסיה? *"
        value={data.pension_provided}
        options={YES_NO_UNKNOWN}
        onChange={(v) => onChange({ pension_provided: v })}
        error={errors.pension_provided}
      />

      {data.pension_provided === "yes" && (
        <RadioGroup
          label="האם ידוע לך שיעור ההפרשה?"
          value={data.pension_rate_known}
          options={[
            { v: "yes", l: "כן" },
            { v: "no", l: "לא" },
          ]}
          onChange={(v) => onChange({ pension_rate_known: v })}
        />
      )}

      <RadioGroup
        label="האם מקבל/ת החזר נסיעות? *"
        value={data.travel_reimbursement}
        options={YES_NO_UNKNOWN}
        onChange={(v) => onChange({ travel_reimbursement: v })}
        error={errors.travel_reimbursement}
      />

      <RadioGroup
        label="האם יש בעיה עם יתרת ימי חופשה? *"
        value={data.vacation_balance_issue}
        options={[
          { v: "yes", l: "כן" },
          { v: "no", l: "לא" },
          { v: "unknown", l: "לא יודע/ת" },
        ]}
        onChange={(v) => onChange({ vacation_balance_issue: v })}
        error={errors.vacation_balance_issue}
      />

      <RadioGroup
        label="האם יש בעיה עם ימי מחלה? *"
        value={data.sick_days_issue}
        options={[
          { v: "yes", l: "כן" },
          { v: "no", l: "לא" },
          { v: "unknown", l: "לא יודע/ת" },
        ]}
        onChange={(v) => onChange({ sick_days_issue: v })}
        error={errors.sick_days_issue}
      />
    </div>
  );
}

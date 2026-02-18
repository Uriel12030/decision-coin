"use client";

import type { IntakeFormData, FileWithMeta } from "@/lib/types";

interface Props {
  data: IntakeFormData;
  files: FileWithMeta[];
  onChange: (patch: Partial<IntakeFormData>) => void;
  errors: Record<string, string[] | undefined>;
}

const TYPE_LABELS: Record<string, string> = {
  hourly: "שעתי",
  monthly: "חודשי",
  global: "גלובלי",
  contractor: "קבלן / פרילנסר",
  unknown: "לא ידוע",
};

const YES_NO: Record<string, string> = {
  yes: "כן",
  no: "לא",
  partial: "חלקי",
  unknown: "לא יודע/ת",
};

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between border-b border-gray-100 py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function ReviewStep({ data, files, onChange, errors }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">סיכום ואישור</h2>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 font-medium text-gray-700">פרטי קשר</h3>
        <Row label="שם מלא" value={data.full_name} />
        <Row label="טלפון" value={data.phone} />
        <Row label="אימייל" value={data.email} />
        <Row label="עיר" value={data.city} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 font-medium text-gray-700">העסקה</h3>
        <Row label="מעסיק" value={data.employer_name} />
        <Row label="תפקיד" value={data.role_title} />
        <Row label="סוג" value={TYPE_LABELS[data.employment_type] || data.employment_type} />
        <Row label="התחלה" value={data.start_date} />
        <Row label="סיום" value={data.still_employed ? "עדיין מועסק/ת" : data.end_date} />
      </div>

      {data.avg_monthly_salary && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-gray-700">שכר ושעות</h3>
          <Row label="שכר ממוצע" value={`${data.avg_monthly_salary} ש"ח`} />
          <Row label="שעות נוספות" value={YES_NO[data.paid_overtime] || data.paid_overtime} />
          <Row label="שעות נוספות בשבוע" value={data.overtime_hours_estimate} />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 font-medium text-gray-700">הטבות</h3>
        <Row label="פנסיה" value={YES_NO[data.pension_provided] || data.pension_provided} />
        <Row label="החזר נסיעות" value={YES_NO[data.travel_reimbursement] || data.travel_reimbursement} />
        <Row label="בעיית חופשה" value={YES_NO[data.vacation_balance_issue] || data.vacation_balance_issue} />
        <Row label="בעיית מחלה" value={YES_NO[data.sick_days_issue] || data.sick_days_issue} />
      </div>

      {data.termination_type && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-gray-700">סיום העסקה</h3>
          <Row label="סוג" value={data.termination_type} />
          <Row label="תאריך" value={data.termination_date} />
          <Row label="סיבה" value={data.reason_for_check} />
        </div>
      )}

      {files.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-gray-700">
            מסמכים ({files.length})
          </h3>
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f.id} className="text-sm text-gray-600">
                {f.file.name} ({f.file_type})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Privacy notice */}
      <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-600">
        <strong>מדיניות פרטיות:</strong> המידע ישמש לצורך בדיקת תלוש השכר בלבד.
        הקבצים מאוחסנים בצורה מאובטחת ונמחקים אוטומטית לאחר 60 יום. לא נשתף
        מידע אישי עם צדדים שלישיים ללא הסכמה.
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange({ consent: e.target.checked })}
          className="mt-0.5 h-5 w-5 rounded border-gray-300"
        />
        <span className="text-sm">
          אני מאשר/ת את שליחת הפרטים והמסמכים לצורך בדיקה. המידע ישמש לצורך
          סינון ראשוני בלבד ואינו מהווה ייעוץ משפטי. *
        </span>
      </label>
      {errors.consent && (
        <p className="text-xs text-red-600">{errors.consent[0]}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          איך שמעת עלינו?
        </label>
        <input
          type="text"
          value={data.marketing_source}
          onChange={(e) => onChange({ marketing_source: e.target.value })}
          placeholder="אופציונלי"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

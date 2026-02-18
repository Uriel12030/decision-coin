"use client";

import type { IntakeFormData } from "@/lib/types";

interface Props {
  data: IntakeFormData;
  onChange: (patch: Partial<IntakeFormData>) => void;
  errors: Record<string, string[] | undefined>;
}

export default function ContactStep({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">פרטי קשר</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">שם מלא *</label>
        <input
          type="text"
          value={data.full_name}
          onChange={(e) => onChange({ full_name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.full_name && (
          <p className="mt-1 text-xs text-red-600">{errors.full_name[0]}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">טלפון *</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir="ltr"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone[0]}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">אימייל *</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          dir="ltr"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">עיר מגורים *</label>
        <input
          type="text"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.city && (
          <p className="mt-1 text-xs text-red-600">{errors.city[0]}</p>
        )}
      </div>
    </div>
  );
}

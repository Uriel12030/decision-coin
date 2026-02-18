"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ui/ProgressBar";
import ContactStep from "./steps/ContactStep";
import EmploymentStep from "./steps/EmploymentStep";
import HoursStep from "./steps/HoursStep";
import BenefitsStep from "./steps/BenefitsStep";
import TerminationStep from "./steps/TerminationStep";
import UploadStep from "./steps/UploadStep";
import ReviewStep from "./steps/ReviewStep";
import {
  contactSchema,
  employmentSchema,
  hoursSchema,
  benefitsSchema,
  terminationSchema,
  fullIntakeSchema,
} from "@/lib/schemas";
import { submitIntake } from "@/lib/actions";
import { EMPTY_FORM } from "@/lib/types";
import type { IntakeFormData, FileWithMeta } from "@/lib/types";

type StepDef = {
  id: string;
  label: string;
  validate?: (data: IntakeFormData) => Record<string, string[] | undefined> | null;
};

export default function WizardShell() {
  const router = useRouter();
  const [data, setData] = useState<IntakeFormData>({ ...EMPTY_FORM });
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const onChange = useCallback((patch: Partial<IntakeFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    setErrors({});
  }, []);

  // Build step list with conditional steps
  const steps = useMemo<StepDef[]>(() => {
    const list: StepDef[] = [
      {
        id: "contact",
        label: "פרטי קשר",
        validate: (d) => {
          const r = contactSchema.safeParse(d);
          return r.success ? null : r.error.flatten().fieldErrors;
        },
      },
      {
        id: "employment",
        label: "תעסוקה",
        validate: (d) => {
          const r = employmentSchema.safeParse(d);
          return r.success ? null : r.error.flatten().fieldErrors;
        },
      },
    ];

    // Hours step: show unless contractor
    if (data.employment_type !== "contractor") {
      list.push({
        id: "hours",
        label: "שעות עבודה",
        validate: (d) => {
          const r = hoursSchema.safeParse(d);
          return r.success ? null : r.error.flatten().fieldErrors;
        },
      });
    }

    list.push({
      id: "benefits",
      label: "הטבות וזכויות",
      validate: (d) => {
        const r = benefitsSchema.safeParse(d);
        return r.success ? null : r.error.flatten().fieldErrors;
      },
    });

    // Termination step: show if not currently employed
    if (!data.still_employed) {
      list.push({
        id: "termination",
        label: "סיום העסקה",
        validate: (d) => {
          const r = terminationSchema.safeParse(d);
          return r.success ? null : r.error.flatten().fieldErrors;
        },
      });
    }

    list.push({ id: "upload", label: "מסמכים" });
    list.push({
      id: "review",
      label: "סיכום ואישור",
      validate: (d) => {
        const r = fullIntakeSchema.safeParse(d);
        return r.success ? null : r.error.flatten().fieldErrors;
      },
    });

    return list;
  }, [data.employment_type, data.still_employed]);

  // Clamp stepIdx if steps changed (conditional logic)
  const safeIdx = Math.min(stepIdx, steps.length - 1);
  const current = steps[safeIdx];

  const goNext = () => {
    if (current.validate) {
      const errs = current.validate(data);
      if (errs) {
        setErrors(errs);
        return;
      }
    }
    setErrors({});
    setStepIdx(Math.min(safeIdx + 1, steps.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setStepIdx(Math.max(safeIdx - 1, 0));
  };

  const handleSubmit = async () => {
    // Final validation
    const r = fullIntakeSchema.safeParse(data);
    if (!r.success) {
      setErrors(r.error.flatten().fieldErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitIntake(data);

      if (result.error || !result.leadId) {
        const err = result.error;
        if (err && "_form" in err) {
          setSubmitError((err as { _form: string[] })._form[0]);
        } else {
          setSubmitError("שגיאה בשליחת הנתונים. נסה שנית.");
        }
        setSubmitting(false);
        return;
      }

      // Upload files
      if (files.length > 0) {
        setUploadProgress(`מעלה קבצים... 0/${files.length}`);
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          const form = new FormData();
          form.append("file", f.file);
          form.append("lead_id", result.leadId);
          form.append("file_type", f.file_type);

          const res = await fetch("/api/upload", { method: "POST", body: form });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.error("Upload failed:", body);
          }
          setUploadProgress(`מעלה קבצים... ${i + 1}/${files.length}`);
        }
      }

      router.push(`/thank-you?ref=${result.leadId}`);
    } catch {
      setSubmitError("שגיאת רשת. נסה שנית.");
      setSubmitting(false);
    }
  };

  const isLast = safeIdx === steps.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <ProgressBar
        current={safeIdx}
        total={steps.length}
        labels={steps.map((s) => s.label)}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {current.id === "contact" && (
          <ContactStep data={data} onChange={onChange} errors={errors} />
        )}
        {current.id === "employment" && (
          <EmploymentStep data={data} onChange={onChange} errors={errors} />
        )}
        {current.id === "hours" && (
          <HoursStep data={data} onChange={onChange} />
        )}
        {current.id === "benefits" && (
          <BenefitsStep data={data} onChange={onChange} errors={errors} />
        )}
        {current.id === "termination" && (
          <TerminationStep data={data} onChange={onChange} errors={errors} />
        )}
        {current.id === "upload" && (
          <UploadStep files={files} onFilesChange={setFiles} />
        )}
        {current.id === "review" && (
          <ReviewStep
            data={data}
            files={files}
            onChange={onChange}
            errors={errors}
          />
        )}

        {submitError && (
          <p className="mt-4 text-sm text-red-600">{submitError}</p>
        )}
        {uploadProgress && (
          <p className="mt-2 text-sm text-blue-600">{uploadProgress}</p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={safeIdx === 0}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:invisible"
          >
            הקודם
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "שולח..." : "שלח בדיקה"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              הבא
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

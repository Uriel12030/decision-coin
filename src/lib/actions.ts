"use server";

import { createServiceClient, createAuthClient } from "./supabase/server";
import { fullIntakeSchema } from "./schemas";
import { computeScore } from "./scoring";
import type { IntakeFormData } from "./types";

export async function submitIntake(data: IntakeFormData) {
  const parsed = fullIntakeSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors, leadId: null };
  }

  const { score, flags } = computeScore({
    pension_provided: data.pension_provided,
    paid_overtime: data.paid_overtime,
    overtime_hours_estimate: data.overtime_hours_estimate,
    travel_reimbursement: data.travel_reimbursement,
    vacation_balance_issue: data.vacation_balance_issue,
    sick_days_issue: data.sick_days_issue,
    termination_type: data.termination_type,
    still_employed: data.still_employed,
    end_date: data.end_date,
  });

  const supabase = createServiceClient();

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      city: data.city,
      employer_name: data.employer_name || null,
      role_title: data.role_title,
      employment_type: data.employment_type,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      still_employed: data.still_employed,
      avg_monthly_salary: data.avg_monthly_salary
        ? parseFloat(data.avg_monthly_salary)
        : null,
      paid_overtime: data.paid_overtime || null,
      overtime_hours_estimate: data.overtime_hours_estimate || null,
      attendance_tracking: data.attendance_tracking || null,
      pension_provided: data.pension_provided || null,
      pension_rate_known: data.pension_rate_known || null,
      travel_reimbursement: data.travel_reimbursement || null,
      vacation_balance_issue: data.vacation_balance_issue || null,
      sick_days_issue: data.sick_days_issue || null,
      termination_type: data.termination_type || null,
      termination_date: data.termination_date || null,
      reason_for_check: data.reason_for_check || null,
      consent: data.consent,
      marketing_source: data.marketing_source || null,
      lead_score: score,
      lead_flags: flags,
    })
    .select("id")
    .single();

  if (error) {
    return { error: { _form: [error.message] }, leadId: null };
  }

  return { error: null, leadId: lead.id as string };
}

export async function updateLeadStatus(
  leadId: string,
  status: string,
  notes?: string
) {
  const supabase = createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const update: Record<string, unknown> = { status };
  if (notes !== undefined) update.admin_notes = notes;

  const { error } = await supabase
    .from("leads")
    .update(update)
    .eq("id", leadId);

  if (error) return { error: error.message };
  return { error: null };
}

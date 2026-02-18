export interface Lead {
  id: string;
  created_at: string;
  status: "new" | "reviewing" | "rejected" | "accepted";
  full_name: string;
  phone: string;
  email: string;
  city: string;
  employer_name: string | null;
  role_title: string | null;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  still_employed: boolean | null;
  avg_monthly_salary: number | null;
  paid_overtime: string | null;
  overtime_hours_estimate: string | null;
  attendance_tracking: string | null;
  pension_provided: string | null;
  pension_rate_known: string | null;
  travel_reimbursement: string | null;
  vacation_balance_issue: string | null;
  sick_days_issue: string | null;
  termination_type: string | null;
  termination_date: string | null;
  reason_for_check: string | null;
  consent: boolean;
  marketing_source: string | null;
  lead_score: number | null;
  lead_flags: LeadFlag[] | null;
  admin_notes: string | null;
}

export interface LeadFlag {
  key: string;
  label: string;
  points: number;
}

export interface LeadFile {
  id: string;
  lead_id: string;
  created_at: string;
  file_type: string | null;
  original_filename: string | null;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
}

export interface IntakeFormData {
  // Step 1
  full_name: string;
  phone: string;
  email: string;
  city: string;
  // Step 2
  employer_name: string;
  role_title: string;
  employment_type: string;
  start_date: string;
  end_date: string;
  still_employed: boolean;
  // Step 3
  avg_monthly_salary: string;
  paid_overtime: string;
  overtime_hours_estimate: string;
  attendance_tracking: string;
  // Step 4
  pension_provided: string;
  pension_rate_known: string;
  travel_reimbursement: string;
  vacation_balance_issue: string;
  sick_days_issue: string;
  // Step 5
  termination_type: string;
  termination_date: string;
  reason_for_check: string;
  // Step 7
  consent: boolean;
  marketing_source: string;
}

export interface FileWithMeta {
  id: string;
  file: File;
  file_type: "payslip" | "contract" | "attendance" | "other";
}

export const EMPTY_FORM: IntakeFormData = {
  full_name: "",
  phone: "",
  email: "",
  city: "",
  employer_name: "",
  role_title: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  still_employed: true,
  avg_monthly_salary: "",
  paid_overtime: "",
  overtime_hours_estimate: "",
  attendance_tracking: "",
  pension_provided: "",
  pension_rate_known: "",
  travel_reimbursement: "",
  vacation_balance_issue: "",
  sick_days_issue: "",
  termination_type: "",
  termination_date: "",
  reason_for_check: "",
  consent: false,
  marketing_source: "",
};

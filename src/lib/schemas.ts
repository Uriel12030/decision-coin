import { z } from "zod";

export const contactSchema = z.object({
  full_name: z.string().min(2, "נדרש שם מלא"),
  phone: z.string().min(9, "מספר טלפון לא תקין"),
  email: z.string().email("אימייל לא תקין"),
  city: z.string().min(2, "נדרש שם עיר"),
});

export const employmentSchema = z.object({
  employer_name: z.string().optional(),
  role_title: z.string().min(1, "נדרש תפקיד"),
  employment_type: z.enum(["hourly", "monthly", "global", "contractor", "unknown"], {
    errorMap: () => ({ message: "יש לבחור סוג העסקה" }),
  }),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  still_employed: z.boolean(),
});

export const hoursSchema = z.object({
  avg_monthly_salary: z.string().optional(),
  paid_overtime: z.string().optional(),
  overtime_hours_estimate: z.string().optional(),
  attendance_tracking: z.string().optional(),
});

export const benefitsSchema = z.object({
  pension_provided: z.string().min(1, "יש לבחור"),
  pension_rate_known: z.string().optional(),
  travel_reimbursement: z.string().min(1, "יש לבחור"),
  vacation_balance_issue: z.string().min(1, "יש לבחור"),
  sick_days_issue: z.string().min(1, "יש לבחור"),
});

export const terminationSchema = z.object({
  termination_type: z.string().min(1, "יש לבחור סוג סיום"),
  termination_date: z.string().optional(),
  reason_for_check: z.string().optional(),
});

export const fullIntakeSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
  city: z.string().min(2),
  employer_name: z.string().optional().default(""),
  role_title: z.string().min(1),
  employment_type: z.string().min(1),
  start_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
  still_employed: z.boolean(),
  avg_monthly_salary: z.string().optional().default(""),
  paid_overtime: z.string().optional().default(""),
  overtime_hours_estimate: z.string().optional().default(""),
  attendance_tracking: z.string().optional().default(""),
  pension_provided: z.string().min(1),
  pension_rate_known: z.string().optional().default(""),
  travel_reimbursement: z.string().min(1),
  vacation_balance_issue: z.string().min(1),
  sick_days_issue: z.string().min(1),
  termination_type: z.string().optional().default(""),
  termination_date: z.string().optional().default(""),
  reason_for_check: z.string().optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "נדרש אישור" }) }),
  marketing_source: z.string().optional().default(""),
});

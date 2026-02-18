import type { LeadFlag } from "./types";

interface ScoringInput {
  pension_provided: string;
  paid_overtime: string;
  overtime_hours_estimate: string;
  travel_reimbursement: string;
  vacation_balance_issue: string;
  sick_days_issue: string;
  termination_type: string;
  still_employed: boolean;
  end_date: string;
}

export function computeScore(data: ScoringInput): {
  score: number;
  flags: LeadFlag[];
} {
  const flags: LeadFlag[] = [];

  if (data.pension_provided === "no") {
    flags.push({ key: "pension_not_provided", label: "פנסיה לא מופרשת", points: 25 });
  }

  if (data.paid_overtime === "no" && data.overtime_hours_estimate?.trim()) {
    flags.push({ key: "unpaid_overtime", label: "שעות נוספות ללא תשלום", points: 25 });
  }

  if (data.travel_reimbursement === "no") {
    flags.push({ key: "no_travel", label: "אין החזר נסיעות", points: 10 });
  }

  if (data.vacation_balance_issue === "yes") {
    flags.push({ key: "vacation_issue", label: "בעיית ימי חופשה", points: 10 });
  }

  if (data.sick_days_issue === "yes") {
    flags.push({ key: "sick_days_issue", label: "בעיית ימי מחלה", points: 10 });
  }

  if (["fired", "laid_off"].includes(data.termination_type)) {
    flags.push({ key: "terminated", label: "פיטורין / צמצום", points: 10 });
  }

  const withinLastYear =
    data.end_date &&
    new Date(data.end_date) >= new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

  if (data.still_employed || withinLastYear) {
    flags.push({ key: "recent_employment", label: "העסקה פעילה / אחרונה", points: 5 });
  }

  const raw = flags.reduce((sum, f) => sum + f.points, 0);
  return { score: Math.min(raw, 100), flags };
}

export function scoreSummary(flags: LeadFlag[]): string[] {
  return flags.map((f) => `${f.label} (+${f.points})`);
}

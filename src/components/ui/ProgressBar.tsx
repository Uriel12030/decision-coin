"use client";

interface Props {
  current: number;
  total: number;
  labels: string[];
}

export default function ProgressBar({ current, total, labels }: Props) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-xs text-gray-500">
        <span>
          שלב {current + 1} מתוך {total}
        </span>
        <span>{labels[current]}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

import Link from "next/link";

export const metadata = { title: "תודה – הבדיקה נשלחה" };

export default function ThankYou({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          הבדיקה נשלחה בהצלחה!
        </h1>
        <p className="mb-4 text-gray-600">
          נבדוק את הפרטים וניצור קשר בהקדם.
        </p>
        {searchParams.ref && (
          <p className="mb-6 rounded-lg bg-gray-100 px-4 py-3 font-mono text-sm text-gray-500">
            מספר פנייה: {searchParams.ref.slice(0, 8).toUpperCase()}
          </p>
        )}
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}

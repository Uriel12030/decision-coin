import Link from "next/link";

export const metadata = { title: "Admin – Payroll Check" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/leads"
            className="text-lg font-bold text-gray-900"
          >
            Payroll Check Admin
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Back to site
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}

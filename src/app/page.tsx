import Link from "next/link";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            בדיקת תלוש שכר{" "}
            <span className="text-blue-600">חינם</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            לא בטוח/ה שהתלוש תקין? מלא/י שאלון קצר, העלה/י מסמכים ונבדוק עבורך
            אם מגיעים לך כספים נוספים — פנסיה, שעות נוספות, החזר נסיעות ועוד.
          </p>
          <Link
            href="/intake"
            className="inline-block rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl"
          >
            התחל בדיקה חינמית
          </Link>
          <p className="mt-4 text-sm text-gray-400">
            ללא התחייבות • ללא צורך ברישום
          </p>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-gray-200 bg-white px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
              1
            </div>
            <h3 className="mb-1 font-semibold">מלא/י שאלון</h3>
            <p className="text-sm text-gray-500">
              שאלות פשוטות על ההעסקה, השכר והתנאים
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
              2
            </div>
            <h3 className="mb-1 font-semibold">העלה/י מסמכים</h3>
            <p className="text-sm text-gray-500">
              תלושי שכר, חוזה עבודה, דוחות נוכחות
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
              3
            </div>
            <h3 className="mb-1 font-semibold">קבל/י תשובה</h3>
            <p className="text-sm text-gray-500">
              נבדוק וניצור קשר עם ממצאים ראשוניים
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-400">
        <p>
          סינון אוטומטי בלבד. אינו מהווה ייעוץ משפטי. המידע מאוחסן בצורה
          מאובטחת ונמחק אוטומטית לאחר 60 יום.
        </p>
      </footer>
    </div>
  );
}

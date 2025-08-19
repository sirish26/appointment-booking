import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-full max-w-xl bg-white/80 border border-teal-100 rounded-lg p-4 mb-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-teal-900">
            Appointment Booking Task
          </h3>
          <ul className="list-disc pl-5 text-sm text-teal-900 space-y-1">
            <li>View available booking slots for various dates.</li>
            <li>Book new appointments with ease.</li>
            <li>view your existing bookings.</li>
            <li>Register for a new account.</li>
            <li>Log in to access your personalized booking dashboard.</li>
          </ul>
          <h2 className="text-lg font-semibold mb-2 text-teal-900">If i have 2 more hours</h2>
          <ul className="list-disc pl-5 text-sm text-teal-900 space-y-1">
            <li>Improve the UI/UX for a more intuitive experience.</li>
            <li>Implement email notifications for booking confirmations.</li>
            <li>Add user profile management features.</li>
            <li>Enhance error handling and validation.</li>
            <li>Optimize performance for faster loading times.</li>
          </ul>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-solid border-teal-400 bg-teal-100 text-teal-900 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 shadow hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-solid border-teal-400 bg-teal-100 text-teal-900 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 shadow hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Register
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center" />
    </div>
  );
}
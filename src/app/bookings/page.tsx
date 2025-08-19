import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import BookingPage from "@/components/Booking-page";

export default async function BookingsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/all-bookings");
  }

  return (
    <BookingPage />
  );
}
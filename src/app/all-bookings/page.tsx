"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Booking {
  id: string;
  slot: Slot;
  user: User;
  createdAt: string;
}

export default function AllBookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    // In a real app, you'd invalidate the session/cookie on the server
    // For this example, we'll just redirect
    router.push("/login");
  };

  const fetchAllBookings = async () => {
    try {
      const res = await fetch("/api/all-bookings");
      if (res.ok) {
        const data = await res.json();
        setAllBookings(data.bookings);
      } else {
        toast.error("Failed to fetch all bookings.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching all bookings.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAllBookings();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleGoToBookings = () => {
    router.push("/bookings");
  };

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full flex-col p-6 md:p-10">
      <div className="w-full max-w-full mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <div className="flex gap-4">
          <Button onClick={handleGoToBookings}>Go to Bookings</Button>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>

      <div className="w-full max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            allBookings.map((booking) => (
              <Card key={booking.id} className="w-full">
                <CardHeader>
                  <CardTitle>Slot: {new Date(booking.slot.startTime).toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>End: {new Date(booking.slot.endTime).toLocaleString()}</p>
                  <p>User: {booking.user.name} ({booking.user.email})</p>
                  <p>Booked At: {new Date(booking.createdAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

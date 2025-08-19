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

interface Booking {
  id: string;
  slot: Slot;
}

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMyBookings = async () => {
    try {
      const res = await fetch("/api/my-bookings");
      if (res.ok) {
        const data = await res.json();
        setMyBookings(data.bookings);
      } else {
        toast.error("Failed to fetch your bookings.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching your bookings.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchMyBookings();
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
        <h1 className="text-2xl font-bold">Your Bookings</h1>
        <Button onClick={handleGoToBookings}>Go to Bookings</Button>
      </div>

      <div className="w-full max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myBookings.length === 0 ? (
            <p>You have no bookings.</p>
          ) : (
            myBookings.map((booking) => (
              <Card key={booking.id} className="w-full">
                <CardHeader>
                  <CardTitle>{new Date(booking.slot.startTime).toLocaleString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>End: {new Date(booking.slot.endTime).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

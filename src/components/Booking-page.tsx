"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface GroupedSlots {
  [date: string]: {
    morning: Slot[];
    afternoon: Slot[];
  };
}

export default function BookingPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  const router = useRouter();

  const fetchSlots = async (selectedDate?: DateRange) => {
    setLoading(true);
    try {
      let url = "/api/slots";
      if (selectedDate?.from) {
        const from = format(selectedDate.from, "yyyy-MM-dd");
        let to = from;
        if (selectedDate.to) {
          to = format(selectedDate.to, "yyyy-MM-dd");
        }
        url = `/api/slots?from=${from}&to=${to}`;
        console.log("Fetching slots from URL:", url);
        const res = await fetch(url);
        console.log("API Response Status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched slots data:", data);
          setSlots(data.slots);
        } else {
          toast.error("Failed to fetch slots.");
        }
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("An error occurred while fetching slots.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots(date);
  }, [date]);

  const handleBookSlot = async (slotId: string) => {
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId }),
      });

      if (res.ok) {
        toast.success("Slot booked successfully!");
        fetchSlots(date); 
      } else {
        const errorData = await res.json();
        toast.error(errorData.error.message || "Failed to book slot.");
      }
    } catch (error) {
      toast.error("An error occurred while booking the slot.");
    }
  };

  const handleLogout = async () => {
    router.push("/login");
  };

  const handleMyBookings = () => {
    router.push("/my-bookings");
  };

  const handleDateSelect: SelectRangeEventHandler = (range) => {
    setDate(range);
  };

  const groupSlots = (slots: Slot[]) => {
    const grouped: GroupedSlots = {};
    slots.forEach((slot) => {
      const date = new Date(slot.startTime).toLocaleDateString();
      const hour = new Date(slot.startTime).getUTCHours();

      if (!grouped[date]) {
        grouped[date] = { morning: [], afternoon: [] };
      }

      if (hour < 12) {
        grouped[date].morning.push(slot);
      } else {
        grouped[date].afternoon.push(slot);
      }
    });
    return grouped;
  };

  const groupedSlots = groupSlots(slots);

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
        <h1 className="text-2xl font-bold">Available Slots</h1>
        <div className="flex gap-4">
          <Button onClick={handleMyBookings}>My Bookings</Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "LLL dd, y")} - ${format(
                      date.to,
                      "LLL dd, y"
                    )}`
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  initialFocus
                />
            </PopoverContent>
          </Popover>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </div>

      <div className="w-full max-w-full mx-auto">
        {Object.keys(groupedSlots).length === 0 ? (
          <p>No available slots.</p>
        ) : (
          Object.keys(groupedSlots).sort().map((date) => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{date}</h2>
              
              {groupedSlots[date].morning.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Morning Slots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedSlots[date].morning.map((slot) => (
                      <Card key={slot.id} className="w-full">
                        <CardHeader>
                          <CardTitle>{new Date(slot.startTime).toLocaleTimeString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>End: {new Date(slot.endTime).toLocaleTimeString()}</p>
                          <Button onClick={() => handleBookSlot(slot.id)} className="mt-4 w-full">
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {groupedSlots[date].afternoon.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Afternoon Slots</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedSlots[date].afternoon.map((slot) => (
                      <Card key={slot.id} className="w-full">
                        <CardHeader>
                          <CardTitle>{new Date(slot.startTime).toLocaleTimeString()}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>End: {new Date(slot.endTime).toLocaleTimeString()}</p>
                          <Button onClick={() => handleBookSlot(slot.id)} className="mt-4 w-full">
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}



"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


type Event = {
  title: string;
  time: string;
  type: 'class' | 'event' | 'seminar';
};

const initialEvents: Record<string, Event[]> = {
  // Dates are in YYYY-MM-DD format for easy key access
  "2024-08-01": [{ title: "Yoga Class", time: "6:00 PM", type: "class" }],
  "2024-08-05": [{ title: "Team Workout", time: "10:00 AM", type: "event" }],
  "2024-08-15": [{ title: "Nutrition Seminar", time: "2:00 PM", type: "seminar" }],
  "2024-08-22": [{ title: "Yoga Class", time: "6:00 PM", type: "class" }],
};

const datesWithEvents = Object.keys(initialEvents).map(d => {
  const [year, month, day] = d.split('-').map(Number);
  return new Date(year, month - 1, day);
});


export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial date on client-side to avoid hydration mismatch
    setDate(new Date());
  }, []);

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would add the event to your state/DB
    toast({
        title: "Evento Adicionado!",
        description: "O novo evento foi adicionado ao calendário.",
    });
    setIsModalOpen(false);
  }

  const selectedDateString = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
  const selectedEvents = initialEvents[selectedDateString] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Event
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>Fill in the details for the new event.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input id="event-title" placeholder="E.g., Morning Yoga" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="event-date">Date</Label>
                        <Input id="event-date" type="date" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="event-time">Time</Label>
                        <Input id="event-time" type="time" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="event-type">Type</Label>
                         <Select required>
                            <SelectTrigger id="event-type">
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="class">Class</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="seminar">Seminar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Event</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[1fr_380px]">
        <Card>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-3 flex justify-center w-full"
            modifiers={{ hasEvent: datesWithEvents }}
            modifiersClassNames={{ hasEvent: 'has-event' }}
            styles={{
              day: { position: 'relative' },
            }}
          />
          <style jsx global>{`
            .has-event:not([aria-selected]) > div::after {
              content: '';
              display: block;
              position: absolute;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: hsl(var(--accent));
              bottom: 2px;
              left: 50%;
              transform: translateX(-50%);
            }
            .has-event[aria-selected] > div::after {
              background-color: hsl(var(--primary-foreground));
            }
          `}</style>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Events for {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "..."}
            </CardTitle>
            <CardDescription>
              {selectedEvents.length > 0 ? `You have ${selectedEvents.length} event(s) today.` : "No events scheduled for this day."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map((event, i) => (
                  <div key={i} className="flex items-start space-x-3 rounded-lg border p-3">
                    <div className="flex-1">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                    <Badge variant={event.type === 'class' ? 'default' : 'secondary'}>{event.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                <p>Select a date with a colored dot to see event details.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

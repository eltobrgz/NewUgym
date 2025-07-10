
"use client";

import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/contexts/user-role-context";
import { format, parse } from 'date-fns';
import { EventsContext, EventType, Event } from "@/contexts/events-context";

const getEventDateKey = (d: Date): string => format(d, 'yyyy-MM-dd');

export default function CalendarPage() {
  const { userRole, user } = useUserRole();
  const { events, addEvent, registerForEvent, isRegistered } = useContext(EventsContext);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial date on the client to avoid hydration mismatch
    setDate(new Date());
  }, []);

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('event-title') as string;
    const dateStr = formData.get('event-date') as string;
    const time = formData.get('event-time') as string;
    const type = formData.get('event-type') as EventType;
    const description = formData.get('event-description') as string;
    
    addEvent({ title, date: dateStr, time, type, description });

    toast({
        title: "Event Added!",
        description: "The new event has been added to the calendar.",
    });
    setAddModalOpen(false);
    e.currentTarget.reset();
  }

  const handleRegister = (eventId: string) => {
    registerForEvent(eventId, user.name); // Using user name as ID for mock
    toast({
      title: "Inscrição Confirmada!",
      description: "Você se inscreveu no evento com sucesso.",
    });
  }

  const selectedDateString = date ? getEventDateKey(date) : '';
  const selectedDayEvents = events[selectedDateString] || [];
  const datesWithEvents = Object.keys(events).map(d => parse(d, 'yyyy-MM-dd', new Date()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
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
                        <Input id="event-title" name="event-title" placeholder="E.g., Morning Yoga" required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="event-date">Date</Label>
                            <Input id="event-date" name="event-date" type="date" required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="event-time">Time</Label>
                            <Input id="event-time" name="event-time" type="time" required />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="event-type">Type</Label>
                         <Select name="event-type" required>
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
                     <div className="space-y-2">
                        <Label htmlFor="event-description">Description</Label>
                        <Input id="event-description" name="event-description" placeholder="A brief description of the event."/>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Event</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={(isOpen) => !isOpen && setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>{selectedEvent?.description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center text-sm text-muted-foreground gap-4 py-4">
            <span>{selectedEvent?.time && format(parse(selectedEvent.time, 'HH:mm', new Date()), 'p')}</span>
            <Badge variant={selectedEvent?.type === 'class' ? 'default' : 'secondary'}>{selectedEvent?.type}</Badge>
          </div>
          {userRole === "Student" && (
            <DialogFooter>
              {isRegistered(selectedEvent?.id || '', user.name) ? (
                <Button disabled>
                  <Ticket className="mr-2 h-4 w-4" />
                  Inscrito
                </Button>
              ) : (
                <Button onClick={() => handleRegister(selectedEvent!.id)}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Inscrever-se
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Events for {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : "..."}
            </CardTitle>
            <CardDescription>
              {selectedDayEvents.length > 0 ? `You have ${selectedDayEvents.length} event(s) today.` : "No events scheduled for this day."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDayEvents.map((event) => (
                  <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full text-left">
                    <div className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-accent transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.time && format(parse(event.time, 'HH:mm', new Date()), 'p')}</p>
                      </div>
                      <Badge variant={event.type === 'class' ? 'default' : 'secondary'}>{event.type}</Badge>
                    </div>
                  </button>
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
    </div>
  );
}

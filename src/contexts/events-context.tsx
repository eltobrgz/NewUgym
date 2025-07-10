
"use client"

import { createContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

export type EventType = 'class' | 'event' | 'seminar';

export type Event = {
  id: string;
  title: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  description: string;
  type: EventType;
};

// Maps date string 'yyyy-MM-dd' to an array of events
type EventsState = Record<string, Event[]>;

// Maps eventId to a Set of userIds (or names for mock)
type RegistrationsState = Record<string, Set<string>>;

const initialEventsData: EventsState = {
  "2024-08-01": [{ id: "evt1", date: "2024-08-01", title: "Yoga Class", time: "18:00", description: "Relaxing yoga session for all levels.", type: "class" }],
  "2024-08-05": [{ id: "evt2", date: "2024-08-05", title: "Team Workout", time: "10:00", description: "High-intensity group workout.", type: "event" }],
  "2024-08-15": [{ id: "evt3", date: "2024-08-15", title: "Nutrition Seminar", time: "14:00", description: "Learn about sports nutrition.", type: "seminar" }],
  "2024-08-22": [{ id: "evt4", date: "2024-08-22", title: "Yoga Class", time: "18:00", description: "Advanced Vinyasa flow.", type: "class" }],
};

interface EventsContextType {
  events: EventsState;
  registrations: RegistrationsState;
  addEvent: (newEventData: Omit<Event, 'id'>) => void;
  registerForEvent: (eventId: string, userId: string) => void;
  isRegistered: (eventId: string, userId: string) => boolean;
}

export const EventsContext = createContext<EventsContextType>({
  events: {},
  registrations: {},
  addEvent: () => {},
  registerForEvent: () => {},
  isRegistered: () => false,
});

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<EventsState>(initialEventsData);
  const [registrations, setRegistrations] = useState<RegistrationsState>({});

  const addEvent = (newEventData: Omit<Event, 'id'>) => {
    setEvents(prev => {
      const newEvents = { ...prev };
      const dateKey = newEventData.date;
      const newEvent = { ...newEventData, id: `evt-${Date.now()}` };

      if (!newEvents[dateKey]) {
        newEvents[dateKey] = [];
      }
      newEvents[dateKey].push(newEvent);
      return newEvents;
    });
  };

  const registerForEvent = (eventId: string, userId: string) => {
    setRegistrations(prev => {
        const newRegs = { ...prev };
        if (!newRegs[eventId]) {
            newRegs[eventId] = new Set();
        }
        newRegs[eventId].add(userId);
        return newRegs;
    });
  };

  const isRegistered = (eventId: string, userId: string) => {
    return registrations[eventId]?.has(userId) || false;
  };

  return (
    <EventsContext.Provider value={{ events, registrations, addEvent, registerForEvent, isRegistered }}>
      {children}
    </EventsContext.Provider>
  );
};

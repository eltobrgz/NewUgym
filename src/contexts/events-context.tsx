
"use client"

import { createContext, useState, ReactNode } from 'react';
import { format, addDays, startOfMonth } from 'date-fns';

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

// Helper to get dates for the current month for more dynamic mock data
const today = new Date();
const startOfCurrentMonth = startOfMonth(today);

const initialEventsData: EventsState = {
  [format(addDays(startOfCurrentMonth, 1), 'yyyy-MM-dd')]: [{ id: "evt1", date: format(addDays(startOfCurrentMonth, 1), 'yyyy-MM-dd'), title: "Aula de Yoga", time: "18:00", description: "Sessão de yoga relaxante para todos os níveis.", type: "class" }],
  [format(addDays(startOfCurrentMonth, 4), 'yyyy-MM-dd')]: [{ id: "evt2", date: format(addDays(startOfCurrentMonth, 4), 'yyyy-MM-dd'), title: "Treino em Equipe", time: "10:00", description: "Treino em grupo de alta intensidade.", type: "event" }],
  [format(addDays(startOfCurrentMonth, 8), 'yyyy-MM-dd')]: [{ id: "evt5", date: format(addDays(startOfCurrentMonth, 8), 'yyyy-MM-dd'), title: "Aula de Spinning", time: "19:00", description: "Queime calorias ao som de músicas vibrantes.", type: "class" }],
  [format(addDays(startOfCurrentMonth, 14), 'yyyy-MM-dd')]: [{ id: "evt3", date: format(addDays(startOfCurrentMonth, 14), 'yyyy-MM-dd'), title: "Seminário de Nutrição", time: "14:00", description: "Aprenda sobre nutrição esportiva com a Dra. Sofia.", type: "seminar" }],
  [format(addDays(startOfCurrentMonth, 21), 'yyyy-MM-dd')]: [
      { id: "evt4", date: format(addDays(startOfCurrentMonth, 21), 'yyyy-MM-dd'), title: "Aula de Yoga Avançada", time: "18:00", description: "Fluxo Vinyasa avançado.", type: "class" },
      { id: "evt6", date: format(addDays(startOfCurrentMonth, 21), 'yyyy-MM-dd'), title: "Desafio de Força", time: "11:00", description: "Teste seus limites no supino e agachamento.", type: "event" }
    ],
  [format(addDays(startOfCurrentMonth, 28), 'yyyy-MM-dd')]: [{ id: "evt7", date: format(addDays(startOfCurrentMonth, 28), 'yyyy-MM-dd'), title: "Aula de Alongamento", time: "09:00", description: "Melhore sua flexibilidade e previna lesões.", type: "class" }],
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
  const [registrations, setRegistrations] = useState<RegistrationsState>({
    'evt1': new Set(['stu-001']),
    'evt3': new Set(['stu-001', 'alex-johnson'])
  });

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

    
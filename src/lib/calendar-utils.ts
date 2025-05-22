import { addDays, startOfToday } from 'date-fns';

// Event type definition
export interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: 'meeting' | 'call' | 'demo' | 'other';
  contactName: string;
}

// Sample events data (for initial dev/testing)
export const sampleEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Meeting with John',
    date: addDays(startOfToday(), 1),
    time: '10:00 AM',
    duration: '1 hour',
    type: 'meeting',
    contactName: 'John Smith',
  },
  // …etc
];

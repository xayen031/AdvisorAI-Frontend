
import { CalendarEvent, sampleEvents } from "@/lib/calendar-utils";
import { isSameDay } from "date-fns";

// In a real application, this would connect to an API
class CalendarService {
  private events: CalendarEvent[] = [...sampleEvents];
  private listeners: (() => void)[] = [];

  getEvents(): CalendarEvent[] {
    return [...this.events];
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => 
      isSameDay(event.date, date)
    );
  }

  addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvent = {
      ...event,
      id: this.generateId(),
    };
    
    this.events.push(newEvent);
    this.notifyListeners();
    return newEvent;
  }

  updateEvent(updatedEvent: CalendarEvent): CalendarEvent {
    const index = this.events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      this.events[index] = updatedEvent;
      this.notifyListeners();
      return updatedEvent;
    }
    throw new Error(`Event with id ${updatedEvent.id} not found`);
  }

  deleteEvent(id: number): void {
    const index = this.events.findIndex(e => e.id === id);
    if (index !== -1) {
      this.events.splice(index, 1);
      this.notifyListeners();
      return;
    }
    throw new Error(`Event with id ${id} not found`);
  }

  private generateId(): number {
    return Math.max(0, ...this.events.map(e => e.id)) + 1;
  }

  addListener(listener: () => void): () => void {
    this.listeners.push(listener);
    
    // Return function to remove the listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Singleton instance
export const calendarService = new CalendarService();

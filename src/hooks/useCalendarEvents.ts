import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { CalendarEvent } from '@/lib/calendar-utils';

export function useCalendarEvents(selectedDate: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events for the selected day
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const day = selectedDate.toISOString().substring(0, 10); // YYYY-MM-DD

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', day)
        .order('time', { ascending: true });

      if (error) {
        console.error('Failed to load events:', error.message);
      } else if (data) {
        setEvents(data.map((r: any) => ({
          id:          r.id,
          title:       r.title,
          date:        new Date(r.date),
          time:        r.time,
          duration:    r.duration,
          type:        r.type,
          contactName: r.contact_name,
        })));
      }
      setIsLoading(false);
    }
    load();
  }, [selectedDate]);

  // Create
  const addEvent = async (e: Omit<CalendarEvent, 'id'>) => {
    const payload = {
      title:        e.title,
      date:         e.date.toISOString().substring(0, 10),
      time:         e.time,
      duration:     e.duration,
      type:         e.type,
      contact_name: e.contactName,
    };
    const { data, error } = await supabase
      .from('events')
      .insert(payload)
      .select()
      .single();

    if (!error && data) {
      setEvents(ev => [
        ...ev,
        {
          id:          data.id,
          title:       data.title,
          date:        new Date(data.date),
          time:        data.time,
          duration:    data.duration,
          type:        data.type,
          contactName: data.contact_name,
        }
      ]);
    }
  };

  // Update
  const updateEvent = async (e: CalendarEvent) => {
    const payload = {
      title:        e.title,
      date:         e.date.toISOString().substring(0, 10),
      time:         e.time,
      duration:     e.duration,
      type:         e.type,
      contact_name: e.contactName,
    };
    const { error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', e.id);

    if (!error) {
      setEvents(ev => ev.map(evt => evt.id === e.id ? e : evt));
    }
  };

  // Delete
  const deleteEvent = async (id: number) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (!error) {
      setEvents(ev => ev.filter(evt => evt.id !== id));
    }
  };

  return { events, isLoading, addEvent, updateEvent, deleteEvent };
}

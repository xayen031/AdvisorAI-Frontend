import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import CRMHeader from '@/components/crm/CRMHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, addDays, isToday } from 'date-fns';
import EventCard from '@/components/crm/EventCard';
import EventForm from '@/components/crm/EventForm';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { supabase } from '@/lib/supabaseClient'; // Make sure this exists

interface Contact {
  id: string;
  name: string;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { events, isLoading, addEvent, updateEvent, deleteEvent } = useCalendarEvents(date);

  const handleAddEvent = (e: Omit<any, 'id'>) => {
    addEvent(e);
    setIsAddEventOpen(false);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from('contacts').select('id, name');
      if (!error && data) setContacts(data);
    };
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950">
      <CRMHeader activePage="Calendar" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your appointments and events</p>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            onClick={() => setIsAddEventOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          <Card className="md:col-span-3 border">
            <CardHeader className="bg-gray-50 dark:bg-indigo-900/50 border-b p-4">
              <CardTitle className="text-xl">{format(date, 'MMMM yyyy')}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={d => d && setDate(d)}
                className="rounded-md border dark:border-gray-800 p-3 w-full"
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-4 border">
            <CardHeader className="bg-gray-50 dark:bg-indigo-900/50 border-b p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  {format(date, 'EEEE, MMMM d, yyyy')}
                  {isToday(date) && (
                    <span className="ml-2 text-sm bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                      Today
                    </span>
                  )}
                </CardTitle>
                <div className="flex space-x-1">
                  <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, -1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDate(addDays(date, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading
                ? <p className="text-center text-gray-500">Loading events…</p>
                : events.length > 0
                  ? events.map(evt => (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        onUpdate={updateEvent}
                        onDelete={deleteEvent}
                        contacts={contacts}
                      />
                    ))
                  : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                      <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">No events</p>
                      <Button className="mt-4" onClick={() => setIsAddEventOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Event
                      </Button>
                    </div>
                  )
              }
            </CardContent>
          </Card>
        </div>
      </div>

      <EventForm
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onSave={handleAddEvent}
        initialDate={date}
        contacts={contacts}
      />
    </div>
  );
};

export default CalendarPage;

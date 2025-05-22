import React, { useState } from 'react';
import { Calendar, Clock, User, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/lib/calendar-utils';
import EventForm from './EventForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Contact {
  id: string;
  name: string;
}

interface EventCardProps {
  event: CalendarEvent;
  onUpdate: (event: CalendarEvent) => void;
  onDelete: (id: number) => void;
  contacts: Contact[]; // ✅ added this
}

const EventCard: React.FC<EventCardProps> = ({ event, onUpdate, onDelete, contacts }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDelOpen, setIsDelOpen] = useState(false);

  const handleUpdate = (data: Omit<CalendarEvent, 'id'>) => {
    onUpdate({ ...data, id: event.id });
    setIsEditOpen(false);
  };

  return (
    <>
      <div className="flex p-3 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="mr-4 p-2 bg-indigo-100 rounded-md">
          <Calendar className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium">{event.title}</h3>
          <div className="mt-1 flex flex-col sm:flex-row sm:gap-3 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" /> {event.time} ({event.duration})
            </span>
            <span className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" /> {event.contactName}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsDelOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <EventForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdate}
        initialDate={event.date}
        event={event}
        contacts={contacts} // ✅ passed here
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDelOpen} onOpenChange={setIsDelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete “{event.title}”? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onDelete(event.id); setIsDelOpen(false); }} className="bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventCard;

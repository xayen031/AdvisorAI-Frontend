import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/calendar-utils';

interface Contact {
  id: string;
  name: string;
}

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  initialDate: Date;
  event?: CalendarEvent;
  contacts: Contact[];
}

const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  event,
  contacts,
}) => {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState<Date>(event?.date || initialDate);
  const [time, setTime] = useState(event?.time || '10:00 AM');
  const [duration, setDuration] = useState(event?.duration || '1 hour');
  const [type, setType] = useState<CalendarEvent['type']>(event?.type || 'meeting');
  const [contactName, setContact] = useState(event?.contactName || '');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setTime(event.time);
      setDuration(event.duration);
      setType(event.type);
      setContact(event.contactName);
    } else {
      setTitle('');
      setDate(initialDate);
      setTime('10:00 AM');
      setDuration('1 hour');
      setType('meeting');
      setContact('');
    }
  }, [isOpen, event, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contactName.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({ title, date, time, duration, type, contactName });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Meeting with client"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full text-left')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={d => d && setDate(d)}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Time *</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="10:00 AM"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration *</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[
                  '15 minutes',
                  '30 minutes',
                  '45 minutes',
                  '1 hour',
                  '1.5 hours',
                  '2 hours',
                  '3 hours',
                ].map(dur => (
                  <SelectItem key={dur} value={dur}>
                    {dur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={type} onValueChange={v => setType(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {['meeting', 'call', 'demo', 'other'].map(t => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contact *</Label>
            <Select value={contactName} onValueChange={setContact}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.name}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {event ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;

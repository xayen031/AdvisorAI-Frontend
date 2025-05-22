// src/components/crm/StatCards.tsx
import React, { useEffect, useState } from 'react';
import {
  Users,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';

const StatCards = () => {
  const [contactCount, setContactCount] = useState<number | null>(null);
  const [meetingCount, setMeetingCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) return;

      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      const { count: meetingsCount } = await supabase
        .from('meetings')
        .select('*', { count: 'exact' })
        .eq('user_id', userId); // 👈 sadece o kullanıcıya ait meeting'ler

      setContactCount(contactsCount ?? 0);
      setMeetingCount(meetingsCount ?? 0);
    };

    fetchStats();
  }, []);


  const stats = [
    {
      title: 'Total Contacts',
      value: contactCount !== null ? contactCount.toString() : '...',
      icon: Users,
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    },
    {
      title: 'Total Meetings',
      value: meetingCount !== null ? meetingCount.toString() : '...',
      icon: CalendarDays,
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;

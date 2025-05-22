// src/pages/Meetings.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CRMHeader from '@/components/crm/CRMHeader'

interface Meeting {
  id: string
  title: string
  started_at: string
  session_id: string
}

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true)

      const { data: userData } = await supabase.auth.getUser()
      const advisorId = userData?.user?.id

      if (!advisorId) {
        console.warn('No advisor ID found.')
        setMeetings([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('meetings')
        .select('id, title, started_at, session_id')
        .eq('user_id', advisorId)
        .order('started_at', { ascending: false })

      if (error) {
        console.error('Error fetching meetings:', error.message)
      } else {
        setMeetings(data || [])
      }

      setLoading(false)
    }

    fetchMeetings()
  }, [])

  const goToDetails = (meeting: Meeting) => {
    navigate('/meeting-details', {
        state: {
            meetingId: meeting.session_id, // ✅ Not UUID — it's the custom string
            advisorName: 'You',
            customerName: meeting.title.replace('Meeting with ', ''),
        }
    })

  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950">
      <CRMHeader activePage="Meetings" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your Meetings</h1>
          <p className="text-gray-600 dark:text-gray-300">Meetings you’ve conducted as an advisor</p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading meetings…</p>
        ) : meetings.length === 0 ? (
          <p className="text-gray-500">No meetings found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="border-b bg-gray-100 dark:bg-indigo-900/50 p-4">
                  <CardTitle className="text-lg">{meeting.title}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {new Date(meeting.started_at).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <Button onClick={() => goToDetails(meeting)}>View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingsPage

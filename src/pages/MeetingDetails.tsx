// src/pages/MeetingDetails.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CRMHeader from '@/components/crm/CRMHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { Contact } from '@/types/contact'

interface TranscriptItem {
  timestamp: string
  speaker: 'Advisor' | 'Customer' | 'System'
  text: string
}

interface AIResponse {
  timestamp?: string
  text: string
}

type LocationState = {
  meetingId: string
  advisorName: string
  customerName: string
}

const MeetingDetails: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { meetingId, advisorName, customerName } = (state as LocationState) || {}

  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([])
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([])
  const [summary, setSummary] = useState<string | null>(null)
  const [extractedInfo, setExtractedInfo] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [appendingField, setAppendingField] = useState<string | null>(null)

  const scrollableArea = { maxHeight: '400px' }

  const renderValue = (val: any, indent = 0): string => {
    const spacer = ' '.repeat(indent);

    if (val === null || val === undefined) return ''; // null'ları atla

    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return `${spacer}${val}`;
    }

    if (Array.isArray(val)) {
      const filtered = val
        .map(item => renderValue(item, indent + 2))
        .filter(Boolean); // boşları ayıkla
      if (filtered.length === 0) return '';
      return filtered.map(item => `${spacer}- ${item.trimStart()}`).join('\n');
    }

    if (typeof val === 'object') {
      const entries = Object.entries(val)
        .map(([k, v]) => {
          const rendered = renderValue(v, indent + 2);
          if (!rendered) return '';
          return `${spacer}${k}: ${rendered}`;
        })
        .filter(Boolean);

      if (entries.length === 0) return '';
      return entries.join('\n');
    }

    return '';
  };

  const fetchMeetingData = async () => {
    if (!meetingId) return
    setLoading(true)

    // 1) Load transcripts
    const { data: tData } = await supabase
      .from('conversations')
      .select('timestamp, source, transcript')
      .eq('session_id', meetingId)
      .order('timestamp', { ascending: true })

    if (tData) {
      setTranscripts(
        tData.map(r => ({
          timestamp: r.timestamp,
          speaker:
            r.source === 'mic' ? 'Advisor' :
            r.source === 'speaker' ? 'Customer' :
            'System',
          text: r.transcript,
        }))
      )
    }

    // 2) Load AI responses
    const { data: aiData } = await supabase
      .from('openai_responses')
      .select('timestamp, openai_response')
      .eq('session_id', meetingId)
      .order('timestamp', { ascending: true })

    if (aiData) {
      setAiResponses(
        aiData.map(r => ({
          timestamp: r.timestamp,
          text: r.openai_response,
        }))
      )
    }

    // 3) Load stored summary
    const { data: sData } = await supabase
      .from('summaries')
      .select('summary')
      .eq('session_id', meetingId)
      .single()

    if (sData?.summary) {
      setSummary(sData.summary)
    }

    // 4) Try existing extracted info from Supabase
    const { data: existing } = await supabase
      .from('contact_extractions')
      .select('extracted_data')
      .eq('session_id', meetingId)
      .maybeSingle()

    if (existing?.extracted_data) {
      setExtractedInfo(existing.extracted_data)
    } else if (tData && tData.length) {
      // 5) Otherwise: call /extract_contact
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/extract_contact?userId=${meetingId}&clientId=${meetingId}&sessionId=${meetingId}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: tData.map(r => ({
                speaker:
                  r.source === 'mic' ? 'Advisor' :
                  r.source === 'speaker' ? 'Customer' :
                  'System',
                text: r.transcript,
              })),
            }),
          }
        )
        if (resp.ok) {
          const info: Contact = await resp.json()
          setExtractedInfo(info)
        } else {
          console.error('Extraction failed:', await resp.text())
        }
      } catch (err) {
        console.error('Error calling extract_contact:', err)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchMeetingData()
  }, [meetingId])

  const handleAppend = async (key: keyof Contact, value: any) => {
    if (!meetingId) return;
    setAppendingField(key as string);

    try {
      // 🔍 Önce meeting içinden client_id'yi bul
      const { data: meeting, error: meetingError } = await supabase
        .from('meetings')
        .select('client_id')
        .eq('session_id', meetingId)
        .single();

      if (meetingError || !meeting) {
        console.error('Meeting not found:', meetingError);
        alert('Meeting not found for this session.');
        return;
      }

      const clientId = meeting.client_id;

      // 🔍 Ardından contact'ı id (client_id) ile bul
      const { data: existingContact, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', clientId)
        .single();

      if (fetchError || !existingContact) {
        console.error('Contact not found:', fetchError);
        alert('Contact not found for this meeting.');
        return;
      }

      // 🔄 Güncellenecek veri
      const updateData: any = {};
      const nestedKeys: Array<keyof Contact> = [
        'personalDetails',
        'compliance',
        'financials',
        'family',
        'riskProfile',
        'letterOfAuthority',
      ];

      if (nestedKeys.includes(key)) {
        updateData[key] = {
          ...(existingContact[key] || {}),
          ...(typeof value === 'object' ? value : {}),
        };
      } else if (key === 'tags' && Array.isArray(value)) {
        const existingTags = existingContact.tags || [];
        updateData.tags = [...new Set([...existingTags, ...value])];
      } else {
        updateData[key] =
          typeof value === 'object' ? JSON.stringify(value) :
          Array.isArray(value) ? value.join(', ') :
          String(value ?? '');
      }

      // 📝 Güncelleme işlemi
      const { error: updateError } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', clientId); // artık id ile eşleştiriyoruz

      if (updateError) {
        console.error('Append error:', updateError);
        alert(`Error updating ${key}`);
      } else {
        alert(`Successfully updated ${key}`);
        fetchMeetingData(); // veriyi yeniden çek
      }
    } catch (err) {
      console.error('Error in handleAppend:', err);
      alert('An error occurred while updating');
    } finally {
      setAppendingField(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Loading meeting details…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950 flex flex-col">
      <CRMHeader activePage="Meeting Details" />

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Meeting Details — {meetingId}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Advisor: {advisorName} | Customer: {customerName}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/crm/meetings')}>
            Back
          </Button>
          <Button variant="outline" onClick={fetchMeetingData}>
            Re-extract Contact Info
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
        {/* Transcript Panel */}
        <Card>
          <CardHeader className="bg-gray-100 dark:bg-indigo-900/50 border-b p-3">
            <CardTitle>Full Transcript</CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-y-auto" style={scrollableArea}>
            {transcripts.map((t, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{new Date(t.timestamp).toLocaleString()}</span>
                  <span className="uppercase">{t.speaker}</span>
                </div>
                <p className="px-3 py-2 bg-gray-200 dark:bg-indigo-800 rounded whitespace-pre-wrap">
                  {t.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Responses Panel */}
        <Card>
          <CardHeader className="bg-gray-100 dark:bg-indigo-900/50 border-b p-3">
            <CardTitle>AI Responses</CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-y-auto" style={scrollableArea}>
            {aiResponses.map((r, i) => (
              <div key={i} className="mb-3">
                {r.timestamp && (
                  <div className="text-xs text-gray-500">
                    {new Date(r.timestamp).toLocaleString()}
                  </div>
                )}
                <div
                  className="px-3 py-2 bg-green-100 dark:bg-green-900 rounded text-sm text-gray-800 dark:text-gray-100"
                  dangerouslySetInnerHTML={{ __html: r.text }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Summary Panel */}
        <Card>
          <CardHeader className="bg-gray-100 dark:bg-indigo-900/50 border-b p-3">
            <CardTitle>AI Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-3 overflow-y-auto" style={scrollableArea}>
            {summary ? (
              <div className="prose dark:prose-invert whitespace-pre-wrap">{summary}</div>
            ) : (
              <p className="text-gray-500">Summary not available.</p>
            )}
          </CardContent>
        </Card>

        {/* Extracted Contact Info Panel */}
        <Card>
          <CardHeader className="bg-gray-100 dark:bg-indigo-900/50 border-b p-3">
            <CardTitle>Extracted Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-4">
            {extractedInfo ? (
              Object.entries(extractedInfo)
                .filter(([, val]) => {
                  if (val === null || val === undefined) return false;
                  if (typeof val === 'object') {
                    // boş obje veya boş array filtrele
                    return Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0;
                  }
                  return true; // string, number, vs göster
                })
                .map(([key, val]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 p-3 rounded-md border bg-white dark:bg-indigo-900/30"
                  >
                    <div className="w-32 font-semibold text-gray-700 dark:text-gray-200 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    </div>
                    <div className="flex-1 space-y-1 text-sm text-gray-800 dark:text-gray-100">
                      <pre className="whitespace-pre-wrap break-words font-mono bg-gray-100 dark:bg-indigo-800 p-2 rounded">
                        {renderValue(val)}
                      </pre>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 sm:mt-0"
                      disabled={appendingField === key}
                      onClick={() => handleAppend(key as keyof Contact, val)}
                    >
                      {appendingField === key ? 'Appending…' : 'Append'}
                    </Button>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 italic">No extracted contact info available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MeetingDetails

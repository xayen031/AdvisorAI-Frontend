// src/pages/Meeting.tsx
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send } from 'lucide-react'

interface TranscriptItem {
  timestamp: string
  speaker: 'Advisor' | 'Customer' | 'System'
  text: string
}

type LocationState = {
  meetingId?: string
  advisorName?: string
  customerName?: string
}

export const MeetingPage: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: LocationState }
  const meetingId    = state?.meetingId    ?? 'dev-session'
  const advisorName  = state?.advisorName  ?? 'Advisor'
  const customerName = state?.customerName ?? 'Customer'

  const micStreamRef = useRef<MediaStream|null>(null)
  const spkStreamRef = useRef<MediaStream|null>(null)

  // WebSocket refs
  const wsMicRef = useRef<WebSocket|null>(null)
  const wsSpkRef = useRef<WebSocket|null>(null)

  // AudioContext refs
  const audioCtxRef = useRef<AudioContext|null>(null)
  const micSrcRef   = useRef<MediaStreamAudioSourceNode|null>(null)
  const spkSrcRef   = useRef<MediaStreamAudioSourceNode|null>(null)
  const micProcRef  = useRef<ScriptProcessorNode|null>(null)
  const spkProcRef  = useRef<ScriptProcessorNode|null>(null)

  // UI state
  const [streaming, setStreaming]       = useState(false)
  const [meetingEnded, setMeetingEnded] = useState(false)
  const [transcripts, setTranscripts]   = useState<TranscriptItem[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [aiPrompt, setAiPrompt]         = useState('')

  const transcriptEl = useRef<HTMLDivElement|null>(null)
  const aiEl         = useRef<HTMLDivElement|null>(null)

  // auto-scroll
  useEffect(() => {
    transcriptEl.current?.scrollTo({ top: transcriptEl.current.scrollHeight })
  }, [transcripts])
  useEffect(() => {
    aiEl.current?.scrollTo({ top: aiEl.current.scrollHeight })
  }, [aiSuggestions])

  const append = (item: TranscriptItem) =>
    setTranscripts(prev => [...prev, item])

  const openWs = (path: '/mic' | '/speaker'): Promise<WebSocket> =>
    new Promise(res => {
      const ws = new WebSocket(import.meta.env.VITE_BACKEND_URL + path +
        `?userId=${meetingId}&clientId=${meetingId}&sessionId=${meetingId}`)
      ws.binaryType = 'arraybuffer'
      ws.onopen = () => res(ws)
    })

  const startMeeting = async () => {

    try {
      // capture system audio via screenshare
      const disp = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      disp.getVideoTracks().forEach(t => t.stop())
      // capture mic audio
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = mic
      spkStreamRef.current = new MediaStream(disp.getAudioTracks()) 
      // open transcription websockets
      const wsMic = await openWs('/mic')
      const wsSpk = await openWs('/speaker')
      wsMicRef.current = wsMic
      wsSpkRef.current = wsSpk

      // handle incoming transcript messages
      wsMic.onmessage = ev => {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'mic_transcription') {
          append({ timestamp: msg.timestamp, speaker: 'Advisor', text: msg.content })
        }
      }
      wsSpk.onmessage = ev => {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'speaker_transcription') {
          append({ timestamp: msg.timestamp, speaker: 'Customer', text: msg.content })
        } else if (msg.type === 'openai_assistant_delta') {
          setAiSuggestions(prev => [...prev, msg.content])
        }
      }

      // UI: mark streaming
      setStreaming(true)
      append({ timestamp: new Date().toISOString(), speaker: 'System', text: 'Meeting started' })

      // setup AudioContext @16kHz
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx({ sampleRate: 16000 })
      audioCtxRef.current = ctx

      // create source nodes
      const micSrc = ctx.createMediaStreamSource(mic)
      const spkSrc = ctx.createMediaStreamSource(new MediaStream(disp.getAudioTracks()))
      micSrcRef.current = micSrc
      spkSrcRef.current = spkSrc

      // create processors
      const micProc = ctx.createScriptProcessor(4096,1,1)
      const spkProc = ctx.createScriptProcessor(4096,1,1)
      micProcRef.current = micProc
      spkProcRef.current = spkProc

      // helper to convert to 16-bit PCM and send
      const sendPCM = (ws: WebSocket, data: Float32Array) => {
        const pcm = new Int16Array(data.length)
        for (let i = 0; i < data.length; i++) {
          const s = Math.max(-1, Math.min(1, data[i]))
          pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
        }
        if (ws.readyState === WebSocket.OPEN) ws.send(pcm.buffer)
      }
      micProc.onaudioprocess = e => sendPCM(wsMic, e.inputBuffer.getChannelData(0))
      spkProc.onaudioprocess = e => sendPCM(wsSpk, e.inputBuffer.getChannelData(0))

      // connect audio graph
      micSrc.connect(micProc)
      spkSrc.connect(spkProc)
      micProc.connect(ctx.destination)
      spkProc.connect(ctx.destination)
    } catch (err:any) {
      console.error(err)
      alert('Could not start meeting:\n' + err.message)
    }
  }

  const stopMeeting = () => {
  // Stop audio processing
  micProcRef.current?.disconnect()
  spkProcRef.current?.disconnect()
  micSrcRef.current?.disconnect()
  spkSrcRef.current?.disconnect()
  audioCtxRef.current?.close()
  wsMicRef.current?.close()
  wsSpkRef.current?.close()

  // Stop all media tracks
  micStreamRef.current?.getTracks().forEach(track => track.stop())
  spkStreamRef.current?.getTracks().forEach(track => track.stop())

  setStreaming(false)
}

const endMeeting = async () => {
  stopMeeting()
  setMeetingEnded(true)
  append({ timestamp: new Date().toISOString(), speaker: 'System', text: 'Meeting ended' })

  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/summarize' +
      `?userId=${meetingId}&clientId=${meetingId}&sessionId=${meetingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: transcripts.map(t => ({
          speaker: t.speaker,
          text: t.text
        }))
      })
    })

    const data = await response.json()
    if (response.ok) {
      append({
        timestamp: new Date().toISOString(),
        speaker: 'System',
        text: 'Summary successfully created.'
      })
    } else {
      console.error(data)
      append({
        timestamp: new Date().toISOString(),
        speaker: 'System',
        text: 'Failed to summarize the meeting.'
      })
    }
  } catch (err) {
    console.error(err)
    append({
      timestamp: new Date().toISOString(),
      speaker: 'System',
      text: 'Error while sending data for summarization.'
    })
  }
}


  const sendToAI = (text: string) => {
    const wsAi = new WebSocket(import.meta.env.VITE_BACKEND_URL + '/mic_and_speaker' +
      `?userId=${meetingId}&clientId=${meetingId}&sessionId=${meetingId}`)
    wsAi.onopen = () => {
      setAiSuggestions([])
      wsAi.send(JSON.stringify({ type: 'text_input', content: text }))
    }
    wsAi.onmessage = ev => {
      const msg = JSON.parse(ev.data)
      if (msg.type === 'openai_assistant_delta') {
        setAiSuggestions(prev => [...prev, msg.content])
      }
    }
  }

  const handleGenerate = () => {
    if (aiPrompt.trim() && streaming && !meetingEnded) {
      sendToAI(aiPrompt.trim())
      setAiPrompt('')
    }
  }

  const goToDetails = () =>
    navigate('/meeting-details', { state: { meetingId, advisorName, customerName } })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-indigo-950 flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Meeting – {meetingId}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Advisor: {advisorName} | Customer: {customerName}
        </p>
      </div>

      {/* Main panels */}
      <div className="container mx-auto px-4 flex-grow grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* AI Assistant */}
        <Card className="md:col-span-2 flex flex-col">
          <CardHeader className="bg-gray-100 dark:bg-indigo-900/50 border-b p-3">
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex flex-col h-full">
            <div
              ref={aiEl}
              className="flex-1 overflow-y-auto space-y-2 mb-4"
              style={{ maxHeight: '400px' }}
            >
              {aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-2 bg-white dark:bg-indigo-800 rounded text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: s }}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 rounded border border-input px-3 py-2 text-sm"
                placeholder="Ask AI…"
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                disabled={!streaming || meetingEnded}
              />
              <Button
                onClick={handleGenerate}
                disabled={!aiPrompt.trim() || meetingEnded}
              >
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="md:col-span-3 flex flex-col">
          <CardHeader className="bg-gray-100 dark:bg-indigo-900/50 border-b p-3 flex justify-between items-center">
            {/* This is the "Transcribe" title */}
            <CardTitle className="text-lg">Transcript</CardTitle>
            {/* Status badge */}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                meetingEnded
                  ? 'bg-red-100 text-red-800'
                  : streaming
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {meetingEnded ? 'ENDED' : streaming ? 'LIVE' : 'IDLE'}
            </span>
          </CardHeader>
          <CardContent className="p-3 flex flex-col h-full">
            <div
              ref={transcriptEl}
              className="flex-1 overflow-y-auto space-y-4 px-2"
              style={{ maxHeight: '400px' }}
            >
              {transcripts.map((t, i) => {
                if (t.speaker === 'System') {
                  return (
                    <div
                      key={i}
                      className="text-center text-sm text-gray-500 dark:text-gray-400 italic border border-dashed border-gray-300 dark:border-indigo-700 p-2 rounded"
                    >
                      {t.text}
                    </div>
                  )
                }

                const isCustomer = t.speaker === 'Customer'
                const bubbleColor = isCustomer
                  ? 'bg-blue-100 dark:bg-blue-800 text-gray-900 dark:text-white'
                  : 'bg-indigo-200 dark:bg-indigo-700 text-gray-900 dark:text-white'

                return (
                  <div
                    key={i}
                    className={`flex items-end ${isCustomer ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className="flex items-end space-x-2 max-w-[75%]">
                      {isCustomer && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-xs flex items-center justify-center text-white font-bold">
                          C
                        </div>
                      )}

                      <div className={`rounded-xl px-4 py-2 text-sm ${bubbleColor}`}>
                        <span className="block mb-1 font-semibold text-xs text-gray-600 dark:text-gray-300">
                          {t.speaker}
                        </span>
                        <div className="whitespace-pre-wrap">{t.text}</div>
                        <div className="text-[10px] text-right text-gray-500 mt-1">
                          {new Date(t.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      {!isCustomer && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-700 text-xs flex items-center justify-center text-white font-bold">
                          A
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-4 border-t flex justify-end">
        <Button
          onClick={() => {
            if (!streaming && !meetingEnded) startMeeting()
            else if (streaming && !meetingEnded) endMeeting()
            else if (meetingEnded) goToDetails()
          }}
        >
          {!streaming && !meetingEnded
            ? 'Start Meeting'
            : streaming && !meetingEnded
            ? 'End Meeting'
            : 'View Meeting Details'}
        </Button>
      </div>
    </div>
  )
}

export default MeetingPage

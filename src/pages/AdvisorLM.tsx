import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Card as ContactCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CRMHeader from '@/components/crm/CRMHeader';
import { Send, Trash2, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';


interface ChatMessage {
  sender: 'advisor' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  created_at: string;
  title?: string;
}

const AdvisorLM: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [showContactDialog, setShowContactDialog] = useState(false);


  const token = localStorage.getItem('access_token');

  const loadChats = async () => {
    const res = await fetch(process.env.BACKEND_URL + 'advisor-chats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setChats(data);
  };

  const loadMessages = async (chatId: string) => {
    setActiveChatId(chatId);
    const res = await fetch(process.env.BACKEND_URL + '/advisor-chats/${chatId}', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      const normalized: ChatMessage[] = data.map((msg: any) => ({
        sender: msg.role === 'user' ? 'advisor' : 'ai',
        text: msg.content,
        timestamp: msg.timestamp,
      }));
      setMessages(normalized);
    } else {
      setMessages([]);
    }
  };

  const createChat = async () => {
    const res = await fetch(process.env.BACKEND_URL + '/advisor-chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const newChat = await res.json();
    if (newChat?.id) {
      await loadChats();
      await loadMessages(newChat.id);
    }
  };

  const sendContactMessage = async (contact: any) => {
    if (!activeChatId) return;

    await fetch(process.env.BACKEND_URL + '/advisor-chats/${activeChatId}', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
        prompt: 'Here is a contact detail for the advisor.',
        contact: contact,
        }),
    });

    setShowContactDialog(false);
    loadMessages(activeChatId);
    };

  const sendMessage = async () => {
    const isFirstMessage = messages.length === 0;

    if (!input.trim() || !activeChatId) return;
    const res = await fetch(process.env.BACKEND_URL + '/advisor-chats/${activeChatId}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();

    const newMessages: ChatMessage[] = [
      {
        sender: 'advisor',
        text: input,
        timestamp: new Date().toISOString(),
      },
      {
        sender: 'ai',
        text: data.content,
        timestamp: data.timestamp,
      },
    ];

    setMessages((prev) => [...prev, ...newMessages]);
    setInput('');
  };

  const fetchContacts = async () => {
    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;
    if (!userId) return;
    const { data, error } = await supabase.from('contacts').select('*').eq('user_id', userId);
    if (!error && data) {
        setContacts(data);
    }
    };

  useEffect(() => {
    loadChats();
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-indigo-950">
      <CRMHeader activePage="Advisor AI" />
      <div className="flex-1 flex overflow-hidden px-3 pt-6 pb-3">
        <div className="flex-1 flex overflow-hidden px-3 pb-3">
          {/* Left: Chat List */}
          <div className="w-full md:w-1/3 lg:w-1/4 pr-4 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Chats</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1">
                <div className="space-y-2">
                  <Button onClick={createChat} className="w-full mb-2">
                    + New Chat
                  </Button>
                  {chats.map((chat) => (
                    <div key={chat.id} className="flex items-center space-x-2">
                        <Button
                        variant={activeChatId === chat.id ? 'default' : 'outline'}
                        className="w-full justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                        onClick={() => loadMessages(chat.id)}
                        title={chat.title || `Chat — ${new Date(chat.created_at).toLocaleDateString('tr-TR')}`}
                        >
                        {chat.title?.trim()
                            ? chat.title
                            : `Chat — ${new Date(chat.created_at).toLocaleDateString('tr-TR')}`}
                        </Button>

                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete “{chat.title || 'this chat'}”? This cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={async () => {
                                await fetch(process.env.BACKEND_URL + '/advisor-chats/${chat.id}', {
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                await loadChats();
                                if (activeChatId === chat.id) {
                                    setActiveChatId(null);
                                    setMessages([]);
                                }
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Active Chat */}
          <div className="w-full flex-1 h-full">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No messages yet.</div>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${m.sender === 'advisor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg text-sm max-w-[70%] whitespace-pre-wrap ${
                          m.sender === 'advisor'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="flex items-center gap-2 p-4 border-t">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button
                variant="outline"
                size="icon"
                onClick={() => setShowContactDialog(true)}
                >
                <Plus size={16} />
                </Button>
                <Button onClick={sendMessage} disabled={!input.trim()}>
                  <Send size={16} />
                </Button>
              </div>
            </Card>
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                <DialogTitle>Select Contact to Add</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {contacts.map((c) => (
                    <ContactCard
                    key={c.id}
                    className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => sendContactMessage(c)}
                    >
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.email} • {c.phone}</div>
                    </ContactCard>
                ))}
                </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorLM;

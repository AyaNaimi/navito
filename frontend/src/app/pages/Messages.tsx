import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CheckCheck, MoreVertical, Phone, Search, Send, Image, Smile, Paperclip, Mic } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAppContext } from '../context/AppContext';
import {
  createConversation,
  fetchConversation,
  fetchConversationContacts,
  fetchConversations,
  sendConversationMessage,
  type ApiConversation,
  type ApiConversationContact,
  type ApiConversationMessage,
} from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

function formatMessageTime(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatChatDate(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Aujourd\'hui';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Hier';
  } else {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
  }
}

function isSameDay(date1?: string | null, date2?: string | null) {
  if (!date1 || !date2) return false;
  return new Date(date1).toDateString() === new Date(date2).toDateString();
}

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authMode, authToken, userName, userRole } = useAppContext();
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [contacts, setContacts] = useState<ApiConversationContact[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  const fetchContacts = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetchConversationContacts(authToken);
      if (response.data) {
        setContacts(response.data);
      }
    } catch {
      // Silent fail
    }
  }, [authToken]);

  useEffect(() => {
    if (authMode !== 'login' || !authToken) {
      navigate('/login?redirectTo=/messages', { replace: true });
      return;
    }

    Promise.all([fetchConversations(authToken), fetchConversationContacts(authToken)])
      .then(([convResponse, contactsResponse]) => {
        setConversations(convResponse.data ?? []);
        setContacts(contactsResponse.data ?? []);
      })
      .catch(() => toast.error('Erreur de chargement'))
      .finally(() => setIsLoading(false));
  }, [authMode, authToken, navigate]);

  useEffect(() => {
    const state = location.state as { participantId?: number; conversationId?: number } | null;
    if (state?.conversationId) {
      setSelectedConversationId(state.conversationId);
      setShowChat(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (!selectedConversationId || !authToken) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    const pollMessages = async () => {
      try {
        const response = await fetchConversation(selectedConversationId, authToken);
        if (response.data) {
          setConversations((current) => {
            const filtered = current.filter((c) => c.id !== response.data?.id);
            const updated = [response.data, ...filtered];
            return updated;
          });
        }
      } catch {
        // Silent fail
      }
    };

    pollingRef.current = setInterval(pollMessages, 3000);
    pollMessages();

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [selectedConversationId, authToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversationId, conversations]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId) ?? null;

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const name = conv.others[0]?.name?.toLowerCase() ?? '';
    return name.includes(searchQuery.toLowerCase());
  });

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.role}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectConversation = async (convId: number) => {
    setSelectedConversationId(convId);
    setShowChat(true);
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }
    if (authToken) {
      try {
        const response = await fetchConversation(convId, authToken);
        if (response.data) {
          setConversations((current) => {
            const filtered = current.filter((c) => c.id !== response.data?.id);
            return [response.data, ...filtered];
          });
        }
      } catch {
        // Silent
      }
    }
    pollingRef.current = setInterval(async () => {
      if (authToken) {
        try {
          const response = await fetchConversation(convId, authToken);
          if (response.data) {
            setConversations((current) => {
              const filtered = current.filter((c) => c.id !== response.data?.id);
              return [response.data, ...filtered];
            });
          }
        } catch {
          // Silent
        }
      }
    }, 3000);
  };

  const handleStartConversation = async (participantId: number) => {
    if (!authToken) return;
    try {
      const response = await createConversation({ participant_ids: [participantId] }, authToken);
      if (response.data) {
        setConversations((current) => {
          const filtered = current.filter((c) => c.id !== response.data!.id);
          return [response.data!, ...filtered];
        });
        await fetchContacts();
        handleSelectConversation(response.data.id);
        toast.success('Conversation demarree');
      }
    } catch {
      toast.error('Erreur lors de la creation');
    }
  };

  const handleSendMessage = async () => {
    if (!authToken || !selectedConversation || !draft.trim()) return;
    setIsSending(true);
    const messageText = draft.trim();
    setDraft('');
    try {
      const response = await sendConversationMessage(selectedConversation.id, { body: messageText }, authToken);
      if (response.data) {
        setConversations((current) =>
          current.map((c) =>
            c.id === selectedConversation.id
              ? {
                  ...c,
                  last_message_at: response.data!.created_at,
                  latest_message: response.data,
                  messages: [...c.messages, response.data!],
                }
              : c,
          ),
        );
      }
    } catch {
      setDraft(messageText);
      toast.error('Erreur d\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  if (authMode !== 'login') return null;

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'guide': return 'bg-purple-500';
      case 'driver': return 'bg-blue-500';
      default: return 'bg-teal-500';
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#ECE5DD] pb-16">
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!showChat ? (
            <motion.div
              key="chats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col bg-white"
            >
              <div className="bg-[#008069] px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <h1 className="text-xl font-bold text-white">Messages</h1>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher ou commencer une conversation"
                    className="w-full rounded-full bg-white/20 px-4 py-2 pl-10 text-sm text-white placeholder-white/70 outline-none"
                  />
                </div>
              </div>

              <div ref={chatListRef} className="flex-1 overflow-y-auto">
                {searchQuery && filteredContacts.length > 0 && (
                  <div className="border-b border-gray-100">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Contacter</p>
                    {filteredContacts.map((contact) => (
                      <button
                        key={contact.id}
                        onClick={() => void handleStartConversation(contact.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getRoleColor(contact.role)} text-white font-bold text-lg`}>
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900">{contact.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredConversations.length === 0 && !isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#D9DBE0]">
                      <svg className="h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                      </svg>
                    </div>
                    <p className="mb-2 text-lg font-bold text-gray-800">WhatsApp Web</p>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Selectionnez un chat pour commencer a envoyer des messages
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredConversations.map((conv) => {
                      const other = conv.others[0];
                      const isSelected = selectedConversationId === conv.id;
                      return (
                        <button
                          key={conv.id}
                          onClick={() => void handleSelectConversation(conv.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 transition-colors ${
                            isSelected ? 'bg-[#D9DBE0]/50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="relative">
                            <div className={`flex h-[50px] w-[50px] items-center justify-center rounded-full ${getRoleColor(other?.role)} text-white font-bold text-xl`}>
                              {other?.name?.charAt(0)?.toUpperCase() ?? '?'}
                            </div>
                            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"></div>
                          </div>
                          <div className="flex-1 overflow-hidden text-left">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900">{other?.name ?? conv.title ?? 'Conversation'}</p>
                              <span className="text-xs text-gray-500">
                                {conv.latest_message?.created_at && formatMessageTime(conv.latest_message.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="flex-1 truncate text-sm text-gray-500">
                                {conv.latest_message?.body ?? 'Aucun message'}
                              </p>
                              {other?.role && (
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase text-white ${getRoleColor(other.role)}`}>
                                  {other.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex h-full w-full flex-col bg-[#ECE5DD]"
            >
              {selectedConversation ? (
                <>
                  <div className="flex items-center gap-3 bg-[#008069] px-4 py-3">
                    <button
                      onClick={() => {
                        setShowChat(false);
                        setSelectedConversationId(null);
                        if (pollingRef.current) {
                          clearInterval(pollingRef.current);
                        }
                      }}
                      className="rounded-full p-1.5 text-white hover:bg-white/20 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getRoleColor(selectedConversation.others[0]?.role)} text-white font-bold`}>
                        {selectedConversation.others[0]?.name?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#008069] bg-emerald-500"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{selectedConversation.others[0]?.name}</p>
                      <p className="text-xs text-white/80 capitalize">
                        {selectedConversation.others[0]?.role ?? 'En ligne'}
                      </p>
                    </div>
                    <button className="rounded-full p-2 text-white hover:bg-white/20 transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="rounded-full p-2 text-white hover:bg-white/20 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-[#ECE5DD] p-4" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                  }}>
                    <div className="flex flex-col gap-1">
                      {selectedConversation.messages.map((message, index) => {
                        const isMine = message.sender.name === userName;
                        const showDate = index === 0 || !isSameDay(
                          selectedConversation.messages[index - 1]?.created_at,
                          message.created_at
                        );
                        const showStatus = isMine && index === selectedConversation.messages.length - 1;

                        return (
                          <div key={message.id}>
                            {showDate && (
                              <div className="my-4 flex justify-center">
                                <span className="rounded-lg bg-[#E1F2FA] px-4 py-1.5 text-xs font-medium text-gray-600 shadow-sm">
                                  {formatChatDate(message.created_at)}
                                </span>
                              </div>
                            )}
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`relative max-w-[75%] ${isMine ? 'order-2' : 'order-1'}`}>
                                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                                  isMine
                                    ? 'bg-[#D9F3BF] rounded-tr-md'
                                    : 'bg-white rounded-tl-md'
                                }`}>
                                  <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">{message.body}</p>
                                  <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? '' : 'justify-end'}`}>
                                    <span className={`text-[10px] ${isMine ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatMessageTime(message.created_at)}
                                    </span>
                                    {showStatus && (
                                      <span className="text-[#53BDEB]">
                                        <CheckCheck className="h-3.5 w-3.5" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  <div className="flex items-end gap-2 bg-[#F0F2F5] px-4 py-3">
                    <button className="flex-shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-200 transition-colors">
                      <Smile className="h-6 w-6" />
                    </button>
                    <button className="flex-shrink-0 rounded-full p-2 text-gray-500 hover:bg-gray-200 transition-colors">
                      <Paperclip className="h-6 w-6" />
                    </button>
                    <div className="flex-1">
                      <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            void handleSendMessage();
                          }
                        }}
                        placeholder="Votre message"
                        className="h-11 rounded-full border-0 bg-white px-4 text-sm shadow-sm focus:ring-0"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => void handleSendMessage()}
                      disabled={isSending || !draft.trim()}
                      className={`flex-shrink-0 rounded-full p-3 transition-colors ${
                        draft.trim()
                          ? 'bg-[#00A884] text-white hover:bg-[#008069]'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {draft.trim() ? (
                        <Send className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#D9DBE0] mx-auto">
                      <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                      </svg>
                    </div>
                    <p className="font-semibold text-gray-700">Selectionnez une conversation</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

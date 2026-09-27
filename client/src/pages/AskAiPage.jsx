import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { materialService } from '../services/materialService';
import { aiService } from '../services/aiService';
import {
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  FileText,
  User,
  Bot,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function AskAiPage() {
  const [searchParams] = useSearchParams();
  const preselectedMaterialId = searchParams.get('materialId') || '';

  const [materials, setMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterialId);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const res = await materialService.getMaterials();
        if (res.success && res.data.materials) {
          setMaterials(res.data.materials);
          if (!selectedMaterialId && res.data.materials.length > 0) {
            setSelectedMaterialId(res.data.materials[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load materials for Ask AI:', err);
      }
    };
    loadMaterials();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputQuestion || inputQuestion.trim() === '' || loading) return;

    const questionText = inputQuestion.trim();
    setInputQuestion('');
    setError('');

    // Optimistically append user message
    const userMsg = {
      sender: 'user',
      text: questionText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiService.askAi({
        materialId: selectedMaterialId || undefined,
        question: questionText,
        chatId: chatId || undefined,
      });

      if (res.success && res.data) {
        setChatId(res.data.chatId);
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to get answer from AI Tutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setChatId(null);
  };

  const selectedMaterial = materials.find((m) => m._id === selectedMaterialId);

  return (
    <div className="space-y-6 h-[calc(100vh-7.5rem)] flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-alice tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-salesport" />
            Ask Your Study Material
          </h1>
          <p className="text-xs text-alice-muted">
            Conversational tutor grounded strictly in your uploaded notes to eliminate hallucinations.
          </p>
        </div>

        {/* Material Context Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs outline-none max-w-[220px] truncate"
          >
            <option value="">General Academic Mode</option>
            {materials.map((m) => (
              <option key={m._id} value={m._id} className="bg-brand-card text-alice">
                {m.title}
              </option>
            ))}
          </select>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-xl bg-brand-surface border border-brand-border hover:border-rose-500/50 text-alice-muted hover:text-rose-400 transition"
              title="Clear Thread"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat Thread Container */}
      <div className="flex-1 glass-card rounded-3xl p-4 sm:p-6 border border-brand-border overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-alice">Grounded Academic Tutor Ready</h3>
              <p className="text-xs text-alice-muted max-w-md mx-auto mt-1">
                {selectedMaterial ? (
                  <>
                    Connected to: <strong className="text-alice">{selectedMaterial.title}</strong>. Ask any question,
                    request an explanation of a formula, or ask for clarifications from this document.
                  </>
                ) : (
                  'Ask any concept or upload study materials to anchor the AI specifically to your syllabus.'
                )}
              </p>
            </div>

            {/* Quick Prompt Ideas */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {[
                'Explain the core mechanism in simple terms',
                'What are the most common exam questions from this?',
                'Can you provide a practical real-world analogy?',
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setInputQuestion(suggestion);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-brand-surface/90 border border-brand-border hover:border-salesport/50 text-xs text-alice-muted hover:text-alice transition"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-salesport text-alice shadow-lg shadow-salesport/20'
                      : 'bg-brand-surface/90 border border-brand-border text-alice'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-brand-border/40 flex items-center justify-between text-[10px] text-alice-muted">
                      <span>Grounded with Gemini AI</span>
                      <button
                        onClick={() => handleCopy(msg.text, index)}
                        className="flex items-center gap-1 hover:text-salesport transition"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-prussian border border-salesport/30 flex items-center justify-center text-alice flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-alice" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-salesport/20 border border-salesport/40 flex items-center justify-center text-salesport flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-brand-surface border border-brand-border text-xs text-alice-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-salesport animate-ping" />
              <span>AI StudyBuddy is reviewing notes and formulating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="relative flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={
            selectedMaterial
              ? `Ask anything about "${selectedMaterial.title}"...`
              : 'Ask an academic or conceptual question...'
          }
          className="flex-1 px-4 py-3 rounded-2xl bg-brand-surface border border-brand-border focus:border-salesport text-alice text-xs sm:text-sm placeholder:text-alice-muted/50 outline-none pr-12 shadow-lg"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={!inputQuestion.trim() || loading}
          className="absolute right-2 px-3 py-2 rounded-xl text-alice glow-button disabled:opacity-40 transition flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

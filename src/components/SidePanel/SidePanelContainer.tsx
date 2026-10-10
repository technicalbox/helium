import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCw,
  FileText,
  MessageSquare,
  Bot,
  User,
  ChevronDown,
  Trash2,
  Check,
  Globe
} from 'lucide-react';
import { Tab } from '../../types/browser';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SidePanelContainerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
}

export const SidePanelContainer: React.FC<SidePanelContainerProps> = ({
  isOpen,
  onClose,
  activeTab
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm Gemini, built directly into Helium. Ask me anything, or toggle page context to analyze, summarize, or extract insights from your active tab.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [includePageContext, setIncludePageContext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Synthesize realistic context from the active tab for the prompt
  const getTabContextSnippet = () => {
    if (activeTab.url === 'helium://newtab') {
      return 'Helium Browser New Tab Page: Minimalist privacy dashboard with quick shortcuts and zero telemetry tracking.';
    }
    if (activeTab.url === 'helium://settings') {
      return 'Helium Settings: Native C++ configuration for appearance, Helium noise anti-fingerprinting, uBlock Origin, and local encrypted vault sync.';
    }
    if (activeTab.url === 'helium://privacy-test') {
      return 'Helium Privacy Test Suite: Live verification tests for HTML5 Canvas mathematical noise injection, WebAudio buffer jitter, and 4-core hardware concurrency spoofing.';
    }
    if (activeTab.url === 'helium://patches') {
      return 'Helium Patches: Catalog of 370+ unified diffs modifying Chromium core, UI, settings, and network stacks.';
    }
    return `Web page URL: ${activeTab.url}. Title: ${activeTab.title}. Page text summary: Discussion of modern web privacy, browser architectures, and anti-fingerprinting protections.`;
  };

  const handleSendPrompt = async (textToSend?: string) => {
    const query = (textToSend || prompt).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setIsLoading(true);

    try {
      const pageContext = getTabContextSnippet();
      const chatHistory = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: query,
          pageContext: pageContext,
          chatHistory: chatHistory,
          includePageContext: includePageContext
        })
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || data.error || 'No response received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: `Error connecting to Gemini service: ${err.message || 'Network request failed'}. Please check your connection or project API configuration.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: "Conversation cleared. How can I assist you with this page or another topic?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickChips = [
    'Summarize this page in 3 bullets',
    'What are the key takeaways?',
    'Explain the main concept simply',
    'List any action items or dates'
  ];

  return (
    <aside className="w-80 md:w-96 h-full bg-[#171a2c] border-l border-[#2c2f42] flex flex-col shadow-2xl z-30 select-none animate-in slide-in-from-right duration-200">
      {/* Side Panel Header */}
      <div className="h-11 bg-[#1b1f30] border-b border-[#2c2f42] px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#3551d2]/20 border border-[#3551d2]/40 flex items-center justify-center text-[#bac3ff]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#fefbff]">Ask Gemini</span>
            <span className="text-[10px] bg-[#3551d2]/25 text-[#bac3ff] px-1.5 py-0.2 rounded font-mono border border-[#3551d2]/30">
              Side Panel
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 rounded-lg text-[#8d8fa6] hover:text-white hover:bg-[#222537] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Close Side Panel (Cmd/Ctrl + Shift + G)"
            className="p-1.5 rounded-lg text-[#8d8fa6] hover:text-white hover:bg-[#222537] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Tab Page Context Bar */}
      <div className="bg-[#141726] border-b border-[#2c2f42] px-3 py-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={includePageContext}
              onChange={(e) => setIncludePageContext(e.target.checked)}
              className="accent-[#3551d2] rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span className="font-medium text-[#fefbff] text-[11.5px]">
              {includePageContext ? 'Chatting with current page' : 'General Chat Mode'}
            </span>
          </label>
          <span className="text-[10px] text-emerald-400 font-mono">
            {includePageContext ? 'Context Attached' : 'Stand-alone'}
          </span>
        </div>

        {includePageContext && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#8d8fa6] bg-[#1b1f30] px-2 py-1 rounded-lg border border-[#2c2f42] truncate">
            <Globe className="w-3 h-3 text-[#3551d2] flex-shrink-0" />
            <span className="truncate font-medium text-slate-300">{activeTab.title}</span>
          </div>
        )}
      </div>

      {/* Messages Log Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#3551d2] text-white rounded-br-none shadow-md font-sans'
                    : 'bg-[#1b1f30] border border-[#2c2f42] text-[#fefbff] rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
              <span className="text-[10px] text-[#8d8fa6] px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Quick prompt suggestions when only welcome message is visible */}
        {messages.length === 1 && (
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-[#8d8fa6] tracking-wider px-1">
              Suggested Prompts
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {quickChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendPrompt(chip)}
                  className="text-left text-xs px-2.5 py-2 rounded-xl bg-[#1b1f30] hover:bg-[#222537] text-slate-200 border border-[#2c2f42] transition-colors hover:border-[#3551d2]/40"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[#1b1f30] border border-[#2c2f42] rounded-2xl max-w-[80%] text-xs text-[#8d8fa6] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#516bec] animate-spin" />
            <span>Gemini is generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#1b1f30] border-t border-[#2c2f42]">
        <div className="relative flex items-end bg-[#171a2c] border border-[#2c2f42] focus-within:border-[#3551d2] rounded-xl p-2 transition-all">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder={
              includePageContext
                ? 'Ask about this page or type a question...'
                : 'Ask Gemini anything...'
            }
            className="w-full bg-transparent text-xs text-[#fefbff] placeholder-[#8d8fa6] outline-none resize-none pr-8 font-sans"
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={!prompt.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-[#3551d2] hover:bg-[#516bec] text-white disabled:opacity-40 disabled:hover:bg-[#3551d2] transition-colors"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#8d8fa6] mt-1.5 px-1">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="font-mono text-[#516bec]">gemini-3.8-flash</span>
        </div>
      </div>
    </aside>
  );
};

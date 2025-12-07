import React, { useEffect, useState, useRef, Component } from 'react';
import { ChatMessage as ChatMessageComponent } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatMessage } from './types/chat';
import { sendMessageToLLM } from './lib/llmClient';
import { Menu } from 'lucide-react';
export function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: 'سلام! من دستیار هوشمند شما هستم. چطور می‌توانم کمک کنم؟\nHello! I am your smart assistant. How can I help you?',
    timestamp: Date.now()
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTools, setActiveTools] = useState<Record<string, number>>({});
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Track active tools from messages
  useEffect(() => {
    const toolMessages = messages.filter(msg => msg.isToolOutput && msg.toolName);
    const newActiveTools: Record<string, number> = {};
    toolMessages.forEach(msg => {
      if (msg.toolName) {
        newActiveTools[msg.toolName] = msg.timestamp;
      }
    });
    setActiveTools(newActiveTools);
  }, [messages]);
  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const newMessages = await sendMessageToLLM([...messages, userMessage]);
      setMessages(prev => [...prev, ...newMessages]);
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleToolClick = (examplePrompt: string) => {
    setInputValue(examplePrompt);
    setIsSidebarOpen(false);
  };
  return <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden selection:bg-cyan-500/30" dir="rtl">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeTools={activeTools} onToolClick={handleToolClick} />

      <main className="flex-1 flex flex-col relative z-10 h-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center p-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-20">
          <span className="flex-1 font-bold text-lg bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            لامبدا چت فارسی
          </span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-slate-400 hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="max-w-4xl mx-auto space-y-6 pb-4">
            {messages.map(msg => <ChatMessageComponent key={msg.id} message={msg} />)}

            {isLoading && <div className="flex justify-start animate-in fade-in duration-300">
                <TypingIndicator />
              </div>}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} value={inputValue} onChange={setInputValue} />
        </div>
      </main>
    </div>;
}
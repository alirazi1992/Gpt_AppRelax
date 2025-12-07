import React, { useEffect, useState, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn, detectDirection } from '../lib/utils';
interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
export function ChatInput({
  onSend,
  isLoading,
  value: externalValue,
  onChange: externalOnChange
}: ChatInputProps) {
  const [internalInput, setInternalInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Use external value if provided, otherwise use internal state
  const input = externalValue !== undefined ? externalValue : internalInput;
  const setInput = externalOnChange || setInternalInput;
  const direction = detectDirection(input);
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);
  // Focus textarea when external value changes
  useEffect(() => {
    if (externalValue && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [externalValue]);
  return <div className="relative w-full max-w-4xl mx-auto p-4">
      <div className="relative group">
        {/* Glowing border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>

        <div className="relative flex items-end gap-2 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <button onClick={() => handleSubmit()} disabled={!input.trim() || isLoading} className={cn('p-3 rounded-xl transition-all duration-300 flex-shrink-0 mb-0.5', input.trim() && !isLoading ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95' : 'bg-white/5 text-slate-600 cursor-not-allowed')}>
            {isLoading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className={cn('w-5 h-5', direction === 'ltr' && 'rotate-180')} />}
          </button>

          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={direction === 'rtl' ? 'پیامی بنویسید...' : 'Type a message...'} dir={direction} rows={1} className={cn('w-full bg-transparent text-slate-100 placeholder:text-slate-500 px-4 py-3 focus:outline-none resize-none max-h-[150px] scrollbar-hide', direction === 'rtl' ? 'text-right' : 'text-left')} disabled={isLoading} />
        </div>
      </div>

      <div className="text-center mt-2">
        <p className="text-[10px] text-slate-500 font-medium">
          می‌توانید فارسی یا انگلیسی تایپ کنید • You can type in Farsi or
          English
        </p>
      </div>
    </div>;
}
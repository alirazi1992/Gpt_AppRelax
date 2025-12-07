import React from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { cn, detectDirection, formatTime } from '../lib/utils';
import { Bot, User, Calculator, Calendar, Languages, FileText } from 'lucide-react';
interface ChatMessageProps {
  message: ChatMessageType;
}
export function ChatMessage({
  message
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isTool = message.isToolOutput;
  const direction = detectDirection(message.content);
  const isRtl = direction === 'rtl';
  if (isTool) {
    return <div className="flex w-full justify-center my-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-xs text-cyan-300/80 font-mono">
          {getToolIcon(message.toolName)}
          <span>استفاده از ابزار: {getToolNameFa(message.toolName)}</span>
        </div>
      </div>;
  }
  return <div className={cn('flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300',
  // In RTL: user messages on LEFT, assistant on RIGHT
  isUser ? 'justify-start' : 'justify-end')}>
      <div className={cn('flex max-w-[85%] md:max-w-[70%] gap-3',
    // Flip avatar position based on message content direction
    isRtl && 'flex-row-reverse')}>
        {/* Avatar */}
        <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg', isUser ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-fuchsia-600 to-purple-700')}>
          {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
        </div>

        {/* Bubble */}
        <div className={cn('flex flex-col',
      // In RTL: user items on right, assistant on left
      isUser ? 'items-end' : 'items-start')}>
          <div className={cn('relative px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border', isUser ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-50 rounded-tr-none' : 'bg-white/5 border-white/10 text-slate-100 rounded-tl-none', isRtl ? 'text-right' : 'text-left')} dir={direction}>
            <p className="whitespace-pre-wrap leading-relaxed text-[0.95rem]">
              {message.content}
            </p>
          </div>

          {/* Timestamp */}
          <span className="text-[10px] text-slate-500 mt-1.5 px-1 font-medium">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>;
}
function getToolIcon(name?: string) {
  switch (name) {
    case 'calculator':
      return <Calculator size={12} />;
    case 'persian_date':
      return <Calendar size={12} />;
    case 'translate':
      return <Languages size={12} />;
    case 'docs_qa':
      return <FileText size={12} />;
    default:
      return <Bot size={12} />;
  }
}
function getToolNameFa(name?: string) {
  switch (name) {
    case 'calculator':
      return 'ماشین‌حساب';
    case 'persian_date':
      return 'تاریخ شمسی';
    case 'translate':
      return 'مترجم';
    case 'docs_qa':
      return 'جستجوی اسناد';
    default:
      return name || 'نامشخص';
  }
}
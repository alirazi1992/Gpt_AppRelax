import React from 'react';
export function TypingIndicator() {
  return <div className="flex items-center gap-1 p-4 bg-white/5 backdrop-blur-md rounded-2xl rounded-tr-none w-fit border border-white/10">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
    </div>;
}
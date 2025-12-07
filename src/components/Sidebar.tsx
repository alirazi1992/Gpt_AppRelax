import React from 'react';
import { Calculator, Calendar, Languages, FileText, X, Cpu, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTools: Record<string, number>;
  onToolClick: (examplePrompt: string) => void;
}
export function Sidebar({
  isOpen,
  onClose,
  activeTools,
  onToolClick
}: SidebarProps) {
  const tools = [{
    id: 'calculator',
    name: 'Calculator',
    nameFa: 'ماشین حساب',
    icon: Calculator,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    examplePrompt: 'محاسبه کن: ۲۵ * ۴ + ۱۰',
    examplePromptEn: 'Calculate 25 * 4 + 10'
  }, {
    id: 'persian_date',
    name: 'Persian Date',
    nameFa: 'تاریخ شمسی',
    icon: Calendar,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    examplePrompt: 'تاریخ امروز چیست؟',
    examplePromptEn: "What is today's date?"
  }, {
    id: 'translate',
    name: 'Translator',
    nameFa: 'مترجم',
    icon: Languages,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    examplePrompt: 'ترجمه کن: سلام دنیا',
    examplePromptEn: 'Translate "Hello World" to Farsi'
  }, {
    id: 'docs_qa',
    name: 'Docs Q&A',
    nameFa: 'جستجو در اسناد',
    icon: FileText,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    examplePrompt: 'جستجو در اسناد درباره Lambda Chat',
    examplePromptEn: 'Search docs about Lambda Chat'
  }];
  const isToolActive = (toolId: string) => {
    if (!activeTools[toolId]) return false;
    const timeSinceUse = Date.now() - activeTools[toolId];
    return timeSinceUse < 30000; // Active if used in last 30 seconds
  };
  const isToolRecentlyUsed = (toolId: string) => {
    if (!activeTools[toolId]) return false;
    const timeSinceUse = Date.now() - activeTools[toolId];
    return timeSinceUse >= 30000 && timeSinceUse < 300000; // Recently used if 30s-5min ago
  };
  return <>
      {/* Mobile Overlay */}
      <div className={cn('fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')} onClick={onClose} />

      {/* Sidebar Content - RTL: positioned on right */}
      <aside className={cn('fixed md:relative inset-y-0 right-0 z-50 w-[280px] bg-slate-950/90 backdrop-blur-xl border-l border-white/5 flex flex-col transition-transform duration-300 ease-out md:translate-x-0', isOpen ? 'translate-x-0' : 'translate-x-full')}>
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-bold text-slate-100 leading-tight text-right">
                  لامبدا
                </h1>
                <span className="text-xs text-cyan-400 font-medium tracking-wider block text-right">
                  چت v2.0
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
                <Cpu className="text-white w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-sm text-slate-400 leading-relaxed mb-2 text-right font-medium">
              دستیار هوشمند فارسی با قابلیت‌های کاربردی و ابزارهای پیشرفته.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed text-left" dir="ltr">
              Local Farsi-first AI assistant with smart tools.
            </p>
          </div>

          {/* Tools List */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2 justify-end">
              <span>ابزارهای فعال</span>
              <Zap size={12} className="text-cyan-400" />
            </h3>
            <div className="space-y-2">
              {tools.map(tool => {
              const isActive = isToolActive(tool.id);
              const isRecent = isToolRecentlyUsed(tool.id);
              return <button key={tool.name} onClick={() => onToolClick(tool.examplePrompt)} className={cn('w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group cursor-pointer', 'hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]', isActive && 'bg-white/10 ring-1 ring-white/20', isRecent && 'bg-white/5')}>
                    <div className={cn('w-1.5 h-1.5 rounded-full transition-all duration-300', isActive ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse scale-125' : isRecent ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-600 group-hover:bg-slate-500')}></div>
                    <div className="flex flex-col flex-1 text-right">
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {tool.nameFa}
                      </span>
                      <span className="text-xs text-slate-500" dir="ltr">
                        {tool.name}
                      </span>
                    </div>
                    <div className={cn('p-2 rounded-lg transition-all duration-300', tool.color, isActive ? cn(tool.bgColor, tool.borderColor, 'border') : 'bg-white/5', 'group-hover:bg-white/10 group-hover:scale-110')}>
                      <tool.icon size={18} />
                    </div>
                  </button>;
            })}
            </div>

            {/* Tool Status Legend */}
            <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-semibold text-right">
                راهنمای وضعیت
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
                  <span>فعال (۳۰ ثانیه اخیر)</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
                  <span>اخیر (۵ دقیقه اخیر)</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 justify-end">
                  <span>آماده</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>وضعیت: آنلاین</span>
            </div>
          </div>
        </div>
      </aside>
    </>;
}
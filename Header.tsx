import React from 'react';
import { Building2, Sparkles, Calculator, ShieldCheck, Search, Key } from 'lucide-react';

interface HeaderProps {
  onOpenAiInsight: () => void;
  onOpenMortgageCalc: () => void;
  selectedCity: string;
  selectedDistrict: string;
  onScrollToQuery: () => void;
  onScrollToApiKey?: () => void;
  hasApiKey?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAiInsight,
  onOpenMortgageCalc,
  selectedCity,
  selectedDistrict,
  onScrollToQuery,
  onScrollToApiKey,
  hasApiKey = false,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-black shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                  台灣房價與實價登錄
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  官方地政連線
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                全台 22 縣市實價拆算・每坪走勢・待售中古屋
              </p>
            </div>
          </div>

          {/* Right Action Pills */}
          <div className="flex items-center gap-2">
            
            {/* API Key quick toggle */}
            {onScrollToApiKey && (
              <button
                id="header-api-key-btn"
                onClick={onScrollToApiKey}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  hasApiKey
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="設定您的 Google Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>API Key</span>
                <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
              </button>
            )}

            {/* Quick region indicator */}
            <button
              onClick={onScrollToQuery}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedCity} {selectedDistrict}</span>
            </button>

            <button
              id="header-mortgage-calc-btn"
              onClick={onOpenMortgageCalc}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition shadow-2xs cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-sky-600" />
              房貸試算
            </button>

            <button
              id="header-ai-insight-btn"
              onClick={onOpenAiInsight}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-black hover:bg-slate-800 text-white transition shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI 估價
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};


import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Sparkles, Plus, Minus, Calculator, ShieldCheck, Activity } from 'lucide-react';

interface HeroSectionProps {
  selectedCity: string;
  selectedDistrict: string;
  avgPrice: number;
  yoyChange: number;
  onScrollToQuery: () => void;
  onOpenAiInsight: () => void;
  onOpenMortgageCalc: () => void;
  hasApiKey?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCity,
  selectedDistrict,
  avgPrice,
  yoyChange,
  onScrollToQuery,
  onOpenAiInsight,
  onOpenMortgageCalc,
  hasApiKey = false,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<number>(0);

  const accordionItems = [
    {
      title: '即時實價登錄更新',
      description: '內政部地政司資料庫同步校準，第一時間掌握全台最新中古屋與新成屋成交真實行情。',
    },
    {
      title: '零話術・扣除車位真實單價',
      description: '精準剔除車位坪數與價格灌水，以純建物實坪計算，徹底還原每坪真實成交底價。',
    },
    {
      title: '3年每坪房價走勢大數據',
      description: '提供電梯大樓、華廈與公寓分立價格曲線，洞悉區域波段起伏與價格帶分佈。',
    },
    {
      title: 'Gemini AI 智慧行情與估價評估',
      description: '結合大語言模型深度評估生活圈機能、未來增值潛力、首購挑屋建議與出價斡旋技巧。',
    },
  ];

  return (
    <section className="bg-white text-slate-900 border-b border-slate-200 pt-10 pb-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Headline & Description */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-[1.15]">
            掌握全台真實房價，買房透明安心
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            即時查詢全台 22 縣市實價登錄拆算單價、3年房價走勢曲線與最新在售中古屋盤源，杜絕灌水假行情。
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onScrollToQuery}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>開始查詢房價</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAiInsight}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI 區域行情剖析</span>
            </button>

            <button
              onClick={onOpenMortgageCalc}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>房貸月付試算</span>
            </button>
          </div>
        </div>

        {/* 2-Column Hero Visual + Interactive Accordion (Matching Reference Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Architectural Photo Framing with Overlaid Glass Performance Metric Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-300 shadow-2xl aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Architectural Housing"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
              
              {/* Brand watermark badge top right */}
              <div className="absolute top-4 right-5 text-white/80 font-black tracking-widest text-sm uppercase">
                TAIWAN REAL ESTATE
              </div>

              {/* Floating Performance / Market Metric Card (Direct translation of reference image) */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">
                        {selectedCity} {selectedDistrict} 行情表現
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {yoyChange >= 0 ? `+${yoyChange}%` : `${yoyChange}%`} 年變動
                  </span>
                </div>

                {/* Sparkline curve & metrics */}
                <div className="pt-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-500">實價拆算均價</div>
                    <div className="text-xl sm:text-2xl font-black text-slate-950">
                      {avgPrice} <span className="text-xs font-normal text-slate-500">萬/坪</span>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  <div>
                    <div className="text-[11px] text-slate-500">平均去化天數</div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">
                      28 <span className="text-xs font-normal text-slate-500">天</span>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-200" />

                  <div>
                    <div className="text-[11px] text-slate-500">車位拆算率</div>
                    <div className="text-base sm:text-lg font-bold text-emerald-600">
                      100%
                    </div>
                  </div>
                </div>

                {/* Animated micro trend line indicator */}
                <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full w-4/5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Elegant Accordion List with Thin Dividers and +/- (Direct translation of reference image) */}
          <div className="lg:col-span-6 space-y-1">
            {accordionItems.map((item, index) => {
              const isOpen = activeAccordion === index;
              return (
                <div
                  key={item.title}
                  className="border-t border-slate-200 last:border-b py-3.5 transition cursor-pointer"
                  onClick={() => setActiveAccordion(isOpen ? -1 : index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-base sm:text-lg font-bold transition ${isOpen ? 'text-slate-950' : 'text-slate-700 hover:text-slate-950'}`}>
                      {item.title}
                    </h3>
                    <button
                      type="button"
                      aria-label="Toggle accordion"
                      className="p-1 text-slate-400 hover:text-slate-900 transition"
                    >
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-slate-900" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed pr-8 animate-in fade-in duration-200">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

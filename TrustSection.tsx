import React from 'react';
import { Star, ShieldCheck, Award, CheckCircle, Database, Check } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const badges = [
    {
      title: 'Leader',
      category: '政府地政資料庫',
      badgeClass: 'bg-orange-500 text-white',
      desc: '內政部即時連線',
    },
    {
      title: 'Leader',
      category: '實價登錄查核',
      badgeClass: 'bg-orange-600 text-white',
      desc: '精準度 99.8%',
    },
    {
      title: 'Leader',
      category: '全台22縣市涵蓋',
      badgeClass: 'bg-red-500 text-white',
      desc: '鄉鎮市區全納入',
    },
    {
      title: 'Momentum Leader',
      category: '每坪走勢大數據',
      badgeClass: 'bg-orange-500 text-white',
      desc: '3年分立曲線',
    },
    {
      title: 'Most Reliable',
      category: '車位精算拆算',
      badgeClass: 'bg-sky-600 text-white',
      desc: '100% 杜絕假單價',
    },
    {
      title: 'Easiest To Use',
      category: '零廣告查價體驗',
      badgeClass: 'bg-emerald-600 text-white',
      desc: '純淨清晰無置入',
    },
  ];

  return (
    <section className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left: Star rating & Bold Headline */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Star rating & icon */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-black text-xs text-white shadow-md">
              G
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            全台買房族首選，<br />
            資料真實透明
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
            直連內政部地政司實價登錄資料庫與各大合法仲介成交紀錄，為您精確拆算純建物真實單價，杜絕灌水與廣告話術。
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" />
              官方數據
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" />
              每日校準
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" />
              完全免費
            </span>
          </div>

        </div>

        {/* Right: 6-Badge Award / Authority Card (Matching Reference Image Grid) */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-w-xl w-full">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {badges.map((b, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 text-center flex flex-col items-center justify-between hover:shadow-md transition group"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] mb-1.5 shadow-sm">
                    G
                  </div>

                  <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                    {b.title}
                  </div>

                  {/* Ribbon tag */}
                  <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${b.badgeClass}`}>
                    {b.category}
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

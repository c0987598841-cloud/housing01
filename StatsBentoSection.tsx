import React from 'react';

export const StatsBentoSection: React.FC = () => {
  const stats = [
    {
      value: '22+',
      label: '全台縣市完整涵蓋',
      sublabel: '包含六都與全台各鄉鎮市區無死角查價',
    },
    {
      value: '100%',
      label: '車位精確拆算率',
      sublabel: '剔除車位灌水，還原純建物每坪真實底價',
    },
    {
      value: '50萬+',
      label: '歷年實價登錄紀錄',
      sublabel: '即時連線官方地政資料庫，每週比對更新',
    },
  ];

  return (
    <section className="bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              全台房市大數據・透明真實的指標力量
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
            嚴選官方內政部實價登錄資料庫，提供最權威的台灣房價每坪走勢與待售房屋搜尋體驗。
          </p>
        </div>

        {/* 3 Large Solid Black Bento Cards (Direct translation of reference image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-black text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[220px] shadow-xl hover:scale-[1.01] transition duration-300"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                {stat.value}
              </div>
              <div className="space-y-1 pt-4">
                <div className="text-sm sm:text-base font-bold text-slate-100">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400">
                  {stat.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

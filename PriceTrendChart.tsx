import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Layers, Calendar, Info, ArrowUpRight, ArrowDownRight, Key, Lock } from 'lucide-react';
import { PriceTrendPoint, AreaSummary } from '../types';

interface PriceTrendChartProps {
  trendData: PriceTrendPoint[];
  summary: AreaSummary;
  city: string;
  district: string;
  hasApiKey?: boolean;
  onRequireApiKey?: () => void;
}

type ChartViewMode = 'trend' | 'distribution';

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  trendData,
  summary,
  city,
  district,
  hasApiKey = false,
  onRequireApiKey,
}) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('trend');
  const [timeRange, setTimeRange] = useState<'1y' | '2y' | 'all'>('all');
  const [visibleSeries, setVisibleSeries] = useState({
    overall: true,
    elevator: true,
    lowRise: true,
  });

  // Filter trend data according to timeRange (Must be called unconditionally)
  const filteredTrendData = React.useMemo(() => {
    if (!trendData || trendData.length === 0) return [];
    if (timeRange === '1y') {
      return trendData.slice(-4);
    }
    if (timeRange === '2y') {
      return trendData.slice(-8);
    }
    return trendData;
  }, [trendData, timeRange]);

  if (!hasApiKey) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-md mx-auto py-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">
              {city}{district} 歷史走勢與價格分佈圖 (已鎖定)
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              為保護資料庫安全與 AI 運算額度，請先輸入您的 Google Gemini API Key 以解鎖近 3 年房價曲線與市場供需分析。
            </p>
          </div>
          <button
            onClick={onRequireApiKey}
            className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer inline-flex items-center gap-2"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>前往上方填寫 API Key 解鎖走勢圖</span>
          </button>
        </div>
      </div>
    );
  }

  // Find min and max for Y-axis scaling
  const allPrices = filteredTrendData.flatMap((d) => [d.overallPrice, d.elevatorPrice, d.lowRisePrice]);
  const minPrice = Math.max(0, Math.floor(Math.min(...allPrices) * 0.9));
  const maxPrice = Math.ceil(Math.max(...allPrices) * 1.08);

  const toggleSeries = (key: 'overall' | 'elevator' | 'lowRise') => {
    setVisibleSeries((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as PriceTrendPoint;
      return (
        <div className="bg-slate-950 text-white border border-slate-800 p-4 rounded-2xl shadow-2xl text-xs z-50 min-w-[200px]">
          <div className="font-bold text-white mb-2 pb-1.5 border-b border-slate-800 flex items-center justify-between gap-4">
            <span className="text-amber-400 font-black text-sm">{dataPoint.period}</span>
            <span className="text-slate-400 font-normal">統計: {dataPoint.monthLabel}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                全區綜合均價:
              </span>
              <span className="font-black text-amber-300 text-sm">
                {dataPoint.overallPrice} <span className="text-[10px] font-normal text-slate-400">萬/坪</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                電梯大樓均價:
              </span>
              <span className="font-bold text-sky-300">
                {dataPoint.elevatorPrice} <span className="text-[10px] font-normal text-slate-400">萬/坪</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                華廈/公寓均價:
              </span>
              <span className="font-bold text-emerald-300">
                {dataPoint.lowRisePrice} <span className="text-[10px] font-normal text-slate-400">萬/坪</span>
              </span>
            </div>
            <div className="pt-2 mt-1 border-t border-slate-800 flex items-center justify-between text-slate-400">
              <span>季成交登錄量:</span>
              <span className="text-white font-bold">{dataPoint.volume} 戶</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDistributionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 text-white border border-slate-800 p-3 rounded-2xl shadow-xl text-xs">
          <div className="font-bold text-amber-400 mb-1">{data.range}</div>
          <div className="text-slate-200">
            佔比：<span className="font-black text-white">{data.percentage}%</span> ({data.count} 筆交易)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
              {city}{district} 每坪房價歷史走勢圖
            </h2>
            <p className="text-xs text-slate-500">
              依據內政部實價登錄最新彙整，精準反映每坪成交單價歷史曲線與交易量
            </p>
          </div>
        </div>

        {/* View Mode & Range Switchers */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Mode switch */}
          <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200">
            <button
              id="chart-tab-trend"
              onClick={() => setViewMode('trend')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'trend'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              每坪走勢曲線
            </button>
            <button
              id="chart-tab-distribution"
              onClick={() => setViewMode('distribution')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'distribution'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              單價區間分佈
            </button>
          </div>

          {/* Time range switch (Only in trend mode) */}
          {viewMode === 'trend' && (
            <div className="bg-slate-100 p-1 rounded-full flex items-center border border-slate-200 text-xs">
              <button
                onClick={() => setTimeRange('1y')}
                className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  timeRange === '1y'
                    ? 'bg-white text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                近1年
              </button>
              <button
                onClick={() => setTimeRange('2y')}
                className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  timeRange === '2y'
                    ? 'bg-white text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                近2年
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  timeRange === 'all'
                    ? 'bg-white text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                全期 (3年)
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        
        {/* Metric 1: Avg Price */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-500 mb-1">當前全區平均單價</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-baseline gap-1">
            {summary.avgPrice}
            <span className="text-xs text-slate-500 font-normal">萬/坪</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">中位數：{summary.medianPrice} 萬/坪</div>
        </div>

        {/* Metric 2: YoY */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-500 mb-1">近一年房價變動 (YoY)</div>
          <div className={`text-2xl sm:text-3xl font-black flex items-center gap-1 ${summary.yoyChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {summary.yoyChange >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            {summary.yoyChange >= 0 ? `+${summary.yoyChange}%` : `${summary.yoyChange}%`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">季增率：+{summary.qoqChange}%</div>
        </div>

        {/* Metric 3: Range */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-500 mb-1">實價登錄單價區間</div>
          <div className="text-base sm:text-lg font-black text-slate-950">
            {summary.lowestPrice} ~ {summary.highestPrice}
            <span className="text-xs text-slate-500 font-normal ml-1">萬/坪</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">涵蓋大樓至老舊公寓</div>
        </div>

        {/* Metric 4: Liquidity */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="text-[11px] font-medium text-slate-500 mb-1">平均去化天數</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-baseline gap-1">
            {summary.avgDaysOnMarket}
            <span className="text-xs text-slate-500 font-normal">天</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">市場熱度：交易穩健</div>
        </div>

      </div>

      {/* Series Toggles (in trend view) */}
      {viewMode === 'trend' && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-bold">走勢曲線：</span>
            <button
              onClick={() => toggleSeries('overall')}
              className={`px-3 py-1 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                visibleSeries.overall
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              全區均價走勢
            </button>
            <button
              onClick={() => toggleSeries('elevator')}
              className={`px-3 py-1 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                visibleSeries.elevator
                  ? 'bg-sky-50 text-sky-900 border-sky-300 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              電梯大樓
            </button>
            <button
              onClick={() => toggleSeries('lowRise')}
              className={`px-3 py-1 rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                visibleSeries.lowRise
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              公寓 / 華廈
            </button>
          </div>
          <div className="text-slate-400 text-xs flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            單位：新台幣 萬元 / 坪
          </div>
        </div>
      )}

      {/* Main Chart Canvas */}
      <div className="h-72 sm:h-84 w-full pt-2">
        {viewMode === 'trend' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorElevator" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorLowRise" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                unit="萬"
              />
              <Tooltip content={<CustomTrendTooltip />} />
              
              {visibleSeries.overall && (
                <Area
                  type="monotone"
                  dataKey="overallPrice"
                  name="全區均價"
                  stroke="#d97706"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOverall)"
                  activeDot={{ r: 6, stroke: '#d97706', strokeWidth: 3, fill: '#ffffff' }}
                />
              )}

              {visibleSeries.elevator && (
                <Area
                  type="monotone"
                  dataKey="elevatorPrice"
                  name="電梯大樓"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorElevator)"
                  strokeDasharray="4 2"
                />
              )}

              {visibleSeries.lowRise && (
                <Area
                  type="monotone"
                  dataKey="lowRisePrice"
                  name="華廈/公寓"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLowRise)"
                  strokeDasharray="2 2"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          /* Distribution Bar Chart */
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summary.priceDistribution} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="range"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                unit="%"
              />
              <Tooltip content={<CustomDistributionTooltip />} />
              <Bar
                dataKey="percentage"
                name="成交比例 (%)"
                fill="#0f172a"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Footer description */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span>圖表數據已濾除特殊親友移轉與純車位交易，真實呈現標準住宅每坪成交單價</span>
        </div>
        <div className="text-slate-400">
          更新頻率：每週與政府實價登錄資料庫同步校準
        </div>
      </div>

    </div>
  );
};


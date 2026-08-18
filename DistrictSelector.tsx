import React from 'react';
import { MapPin, Search, ChevronRight, TrendingUp, Sparkles, SlidersHorizontal } from 'lucide-react';
import { TAIWAN_REGIONS, POPULAR_HOTSPOTS } from '../data/taiwanDistricts';

interface DistrictSelectorProps {
  selectedCity: string;
  selectedDistrict: string;
  onSelectRegion: (city: string, district: string) => void;
  avgPrice: number;
  yoyChange: number;
  hasApiKey?: boolean;
  onRequireApiKey?: () => void;
}

export const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  selectedCity,
  selectedDistrict,
  onSelectRegion,
  avgPrice,
  yoyChange,
  hasApiKey = false,
  onRequireApiKey,
}) => {
  // Find current districts for the chosen city
  const currentCityObj = TAIWAN_REGIONS.find((r) => r.city === selectedCity) || TAIWAN_REGIONS[0];
  const currentDistricts = currentCityObj.districts;

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!hasApiKey) {
      if (onRequireApiKey) onRequireApiKey();
      return;
    }
    const newCity = e.target.value;
    const targetCityObj = TAIWAN_REGIONS.find((r) => r.city === newCity);
    if (targetCityObj && targetCityObj.districts.length > 0) {
      onSelectRegion(newCity, targetCityObj.districts[0]);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!hasApiKey) {
      if (onRequireApiKey) onRequireApiKey();
      return;
    }
    onSelectRegion(selectedCity, e.target.value);
  };

  const handleHotspotClick = (city: string, district: string) => {
    if (!hasApiKey) {
      if (onRequireApiKey) onRequireApiKey();
      return;
    }
    onSelectRegion(city, district);
  };

  return (
    <div id="query-section" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      
      {/* Top Header with Selected Location and Live Price Badge */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        
        {/* Title and location indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              即時查詢目標區域
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2">
              <span>{selectedCity}</span>
              <ChevronRight className="w-5 h-5 text-slate-300 inline" />
              <span className="text-amber-600">{selectedDistrict}</span>
            </div>
          </div>
        </div>

        {/* Current benchmark price pill in crisp high contrast */}
        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200 w-full lg:w-auto justify-between sm:justify-start">
          <div>
            <div className="text-[11px] font-medium text-slate-500">實價登錄平均單價</div>
            <div className="text-xl sm:text-2xl font-black text-slate-950 flex items-baseline gap-1">
              <span>{avgPrice}</span>
              <span className="text-xs text-slate-500 font-normal">萬/坪</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-1" />
          <div>
            <div className="text-[11px] font-medium text-slate-500">近一年年變動</div>
            <div className={`text-base font-bold flex items-center gap-0.5 ${yoyChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              <TrendingUp className={`w-3.5 h-3.5 ${yoyChange < 0 ? 'rotate-180' : ''}`} />
              {yoyChange >= 0 ? `+${yoyChange}%` : `${yoyChange}%`}
            </div>
          </div>
        </div>

      </div>

      {/* Select Controls Row */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        
        {/* City Dropdown */}
        <div>
          <label htmlFor="city-select" className="block text-xs font-bold text-slate-700 mb-1.5">
            1. 選擇縣市 (全台22縣市)
          </label>
          <div className="relative">
            <select
              id="city-select"
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full bg-slate-50 text-slate-900 font-bold rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition appearance-none cursor-pointer pr-10"
            >
              {TAIWAN_REGIONS.map((r) => (
                <option key={r.city} value={r.city}>
                  {r.city}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 font-bold text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* District Dropdown */}
        <div>
          <label htmlFor="district-select" className="block text-xs font-bold text-slate-700 mb-1.5">
            2. 選擇行政區 / 鄉鎮市區
          </label>
          <div className="relative">
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full bg-slate-50 text-slate-900 font-bold rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition appearance-none cursor-pointer pr-10"
            >
              {currentDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400 font-bold text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Quick prompt */}
        <div className="sm:col-span-2 md:col-span-1 flex flex-col justify-end">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>切換選區將自動即時更新下方實價走勢圖與在售物件！</span>
          </div>
        </div>

      </div>

      {/* Hotspots chips row */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            🔥 全台熱門房市快選：
          </span>
          {!hasApiKey && (
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              🔒 需填寫 API Key 才能執行查詢
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_HOTSPOTS.map((hotspot) => {
            const isSelected = selectedCity === hotspot.city && selectedDistrict === hotspot.district;
            return (
              <button
                key={`${hotspot.city}-${hotspot.district}`}
                id={`hotspot-${hotspot.city}-${hotspot.district}`}
                onClick={() => handleHotspotClick(hotspot.city, hotspot.district)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950 border border-slate-200'
                }`}
              >
                {hotspot.label}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};


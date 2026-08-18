import React, { useState } from 'react';
import { ShieldCheck, Calendar, MapPin, Building, Car, Home, ArrowUpRight, ArrowDownRight, ExternalLink, Info, CheckCircle2, ChevronRight, Eye, Sparkles, Key, Lock } from 'lucide-react';
import { RealPriceRecord } from '../types';

interface RealPriceRecordsProps {
  records: RealPriceRecord[];
  city: string;
  district: string;
  avgPrice: number;
  hasApiKey?: boolean;
  onRequireApiKey?: () => void;
}

export const RealPriceRecords: React.FC<RealPriceRecordsProps> = ({
  records,
  city,
  district,
  avgPrice,
  hasApiKey = false,
  onRequireApiKey,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<RealPriceRecord | null>(null);

  if (!hasApiKey) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-md mx-auto py-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">
              {city}{district} 最近 5 筆實價登錄 (已鎖定)
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              為保護資料查詢額度與真實行情，請先輸入您的 Google Gemini API Key 以解鎖包含車位精確拆算之成交底價紀錄。
            </p>
          </div>
          <button
            onClick={onRequireApiKey}
            className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer inline-flex items-center gap-2"
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>前往上方填寫 API Key 解鎖實價登錄</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                {city}{district} 最近 5 筆實價登錄紀錄
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                最新 5 筆
              </span>
            </div>
            <p className="text-xs text-slate-500">
              官方內政部實價登錄查核資料・車位價格已自動精確拆算・剔除特殊交易
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 self-start sm:self-auto font-medium">
          區域基準均價：<span className="font-bold text-slate-950">{avgPrice} 萬/坪</span>
        </div>
      </div>

      {/* 5 Records List */}
      <div className="divide-y divide-slate-100 mt-2">
        {records.map((rec, index) => {
          const isHigher = rec.priceDiffPercent >= 0;
          return (
            <div
              key={rec.id}
              className="py-4.5 hover:bg-slate-50/80 transition rounded-2xl px-3 sm:px-4 group cursor-pointer"
              onClick={() => setSelectedRecord(rec)}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left Block: Index badge, date, community name, address, tags */}
                <div className="flex items-start gap-3.5 w-full lg:w-1/2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 group-hover:bg-black group-hover:text-white transition">
                    #{index + 1}
                  </div>
                  
                  <div className="space-y-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {rec.transactionDate} ({rec.formattedDate})
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                        {rec.buildingType}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        屋齡 {rec.age} 年
                      </span>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-amber-600 transition flex items-center gap-1.5">
                      <span>{rec.communityName}</span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{city}{district}{rec.address}</span>
                      <span className="text-slate-300">|</span>
                      <span>{rec.floor}</span>
                    </div>
                  </div>
                </div>

                {/* Right Block: Price, Unit price, Ping, Layout, Comparison badge */}
                <div className="flex items-center justify-between lg:justify-end gap-5 w-full lg:w-1/2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  
                  {/* Specs & Layout */}
                  <div className="text-left lg:text-right text-xs text-slate-600 space-y-0.5">
                    <div className="font-bold text-slate-900">
                      {rec.areaPing} 坪・{rec.layout}
                    </div>
                    <div className="text-slate-400 text-[11px] truncate max-w-[200px] sm:max-w-none">
                      {rec.parkingInfo}
                    </div>
                  </div>

                  {/* Price & Unit Price Tag */}
                  <div className="text-right pl-4 border-l border-slate-200 shrink-0">
                    <div className="text-xl sm:text-2xl font-black text-slate-950">
                      {rec.unitPricePing} <span className="text-xs font-normal text-slate-500">萬/坪</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      總價 {rec.totalPrice.toLocaleString()} 萬元
                    </div>
                    <div className={`text-[11px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${isHigher ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {isHigher ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {isHigher ? `高於均價 +${rec.priceDiffPercent}%` : `低於均價 ${rec.priceDiffPercent}%`}
                    </div>
                  </div>

                  {/* Detail trigger button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecord(rec);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-black hover:text-white text-slate-600 border border-slate-200 transition shrink-0 hidden sm:block cursor-pointer"
                    title="查看完整移轉明細"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>依據內政部實價登錄地政三法規範，單價已去除車位面積與價格精確拆算。</span>
        </div>
        <div className="text-slate-400">
          點擊任一筆紀錄可查閱詳細格局與移轉結構
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  實價登錄移轉明細
                </span>
                <h3 className="text-xl font-black text-slate-950 mt-1.5">
                  {selectedRecord.communityName}
                </h3>
                <p className="text-xs text-slate-500">
                  {city}{district}{selectedRecord.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-950 p-1.5 rounded-xl hover:bg-slate-100 transition text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-slate-500 text-xs">成交總價</div>
                  <div className="text-2xl font-black text-slate-950">
                    {selectedRecord.totalPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">萬元</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs">每坪單價 (拆算後)</div>
                  <div className="text-2xl font-black text-amber-600">
                    {selectedRecord.unitPricePing} <span className="text-xs font-normal text-slate-500">萬/坪</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-slate-700 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400">交易日期：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.formattedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">交易建坪：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.areaPing} 坪</span>
                </div>
                <div>
                  <span className="text-slate-400">建物型態：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.buildingType}</span>
                </div>
                <div>
                  <span className="text-slate-400">交易樓層：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.floor}</span>
                </div>
                <div>
                  <span className="text-slate-400">屋齡：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.age} 年</span>
                </div>
                <div>
                  <span className="text-slate-400">格局：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.layout}</span>
                </div>
                <div>
                  <span className="text-slate-400">主要結構：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.buildingMaterial}</span>
                </div>
                <div>
                  <span className="text-slate-400">主要用途：</span>
                  <span className="font-bold text-slate-950 ml-1">{selectedRecord.purpose}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-slate-500 text-xs mb-1 font-semibold">車位交易資訊</div>
                <div className="font-bold text-slate-800 text-xs">{selectedRecord.parkingInfo}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="text-slate-500 text-xs mb-1 font-semibold">與區域平均行情對比</div>
                <div className="text-xs text-slate-600">
                  該筆成交每坪 {selectedRecord.unitPricePing} 萬元，與目前 {city}{district} 平均單價 {avgPrice} 萬相比，
                  <span className={`font-bold ml-1 ${selectedRecord.priceDiffPercent >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedRecord.priceDiffPercent >= 0 ? `高出 +${selectedRecord.priceDiffPercent}%` : `低於 ${selectedRecord.priceDiffPercent}%`}
                  </span>
                  。屬於正常合規市場波動。
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                關閉明細
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};


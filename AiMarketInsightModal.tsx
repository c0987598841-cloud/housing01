import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, RefreshCw, Copy, Check, AlertTriangle, Key, ExternalLink, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface AiMarketInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  district: string;
  avgPrice: number;
  yoyChange: number;
  apiKey?: string;
  onApiKeyChange?: (key: string) => void;
  selectedModel?: string;
}

export const AiMarketInsightModal: React.FC<AiMarketInsightModalProps> = ({
  isOpen,
  onClose,
  city,
  district,
  avgPrice,
  yoyChange,
  apiKey = '',
  onApiKeyChange,
  selectedModel = 'gemini-2.5-flash',
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [localKeyInput, setLocalKeyInput] = useState<string>(apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);

  useEffect(() => {
    setLocalKeyInput(apiKey);
  }, [apiKey]);

  const fetchAiAnalysis = async (customKey?: string) => {
    const keyToUse = (customKey !== undefined ? customKey : apiKey).trim();
    if (!keyToUse) {
      setError('請先輸入有效的 Google Gemini API Key 才能執行 AI 房市分析。');
      setAnalysis('');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          district,
          averagePrice: avgPrice,
          trendRate: yoyChange,
          propertyType: '電梯大樓、華廈與透天',
          transactionCount: '近一季成交活躍',
          apiKey: keyToUse,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI 伺服器分析失敗');
      }
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error('AI analysis fetch error:', err);
      setError(err.message || 'AI 伺服器分析失敗，請檢查 API Key 是否正確。');
      setAnalysis('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (apiKey.trim()) {
        fetchAiAnalysis(apiKey);
      } else {
        setAnalysis('');
        setError(null);
      }
    }
  }, [isOpen, city, district]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndAnalyze = () => {
    if (!localKeyInput.trim()) {
      setError('請輸入有效的 Google Gemini API Key');
      return;
    }
    if (onApiKeyChange) {
      onApiKeyChange(localKeyInput.trim());
    }
    fetchAiAnalysis(localKeyInput.trim());
  };

  const hasKey = Boolean(apiKey.trim() || localKeyInput.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                AI 專家房市行情剖析
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  {selectedModel}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                目標區域：{city} {district}・實價登錄均價 {avgPrice} 萬/坪
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {analysis && (
              <button
                onClick={handleCopy}
                disabled={loading || !analysis}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '已複製！' : '複製報告'}
              </button>
            )}
            {analysis && (
              <button
                onClick={() => fetchAiAnalysis()}
                disabled={loading}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 flex items-center justify-center border border-slate-200 transition cursor-pointer text-xs"
                title="重新分析"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Missing API Key Guidance State */}
          {!hasKey && !analysis && (
            <div className="bg-[#0B0F19] text-white border border-blue-900/50 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2D2214] border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-50 text-base">
                      請先輸入您的 Google Gemini API Key
                    </h4>
                    <p className="text-xs text-slate-400">
                      為保護系統 API 額度與安全，本分析採用使用者專屬 Key 模式。
                    </p>
                  </div>
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4 text-xs font-medium flex items-center gap-1"
                >
                  <span>免費申請 Key</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Input for key */}
              <div className="bg-[#060913] border border-blue-900/60 focus-within:border-blue-500 rounded-full px-4 py-2.5 flex items-center gap-3">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={localKeyInput}
                  onChange={(e) => setLocalKeyInput(e.target.value)}
                  placeholder="請在此貼上您的 Google Gemini API Key (AIzaSy...)"
                  className="bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none w-full text-xs sm:text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Key 僅保存在您的瀏覽器中</span>
                </div>

                <button
                  onClick={handleSaveAndAnalyze}
                  disabled={!localKeyInput.trim() || loading}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>儲存並開始 AI 深度分析</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Message if any */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">分析請求未能完成</p>
                <p className="text-xs text-rose-700">{error}</p>
                {!apiKey.trim() && (
                  <button
                    onClick={() => {
                      onClose();
                      const el = document.getElementById('gemini-api-key-card');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                  >
                    <span>👉 前往首頁頂部設定 API Key</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto animate-pulse">
                <Bot className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-950">AI 正在深度解析 {city}{district} 房市大數據...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  使用模型：{selectedModel}・正在比對實價登錄歷史成交脈絡與近期市場供需結構
                </p>
              </div>
              <div className="max-w-md mx-auto space-y-2 pt-4">
                <div className="h-3 bg-slate-100 rounded-full w-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-full w-5/6 mx-auto animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-full w-4/6 mx-auto animate-pulse" />
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              
              {/* Region Benchmark Tag banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <span>區域均價：<strong className="text-slate-950 text-sm font-black">{avgPrice} 萬/坪</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span>年變動率：<strong className={`font-black ${yoyChange >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{yoyChange >= 0 ? `+${yoyChange}%` : `${yoyChange}%`}</strong></span>
                </div>
                <div className="text-slate-500 font-medium">
                  分析引擎：{selectedModel}
                </div>
              </div>

              {/* Analysis Text formatted */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                {analysis}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  免責聲明：本 AI 分析報告係依據政府實價登錄公開資料與即時房市模型運算提供參考，非屬任何形式之保證或投資要約。實際購屋出價請結合現場屋況及專業地政士諮詢。
                </span>
              </div>

            </div>
          ) : null}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              關閉分析視窗
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};


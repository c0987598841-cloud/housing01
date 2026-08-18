import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Sparkles, ShieldCheck, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface GeminiApiKeyCardProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const GeminiApiKeyCard: React.FC<GeminiApiKeyCardProps> = ({
  apiKey,
  onApiKeyChange,
  selectedModel,
  onModelChange,
}) => {
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const isUnlocked = Boolean(apiKey.trim());

  // Available models matching the prompt and screenshot
  const modelOptions = [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (最新高效 - 推薦)' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (深度推理)' },
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (極速響應)' },
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (穩定版)' },
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  ];

  // Test and detect model with the provided key
  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: '請先在上方輸入欄位填入您的 Google Gemini API Key',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/gemini/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          model: selectedModel,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || `連線成功！已成功偵測並啟用 ${selectedModel}`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'API Key 驗證失敗，請確認 Key 是否有效',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || '測試連線發生錯誤，請稍後重試',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      id="gemini-api-key-card"
      className="bg-[#0B0F19] text-white border border-blue-900/50 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl shadow-blue-950/20 space-y-4 sm:space-y-5 transition-all"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2214] border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-amber-50 tracking-wide">
              您的 Google Gemini API Key
            </h2>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              必填
            </span>
          </div>
        </div>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline underline-offset-4 text-xs font-medium flex items-center gap-1 transition"
        >
          <span>免費申請 Key</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Middle Input Row */}
      <div className="bg-[#060913] border border-blue-900/60 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 rounded-full px-5 py-3 flex items-center gap-3 transition">
        <input
          id="user-gemini-api-key-input"
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => {
            onApiKeyChange(e.target.value);
            setTestResult(null);
          }}
          placeholder="請在此貼上您的 Google Gemini API Key (例如：AIzaSy...)"
          className="bg-transparent border-0 text-slate-100 placeholder-slate-500 focus:outline-none w-full text-sm font-mono tracking-wider"
          autoComplete="off"
          spellCheck="false"
        />
        
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="text-slate-400 hover:text-slate-200 transition p-1 cursor-pointer focus:outline-none shrink-0"
          title={showKey ? '隱藏 API Key' : '顯示 API Key'}
        >
          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Test Button */}
        <button
          id="test-gemini-model-btn"
          type="button"
          onClick={handleTestKey}
          disabled={isTesting}
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
        >
          {isTesting ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
          )}
          <span>{isTesting ? '正在測試連線中...' : '✨ 測試與偵測可用模型'}</span>
        </button>

        {/* Model Selector Pill Dropdown */}
        <div className="relative">
          <select
            id="gemini-model-select"
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full sm:w-auto bg-[#0B132B] border border-blue-900/70 text-slate-200 rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 cursor-pointer appearance-none pr-8"
          >
            {modelOptions.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Test feedback toast */}
      {testResult && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
            testResult.success
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Lock/Unlock Status Bar */}
      <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
        isUnlocked
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
      }`}>
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          )}
          <span className="font-bold">
            {isUnlocked
              ? '✅ 查詢權限已解鎖：您已填寫 API Key，可完整查詢全台 22 縣市實價登錄、價格走勢與 AI 房市分析！'
              : '🔒 查詢功能目前鎖定中：請於上方貼上您的 Google Gemini API Key 以解鎖全站實價登錄與房市查詢。'}
          </span>
        </div>
      </div>

      {/* Footer Safety Notice */}
      <div className="pt-2 flex items-center gap-2 text-slate-400 text-xs font-normal">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Key 僅安全存在您的瀏覽器，無備援機制，100% 由 Gemini AI 解析。</span>
      </div>
    </div>
  );
};

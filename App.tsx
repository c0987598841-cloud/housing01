import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustSection } from './components/TrustSection';
import { StatsBentoSection } from './components/StatsBentoSection';
import { GeminiApiKeyCard } from './components/GeminiApiKeyCard';
import { RealTimePlatformHub } from './components/RealTimePlatformHub';
import { DistrictSelector } from './components/DistrictSelector';
import { PriceTrendChart } from './components/PriceTrendChart';
import { RealPriceRecords } from './components/RealPriceRecords';
import { PropertyList } from './components/PropertyList';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { MortgageCalculatorModal } from './components/MortgageCalculatorModal';
import { AiMarketInsightModal } from './components/AiMarketInsightModal';

import {
  getBenchmarkBasePrice,
  getRecent5RealPriceRecords,
  getPriceTrendData,
  getPropertiesForSale,
  getAreaSummary,
} from './data/realEstateData';
import { Property, RealPriceRecord } from './types';
import { Building2, ShieldCheck, Database, Layers, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  // User Gemini API Key & Model State stored in LocalStorage for protection and persistence
  const [userApiKey, setUserApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('gemini_user_api_key') || '';
    } catch {
      return '';
    }
  });

  const [userModel, setUserModel] = useState<string>(() => {
    try {
      return localStorage.getItem('gemini_user_model') || 'gemini-2.5-flash';
    } catch {
      return 'gemini-2.5-flash';
    }
  });

  const handleApiKeyChange = (newKey: string) => {
    setUserApiKey(newKey);
    try {
      localStorage.setItem('gemini_user_api_key', newKey);
    } catch (e) {
      console.warn('Failed to persist API Key', e);
    }
  };

  const handleModelChange = (newModel: string) => {
    setUserModel(newModel);
    try {
      localStorage.setItem('gemini_user_model', newModel);
    } catch (e) {
      console.warn('Failed to persist model', e);
    }
  };

  // Region Selection State
  const [selectedCity, setSelectedCity] = useState<string>('臺北市');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('大安區');

  // Custom Live-injected records if applied from Live Platform Hub
  const [liveRealPriceRecords, setLiveRealPriceRecords] = useState<RealPriceRecord[] | null>(null);
  const [liveProperties, setLiveProperties] = useState<Property[] | null>(null);

  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tw_house_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tw_house_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to persist favorites', e);
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMortgageModalOpen, setIsMortgageModalOpen] = useState<boolean>(false);
  const [mortgageTargetProperty, setMortgageTargetProperty] = useState<Property | null>(null);
  const [isAiInsightModalOpen, setIsAiInsightModalOpen] = useState<boolean>(false);

  // Region change handler
  const handleSelectRegion = (city: string, district: string) => {
    setSelectedCity(city);
    setSelectedDistrict(district);
    setLiveRealPriceRecords(null);
    setLiveProperties(null);
  };

  // Scroll helpers
  const scrollToQuerySection = () => {
    const el = document.getElementById('query-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToApiKeySection = () => {
    const el = document.getElementById('gemini-api-key-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Focus the input
      const inputEl = document.getElementById('user-gemini-api-key-input') as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
      }
    }
  };

  // Data queries based on chosen region
  const avgBenchmarkPrice = useMemo(
    () => getBenchmarkBasePrice(selectedCity, selectedDistrict),
    [selectedCity, selectedDistrict]
  );

  const default5Records = useMemo(
    () => getRecent5RealPriceRecords(selectedCity, selectedDistrict),
    [selectedCity, selectedDistrict]
  );

  const recent5Records = liveRealPriceRecords || default5Records;

  const trendData = useMemo(
    () => getPriceTrendData(selectedCity, selectedDistrict),
    [selectedCity, selectedDistrict]
  );

  const defaultPropertiesForSale = useMemo(
    () => getPropertiesForSale(selectedCity, selectedDistrict),
    [selectedCity, selectedDistrict]
  );

  const propertiesForSale = liveProperties || defaultPropertiesForSale;

  const areaSummary = useMemo(
    () => getAreaSummary(selectedCity, selectedDistrict),
    [selectedCity, selectedDistrict]
  );

  const handleOpenMortgageForProperty = (property: Property) => {
    setMortgageTargetProperty(property);
    setIsMortgageModalOpen(true);
  };

  const handleOpenGeneralMortgage = () => {
    setMortgageTargetProperty(null);
    setIsMortgageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-black selection:text-white font-sans antialiased">
      
      {/* Header */}
      <Header
        onOpenAiInsight={() => setIsAiInsightModalOpen(true)}
        onOpenMortgageCalc={handleOpenGeneralMortgage}
        selectedCity={selectedCity}
        selectedDistrict={selectedDistrict}
        onScrollToQuery={scrollToQuerySection}
        onScrollToApiKey={scrollToApiKeySection}
        hasApiKey={Boolean(userApiKey.trim())}
      />

      {/* Hero Section matching Reference Image */}
      <HeroSection
        selectedCity={selectedCity}
        selectedDistrict={selectedDistrict}
        avgPrice={avgBenchmarkPrice}
        yoyChange={areaSummary.yoyChange}
        onScrollToQuery={scrollToQuerySection}
        onOpenAiInsight={() => setIsAiInsightModalOpen(true)}
        onOpenMortgageCalc={handleOpenGeneralMortgage}
        hasApiKey={Boolean(userApiKey.trim())}
      />

      {/* Trust & Authority 6-Badge Section */}
      <TrustSection />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* User Gemini API Key Card (as requested in screenshot) */}
        <section aria-label="Gemini API Key 設定">
          <GeminiApiKeyCard
            apiKey={userApiKey}
            onApiKeyChange={handleApiKeyChange}
            selectedModel={userModel}
            onModelChange={handleModelChange}
          />
        </section>

        {/* District & City Selector with Hotspots */}
        <section aria-label="縣市行政區選擇">
          <DistrictSelector
            selectedCity={selectedCity}
            selectedDistrict={selectedDistrict}
            onSelectRegion={handleSelectRegion}
            avgPrice={avgBenchmarkPrice}
            yoyChange={areaSummary.yoyChange}
            hasApiKey={Boolean(userApiKey.trim())}
            onRequireApiKey={scrollToApiKeySection}
          />
        </section>

        {/* Real-time Official Platform Hub (MOI, 591, Leju) */}
        <section aria-label="即時官方平台串接與即時同步">
          <RealTimePlatformHub
            city={selectedCity}
            district={selectedDistrict}
            apiKey={userApiKey}
            selectedModel={userModel}
            onApplyLiveRealPrices={(records) => setLiveRealPriceRecords(records)}
            onApplyLiveProperties={(props) => setLiveProperties(props)}
          />
        </section>

        {/* Section 1: Price Per Ping Trend Visualizer (Recharts Curve) */}
        <section aria-label="每坪房價歷史走勢圖">
          <PriceTrendChart
            trendData={trendData}
            summary={areaSummary}
            city={selectedCity}
            district={selectedDistrict}
            hasApiKey={Boolean(userApiKey.trim())}
            onRequireApiKey={scrollToApiKeySection}
          />
        </section>

        {/* Section 2: Recent 5 Real Price Registration Records */}
        <section aria-label="最近5筆實價登錄紀錄">
          <RealPriceRecords
            records={recent5Records}
            city={selectedCity}
            district={selectedDistrict}
            avgPrice={avgBenchmarkPrice}
            hasApiKey={Boolean(userApiKey.trim())}
            onRequireApiKey={scrollToApiKeySection}
          />
        </section>

        {/* Section 3: Properties For Sale (中古屋待售清單) */}
        <section aria-label="該地區待售中古屋清單">
          <PropertyList
            properties={propertiesForSale}
            city={selectedCity}
            district={selectedDistrict}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            onCalculateMortgage={handleOpenMortgageForProperty}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            hasApiKey={Boolean(userApiKey.trim())}
            onRequireApiKey={scrollToApiKeySection}
          />
        </section>

      </main>

      {/* Stats Bento Section */}
      <StatsBentoSection />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-black text-slate-950 text-sm">台灣房價與實價登錄查詢平台</div>
              <div className="text-[11px] text-slate-500">
                資料來源：中華民國內政部地政司實價登錄公開資料庫・各大合法仲介成交彙整
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              資料車位已精確拆算
            </span>
            <span className="flex items-center gap-1">
              <Database className="w-4 h-4 text-sky-600" />
              即時校對更新
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Gemini AI 區域估價分析支援
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onOpenMortgageCalc={handleOpenMortgageForProperty}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <MortgageCalculatorModal
        isOpen={isMortgageModalOpen}
        onClose={() => {
          setIsMortgageModalOpen(false);
          setMortgageTargetProperty(null);
        }}
        initialProperty={mortgageTargetProperty}
      />

      <AiMarketInsightModal
        isOpen={isAiInsightModalOpen}
        onClose={() => setIsAiInsightModalOpen(false)}
        city={selectedCity}
        district={selectedDistrict}
        avgPrice={avgBenchmarkPrice}
        yoyChange={areaSummary.yoyChange}
        apiKey={userApiKey}
        onApiKeyChange={handleApiKeyChange}
        selectedModel={userModel}
      />

    </div>
  );
}


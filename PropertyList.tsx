import React, { useState, useMemo } from 'react';
import { Home, Search, SlidersHorizontal, ArrowUpDown, Filter, RotateCcw, Building2, Key, Lock } from 'lucide-react';
import { Property, BuildingType, FilterOptions } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  city: string;
  district: string;
  onSelectProperty: (property: Property) => void;
  onCalculateMortgage: (property: Property) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  hasApiKey?: boolean;
  onRequireApiKey?: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  city,
  district,
  onSelectProperty,
  onCalculateMortgage,
  favorites,
  onToggleFavorite,
  hasApiKey = false,
  onRequireApiKey,
}) => {
  const [filter, setFilter] = useState<FilterOptions>({
    keyword: '',
    sortBy: 'latest',
  });

  const [selectedBuildingType, setSelectedBuildingType] = useState<string>('all');
  const [selectedRooms, setSelectedRooms] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedPingRange, setSelectedPingRange] = useState<string>('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Reset filters
  const handleResetFilters = () => {
    setFilter({ keyword: '', sortBy: 'latest' });
    setSelectedBuildingType('all');
    setSelectedRooms('all');
    setSelectedPriceRange('all');
    setSelectedPingRange('all');
    setShowOnlyFavorites(false);
  };

  // Filtered & Sorted properties (Called unconditionally at top level)
  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];
    return properties
      .filter((p) => {
        // Keyword
        if (filter.keyword.trim()) {
          const kw = filter.keyword.toLowerCase().trim();
          const matchTitle = p.title.toLowerCase().includes(kw);
          const matchAddress = p.address.toLowerCase().includes(kw);
          const matchCommunity = p.communityName.toLowerCase().includes(kw);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(kw));
          if (!matchTitle && !matchAddress && !matchCommunity && !matchTags) return false;
        }

        // Favorites filter
        if (showOnlyFavorites && !favorites.includes(p.id)) {
          return false;
        }

        // Building Type
        if (selectedBuildingType !== 'all' && p.buildingType !== selectedBuildingType) {
          return false;
        }

        // Rooms
        if (selectedRooms !== 'all') {
          const rNum = parseInt(selectedRooms, 10);
          if (selectedRooms === '4+' && p.rooms < 4) return false;
          if (selectedRooms !== '4+' && p.rooms !== rNum) return false;
        }

        // Price range
        if (selectedPriceRange !== 'all') {
          if (selectedPriceRange === '<1000' && p.price >= 1000) return false;
          if (selectedPriceRange === '1000-2000' && (p.price < 1000 || p.price > 2000)) return false;
          if (selectedPriceRange === '2000-3500' && (p.price < 2000 || p.price > 3500)) return false;
          if (selectedPriceRange === '>3500' && p.price <= 3500) return false;
        }

        // Ping range
        if (selectedPingRange !== 'all') {
          if (selectedPingRange === '<25' && p.pingTotal >= 25) return false;
          if (selectedPingRange === '25-40' && (p.pingTotal < 25 || p.pingTotal > 40)) return false;
          if (selectedPingRange === '40-60' && (p.pingTotal < 40 || p.pingTotal > 60)) return false;
          if (selectedPingRange === '>60' && p.pingTotal <= 60) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filter.sortBy === 'price-asc') return a.price - b.price;
        if (filter.sortBy === 'price-desc') return b.price - a.price;
        if (filter.sortBy === 'unit-asc') return a.pricePerPing - b.pricePerPing;
        if (filter.sortBy === 'unit-desc') return b.pricePerPing - a.pricePerPing;
        if (filter.sortBy === 'ping-desc') return b.pingTotal - a.pingTotal;
        if (filter.sortBy === 'age-asc') return a.age - b.age;
        return 0; // latest
      });
  }, [
    properties,
    filter.keyword,
    filter.sortBy,
    selectedBuildingType,
    selectedRooms,
    selectedPriceRange,
    selectedPingRange,
    showOnlyFavorites,
    favorites,
  ]);

  if (!hasApiKey) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-md mx-auto py-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">
              {city}{district} 在售中古屋物件列表 (已鎖定)
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              請先輸入您的 Google Gemini API Key 以解鎖包含各大房仲同步盤源、拆算扣車位每坪單價與最新在售房源。
            </p>
          </div>
          <button
            onClick={onRequireApiKey}
            className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer inline-flex items-center gap-2"
          >
            <Key className="w-4 h-4 text-sky-400" />
            <span>前往上方填寫 API Key 解鎖在售物件</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Section Header with count and search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  {city}{district} 待售中古屋
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  共 {filteredProperties.length} 筆物件
                </span>
              </div>
              <p className="text-xs text-slate-500">
                嚴選地段、社區管理、採光與通風俱佳之優質在售中古住宅
              </p>
            </div>
          </div>

          {/* Search bar & Sorter */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="property-search-input"
                type="text"
                value={filter.keyword}
                onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
                placeholder="搜尋社區、路段或特色..."
                className="w-full bg-slate-50 text-slate-900 font-medium rounded-full pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black border border-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                id="property-sort-select"
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                className="bg-slate-50 text-slate-900 font-semibold rounded-full pl-3.5 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-black border border-slate-200 appearance-none cursor-pointer"
              >
                <option value="latest">精選推薦排序</option>
                <option value="price-asc">總價：低至高</option>
                <option value="price-desc">總價：高至低</option>
                <option value="unit-asc">單價：低至高</option>
                <option value="unit-desc">單價：高至低</option>
                <option value="ping-desc">坪數：大至小</option>
                <option value="age-asc">屋齡：新至舊</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

          </div>

        </div>

        {/* Multi-Filter Badges Row */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 text-xs">
          
          {/* Building Type Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">建物類型</label>
            <select
              value={selectedBuildingType}
              onChange={(e) => setSelectedBuildingType(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-3 py-2 border border-slate-200 text-xs focus:ring-1 focus:ring-black focus:outline-none cursor-pointer"
            >
              <option value="all">全部型態</option>
              <option value="電梯大樓">電梯大樓</option>
              <option value="華廈">華廈</option>
              <option value="公寓">公寓</option>
              <option value="透天別墅">透天別墅</option>
              <option value="套房">套房</option>
            </select>
          </div>

          {/* Rooms Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">房數格局</label>
            <select
              value={selectedRooms}
              onChange={(e) => setSelectedRooms(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-3 py-2 border border-slate-200 text-xs focus:ring-1 focus:ring-black focus:outline-none cursor-pointer"
            >
              <option value="all">不限房數</option>
              <option value="1">1 房</option>
              <option value="2">2 房</option>
              <option value="3">3 房</option>
              <option value="4+">4 房以上</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">總價預算</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-3 py-2 border border-slate-200 text-xs focus:ring-1 focus:ring-black focus:outline-none cursor-pointer"
            >
              <option value="all">不限預算</option>
              <option value="<1000">1000 萬以下</option>
              <option value="1000-2000">1000 ~ 2000 萬</option>
              <option value="2000-3500">2000 ~ 3500 萬</option>
              <option value=">3500">3500 萬以上</option>
            </select>
          </div>

          {/* Ping Range Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 mb-1 block">權狀坪數</label>
            <select
              value={selectedPingRange}
              onChange={(e) => setSelectedPingRange(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 font-medium rounded-xl px-3 py-2 border border-slate-200 text-xs focus:ring-1 focus:ring-black focus:outline-none cursor-pointer"
            >
              <option value="all">不限坪數</option>
              <option value="<25">25 坪以下</option>
              <option value="25-40">25 ~ 40 坪</option>
              <option value="40-60">40 ~ 60 坪</option>
              <option value=">60">60 坪以上</option>
            </select>
          </div>

          {/* Quick Actions (Reset & Favorites toggle) */}
          <div className="col-span-2 sm:col-span-4 md:col-span-1 flex items-end gap-2">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                showOnlyFavorites
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              已收藏 ({favorites.length})
            </button>
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-950 border border-slate-200 transition cursor-pointer"
              title="重設所有篩選"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
              onCalculateMortgage={onCalculateMortgage}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-950">查無符合條件之待售房屋</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            建議您放寬總價預算、坪數條件或清除關鍵字重新搜尋。
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-sm"
          >
            重設篩選條件
          </button>
        </div>
      )}

    </div>
  );
};


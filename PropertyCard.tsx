import React from 'react';
import { Building2, MapPin, Maximize2, Sparkles, Heart, Phone, Calculator, Check, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onCalculateMortgage: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onCalculateMortgage,
  isFavorite,
  onToggleFavorite,
}) => {
  // Estimated monthly mortgage (assume 80% loan, 30 years, 2.185% interest)
  const loanAmount = property.price * 0.8;
  const monthlyRate = 0.02185 / 12;
  const totalMonths = 30 * 12;
  const estMonthlyPayment = Math.round(
    (loanAmount * 10000 * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  return (
    <div
      className="bg-white border border-slate-200 hover:border-slate-400 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition duration-300 flex flex-col group cursor-pointer"
      onClick={() => onSelect(property)}
    >
      {/* Thumbnail with overlay badges */}
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-md border border-white/40 shadow-xs">
            {property.buildingType}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`p-2 rounded-full pointer-events-auto backdrop-blur-md transition shadow-sm cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
            }`}
            title="收藏物件"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Price Overlay on Image */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 pt-8 flex items-end justify-between text-white">
          <div>
            <div className="text-2xl font-black text-white leading-none">
              {property.price.toLocaleString()} <span className="text-xs font-normal text-slate-200">萬元</span>
            </div>
            <div className="text-xs font-semibold text-amber-300 mt-1">
              單價：<span className="font-bold">{property.pricePerPing}</span> 萬/坪
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
              屋齡 {property.age} 年
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        
        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-950 group-hover:text-amber-600 transition line-clamp-2 leading-snug">
            {property.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.address}</span>
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 text-center text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">建坪</div>
            <div className="font-bold text-slate-900">{property.pingTotal} 坪</div>
          </div>
          <div className="border-x border-slate-200">
            <div className="text-slate-400 text-[11px]">格局</div>
            <div className="font-bold text-slate-900">{property.rooms}房{property.livingRooms}廳{property.bathrooms}衛</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">樓層</div>
            <div className="font-bold text-slate-900">{property.floor}F/{property.totalFloors}F</div>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-12">
          {property.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
            >
              {tag}
            </span>
          ))}
          {property.tags.length > 3 && (
            <span className="text-[11px] text-slate-400 px-1 py-0.5">
              +{property.tags.length - 3}
            </span>
          )}
        </div>

        {/* Estimated Mortgage & Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCalculateMortgage(property);
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-sky-600 transition cursor-pointer"
            title="查看房貸月付試算"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-500" />
            <span>月付約 <strong className="text-sky-700 font-bold">{estMonthlyPayment.toLocaleString()}</strong> 元</span>
          </button>

          <span className="text-slate-950 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
            詳情
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  );
};


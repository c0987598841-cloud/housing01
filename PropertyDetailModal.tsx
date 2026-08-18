import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Heart,
  Share2,
  Calculator,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  Car,
  Compass,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenMortgageCalc: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenMortgageCalc,
  isFavorite,
  onToggleFavorite,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  // Quick mortgage math (80% loan, 30 yrs, 2.185%)
  const loanAmount = Math.round(property.price * 0.8);
  const downPayment = property.price - loanAmount;
  const monthlyRate = 0.02185 / 12;
  const totalMonths = 30 * 12;
  const estMonthlyPayment = Math.round(
    (loanAmount * 10000 * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactAgent = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header with Close and Share */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {property.buildingType}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              物件編號：{property.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition cursor-pointer text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? '已複製連結！' : '分享'}
            </button>
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-950 border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 flex items-center justify-center font-bold text-sm transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Image Gallery */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/20 backdrop-blur-sm transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/20 backdrop-blur-sm transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold backdrop-blur-sm border border-white/20">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Title & Core Price Hero */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                {property.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{property.address}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {property.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl shrink-0 text-left md:text-right min-w-[220px]">
              <div className="text-xs text-slate-500">委託開價</div>
              <div className="text-3xl font-black text-slate-950 leading-tight">
                {property.price.toLocaleString()} <span className="text-sm font-normal text-slate-500">萬元</span>
              </div>
              <div className="text-xs text-slate-700 font-bold mt-1">
                單價：<strong className="text-amber-600 text-sm">{property.pricePerPing}</strong> 萬/坪
              </div>
            </div>
          </div>

          {/* Detailed Property Specs Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-950 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              房屋基本規格與產權坪數
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">總建坪：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.pingTotal} 坪</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">主建物(室內)：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.pingMain} 坪</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">附屬建物：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.pingSub} 坪</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">公設比：</span>
                <span className="font-bold text-sky-700 block text-sm mt-0.5">{property.publicRatio}%</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">格局配置：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">
                  {property.rooms}房 {property.livingRooms}廳 {property.bathrooms}衛 {property.balconies}陽台
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">建築屋齡：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.age} 年</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">所在樓層：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.floor} 樓 / 共 {property.totalFloors} 樓</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">主要座向：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.orientation}</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">車位類型：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">{property.parkingType}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">車位價格：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">
                  {property.parkingPrice ? `${property.parkingPrice} 萬` : '已含於總價/無'}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">管理費：</span>
                <span className="font-bold text-slate-950 block text-sm mt-0.5">
                  {property.managementFee > 0 ? `${property.managementFee.toLocaleString()} 元/月` : '免管理費'}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-slate-500">建物型態：</span>
                <span className="font-bold text-amber-700 block text-sm mt-0.5">{property.buildingType}</span>
              </div>
            </div>
          </div>

          {/* Embedded Mortgage Loan Calculator Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">房貸試算預估 (首購/新青安參考)</h4>
                  <p className="text-xs text-slate-500">以自備 20%・貸款 80%・年期 30 年・年利率 2.185% 試算</p>
                </div>
              </div>
              <button
                onClick={() => onOpenMortgageCalc(property)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                自訂成數與寬限期 ➜
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 text-center text-xs">
              <div>
                <div className="text-slate-500">預估自備款 (2成)</div>
                <div className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                  {downPayment.toLocaleString()} <span className="text-xs font-normal text-slate-500">萬</span>
                </div>
              </div>
              <div className="border-x border-slate-200">
                <div className="text-slate-500">預估貸款金額 (8成)</div>
                <div className="text-base sm:text-lg font-black text-slate-950 mt-0.5">
                  {loanAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">萬</span>
                </div>
              </div>
              <div>
                <div className="text-slate-500">每月本息平均攤還</div>
                <div className="text-base sm:text-lg font-black text-sky-700 mt-0.5">
                  約 {estMonthlyPayment.toLocaleString()} <span className="text-xs font-normal text-slate-500">元/月</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-950 mb-2">物件詳細介紹</h3>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </div>
          </div>

          {/* Agent Contact Card & Action Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Agent info */}
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <img
                  src={property.agent.avatarUrl}
                  alt={property.agent.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-950 text-base">{property.agent.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                      專案經紀
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">{property.agent.agency}</div>
                  <div className="text-[11px] text-slate-400">證照字號：{property.agent.licenseNumber}</div>
                </div>
              </div>

              {/* Call or message buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  撥打電話 ({property.agent.phone})
                </a>
              </div>

            </div>

            {/* Quick Contact Form simulation */}
            <form onSubmit={handleContactAgent} className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="留下您的姓名與電話 (例如: 林先生 0912-345678)"
                required
                className="flex-1 bg-white text-slate-950 rounded-full px-4 py-2.5 text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                預約實體看屋
              </button>
            </form>

            {contactSent && (
              <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <CheckCircle className="w-4 h-4" />
                已收到您的看屋預約！專案經紀人將於 30 分鐘內與您聯繫安排看屋時間。
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};


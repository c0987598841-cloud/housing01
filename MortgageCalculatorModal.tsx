import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Calendar, ShieldCheck, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProperty?: Property | null;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialProperty,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(1800); // 萬元
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [loanYears, setLoanYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(2.185); // %
  const [gracePeriodYears, setGracePeriodYears] = useState<number>(0);
  const [repaymentType, setRepaymentType] = useState<'principal_interest' | 'principal_only'>('principal_interest');

  useEffect(() => {
    if (initialProperty) {
      setTotalPrice(initialProperty.price);
    }
  }, [initialProperty]);

  if (!isOpen) return null;

  // Preset plans
  const applyPreset = (type: 'youth' | 'first_standard' | 'second_home') => {
    if (type === 'youth') {
      setInterestRate(1.775);
      setLoanYears(40);
      setGracePeriodYears(3);
      setDownPaymentPercent(20);
    } else if (type === 'first_standard') {
      setInterestRate(2.185);
      setLoanYears(30);
      setGracePeriodYears(0);
      setDownPaymentPercent(20);
    } else if (type === 'second_home') {
      setInterestRate(2.45);
      setLoanYears(30);
      setGracePeriodYears(0);
      setDownPaymentPercent(30);
    }
  };

  const downPaymentAmount = Math.round(totalPrice * (downPaymentPercent / 100));
  const loanAmount = totalPrice - downPaymentAmount; // 萬元
  const loanAmountNTD = loanAmount * 10000;

  const totalMonths = loanYears * 12;
  const graceMonths = gracePeriodYears * 12;
  const amortizeMonths = totalMonths - graceMonths;
  const monthlyRate = interestRate / 100 / 12;

  // Calculation during grace period (interest only)
  const graceMonthlyInterest = Math.round(loanAmountNTD * monthlyRate);

  // Calculation after grace period (principal + interest)
  let normalMonthlyPayment = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (amortizeMonths > 0 && monthlyRate > 0) {
    if (repaymentType === 'principal_interest') {
      normalMonthlyPayment = Math.round(
        (loanAmountNTD * (monthlyRate * Math.pow(1 + monthlyRate, amortizeMonths))) /
          (Math.pow(1 + monthlyRate, amortizeMonths) - 1)
      );
      totalPayment = graceMonthlyInterest * graceMonths + normalMonthlyPayment * amortizeMonths;
      totalInterest = totalPayment - loanAmountNTD;
    } else {
      // Principal only (decreasing payment) - show first month
      const monthlyPrincipal = Math.round(loanAmountNTD / amortizeMonths);
      normalMonthlyPayment = monthlyPrincipal + graceMonthlyInterest;
      totalInterest = Math.round(((amortizeMonths + 1) * loanAmountNTD * monthlyRate) / 2) + graceMonthlyInterest * graceMonths;
      totalPayment = loanAmountNTD + totalInterest;
    }
  }

  // Recommended minimum monthly income (mortgage <= 35% of income)
  const recommendedIncome = Math.round(normalMonthlyPayment / 0.35);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-950">台灣房貸月付本息試算機</h3>
              <p className="text-xs text-slate-500">支援新青安優貸・首購本息均攤與寬限期試算</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Quick preset buttons */}
          <div>
            <div className="text-xs font-bold text-slate-700 mb-2">常用方案快速套用：</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => applyPreset('youth')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 text-slate-900 text-xs font-bold text-left transition cursor-pointer"
              >
                <div className="text-amber-800 font-black">✨ 新青安貸款 (1.775%)</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">40年期・3年寬限</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('first_standard')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 text-slate-900 text-xs font-bold text-left transition cursor-pointer"
              >
                <div className="text-slate-950 font-black">首購一般房貸 (2.185%)</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">30年期・無寬限</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('second_home')}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 text-slate-900 text-xs font-bold text-left transition cursor-pointer"
              >
                <div className="text-slate-950 font-black">換屋/二戶房貸 (2.45%)</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">自備3成・30年期</div>
              </button>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Total Price */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                房屋總價 (萬元)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max="20000"
                  step="10"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-950 rounded-2xl px-4 py-2.5 font-bold text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">萬元</span>
              </div>
            </div>

            {/* Down Payment % */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                自備款成數 ({downPaymentPercent}%) ＝ {downPaymentAmount.toLocaleString()} 萬
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="flex-1 accent-black cursor-pointer"
                />
                <span className="font-bold text-slate-950 w-10 text-right">{downPaymentPercent}%</span>
              </div>
            </div>

            {/* Loan Years */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                貸款年限 (年)
              </label>
              <select
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
                className="w-full bg-slate-50 text-slate-950 rounded-2xl px-4 py-2.5 font-bold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <option value={20}>20 年 (240 期)</option>
                <option value={30}>30 年 (360 期) - 主流</option>
                <option value={40}>40 年 (480 期) - 新青安/首購</option>
              </select>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                房貸年利率 (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1.0"
                  max="8.0"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-950 rounded-2xl px-4 py-2.5 font-bold text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
              </div>
            </div>

            {/* Grace Period */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                寬限期 (只繳息不還本)
              </label>
              <select
                value={gracePeriodYears}
                onChange={(e) => setGracePeriodYears(Number(e.target.value))}
                className="w-full bg-slate-50 text-slate-950 rounded-2xl px-4 py-2.5 font-bold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <option value={0}>無寬限期 (立即還本)</option>
                <option value={1}>1 年</option>
                <option value={2}>2 年</option>
                <option value={3}>3 年 (新青安常見)</option>
                <option value={5}>5 年 (最長寬限)</option>
              </select>
            </div>

            {/* Repayment Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                還款方式
              </label>
              <select
                value={repaymentType}
                onChange={(e) => setRepaymentType(e.target.value as any)}
                className="w-full bg-slate-50 text-slate-950 rounded-2xl px-4 py-2.5 font-bold border border-slate-200 focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <option value="principal_interest">本息平均攤還法 (每月金額固定)</option>
                <option value="principal_only">本金平均攤還法 (每月金額遞減)</option>
              </select>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="text-xs font-black text-slate-950 uppercase tracking-wider">
              房貸月付與還款試算結果
            </div>

            {/* Big monthly payment display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200">
              {gracePeriodYears > 0 && (
                <div>
                  <div className="text-xs text-slate-500">寬限期內每月繳息 (前 {gracePeriodYears} 年)</div>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {graceMonthlyInterest.toLocaleString()} <span className="text-xs font-normal text-slate-500">元/月</span>
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-xs text-slate-500">
                  {gracePeriodYears > 0 ? `寬限期滿後每月月付 (第 ${gracePeriodYears + 1} 年起)` : '每月本息攤還金額'}
                </div>
                <div className="text-3xl font-black text-slate-950 mt-1">
                  {normalMonthlyPayment.toLocaleString()} <span className="text-xs font-normal text-slate-500">元/月</span>
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <div className="text-slate-500">自備頭期款</div>
                <div className="font-bold text-slate-950 mt-0.5">{downPaymentAmount.toLocaleString()} 萬</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <div className="text-slate-500">貸款總額</div>
                <div className="font-bold text-slate-950 mt-0.5">{loanAmount.toLocaleString()} 萬</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <div className="text-slate-500">總利息支出</div>
                <div className="font-bold text-rose-600 mt-0.5">{Math.round(totalInterest / 10000).toLocaleString()} 萬</div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200">
                <div className="text-slate-500">建議家庭月收</div>
                <div className="font-bold text-emerald-700 mt-0.5">{recommendedIncome.toLocaleString()} 元</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-white p-3 rounded-2xl border border-slate-200">
              💡 <strong>專家建議：</strong> 建議每月房貸負擔不宜超過家庭總月收入之 <strong>30% ~ 35%</strong>，以維持充裕之生活品質與緊急備用金。
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              完成試算並關閉
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};


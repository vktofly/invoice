import React from 'react';

type Props = {
  subtotal: number;
  discountType: 'percent' | 'fixed';
  setDiscountType: (v: 'percent' | 'fixed') => void;
  discountValue: number;
  setDiscountValue: (v: number) => void;
  tdsOrTcs: 'TDS' | 'TCS';
  setTdsOrTcs: (v: 'TDS' | 'TCS') => void;
  tdsOrTcsRate: number;
  setTdsOrTcsRate: (v: number) => void;
  discountAmount: number;
  discountedSubtotal: number;
  tdsOrTcsAmount: number;
  finalTotal: number;
  currencySymbol: string;
  showTotalSummary: boolean;
  setShowTotalSummary: (v: boolean) => void;
};

const TotalSummary: React.FC<Props> = ({
  subtotal,
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  tdsOrTcs,
  setTdsOrTcs,
  tdsOrTcsRate,
  setTdsOrTcsRate,
  discountAmount,
  discountedSubtotal,
  tdsOrTcsAmount,
  finalTotal,
  currencySymbol,
  showTotalSummary,
  setShowTotalSummary,
}) => {
  return (
    <div className="w-full mt-4">
      <div className="flex justify-end">
        <button
          className="text-blue-600 text-sm hover:underline"
          onClick={() => setShowTotalSummary(!showTotalSummary)}
        >
          {showTotalSummary ? 'Hide Total Summary' : 'Show Total Summary'}
        </button>
      </div>
      {showTotalSummary && (
        <div className="border-t pt-4 mt-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold">Sub Total</span>
            <span className="text-sm font-semibold">{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Discount</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-16 border px-2 py-1 rounded-none text-right"
              />
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value as 'percent' | 'fixed')}
                className="border px-2 py-1 rounded-none"
              >
                <option value="percent">%</option>
                <option value="fixed">₹</option>
              </select>
            </div>
            <span className="text-sm">{currencySymbol}{discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">
              <label>
                <input
                  type="radio"
                  checked={tdsOrTcs === 'TDS'}
                  onChange={() => setTdsOrTcs('TDS')}
                  className="mr-1"
                />
                TDS
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  checked={tdsOrTcs === 'TCS'}
                  onChange={() => setTdsOrTcs('TCS')}
                  className="mr-1"
                />
                TCS
              </label>
            </span>
            <input
              type="number"
              min={0}
              value={tdsOrTcsRate}
              onChange={e => setTdsOrTcsRate(Number(e.target.value))}
              className="w-16 border px-2 py-1 rounded-none text-right"
              placeholder="Rate"
            />
            <span className="text-sm">- {currencySymbol}{tdsOrTcsAmount.toFixed(2)}</span>
          </div>
          <hr className="my-4" />
        </div>
      )}
      <div className="flex justify-between items-center border-t pt-4 mt-2">
        <span className="text-base font-semibold">Total ({currencySymbol})</span>
        <span className="text-xl font-bold">{finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TotalSummary;

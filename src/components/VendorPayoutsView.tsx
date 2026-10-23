import React, { useState } from 'react';
import { TOP_VENDORS } from '../data/mockData';

export const VendorPayoutsView: React.FC = () => {
  const [payoutList, setPayoutList] = useState(TOP_VENDORS);
  const [processingBatch, setProcessingBatch] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDisburseAll = () => {
    setProcessingBatch(true);
    setTimeout(() => {
      setPayoutList(
        payoutList.map((v) => ({
          ...v,
          status: 'Disbursed (1Link / Raast Batch Cleared)',
        }))
      );
      setProcessingBatch(false);
      setSuccessMsg('Batch of PKR 1,308,000 disbursed directly to Pakistani IBANs via SBP Raast switch.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleSingleDisburse = (vendorId: string) => {
    setPayoutList(
      payoutList.map((v) =>
        v.id === vendorId ? { ...v, status: 'Disbursed (Instant Raast)' } : v
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#bfc7d2]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-xs text-[#006194] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006194]"></span>
            Vendor Settlement Gateway
          </span>
          <h2 className="font-headline-lg text-2xl font-bold text-[#0b1c30] mt-1">
            Partner Payouts &amp; Direct Banking Network
          </h2>
          <p className="font-body-sm text-xs text-[#565e74]">
            Direct disburse via 1Link, Raast QR, Meezan Bank, and HBL Microfinance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDisburseAll}
            disabled={processingBatch}
            className="px-4 py-2.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold shadow-sm transition-colors inline-flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">send_money</span>
            {processingBatch ? 'Processing Raast Batch...' : 'Disburse All Pending (Raast)'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#00685f]/15 border border-[#00685f]/30 text-[#00685f] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Payout Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payoutList.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white p-5 rounded-xl border border-[#bfc7d2]/30 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#006194]/40 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#eff4ff] text-[#006194] font-headline-md font-bold flex items-center justify-center text-sm border border-[#e5eeff]">
                  {vendor.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30]">
                      {vendor.name}
                    </h3>
                    {vendor.verified && (
                      <span className="material-symbols-outlined text-[#006194] text-[16px]">
                        verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#565e74]">{vendor.location}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eff4ff] text-[#006194]">
                {vendor.bank}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#565e74] uppercase block">Net Payout Share</span>
                <span className="font-price-display text-lg font-bold text-[#0b1c30]">
                  {vendor.amountFormatted}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#565e74] uppercase block">Status</span>
                <span className="font-label-sm text-xs text-[#00685f] font-semibold">
                  {vendor.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#565e74] font-mono">
                IBAN: PK**{vendor.bank.substring(0, 4)}****1928
              </span>
              <button
                onClick={() => handleSingleDisburse(vendor.id)}
                className="px-3 py-1 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006194] text-xs font-semibold border border-[#006194]/30 transition-colors inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">payments</span>
                Disburse Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

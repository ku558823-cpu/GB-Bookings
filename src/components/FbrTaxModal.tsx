import React, { useState } from 'react';

interface FbrTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FbrTaxModal: React.FC<FbrTaxModalProps> = ({ isOpen, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleExportFbrBatch = () => {
    const csvContent = `FBR CPR No,Tax Period,Gross GBV (PKR),GBRA Sales Tax (16%),WHT Sec 236A (1%),Net Remitted (PKR),Status
CPR-2024-GB-99021,2024-10,4820000,771200,48200,819400,Automated FBR e-Filed
CPR-2024-GB-99018,2024-09,3860000,617600,38600,656200,Settled & Verified
CPR-2024-GB-99012,2024-08,3120000,499200,31200,530400,Settled & Verified`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FBR-GB-Tax-Reconciliation-Batch-Oct2024.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#213145]/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#bfc7d2]/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#eff4ff] flex items-center justify-between border-b border-[#bfc7d2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006194]/15 text-[#006194] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  FBR &amp; GBRA Tax Reconciliation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00685f]/15 text-[#00685f]">
                  IRIS PORTAL COMPLIANT
                </span>
              </div>
              <p className="font-body-sm text-xs text-[#565e74]">
                Gilgit-Baltistan Revenue Authority (GBRA) &amp; Federal Board of Revenue compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#ffffff] text-[#565e74] hover:text-[#0b1c30] flex items-center justify-center transition-colors shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
              <span className="text-[10px] text-[#565e74] uppercase font-bold block">
                Total Taxable GBV (Oct 2024)
              </span>
              <span className="font-price-display text-lg text-[#0b1c30] font-bold">
                PKR 4,820,000
              </span>
              <span className="text-[10px] text-[#00685f] block mt-1">1,180 Settled Invoices</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
              <span className="text-[10px] text-[#565e74] uppercase font-bold block">
                GBRA Sales Tax (16%)
              </span>
              <span className="font-price-display text-lg text-[#006194] font-bold">
                PKR 771,200
              </span>
              <span className="text-[10px] text-[#565e74] block mt-1">Services Hospitality Act</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff]">
              <span className="text-[10px] text-[#565e74] uppercase font-bold block">
                Withholding Tax (1% ATL)
              </span>
              <span className="font-price-display text-lg text-[#00685f] font-bold">
                PKR 48,200
              </span>
              <span className="text-[10px] text-[#565e74] block mt-1">Section 236A Active List</span>
            </div>
          </div>

          {/* CPR Challan Logs */}
          <div className="space-y-1.5">
            <span className="font-label-sm text-xs font-semibold text-[#0b1c30] block">
              Automated CPR Challan Electronic Receipts
            </span>
            <div className="border border-[#e5eeff] rounded-xl overflow-hidden text-xs">
              <div className="bg-[#eff4ff] p-2.5 font-mono text-[11px] text-[#565e74] flex justify-between">
                <span>CPR Number</span>
                <span>FBR IRIS Status</span>
                <span>Tax Challan Amount</span>
              </div>
              <div className="p-3 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                  <div>
                    <span className="font-bold text-[#0b1c30]">CPR-2024-GB-99021</span>
                    <span className="text-[#565e74] block text-[10px]">Stays &amp; 4×4 Fleet Batch #44</span>
                  </div>
                  <span className="text-[#00685f] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    E-Filed &amp; Validated
                  </span>
                  <span className="font-bold text-[#0b1c30]">PKR 819,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0b1c30]">CPR-2024-GB-99018</span>
                    <span className="text-[#565e74] block text-[10px]">Expeditions &amp; Alpine Batch #43</span>
                  </div>
                  <span className="text-[#00685f] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Bank Settled
                  </span>
                  <span className="font-bold text-[#0b1c30]">PKR 656,200</span>
                </div>
              </div>
            </div>
          </div>

          {downloaded && (
            <div className="p-2.5 rounded-lg bg-[#00685f]/15 text-[#00685f] text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              FBR monthly tax reconciliation batch CSV downloaded successfully.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#bfc7d2]/30 flex items-center justify-between">
          <span className="text-[11px] text-[#565e74]">
            NTN: 8192004-9 • Sales Tax Reg: 32778761-00
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFbrBatch}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#006194] text-white font-label-md text-xs hover:bg-[#007bb9] transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export FBR IRIS Batch (CSV)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#ffffff] text-[#565e74] hover:bg-[#eff4ff] border border-[#bfc7d2] font-label-md text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

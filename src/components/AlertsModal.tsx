import React from 'react';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewClawback: () => void;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  onViewClawback,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#213145]/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#bfc7d2]/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#eff4ff] flex items-center justify-between border-b border-[#bfc7d2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006194]/15 text-[#006194] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                Platform Escrow &amp; Weather Alerts
              </h3>
              <p className="font-body-sm text-xs text-[#565e74]">
                Active live radar &amp; transaction monitor (Gilgit-Baltistan)
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

        {/* List */}
        <div className="p-5 space-y-3">
          {/* Alert 1 */}
          <div className="p-3.5 rounded-xl bg-[#ffdad6]/30 border border-[#ba1a1a]/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ba1a1a]/15 text-[#ba1a1a] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                WEATHER PROTOCOL TRIGGERED
              </span>
              <span className="text-[10px] font-mono text-[#565e74]">Oct 13, 09:15 PKT</span>
            </div>
            <p className="font-label-md text-xs font-bold text-[#0b1c30]">
              Babusar Pass Snow Advisory Active (4,173m)
            </p>
            <p className="text-[11px] text-[#565e74]">
              NHA closed pass due to fresh blizzard. 1 affected transit booking (#GB-88102) was auto-refunded and platform 50% commission debited.
            </p>
            <button
              onClick={() => {
                onClose();
                onViewClawback();
              }}
              className="text-xs font-semibold text-[#ba1a1a] hover:underline inline-flex items-center gap-1 pt-1"
            >
              View Clawback Audit Voucher
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          {/* Alert 2 */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00685f]/15 text-[#00685f] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                SETTLEMENT BATCH OK
              </span>
              <span className="text-[10px] font-mono text-[#565e74]">Oct 14, 14:00 PKT</span>
            </div>
            <p className="font-label-md text-xs font-bold text-[#0b1c30]">
              Raast Instant P2M Batch Cleared (PKR 540,000)
            </p>
            <p className="text-[11px] text-[#565e74]">
              State Bank of Pakistan switch settled 12 partner disbursements to Meezan and HBL accounts.
            </p>
          </div>

          {/* Alert 3 */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#006194]/15 text-[#006194] flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                HIGH ESCROW LOCK
              </span>
              <span className="text-[10px] font-mono text-[#565e74]">Oct 14, 11:05 PKT</span>
            </div>
            <p className="font-label-md text-xs font-bold text-[#0b1c30]">
              K2 Base Camp Expedition: PKR 120,000 Escrow Active
            </p>
            <p className="text-[11px] text-[#565e74]">
              Booking #GB-89390 by Hamza Tariq. 12-day alpine trek in progress; auto-disburse set on check-out.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#bfc7d2]/30 flex items-center justify-between">
          <span className="text-[11px] text-[#565e74]">All systems operational</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#006194] text-white font-label-md text-xs hover:bg-[#007bb9] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

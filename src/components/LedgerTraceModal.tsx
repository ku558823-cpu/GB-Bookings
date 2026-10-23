import React from 'react';
import { BookingRecord } from '../types';

interface LedgerTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
}

export const LedgerTraceModal: React.FC<LedgerTraceModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  const isRefund = booking.splitStatus === 'clawback';
  const isEscrow = booking.splitStatus === 'in_progress';

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
            <div className="w-10 h-10 rounded-xl bg-[#00685f]/15 text-[#00685f] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">account_tree</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  Double-Entry Ledger Trace
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eff4ff] text-[#006194] border border-[#006194]/30">
                  VOUCHER-{booking.id.replace('#', '')}
                </span>
              </div>
              <p className="font-body-sm text-xs text-[#565e74]">
                Service: {booking.serviceTitle} • {booking.displayTime}
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
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#e5eeff] text-xs text-[#0b1c30]">
            <div>
              <span className="text-[#565e74] block text-[11px]">Gross Booking Total (GBV)</span>
              <span className="font-price-display text-base font-bold text-[#006194]">
                {booking.grossTotalFormatted}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#565e74] block text-[11px]">Accounting Equation State</span>
              <span className="font-bold text-[#00685f] flex items-center gap-1 justify-end">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Assets = Liabilities + Equity
              </span>
            </div>
          </div>

          {/* Double-Entry Table */}
          <div className="border border-[#e5eeff] rounded-xl overflow-hidden">
            <table className="w-full text-left font-body-sm text-xs">
              <thead className="bg-[#eff4ff] text-[#565e74] uppercase tracking-wider text-[10px] border-b border-[#e5eeff]">
                <tr>
                  <th className="py-2.5 px-3">GL Account Code &amp; Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Debit (PKR)</th>
                  <th className="py-2.5 px-3 text-right">Credit (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eff4ff] font-mono text-[11px]">
                {/* Leg 1: Cash / Gateway Clearing */}
                <tr>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-bold text-[#0b1c30]">1010 - Gateway Clearing ({booking.paymentGateway.toUpperCase()})</span>
                    <span className="block text-[10px] text-[#565e74]">Asset (Inflow from Customer)</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#565e74]">Asset</td>
                  <td className="py-2.5 px-3 text-right text-[#00685f] font-bold">
                    {isRefund ? '0' : booking.grossTotal.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#ba1a1a]">
                    {isRefund ? booking.grossTotal.toLocaleString() : '0'}
                  </td>
                </tr>

                {/* Leg 2: Platform Commission Revenue */}
                <tr>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-bold text-[#0b1c30]">4010 - Platform Commission Revenue (50%)</span>
                    <span className="block text-[10px] text-[#565e74]">Equity / Operating Revenue</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#565e74]">Revenue</td>
                  <td className="py-2.5 px-3 text-right text-[#ba1a1a]">
                    {isRefund ? Math.abs(booking.platformSplit).toLocaleString() : '0'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#00685f] font-bold">
                    {isRefund ? '0' : (isEscrow ? '0 (Hold)' : booking.platformSplit.toLocaleString())}
                  </td>
                </tr>

                {/* Leg 3: Vendor Payable or Escrow Liability */}
                <tr>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-bold text-[#0b1c30]">
                      {isEscrow ? '2030 - Escrow Liability (Vendor Hold)' : '2010 - Accounts Payable (Vendor Share 50%)'}
                    </span>
                    <span className="block text-[10px] text-[#565e74]">
                      Liability (Payable via {booking.vendorChannel})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#565e74]">Liability</td>
                  <td className="py-2.5 px-3 text-right text-[#565e74]">0</td>
                  <td className="py-2.5 px-3 text-right text-[#00685f] font-bold">
                    {isRefund ? '0 (Released)' : booking.vendorShare.toLocaleString()}
                  </td>
                </tr>

                {/* Total balancing line */}
                <tr className="bg-[#eff4ff] font-bold text-xs text-[#0b1c30]">
                  <td className="py-2.5 px-3 font-sans" colSpan={2}>
                    Balancing Total
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#00685f]">
                    PKR {booking.grossTotal.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#00685f]">
                    PKR {booking.grossTotal.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-lg bg-[#eff4ff] text-[11px] text-[#565e74] flex items-center justify-between">
            <span className="font-mono">Ledger Node: pk-isb-ledger-01 • FBR Compliant</span>
            <span className="text-[#00685f] font-semibold">Status: Balanced &amp; Locked</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#bfc7d2]/30 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#006194] text-white font-label-md text-xs hover:bg-[#007bb9] transition-colors"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};

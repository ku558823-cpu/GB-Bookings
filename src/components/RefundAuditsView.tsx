import React from 'react';
import { BookingRecord } from '../types';

interface RefundAuditsViewProps {
  bookings: BookingRecord[];
  onOpenClawbackModal: (booking: BookingRecord) => void;
  onInspectWebhook: (booking: BookingRecord) => void;
}

export const RefundAuditsView: React.FC<RefundAuditsViewProps> = ({
  bookings,
  onOpenClawbackModal,
  onInspectWebhook,
}) => {
  const refundedBookings = bookings.filter((b) => b.splitStatus === 'clawback');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#bfc7d2]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-xs text-[#ba1a1a] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            Automated Reversal &amp; Invalidation Ledger
          </span>
          <h2 className="font-headline-lg text-2xl font-bold text-[#0b1c30] mt-1">
            Refund &amp; Commission Clawback Audits
          </h2>
          <p className="font-body-sm text-xs text-[#565e74]">
            Karakoram Weather Protocol: 100% guest refund upon official road closures, with automatic platform 50% commission debit.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#ffdad6]/30 border border-[#ba1a1a]/20 text-right">
            <span className="block text-[11px] text-[#565e74]">Total Reversed Commissions</span>
            <span className="font-price-display text-lg font-bold text-[#ba1a1a]">
              - PKR 14,000
            </span>
          </div>
        </div>
      </div>

      {/* Protocol Banner */}
      <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006194]/15 text-[#006194] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
          </div>
          <div>
            <h4 className="font-headline-sm text-xs font-bold text-[#0b1c30]">
              Karakoram Weather Protocol Status: LIVE ACTIVE
            </h4>
            <p className="text-[11px] text-[#565e74]">
              Connected to Gilgit Airport CAA radar, Skardu met-station, and National Highway Authority (NHA) pass monitors.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#ffdad6] text-[#ba1a1a] shrink-0">
          Babusar Pass Snow Closure Active
        </span>
      </div>

      {/* Refunded Records Table */}
      <div className="bg-white rounded-xl border border-[#bfc7d2]/30 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#eff4ff]">
          <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
            Audited Clawback Records
          </h3>
          <p className="text-xs text-[#565e74]">
            Immutable balancing entries with SHA-256 cryptographic stamps
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-xs">
            <thead className="bg-[#eff4ff] text-[#565e74] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Affected Itinerary</th>
                <th className="py-3 px-4">Customer Refund</th>
                <th className="py-3 px-4">Platform Clawback</th>
                <th className="py-3 px-4">Vendor Status</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff4ff]">
              {refundedBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#006194]">
                    {b.id}
                    <span className="block text-[10px] text-[#565e74] font-normal">{b.displayTime}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#0b1c30] block">{b.serviceTitle}</span>
                    <span className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">warning</span>
                      {b.serviceSubtext}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#00685f] block">PKR {b.grossTotal.toLocaleString()}</span>
                    <span className="text-[10px] text-[#565e74]">100% Disbursed to {b.customerName}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#ba1a1a] block">- PKR {Math.abs(b.platformSplit).toLocaleString()}</span>
                    <span className="text-[10px] text-[#565e74]">Auto-debited from Platform GL</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#565e74] block">Released without penalty</span>
                    <span className="text-[10px] text-[#00685f]">Karakoram Guarantee Covered</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      Clawback Audited
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onInspectWebhook(b)}
                      className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#565e74] text-xs font-semibold"
                    >
                      Webhook
                    </button>
                    <button
                      onClick={() => onOpenClawbackModal(b)}
                      className="px-3 py-1 rounded bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      View Voucher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

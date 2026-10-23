import React, { useState } from 'react';
import { BookingRecord } from '../types';

interface EscrowLifecycleViewProps {
  bookings: BookingRecord[];
  onReleaseEscrow: (bookingId: string) => void;
  onInspectWebhook: (booking: BookingRecord) => void;
}

export const EscrowLifecycleView: React.FC<EscrowLifecycleViewProps> = ({
  bookings,
  onReleaseEscrow,
  onInspectWebhook,
}) => {
  const [filterRegion, setFilterRegion] = useState('');
  const escrowBookings = bookings.filter((b) => b.splitStatus === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#bfc7d2]/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006194]"></span>
            <span className="font-label-sm text-xs text-[#006194] font-bold uppercase tracking-wider">
              Escrow Vault Monitor
            </span>
          </div>
          <h2 className="font-headline-lg text-2xl font-bold text-[#0b1c30] mt-1">
            Active Escrow &amp; Karakoram Guarantee Pipeline
          </h2>
          <p className="font-body-sm text-xs text-[#565e74]">
            Funds held securely in State Bank of Pakistan clearing escrow until guest trip check-in verification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#eff4ff] border border-[#e5eeff] text-right">
            <span className="block text-[11px] text-[#565e74]">Total Locked Escrow</span>
            <span className="font-price-display text-lg font-bold text-[#006194]">
              PKR 380,000
            </span>
          </div>
        </div>
      </div>

      {/* Escrow Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#bfc7d2]/30 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#565e74]">
            <span className="font-bold text-[#006194]">Stage 1: Inflow</span>
            <span className="material-symbols-outlined text-[16px] text-[#006194]">account_balance</span>
          </div>
          <div className="mt-2">
            <span className="font-price-display text-xl font-bold text-[#0b1c30]">PKR 4,820,000</span>
            <span className="block text-[11px] text-[#00685f] mt-0.5">100% Guest deposit collected</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#bfc7d2]/30 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#565e74]">
            <span className="font-bold text-[#00685f]">Stage 2: Platform Split</span>
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">pie_chart</span>
          </div>
          <div className="mt-2">
            <span className="font-price-display text-xl font-bold text-[#00685f]">PKR 2,410,000</span>
            <span className="block text-[11px] text-[#565e74] mt-0.5">50% net platform commission</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#006194]/40 bg-[#eff4ff]/30 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#006194]">
            <span className="font-bold">Stage 3: Escrow Vault</span>
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
          </div>
          <div className="mt-2">
            <span className="font-price-display text-xl font-bold text-[#006194]">PKR 380,000</span>
            <span className="block text-[11px] text-[#006194] mt-0.5">Active trips in progress (32)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#bfc7d2]/30 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#565e74]">
            <span className="font-bold text-[#565e74]">Stage 4: Vendor Disbursed</span>
            <span className="material-symbols-outlined text-[16px] text-[#00685f]">verified</span>
          </div>
          <div className="mt-2">
            <span className="font-price-display text-xl font-bold text-[#0b1c30]">PKR 2,030,000</span>
            <span className="block text-[11px] text-[#00685f] mt-0.5">Settled to 1Link &amp; Raast IBANs</span>
          </div>
        </div>
      </div>

      {/* Escrow Items Table */}
      <div className="bg-white rounded-xl border border-[#bfc7d2]/30 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#eff4ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
              Pending &amp; In-Progress Escrow Holdings
            </h3>
            <p className="text-xs text-[#565e74]">
              High ticket treks and custom expeditions held under Karakoram weather verification
            </p>
          </div>
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] border border-[#bfc7d2]/40 focus:outline-none"
          >
            <option value="">All Regions</option>
            <option value="skardu">Skardu &amp; Baltistan</option>
            <option value="hunza">Hunza Valley</option>
            <option value="fairymeadows">Fairy Meadows</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-xs">
            <thead className="bg-[#eff4ff] text-[#565e74] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Service &amp; Itinerary</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total Fare</th>
                <th className="py-3 px-4">Locked Escrow (50%)</th>
                <th className="py-3 px-4">Verification State</th>
                <th className="py-3 px-4 text-right">Escrow Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eff4ff]">
              {escrowBookings.length > 0 ? (
                escrowBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#eff4ff]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#006194]">
                      {b.id}
                      <span className="block text-[10px] text-[#565e74] font-normal">{b.displayTime}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#0b1c30] block">{b.serviceTitle}</span>
                      <span className="text-[11px] text-[#565e74]">{b.serviceSubtext}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#0b1c30] block">{b.customerName}</span>
                      <span className="text-[10px] text-[#565e74] font-mono">{b.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 font-price-display font-bold text-[#0b1c30]">
                      {b.grossTotalFormatted}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#006194] block">PKR {b.vendorShare.toLocaleString()}</span>
                      <span className="text-[10px] text-[#565e74]">Guaranteed in Vault</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff4ff] text-[#006194] border border-[#006194]/20">
                        <span className="material-symbols-outlined text-[12px]">hourglass_top</span>
                        Awaiting Trip Completion
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onInspectWebhook(b)}
                        className="px-2.5 py-1 rounded bg-[#eff4ff] hover:bg-[#e5eeff] text-[#565e74] text-xs font-semibold transition-colors"
                      >
                        Webhook
                      </button>
                      <button
                        onClick={() => onReleaseEscrow(b.id)}
                        className="px-3 py-1 rounded bg-[#00685f] hover:bg-[#008378] text-white text-xs font-semibold shadow-sm transition-colors inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">lock_open</span>
                        Release Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#565e74]">
                    All escrow funds are currently disbursed. No active locked deposits.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

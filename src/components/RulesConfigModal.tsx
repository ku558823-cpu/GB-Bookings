import React, { useState } from 'react';
import { SplitPolicyConfig } from '../types';

interface RulesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SplitPolicyConfig;
  onSave: (newConfig: SplitPolicyConfig) => void;
}

export const RulesConfigModal: React.FC<RulesConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = useState<SplitPolicyConfig>({ ...config });
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 1200);
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
      <div className="bg-[#ffffff] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#bfc7d2]/30 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#eff4ff] flex items-center justify-between border-b border-[#bfc7d2]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#006194]/15 text-[#006194] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                Commission Engine &amp; Policy Rules
              </h3>
              <p className="font-body-sm text-xs text-[#565e74]">
                Enforced system-wide across Gilgit-Baltistan operations
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Split Ratio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-xs font-semibold text-[#0b1c30]">
                Platform Commission Split Ratio
              </label>
              <span className="px-2 py-0.5 rounded bg-[#00685f]/15 text-[#00685f] font-mono text-xs font-bold">
                {formData.platformCommissionPercent}% Platform / {100 - formData.platformCommissionPercent}% Vendor
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              step="5"
              value={formData.platformCommissionPercent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  platformCommissionPercent: Number(e.target.value),
                })
              }
              className="w-full accent-[#006194] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#565e74]">
              <span>20% (Low Platform)</span>
              <span className="font-semibold text-[#006194]">Standard 50/50 Peak Season</span>
              <span>70% (High Platform)</span>
            </div>
          </div>

          {/* Auto Disburse toggle */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] flex items-center justify-between border border-[#e5eeff]">
            <div>
              <span className="font-label-md text-xs font-bold text-[#0b1c30] block">
                Auto-Disburse on Trip Check-out
              </span>
              <span className="text-[11px] text-[#565e74]">
                Automatically release 50% vendor payout to 1Link/Raast upon confirmed guest check-out
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3 shrink-0">
              <input
                type="checkbox"
                checked={formData.autoDisburseOnCheckout}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autoDisburseOnCheckout: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#bfc7d2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00685f]"></div>
            </label>
          </div>

          {/* Idempotency Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-label-md text-xs font-semibold text-[#0b1c30]">
                Idempotency TTL Window
              </label>
              <select
                value={formData.idempotencyTtlMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idempotencyTtlMinutes: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-[#eff4ff] rounded-lg text-xs font-mono text-[#0b1c30] border border-[#bfc7d2]/40 focus:outline-none"
              >
                <option value={60}>60 Minutes (Fast Retries)</option>
                <option value={120}>120 Minutes (Standard)</option>
                <option value={240}>240 Minutes (Remote 4G)</option>
                <option value={1440}>24 Hours (Extreme Remote)</option>
              </select>
              <span className="text-[10px] text-[#565e74] block">
                Prevents duplicate 50% commission entries
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-label-md text-xs font-semibold text-[#0b1c30]">
                Weather Radar Sync Interval
              </label>
              <select
                value={formData.weatherRadarSyncIntervalSec}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weatherRadarSyncIntervalSec: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-[#eff4ff] rounded-lg text-xs font-mono text-[#0b1c30] border border-[#bfc7d2]/40 focus:outline-none"
              >
                <option value={30}>Every 30 Seconds (Live Real-Time)</option>
                <option value={60}>Every 60 Seconds (Recommended)</option>
                <option value={300}>Every 5 Minutes</option>
              </select>
              <span className="text-[10px] text-[#565e74] block">
                NHA &amp; Met-Office live radar prober
              </span>
            </div>
          </div>

          {/* Max Webhook Latency SLA */}
          <div className="space-y-1">
            <label className="font-label-md text-xs font-semibold text-[#0b1c30]">
              Max Webhook Latency SLA (ms)
            </label>
            <input
              type="number"
              min="100"
              max="2000"
              step="10"
              value={formData.maxPaymentHookLatencyMs}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxPaymentHookLatencyMs: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 bg-[#eff4ff] rounded-lg text-xs font-mono text-[#0b1c30] border border-[#bfc7d2]/40 focus:outline-none"
            />
            <span className="text-[10px] text-[#565e74]">
              Webhooks exceeding this threshold trigger automated redundancy fallback to Raast QR
            </span>
          </div>

          {savedNotification && (
            <div className="p-2.5 rounded-lg bg-[#00685f]/15 text-[#00685f] text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Engine rules updated successfully and applied to active ledger node.
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#ffffff] hover:bg-[#eff4ff] text-[#565e74] font-label-md text-xs border border-[#bfc7d2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white font-label-md text-xs shadow-sm transition-colors"
            >
              Save &amp; Enforce Policies
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

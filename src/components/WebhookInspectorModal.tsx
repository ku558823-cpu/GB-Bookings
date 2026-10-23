import React, { useState } from 'react';
import { BookingRecord } from '../types';

interface WebhookInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
}

export const WebhookInspectorModal: React.FC<WebhookInspectorModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [copied, setCopied] = useState(false);
  const [replayed, setReplayed] = useState(false);

  if (!isOpen || !booking) return null;

  const payload = booking.rawWebhookPayload || {
    booking_id: booking.id,
    gross: booking.grossTotal,
    platform_split: booking.platformSplit,
    vendor_split: booking.vendorShare,
    idempotency_key: booking.sha256Hash.replace('sha256:', ''),
    timestamp: booking.timestamp,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateReplay = () => {
    setReplayed(true);
    setTimeout(() => setReplayed(false), 3000);
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
              <span className="material-symbols-outlined text-[22px]">data_object</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  Webhook Ingestion Payload
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00685f]/15 text-[#00685f]">
                  200 OK • VERIFIED
                </span>
              </div>
              <p className="font-body-sm text-xs text-[#565e74]">
                Target: /api/v1/escrow/split-settle • ID: {booking.id}
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
          {/* Header Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#e5eeff]">
              <span className="block text-[10px] text-[#565e74] uppercase font-bold">Method</span>
              <span className="text-xs font-mono font-bold text-[#006194]">POST</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#e5eeff]">
              <span className="block text-[10px] text-[#565e74] uppercase font-bold">Protocol</span>
              <span className="text-xs font-mono font-bold text-[#0b1c30]">TLS 1.3 / HTTP2</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#e5eeff]">
              <span className="block text-[10px] text-[#565e74] uppercase font-bold">Latency</span>
              <span className="text-xs font-mono font-bold text-[#00685f]">182ms (SLA &lt;420ms)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#e5eeff]">
              <span className="block text-[10px] text-[#565e74] uppercase font-bold">Idempotency</span>
              <span className="text-xs font-mono font-bold text-[#00685f]">SHA-256 Match</span>
            </div>
          </div>

          {/* Cryptographic Idempotency Header */}
          <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#bfc7d2]/40 font-mono text-[11px] space-y-1">
            <div className="text-[#565e74] flex items-center justify-between">
              <span>X-Idempotency-Key:</span>
              <span className="text-[#006194] font-semibold">{booking.sha256Hash}</span>
            </div>
            <div className="text-[#565e74] flex items-center justify-between">
              <span>X-Gateway-Signature:</span>
              <span className="text-[#0b1c30]">hmac-sha256:88fa291040ea...c77</span>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <div className="flex items-center justify-between pb-1.5 text-xs text-[#565e74]">
              <span className="font-mono">JSON Body Payload:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-[#006194] hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#0b1c30] text-[#89f5e7] font-mono text-xs overflow-x-auto max-h-56 select-all leading-relaxed">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>

          {replayed && (
            <div className="p-3 rounded-lg bg-[#e5eeff] text-[#006194] text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[16px] text-[#00685f]">verified</span>
              <span>Replay check returned <strong>409 IDEMPOTENT_DUPLICATE_CACHED</strong>: Zero secondary commission debit occurred. Shield verified!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#bfc7d2]/30 flex items-center justify-between">
          <span className="text-[11px] text-[#565e74]">
            Evaluated by GB Anti-Double Booking Guard v4.2
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateReplay}
              disabled={replayed}
              className="px-3 py-1.5 rounded-lg bg-[#ffffff] hover:bg-[#e5eeff] text-[#006194] font-label-md text-xs border border-[#006194]/30 transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">replay</span>
              Test Idempotent Replay
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#006194] text-white font-label-md text-xs hover:bg-[#007bb9] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

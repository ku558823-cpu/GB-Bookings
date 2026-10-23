import React, { useState } from 'react';

interface PkrGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PkrGatewayModal: React.FC<PkrGatewayModalProps> = ({ isOpen, onClose }) => {
  const [testingPing, setTestingPing] = useState(false);
  const [pings, setPings] = useState({
    easypaisa: 142,
    jazzcash: 188,
    raast: 48,
    oneLink: 215,
  });

  if (!isOpen) return null;

  const handleTestLatency = () => {
    setTestingPing(true);
    setTimeout(() => {
      setPings({
        easypaisa: Math.floor(130 + Math.random() * 30),
        jazzcash: Math.floor(170 + Math.random() * 30),
        raast: Math.floor(40 + Math.random() * 20),
        oneLink: Math.floor(190 + Math.random() * 40),
      });
      setTestingPing(false);
    }, 800);
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
            <div className="w-10 h-10 rounded-xl bg-[#00685f]/15 text-[#00685f] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                Pakistani Payment Gateways
              </h3>
              <p className="font-body-sm text-xs text-[#565e74]">
                State Bank of Pakistan (SBP) switches &amp; mobile wallets uptime
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
        <div className="p-6 space-y-3">
          {/* Gateway 1: Raast */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006194] text-white font-bold flex items-center justify-center text-xs">
                RAAST
              </div>
              <div>
                <span className="font-label-md text-xs font-bold text-[#0b1c30] block">
                  Raast Instant QR (SBP P2M Switch)
                </span>
                <span className="text-[11px] text-[#565e74]">
                  Zero merchant interchange fee • Instant 24/7 bank settlement
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-[#00685f] font-bold block">
                {pings.raast}ms
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00685f]/15 text-[#00685f]">
                99.98% UP
              </span>
            </div>
          </div>

          {/* Gateway 2: Easypaisa */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#14A05B] text-white font-bold flex items-center justify-center text-xs">
                EP
              </div>
              <div>
                <span className="font-label-md text-xs font-bold text-[#0b1c30] block">
                  Easypaisa Direct API
                </span>
                <span className="text-[11px] text-[#565e74]">
                  Telenor Microfinance Bank • High mobile penetration in GB
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-[#00685f] font-bold block">
                {pings.easypaisa}ms
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00685f]/15 text-[#00685f]">
                OPERATIONAL
              </span>
            </div>
          </div>

          {/* Gateway 3: JazzCash */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E61C24] text-white font-bold flex items-center justify-center text-xs">
                JC
              </div>
              <div>
                <span className="font-label-md text-xs font-bold text-[#0b1c30] block">
                  JazzCash Direct Gateway
                </span>
                <span className="text-[11px] text-[#565e74]">
                  Mobilink Microfinance Bank • SMS &amp; Mobile PIN checkout
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-[#00685f] font-bold block">
                {pings.jazzcash}ms
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00685f]/15 text-[#00685f]">
                OPERATIONAL
              </span>
            </div>
          </div>

          {/* Gateway 4: 1Link */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#e5eeff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#006194] text-white font-bold flex items-center justify-center text-xs">
                1LINK
              </div>
              <div>
                <span className="font-label-md text-xs font-bold text-[#0b1c30] block">
                  1Link Card &amp; IBFT Switch
                </span>
                <span className="text-[11px] text-[#565e74]">
                  Visa / MasterCard / PayPak • Direct interbank vendor routing
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-[#00685f] font-bold block">
                {pings.oneLink}ms
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00685f]/15 text-[#00685f]">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#eff4ff] border-t border-[#bfc7d2]/30 flex items-center justify-between">
          <span className="text-[11px] text-[#565e74]">
            Settlement SLA: Same-Day Payout
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestLatency}
              disabled={testingPing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ffffff] text-[#006194] hover:bg-[#e5eeff] font-label-md text-xs border border-[#006194]/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] animate-spin" style={{ display: testingPing ? 'inline-block' : 'none' }}>
                sync
              </span>
              <span className="material-symbols-outlined text-[16px]" style={{ display: testingPing ? 'none' : 'inline-block' }}>
                network_ping
              </span>
              {testingPing ? 'Probing...' : 'Probe Live Latency'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#006194] text-white font-label-md text-xs hover:bg-[#007bb9] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

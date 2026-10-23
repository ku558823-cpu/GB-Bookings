import React, { useState } from 'react';
import { TRAVEL_VERTICALS } from '../data/mockData';

export const CommissionsSplitsView: React.FC = () => {
  const [testAmount, setTestAmount] = useState<number>(100000);
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [selectedVertical, setSelectedVertical] = useState('jeep');
  const [selectedGateway, setSelectedGateway] = useState('easypaisa');

  const platformShare = Math.round((testAmount * splitRatio) / 100);
  const vendorShare = testAmount - platformShare;
  const fbrTax = Math.round(testAmount * 0.01); // 1% Section 236A

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-[#bfc7d2]/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-label-sm text-xs text-[#00685f] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
            Mathematical Split Architecture
          </span>
          <h2 className="font-headline-lg text-2xl font-bold text-[#0b1c30] mt-1">
            Automated 50:50 Commission Engine
          </h2>
          <p className="font-body-sm text-xs text-[#565e74]">
            Real-time algorithmic split between platform maintenance, local guides, and transport operators.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#00685f]/15 text-[#00685f] font-label-md text-xs font-bold">
            Policy: Fixed 50% Autumn Season
          </span>
        </div>
      </div>

      {/* Interactive Simulator & Vertical Yield Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#bfc7d2]/30 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#eff4ff] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194]">calculate</span>
              <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                Commission Split Simulator
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#565e74]">SIMULATOR-NODE-01</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-label-md text-xs font-bold text-[#0b1c30] block mb-1">
                Gross Booking Value (PKR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#565e74]">PKR</span>
                <input
                  type="number"
                  min="5000"
                  max="1000000"
                  step="1000"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-2 bg-[#eff4ff] border border-[#bfc7d2]/40 rounded-lg text-sm font-price-display font-bold text-[#0b1c30] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-md text-xs font-bold text-[#0b1c30] block mb-1">
                  Service Category
                </label>
                <select
                  value={selectedVertical}
                  onChange={(e) => setSelectedVertical(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eff4ff] border border-[#bfc7d2]/40 rounded-lg text-xs font-semibold text-[#0b1c30] focus:outline-none"
                >
                  <option value="jeep">4×4 Jeeps &amp; Prado (Skardu/Hunza)</option>
                  <option value="stay">Stays &amp; Luxury Resorts (Serena/Shangrila)</option>
                  <option value="trek">K2 &amp; Alpine Treks (Baltoro/Concordia)</option>
                  <option value="experience">Cultural Camping &amp; Guides</option>
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs font-bold text-[#0b1c30] block mb-1">
                  Payment Switch
                </label>
                <select
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eff4ff] border border-[#bfc7d2]/40 rounded-lg text-xs font-semibold text-[#0b1c30] focus:outline-none"
                >
                  <option value="easypaisa">Easypaisa Direct API</option>
                  <option value="jazzcash">JazzCash Direct</option>
                  <option value="raast">Raast Instant QR</option>
                  <option value="card">1Link Card Gateway</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#0b1c30] mb-1">
                <span>Platform Commission Rate</span>
                <span className="text-[#006194]">{splitRatio}% Platform / {100 - splitRatio}% Vendor</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={splitRatio}
                onChange={(e) => setSplitRatio(Number(e.target.value))}
                className="w-full accent-[#006194] cursor-pointer"
              />
            </div>

            {/* Split Output Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#006194]/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#006194] block">
                  Platform Commission ({splitRatio}%)
                </span>
                <span className="font-price-display text-xl font-extrabold text-[#006194] block">
                  PKR {platformShare.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#565e74] block">
                  Retained for operations &amp; insurance
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#00685f]/20 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#00685f] block">
                  Vendor Partner Share ({100 - splitRatio}%)
                </span>
                <span className="font-price-display text-xl font-extrabold text-[#00685f] block">
                  PKR {vendorShare.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#565e74] block">
                  Instant disburse or check-in release
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#f8f9ff] border border-[#bfc7d2]/40 text-xs space-y-1 font-mono text-[11px] text-[#565e74]">
              <div className="flex justify-between">
                <span>Withholding Tax (1% Sec 236A):</span>
                <span className="text-[#ba1a1a] font-bold">PKR {fbrTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Net Disbursed to Vendor IBAN:</span>
                <span className="text-[#00685f] font-bold">PKR {(vendorShare - fbrTax).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Performance Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#bfc7d2]/30 shadow-sm space-y-4">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
              Vertical Revenue Distribution
            </h3>
            <p className="text-xs text-[#565e74]">Gilgit-Baltistan category margins</p>
          </div>

          <div className="space-y-3">
            {TRAVEL_VERTICALS.map((vert) => (
              <div key={vert.id} className="p-3 rounded-xl bg-[#eff4ff] border border-[#e5eeff] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#006194]">
                      {vert.icon}
                    </span>
                    <span className="font-label-md text-xs font-bold text-[#0b1c30]">
                      {vert.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#00685f]">
                    {vert.amountFormatted}
                  </span>
                </div>
                <div className="w-full bg-[#cbdbf5] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#006194] h-full rounded-full"
                    style={{ width: `${vert.volPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-[#565e74]">
                  <span>Volume: {vert.volPercent}% of portfolio</span>
                  <span>{vert.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  INITIAL_BOOKINGS,
  INITIAL_POLICY_CONFIG,
  INITIAL_WEBHOOK_LOGS,
  TOP_VENDORS,
  TRAVEL_VERTICALS,
} from './data/mockData';
import { BookingRecord, SplitPolicyConfig, WebhookLogItem } from './types';
import { RefundAuditModal } from './components/RefundAuditModal';
import { WebhookInspectorModal } from './components/WebhookInspectorModal';
import { LedgerTraceModal } from './components/LedgerTraceModal';
import { RulesConfigModal } from './components/RulesConfigModal';
import { FbrTaxModal } from './components/FbrTaxModal';
import { PkrGatewayModal } from './components/PkrGatewayModal';
import { AlertsModal } from './components/AlertsModal';
import { PublicMarketplaceView } from './components/PublicMarketplaceView';
import { EscrowLifecycleView } from './components/EscrowLifecycleView';
import { CommissionsSplitsView } from './components/CommissionsSplitsView';
import { VendorPayoutsView } from './components/VendorPayoutsView';
import { RefundAuditsView } from './components/RefundAuditsView';

export default function App() {
  // Navigation & View State
  const [activeNav, setActiveNav] = useState<
    'overview' | 'escrow' | 'commissions' | 'payouts' | 'refunds' | 'marketplace'
  >('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data State
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>(INITIAL_WEBHOOK_LOGS);
  const [policyConfig, setPolicyConfig] = useState<SplitPolicyConfig>(INITIAL_POLICY_CONFIG);
  const [weatherAlertActive, setWeatherAlertActive] = useState(true);

  // Ledger Filter State
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'escrow' | 'refunded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals State
  const [selectedBookingForWebhook, setSelectedBookingForWebhook] = useState<BookingRecord | null>(null);
  const [selectedBookingForLedger, setSelectedBookingForLedger] = useState<BookingRecord | null>(null);
  const [isClawbackModalOpen, setIsClawbackModalOpen] = useState(false);
  const [selectedClawbackBooking, setSelectedClawbackBooking] = useState<BookingRecord | null>(
    INITIAL_BOOKINGS.find((b) => b.id === '#GB-88102') || null
  );
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFbrModalOpen, setIsFbrModalOpen] = useState(false);
  const [isPkrGatewayModalOpen, setIsPkrGatewayModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Tab filter
      if (activeTab === 'confirmed' && booking.splitStatus !== 'confirmed') return false;
      if (activeTab === 'escrow' && booking.splitStatus !== 'in_progress') return false;
      if (activeTab === 'refunded' && booking.splitStatus !== 'clawback') return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = booking.id.toLowerCase().includes(query);
        const matchesCustomer = booking.customerName.toLowerCase().includes(query);
        const matchesService = booking.serviceTitle.toLowerCase().includes(query);
        const matchesSha = booking.sha256Hash.toLowerCase().includes(query);
        const matchesChannel = booking.vendorChannel.toLowerCase().includes(query);
        if (!matchesId && !matchesCustomer && !matchesService && !matchesSha && !matchesChannel) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion && booking.region !== selectedRegion) {
        return false;
      }

      // Gateway filter
      if (selectedGateway && booking.paymentGateway !== selectedGateway) {
        return false;
      }

      return true;
    });
  }, [bookings, activeTab, searchQuery, selectedRegion, selectedGateway]);

  // Tab count metrics
  const countAll = 1248 + (bookings.length - INITIAL_BOOKINGS.length);
  const countConfirmed = 1180 + bookings.filter((b) => b.splitStatus === 'confirmed').length - 4;
  const countEscrow = 32 + bookings.filter((b) => b.splitStatus === 'in_progress').length - 1;
  const countRefunded = 36;

  // Handlers
  const handleToggleAutoDisburse = () => {
    setPolicyConfig((prev) => ({
      ...prev,
      autoDisburseOnCheckout: !prev.autoDisburseOnCheckout,
    }));
  };

  const handleSimulateWeatherToggle = () => {
    setWeatherAlertActive((prev) => !prev);
  };

  const handleExportCsv = () => {
    const headers = 'Booking ID,Timestamp,Service Title,Customer,Gateway,Gross Total (PKR),Platform 50% (PKR),Vendor 50% (PKR),Split Status\n';
    const rows = filteredBookings
      .map(
        (b) =>
          `"${b.id}","${b.displayTime}","${b.serviceTitle}","${b.customerName}","${b.paymentGateway}",${b.grossTotal},${b.platformSplit},${b.vendorShare},"${b.splitStatusLabel}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GB-Bookings-Ledger-Export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNewBookingFromMarketplace = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Log new webhook
    const newWebhook: WebhookLogItem = {
      timestamp: new Date().toLocaleTimeString('en-PK', { hour12: false }) + ' PKT',
      method: 'POST',
      endpoint: '/api/v1/escrow/split-settle',
      statusCode: 200,
      payload: {
        booking_id: newBooking.id,
        gross: newBooking.grossTotal,
        platform_split: newBooking.platformSplit,
        vendor_split: newBooking.vendorShare,
        idempotency_key: newBooking.sha256Hash.replace('sha256:', ''),
      },
    };
    setWebhookLogs((prev) => [newWebhook, ...prev.slice(0, 4)]);
  };

  const handleReleaseEscrow = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            splitStatus: 'confirmed',
            splitStatusLabel: 'Confirmed Split',
            paidStatus: 'Paid in full',
            platformSplitType: 'credited',
            platformSplitRate: 'Auto-credited (50.0%)',
            vendorChannel: 'Raast Released Post-Checkin',
          };
        }
        return b;
      })
    );
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col font-body-md antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="h-20 w-full px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Brand Zone */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              type="button"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            <button
              onClick={() => setActiveNav('overview')}
              className="flex items-center gap-2.5 group text-left"
              type="button"
            >
              <div className="w-9 h-9 rounded-lg bg-[#006194] flex items-center justify-center text-white font-headline-md text-sm font-bold tracking-tighter shadow-xs">
                GB
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm font-bold text-slate-900 leading-none tracking-tight">
                  GB Bookings
                </span>
                <span className="font-label-sm text-[10px] text-slate-500 leading-tight tracking-wider uppercase mt-0.5">
                  Platform Admin Portal
                </span>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
              <span className="font-label-sm text-xs font-semibold text-[#00685f]">
                Escrow Split Engine Active
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setIsPkrGatewayModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#0b1c30] font-label-md text-xs hover:bg-[#eff4ff] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#565e74]">payments</span>
                <span>PKR Gateway</span>
              </button>

              <button
                onClick={() => setIsAlertsModalOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#0b1c30] font-label-md text-xs hover:bg-[#eff4ff] transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#565e74]">notifications</span>
                <span>Alerts</span>
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] absolute top-1.5 right-1.5"></span>
              </button>
            </div>

            <button
              onClick={() => setActiveNav(activeNav === 'marketplace' ? 'overview' : 'marketplace')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-label-md text-xs transition-colors shadow-sm ${
                activeNav === 'marketplace'
                  ? 'bg-[#006194] text-white hover:bg-[#007bb9]'
                  : 'bg-[#eff4ff] text-[#006194] hover:bg-[#dce9ff]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">travel_explore</span>
              <span>{activeNav === 'marketplace' ? 'Admin Portal' : 'Public Marketplace'}</span>
            </button>

            {/* Profile */}
            <div className="pl-2 border-l border-[#bfc7d2]/40 flex items-center gap-2.5">
              <img
                alt="Owner Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#006194]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLDQ71g-V9fnEyEuPEoUkxfrpQ8cnZF-bNCHAdZKXuAd4V-BPzezISmIgpEGNrDGwYddATKalPayycpf5iaG9gan2gLAkkOqg_QqBlFMHgSm6NFzaM5cxh4a2VsMBBA0g37zbOwJDi0IP2sbEvteHJ1xu3kcueZFCjUhMBg_KHWh-nZB0ONzDZYV8lYUzyL1bM-FJTOiMJuXJTOnaNPYvHPfFWWKXOMiK6ANt3IgIRl_dhEjfvw1hZ"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-label-md text-xs font-semibold text-[#0b1c30] leading-tight">
                  Super Admin
                </span>
                <span className="font-label-sm text-[10px] text-[#565e74] leading-none">
                  Owner / Finance
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex pt-20 flex-1 bg-white">
        {/* Left Sidebar */}
        <aside
          className={`fixed top-20 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col justify-between overflow-y-auto transition-transform lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-4">
            <div className="px-2 py-1">
              <span className="font-label-sm text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Commission Controls
              </span>
            </div>

            <nav className="flex flex-col gap-1 text-xs">
              <button
                onClick={() => {
                  setActiveNav('overview');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-label-md text-left ${
                  activeNav === 'overview'
                    ? 'bg-blue-50 text-[#006194] font-bold border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('escrow');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-label-md text-left ${
                  activeNav === 'escrow'
                    ? 'bg-blue-50 text-[#006194] font-bold border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                <span>Bookings &amp; Escrow</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('commissions');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-label-md text-left ${
                  activeNav === 'commissions'
                    ? 'bg-blue-50 text-[#006194] font-bold border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">percent</span>
                <span>Commissions &amp; Splits (50/50)</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('payouts');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-label-md text-left ${
                  activeNav === 'payouts'
                    ? 'bg-blue-50 text-[#006194] font-bold border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>Vendor Payouts</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('refunds');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors font-label-md text-left ${
                  activeNav === 'refunds'
                    ? 'bg-blue-50 text-[#006194] font-bold border border-blue-200/60 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">history_edu</span>
                <span>Refund Audits</span>
              </button>
            </nav>
          </div>

          {/* Retention Ratio Box */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="rounded-lg bg-white p-3 space-y-1 border border-slate-200 shadow-xs">
              <p className="font-label-sm text-xs text-slate-900 font-bold">Escrow Retention Ratio</p>
              <p className="font-body-sm text-[11px] text-slate-500">
                50% Advanced / 50% Post-Trip Payout Policy active.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="w-full lg:pl-64 min-h-[calc(100vh-80px)] bg-white">
          {activeNav === 'marketplace' ? (
            <PublicMarketplaceView
              onReturnToAdmin={() => setActiveNav('overview')}
              onNewBookingCreated={handleNewBookingFromMarketplace}
            />
          ) : (
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto w-full">
              {activeNav === 'escrow' && (
                <EscrowLifecycleView
                  bookings={bookings}
                  onReleaseEscrow={handleReleaseEscrow}
                  onInspectWebhook={(b) => setSelectedBookingForWebhook(b)}
                />
              )}

              {activeNav === 'commissions' && <CommissionsSplitsView />}

              {activeNav === 'payouts' && <VendorPayoutsView />}

              {activeNav === 'refunds' && (
                <RefundAuditsView
                  bookings={bookings}
                  onOpenClawbackModal={(b) => {
                    setSelectedClawbackBooking(b);
                    setIsClawbackModalOpen(true);
                  }}
                  onInspectWebhook={(b) => setSelectedBookingForWebhook(b)}
                />
              )}

              {activeNav === 'overview' && (
                <>
                  {/* Top Admin Header & Global Status */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#006194] font-label-sm text-xs font-semibold border border-blue-200/50">
                          <span className="material-symbols-outlined text-[14px]">shield</span>
                          GB Escrow Ledger v4.2
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#00685f] font-label-sm text-xs font-semibold border border-emerald-200/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00685f]"></span>
                          Automated 50:50 Commission Engine
                        </span>
                        <span className="text-slate-500 font-label-sm text-xs">
                          Peak Autumn Season (Gilgit-Baltistan)
                        </span>
                      </div>
                      <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Commission Engine &amp; Escrow Audit
                      </h1>
                      <p className="font-body-sm text-xs sm:text-sm text-slate-500">
                        Platform commission retention, anti-duplicate idempotent webhooks, and partner disbursement ledger.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        onClick={() => setIsRulesModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-label-md text-xs transition-colors shadow-xs border border-slate-200"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">tune</span>
                        Rules Config
                      </button>
                      <button
                        onClick={() => setIsFbrModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-label-md text-xs transition-colors shadow-xs border border-slate-200"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">receipt_long</span>
                        FBR Tax Reconciliation
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClawbackBooking(
                            bookings.find((b) => b.id === '#GB-88102') || bookings[0]
                          );
                          setIsClawbackModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006194] text-white font-label-md text-xs hover:bg-[#007bb9] transition-colors shadow-xs font-semibold"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">history_edu</span>
                        Clawback Audit Log
                      </button>
                    </div>
                  </div>

                  {/* Executive KPI Grid (50/50 Split Focus) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: GBV */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-60 group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-between relative">
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          Total Gross Bookings
                        </span>
                        <span className="material-symbols-outlined text-[#006194] text-[20px]">
                          account_balance_wallet
                        </span>
                      </div>
                      <div className="mt-4 relative">
                        <div className="font-price-display text-2xl font-extrabold text-slate-900">
                          PKR 4,820,000
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-label-sm text-xs text-[#00685f] flex items-center font-bold">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span> +24.8%
                          </span>
                          <span className="font-body-sm text-xs text-slate-500">vs last month</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 text-slate-500 font-label-sm text-xs flex justify-between">
                        <span>Settled Bookings</span>
                        <span className="font-semibold text-slate-900">1,180 txns</span>
                      </div>
                    </div>

                    {/* Card 2: Platform Commission */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-between relative">
                        <div className="flex items-center gap-1.5">
                          <span className="font-label-sm text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            Platform Revenue (50%)
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#00685f] text-white font-bold">
                            LOCKED 50%
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-[#00685f] text-[20px]">
                          verified
                        </span>
                      </div>
                      <div className="mt-4 relative">
                        <div className="font-price-display text-2xl font-extrabold text-[#00685f]">
                          PKR 2,410,000
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-label-sm text-xs text-[#00685f] flex items-center font-bold">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span> +18.4%
                          </span>
                          <span className="font-body-sm text-xs text-slate-500">Auto-credited post-settlement</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 text-slate-500 font-label-sm text-xs flex justify-between">
                        <span>Accrual Protocol</span>
                        <span className="font-semibold text-slate-900">Instant Net Split</span>
                      </div>
                    </div>

                    {/* Card 3: Vendor Payouts */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-100 rounded-full opacity-60 group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-between relative">
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          Partner Payouts (50%)
                        </span>
                        <span className="material-symbols-outlined text-slate-600 text-[20px]">
                          storefront
                        </span>
                      </div>
                      <div className="mt-4 relative">
                        <div className="font-price-display text-2xl font-extrabold text-slate-900">
                          PKR 2,410,000
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-body-sm text-xs text-slate-500">
                            PKR 1.84M Settled • PKR 570k In Transit
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 text-slate-500 font-label-sm text-xs flex justify-between">
                        <span>Channels</span>
                        <span className="font-semibold text-slate-900">1Link • Raast • HBL</span>
                      </div>
                    </div>

                    {/* Card 4: Escrow Hold */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                      <div className="flex items-center justify-between relative">
                        <span className="font-label-sm text-xs uppercase tracking-wider text-slate-500 font-semibold">
                          Escrow Hold Balance
                        </span>
                        <span className="material-symbols-outlined text-[#006194] text-[20px]">
                          lock_clock
                        </span>
                      </div>
                      <div className="mt-4 relative">
                        <div className="font-price-display text-2xl font-extrabold text-[#006194]">
                          PKR 380,000
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="font-body-sm text-xs text-slate-500">
                            Active trips awaiting check-out
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-100 text-slate-500 font-label-sm text-xs flex justify-between">
                        <span>Karakoram Guarantee</span>
                        <span className="font-semibold text-[#00685f]">100% Protected</span>
                      </div>
                    </div>
                  </div>

                  {/* Automated Split Engine Policies Banner */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#006194] text-white flex items-center justify-center font-bold shadow-xs">
                          <span className="material-symbols-outlined text-[18px]">
                            precision_manufacturing
                          </span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-base font-bold text-slate-900 leading-tight">
                            Automated Split Engine Policies
                          </h2>
                          <p className="font-body-sm text-xs text-slate-500">
                            Enforced system-wide across Stays, 4×4 Jeeps, Treks, and Alpine Guides
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-xs border border-slate-200">
                          <span className="font-label-sm text-xs text-slate-500">
                            Auto-Disburse on Check-out:
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={policyConfig.autoDisburseOnCheckout}
                              onChange={handleToggleAutoDisburse}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00685f]"></div>
                          </label>
                          <span className="font-label-sm text-xs font-bold text-[#00685f]">
                            {policyConfig.autoDisburseOnCheckout ? 'Enabled' : 'Manual'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Rule 1 */}
                      <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#006194]">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            <span className="font-label-sm text-[11px] font-bold uppercase">
                              Payment Trigger Rule
                            </span>
                          </div>
                          <p className="font-label-md text-sm text-slate-900 font-semibold">
                            Confirmed Settlement Hook
                          </p>
                          <p className="font-body-sm text-xs text-slate-500 leading-relaxed">
                            Commissions only debit &amp; credit into platform account after webhook confirmation from{' '}
                            <strong>Easypaisa, JazzCash, 1Link, or Raast QR</strong>. Pending orders remain non-accruing.
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-label-sm text-xs">
                          <span>Latency SLA: &lt; 420ms</span>
                          <span className="text-[#00685f] font-bold">Active Enforced</span>
                        </div>
                      </div>

                      {/* Rule 2 */}
                      <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#00685f]">
                            <span className="material-symbols-outlined text-[18px]">fingerprint</span>
                            <span className="font-label-sm text-[11px] font-bold uppercase">
                              Idempotency Shield
                            </span>
                          </div>
                          <p className="font-label-md text-sm text-slate-900 font-semibold">
                            SHA-256 Anti-Double Booking
                          </p>
                          <p className="font-body-sm text-xs text-slate-500 leading-relaxed">
                            High-frequency guest retries or repeated payment callbacks evaluate cryptographic idempotency headers. Prevents duplicate 50% commission entries on unstable mountain 4G connections.
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-label-sm text-xs">
                          <span>Zero Duplicates Logged</span>
                          <span className="text-[#00685f] font-bold">100% Match Rate</span>
                        </div>
                      </div>

                      {/* Rule 3 */}
                      <div className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#dc2626]">
                            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
                            <span className="font-label-sm text-[11px] font-bold uppercase">
                              Karakoram Weather Protocol
                            </span>
                          </div>
                          <p className="font-label-md text-sm text-slate-900 font-semibold">
                            Automated Clawback Engine
                          </p>
                          <p className="font-body-sm text-xs text-slate-500 leading-relaxed">
                            If Babusar Pass closes or Gilgit flight cancels, 100% is refunded to guest. The platform's 50% commission is <strong>auto-reversed and debited from the ledger</strong> simultaneously.
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 font-label-sm text-xs">
                          <span>Zero Vendor Penalty</span>
                          <span className="text-[#006194] font-bold">Immutable Audit Trail</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Analytics: Vertical Performance & Top Partners */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 50% Split by Vertical */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-headline-sm text-base font-bold text-slate-900">
                            Commission Yield by Travel Vertical
                          </h3>
                          <p className="font-body-sm text-xs text-slate-500">
                            Real-time 50% revenue distribution across Gilgit-Baltistan categories
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 text-[#006194] font-label-sm text-xs rounded-md font-bold border border-blue-200/50">
                          Oct 2024 Yield
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#006194] text-[20px]">
                              directions_car
                            </span>
                            <span className="font-label-sm text-xs text-slate-500">42% Vol</span>
                          </div>
                          <p className="font-label-md text-xs font-semibold text-slate-900 mt-2">
                            4×4 Jeeps &amp; Prado
                          </p>
                          <p className="font-headline-sm text-base font-bold text-[#00685f]">
                            PKR 1,012,200
                          </p>
                          <p className="font-label-sm text-[11px] text-slate-500">Platform 50% cut</p>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#006194] text-[20px]">
                              apartment
                            </span>
                            <span className="font-label-sm text-xs text-slate-500">31% Vol</span>
                          </div>
                          <p className="font-label-md text-xs font-semibold text-slate-900 mt-2">
                            Stays &amp; Resorts
                          </p>
                          <p className="font-headline-sm text-base font-bold text-[#00685f]">
                            PKR 747,100
                          </p>
                          <p className="font-label-sm text-[11px] text-slate-500">Platform 50% cut</p>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#006194] text-[20px]">
                              hiking
                            </span>
                            <span className="font-label-sm text-xs text-slate-500">19% Vol</span>
                          </div>
                          <p className="font-label-md text-xs font-semibold text-slate-900 mt-2">
                            K2 / Treks &amp; Guides
                          </p>
                          <p className="font-headline-sm text-base font-bold text-[#00685f]">
                            PKR 457,900
                          </p>
                          <p className="font-label-sm text-[11px] text-slate-500">High ticket size</p>
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="material-symbols-outlined text-[#006194] text-[20px]">
                              local_cafe
                            </span>
                            <span className="font-label-sm text-xs text-slate-500">8% Vol</span>
                          </div>
                          <p className="font-label-md text-xs font-semibold text-slate-900 mt-2">
                            Local Experiences
                          </p>
                          <p className="font-headline-sm text-base font-bold text-[#00685f]">
                            PKR 192,800
                          </p>
                          <p className="font-label-sm text-[11px] text-slate-500">Cultural &amp; Camping</p>
                        </div>
                      </div>

                      {/* Multi-Segment Ratio Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between font-label-sm text-xs text-slate-500">
                          <span>Portfolio Composition</span>
                          <span className="font-semibold text-slate-900">Total Earned: PKR 2,410,000</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                          <div className="h-full bg-[#006194]" style={{ width: '42%' }} title="4x4 Fleet (42%)"></div>
                          <div className="h-full bg-[#007bb9]" style={{ width: '31%' }} title="Stays (31%)"></div>
                          <div className="h-full bg-[#00685f]" style={{ width: '19%' }} title="Expeditions (19%)"></div>
                          <div className="h-full bg-slate-400" style={{ width: '8%' }} title="Experiences (8%)"></div>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap pt-1 text-xs">
                          <div className="flex items-center gap-1.5 font-label-sm text-slate-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#006194]"></span> 4×4 Fleet (PKR 1.01M)
                          </div>
                          <div className="flex items-center gap-1.5 font-label-sm text-slate-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#007bb9]"></span> Resorts &amp; Stays (PKR 747K)
                          </div>
                          <div className="flex items-center gap-1.5 font-label-sm text-slate-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#00685f]"></span> Treks &amp; Expeditions (PKR 457K)
                          </div>
                          <div className="flex items-center gap-1.5 font-label-sm text-slate-900">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Experiences (PKR 192K)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verified High-Volume Local Partners */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-headline-sm text-base font-bold text-slate-900">
                            Top Vendor Payouts
                          </h3>
                          <span className="text-[#00685f] font-label-sm text-xs font-bold">
                            50% Net Share
                          </span>
                        </div>
                        <p className="font-body-sm text-xs text-slate-500">
                          Verified Gilgit-Baltistan service operators
                        </p>

                        <div className="mt-3 space-y-2">
                          {TOP_VENDORS.map((vendor) => (
                            <div
                              key={vendor.id}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#006194] font-bold text-xs shrink-0 border border-blue-100">
                                  {vendor.initials}
                                </div>
                                <div className="truncate">
                                  <div className="flex items-center gap-1">
                                    <span className="font-label-md text-xs text-slate-900 truncate font-semibold">
                                      {vendor.name}
                                    </span>
                                    <span className="material-symbols-outlined text-[#006194] text-[14px]">
                                      verified
                                    </span>
                                  </div>
                                  <span className="font-label-sm text-[11px] text-slate-500">
                                    {vendor.location}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-label-md text-xs text-slate-900 font-bold">
                                  {vendor.amountFormatted}
                                </span>
                                <span className={`block font-label-sm text-[11px] ${vendor.status.includes('Escrow') ? 'text-slate-500' : 'text-[#00685f]'}`}>
                                  {vendor.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between border border-slate-200">
                          <span className="font-label-sm text-xs text-slate-500">
                            Partner Banking Network
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-label-sm text-[10px] font-bold border border-slate-200 shadow-2xs">
                              1Link
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-label-sm text-[10px] font-bold border border-slate-200 shadow-2xs">
                              Raast
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white text-slate-800 font-label-sm text-[10px] font-bold border border-slate-200 shadow-2xs">
                              Meezan
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Bookings & Commission Ledger Section */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    {/* Ledger Header & Filter Controls */}
                    <div className="p-6 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h2 className="font-headline-md text-xl font-bold text-slate-900">
                            Live Bookings &amp; Split Ledger
                          </h2>
                          <p className="font-body-sm text-xs text-slate-500">
                            Audit individual booking transactions, idempotent payloads, and escrow triggers.
                          </p>
                        </div>

                        {/* Tabs */}
                        <div className="inline-flex bg-slate-100 p-1 rounded-lg self-start lg:self-center border border-slate-200">
                          <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3.5 py-1.5 rounded-md font-label-md text-xs transition-all ${
                              activeTab === 'all'
                                ? 'bg-white shadow-xs text-slate-900 font-bold border border-slate-200'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            All Bookings ({countAll})
                          </button>
                          <button
                            onClick={() => setActiveTab('confirmed')}
                            className={`px-3.5 py-1.5 rounded-md font-label-md text-xs transition-all ${
                              activeTab === 'confirmed'
                                ? 'bg-white shadow-xs text-slate-900 font-bold border border-slate-200'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Confirmed &amp; Split ({countConfirmed})
                          </button>
                          <button
                            onClick={() => setActiveTab('escrow')}
                            className={`px-3.5 py-1.5 rounded-md font-label-md text-xs transition-all ${
                              activeTab === 'escrow'
                                ? 'bg-white shadow-xs text-slate-900 font-bold border border-slate-200'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Pending / Escrow ({countEscrow})
                          </button>
                          <button
                            onClick={() => setActiveTab('refunded')}
                            className={`px-3.5 py-1.5 rounded-md font-label-md text-xs transition-all ${
                              activeTab === 'refunded'
                                ? 'bg-white shadow-xs text-slate-900 font-bold border border-slate-200'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Refunded / Clawed ({countRefunded})
                          </button>
                        </div>
                      </div>

                      {/* Filter Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-4 relative">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
                            search
                          </span>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by ID (#GB-), Vendor, Customer or Raast Ref..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-slate-900 font-body-sm text-xs focus:outline-none focus:bg-white border border-slate-200 shadow-2xs"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-lg text-slate-900 font-body-sm text-xs focus:outline-none border border-slate-200"
                          >
                            <option value="">All Regions (Hunza, Skardu, Gilgit, Fairy Meadows)</option>
                            <option value="hunza">Hunza Valley &amp; Karimabad</option>
                            <option value="skardu">Skardu &amp; Baltistan</option>
                            <option value="gilgit">Gilgit City &amp; Bagrote</option>
                            <option value="fairymeadows">Fairy Meadows &amp; Raikot</option>
                            <option value="khunjerab">Khunjerab / Sost Border</option>
                          </select>
                        </div>

                        <div className="md:col-span-3">
                          <select
                            value={selectedGateway}
                            onChange={(e) => setSelectedGateway(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 rounded-lg text-slate-900 font-body-sm text-xs focus:outline-none border border-slate-200"
                          >
                            <option value="">Payment Gateway: All (Easypaisa, JazzCash, Raast)</option>
                            <option value="easypaisa">Easypaisa Mobile Account</option>
                            <option value="jazzcash">JazzCash Direct</option>
                            <option value="raast">Raast Instant QR</option>
                            <option value="card">1Link Card Gateway</option>
                          </select>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-end">
                          <button
                            onClick={handleExportCsv}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 font-label-md text-xs rounded-lg transition-colors border border-slate-200 shadow-2xs"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Export CSV
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* High-Density Data Table */}
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left font-body-sm text-xs text-slate-900">
                        <thead className="bg-slate-50 font-label-sm text-[11px] uppercase tracking-wider text-slate-500 border-y border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Booking ID &amp; Hash</th>
                            <th className="py-3 px-4">Service &amp; Vendor Details</th>
                            <th className="py-3 px-4">Customer &amp; Channel</th>
                            <th className="py-3 px-4">Gross Total</th>
                            <th className="py-3 px-4">Platform (50%)</th>
                            <th className="py-3 px-4">Vendor Share (50%)</th>
                            <th className="py-3 px-4">Split Status</th>
                            <th className="py-3 px-4 text-right">Ledger Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredBookings.length > 0 ? (
                            filteredBookings.map((row) => {
                              const isClawback = row.splitStatus === 'clawback';
                              const isInProgress = row.splitStatus === 'in_progress';

                              return (
                                <tr
                                  key={row.id}
                                  className={`hover:bg-slate-50 transition-colors ${
                                    isClawback
                                      ? 'bg-rose-50/50'
                                      : isInProgress
                                      ? 'bg-sky-50/40'
                                      : 'bg-white'
                                  }`}
                                >
                                  {/* Col 1 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <div className="font-headline-sm text-sm font-bold text-slate-900">
                                      {row.id}
                                    </div>
                                    <div className="text-[11px] text-slate-500">{row.displayTime}</div>
                                    <div className="inline-flex items-center gap-1 text-[10px] text-slate-600 mt-1 bg-slate-100 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                                      <span>{row.sha256Hash}</span>
                                      <span
                                        className={`material-symbols-outlined text-[12px] ${
                                          isClawback
                                            ? 'text-rose-600'
                                            : isInProgress
                                            ? 'text-sky-600'
                                            : 'text-emerald-600'
                                        }`}
                                      >
                                        {isClawback
                                          ? 'cancel'
                                          : isInProgress
                                          ? 'hourglass_top'
                                          : 'check_circle'}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Col 2 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <div className="font-label-md text-xs text-slate-900 font-semibold">
                                      {row.serviceTitle}
                                    </div>
                                    <div className="text-slate-500 text-[11px]">{row.serviceSubtext}</div>
                                    <div
                                      className={`flex items-center gap-1 text-[11px] mt-1 ${
                                        isClawback ? 'text-rose-600 font-medium' : 'text-sky-700'
                                      }`}
                                    >
                                      <span className="material-symbols-outlined text-[13px]">
                                        {isClawback ? 'warning' : 'location_on'}
                                      </span>
                                      {isClawback
                                        ? 'Karakoram Weather Protocol Triggered'
                                        : row.location}
                                    </div>
                                  </td>

                                  {/* Col 3 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <div className="font-label-md text-xs text-slate-900 font-medium">
                                      {row.customerName}
                                    </div>
                                    <div className="text-slate-500 text-[11px] font-mono">
                                      {row.customerPhone}
                                    </div>
                                    <div className="mt-1">
                                      {row.paymentGateway === 'easypaisa' && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                          {row.gatewayStatusText}
                                        </span>
                                      )}
                                      {row.paymentGateway === 'jazzcash' && (
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                            isClawback
                                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                              : 'bg-red-50 text-red-600 border border-red-200'
                                          }`}
                                        >
                                          <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              isClawback ? 'bg-rose-600' : 'bg-red-500'
                                            }`}
                                          ></span>
                                          {row.gatewayStatusText}
                                        </span>
                                      )}
                                      {row.paymentGateway === 'raast' && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 inline-flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                                          {row.gatewayStatusText}
                                        </span>
                                      )}
                                      {row.paymentGateway === 'card' && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 inline-flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                                          {row.gatewayStatusText}
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Col 4 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <div
                                      className={`font-price-display text-sm font-semibold text-slate-900 ${
                                        isClawback ? 'line-through text-slate-400' : ''
                                      }`}
                                    >
                                      {row.grossTotalFormatted}
                                    </div>
                                    <span
                                      className={`text-[11px] ${
                                        isClawback ? 'text-rose-600 font-bold' : 'text-slate-500'
                                      }`}
                                    >
                                      {row.paidStatus}
                                    </span>
                                  </td>

                                  {/* Col 5 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <div className="inline-flex flex-col">
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                                          isClawback
                                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                            : isInProgress
                                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        }`}
                                      >
                                        {row.platformSplitFormatted}
                                      </span>
                                      <span
                                        className={`text-[10px] mt-0.5 font-medium ${
                                          isClawback
                                            ? 'text-rose-600'
                                            : isInProgress
                                            ? 'text-sky-700'
                                            : 'text-emerald-700'
                                        }`}
                                      >
                                        {row.platformSplitRate}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Col 6 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <div
                                      className={`font-label-md text-xs font-semibold ${
                                        isClawback ? 'line-through text-slate-400' : 'text-slate-900'
                                      }`}
                                    >
                                      {row.vendorShareFormatted}
                                    </div>
                                    <span className="text-[11px] text-slate-500">{row.vendorChannel}</span>
                                  </td>

                                  {/* Col 7 */}
                                  <td className="py-3.5 px-4 align-top">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                        isClawback
                                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                          : isInProgress
                                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      }`}
                                    >
                                      <span className="material-symbols-outlined text-[14px]">
                                        {isClawback ? 'undo' : isInProgress ? 'lock' : 'done_all'}
                                      </span>
                                      {row.splitStatusLabel}
                                    </span>
                                  </td>

                                  {/* Col 8 */}
                                  <td className="py-3.5 px-4 align-top text-right space-x-1">
                                    {isClawback && (
                                      <button
                                        onClick={() => {
                                          setSelectedClawbackBooking(row);
                                          setIsClawbackModalOpen(true);
                                        }}
                                        className="p-1.5 hover:bg-rose-100 rounded text-rose-600 transition-colors"
                                        title="View Clawback Audit Voucher"
                                        type="button"
                                      >
                                        <span className="material-symbols-outlined text-[18px]">verified</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => setSelectedBookingForWebhook(row)}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                                      title="Inspect Webhook Payload"
                                      type="button"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">data_object</span>
                                    </button>

                                    <button
                                      onClick={() => setSelectedBookingForLedger(row)}
                                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                                      title="Double-Entry Ledger Trace"
                                      type="button"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">receipt</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-slate-500">
                                No booking transactions match the current query filters.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination & Ledger Summary Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-slate-600 font-body-sm text-xs">
                        Showing <span className="font-semibold text-slate-900">1 - {filteredBookings.length}</span> of{' '}
                        <span className="font-semibold text-slate-900">{countAll}</span> recorded bookings (PKR 4,820,000 Total GBV)
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className="px-2.5 py-1 rounded bg-white text-slate-600 hover:text-slate-900 font-label-sm shadow-xs border border-slate-300 disabled:opacity-50"
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className={`px-2.5 py-1 rounded font-label-sm font-semibold ${
                            currentPage === 1
                              ? 'bg-[#006194] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300'
                          }`}
                        >
                          1
                        </button>
                        <button
                          onClick={() => setCurrentPage(2)}
                          className={`px-2.5 py-1 rounded font-label-sm font-semibold ${
                            currentPage === 2
                              ? 'bg-[#006194] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300'
                          }`}
                        >
                          2
                        </button>
                        <button
                          onClick={() => setCurrentPage(3)}
                          className={`px-2.5 py-1 rounded font-label-sm font-semibold ${
                            currentPage === 3
                              ? 'bg-[#006194] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300'
                          }`}
                        >
                          3
                        </button>
                        <span className="px-1 text-slate-400">...</span>
                        <button
                          onClick={() => setCurrentPage(250)}
                          className={`px-2.5 py-1 rounded font-label-sm font-semibold ${
                            currentPage === 250
                              ? 'bg-[#006194] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-300'
                          }`}
                        >
                          250
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(250, currentPage + 1))}
                          className="px-2.5 py-1 rounded bg-white text-slate-600 hover:text-slate-900 font-label-sm shadow-xs border border-slate-300"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Idempotency & Webhook Resilience Technical Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Live Webhook Monitor */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="font-label-md text-xs text-slate-900 font-semibold">
                            Active Settlement Webhooks
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          PORT-443 TLS 1.3
                        </span>
                      </div>
                      <div className="font-mono text-[11px] bg-slate-950 p-3 rounded-lg text-slate-300 space-y-1.5 overflow-x-auto max-h-36 border border-slate-800">
                        {webhookLogs.map((log, index) => (
                          <div key={index} className="space-y-0.5">
                            <div className="text-emerald-400 font-semibold text-[11px]">
                              [{log.timestamp}] {log.method} {log.endpoint} → {log.statusCode} OK
                            </div>
                            <div className="text-slate-300 text-[10px] truncate">
                              {JSON.stringify(log.payload)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Karakoram Weather Guarantee Status */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#006194] text-[20px]">
                              cloudy_snowing
                            </span>
                            <span className="font-label-md text-xs text-slate-900 font-semibold">
                              Karakoram Mountain Weather Engine
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            LIVE RADAR SYNC
                          </span>
                        </div>
                        <p className="font-body-sm text-xs text-slate-600">
                          Continuous sync with Gilgit &amp; Skardu Airport met-offices and NHA (National Highway Authority) pass status. Automatic refund verification triggers when official closures are declared.
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Current Pass Alerts:</span>
                          <span
                            className={`font-semibold ${
                              weatherAlertActive ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {weatherAlertActive
                              ? 'Babusar Pass Snow Advisory Active'
                              : 'All Passes Clear & Operational'}
                          </span>
                        </div>
                        <button
                          onClick={handleSimulateWeatherToggle}
                          className="text-[11px] text-[#006194] hover:underline font-semibold"
                          type="button"
                        >
                          {weatherAlertActive ? 'Simulate All Clear' : 'Simulate Snow Closure'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals Container */}
      <RefundAuditModal
        isOpen={isClawbackModalOpen}
        onClose={() => setIsClawbackModalOpen(false)}
        detail={selectedClawbackBooking?.clawbackDetail || null}
      />

      <WebhookInspectorModal
        isOpen={Boolean(selectedBookingForWebhook)}
        onClose={() => setSelectedBookingForWebhook(null)}
        booking={selectedBookingForWebhook}
      />

      <LedgerTraceModal
        isOpen={Boolean(selectedBookingForLedger)}
        onClose={() => setSelectedBookingForLedger(null)}
        booking={selectedBookingForLedger}
      />

      <RulesConfigModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        config={policyConfig}
        onSave={(newCfg) => setPolicyConfig(newCfg)}
      />

      <FbrTaxModal isOpen={isFbrModalOpen} onClose={() => setIsFbrModalOpen(false)} />

      <PkrGatewayModal
        isOpen={isPkrGatewayModalOpen}
        onClose={() => setIsPkrGatewayModalOpen(false)}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        onViewClawback={() => {
          setSelectedClawbackBooking(
            bookings.find((b) => b.id === '#GB-88102') || bookings[0]
          );
          setIsClawbackModalOpen(true);
        }}
      />
    </div>
  );
}

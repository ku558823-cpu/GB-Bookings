import React, { useState } from 'react';
import { BookingRecord } from '../types';

interface PublicMarketplaceViewProps {
  onReturnToAdmin: () => void;
  onNewBookingCreated: (newBooking: BookingRecord) => void;
}

interface MarketplaceListing {
  id: string;
  title: string;
  category: 'stay' | 'jeep' | 'trek';
  categoryLabel: string;
  location: string;
  region: 'hunza' | 'skardu' | 'gilgit' | 'fairymeadows' | 'khunjerab';
  pricePkr: number;
  priceFormatted: string;
  duration: string;
  vendorName: string;
  vendorRating: number;
  imageUrl: string;
  features: string[];
}

const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'm1',
    title: 'Hunza Serena Inn - Heritage Executive Suite',
    category: 'stay',
    categoryLabel: 'Luxury Resort Stay',
    location: 'Karimabad, Hunza Valley',
    region: 'hunza',
    pricePkr: 111500,
    priceFormatted: 'PKR 111,500',
    duration: '3 Nights',
    vendorName: 'Hunza Serena Hospitality',
    vendorRating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    features: ['Mountain & Rakaposhi Views', 'Local Organic Breakfast', 'Central Heating', 'Cultural Guide'],
  },
  {
    id: 'm2',
    title: 'Custom Prado TZ 4×4 - Skardu & Deosai Plains Safari',
    category: 'jeep',
    categoryLabel: 'Off-Road 4×4 Transit',
    location: 'Skardu & Deosai National Park',
    region: 'skardu',
    pricePkr: 76000,
    priceFormatted: 'PKR 76,000',
    duration: '4 Days Transit',
    vendorName: 'Rehman Ali Fleet Services',
    vendorRating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    features: ['Veteran Mountain Driver', 'Spare Fuel & Oxygen Tank', 'High Ground Clearance', 'All Tolls Included'],
  },
  {
    id: 'm3',
    title: 'K2 Base Camp & Concordia Alpine Expedition',
    category: 'trek',
    categoryLabel: 'High-Altitude Expedition',
    location: 'Askole to Concordia (Baltoro Glacier)',
    region: 'skardu',
    pricePkr: 240000,
    priceFormatted: 'PKR 240,000',
    duration: '12 Days Trek',
    vendorName: 'Ghulam Raza Alpine Guides',
    vendorRating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    features: ['4 Licensed Porters', 'North Face Alpine Tents', 'Karakoram Guarantee Escrow', 'Satellite Comm Device'],
  },
  {
    id: 'm4',
    title: 'Fairy Meadows Alpine Cottages - Nanga Parbat Facing',
    category: 'stay',
    categoryLabel: 'Alpine Cabin & Stay',
    location: 'Raikot Valley, Fairy Meadows',
    region: 'fairymeadows',
    pricePkr: 45000,
    priceFormatted: 'PKR 45,000',
    duration: '2 Nights',
    vendorName: 'Fairy Meadows Hospitality',
    vendorRating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    features: ['Direct View of Killer Mountain', 'Wood Stove Fireplace', 'Jeep Transit from Raikot', 'Campfire & Stargazing'],
  },
];

export const PublicMarketplaceView: React.FC<PublicMarketplaceViewProps> = ({
  onReturnToAdmin,
  onNewBookingCreated,
}) => {
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('+92 3');
  const [selectedGateway, setSelectedGateway] = useState<'easypaisa' | 'jazzcash' | 'raast'>('easypaisa');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleBookNow = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setBookingSuccess(null);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const newBookingId = `#GB-${randomId}`;
    const half = Math.round(selectedListing.pricePkr / 2);

    const newBooking: BookingRecord = {
      id: newBookingId,
      timestamp: new Date().toISOString(),
      displayTime: 'Just Now • Live Checkout',
      sha256Hash: `sha256:${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 5)}`,
      serviceTitle: selectedListing.title,
      serviceCategory: selectedListing.category,
      serviceSubtext: `${selectedListing.categoryLabel} • ${selectedListing.duration}`,
      location: selectedListing.location,
      region: selectedListing.region,
      customerName: guestName.trim() || 'Guest Traveler',
      customerPhone: guestPhone,
      paymentGateway: selectedGateway,
      gatewayStatusText:
        selectedGateway === 'easypaisa'
          ? 'Easypaisa Settled'
          : selectedGateway === 'jazzcash'
          ? 'JazzCash Paid'
          : 'Raast QR Instant',
      grossTotal: selectedListing.pricePkr,
      grossTotalFormatted: selectedListing.priceFormatted,
      paidStatus: selectedListing.category === 'trek' ? 'Escrow Locked' : 'Paid in full',
      platformSplit: half,
      platformSplitFormatted: `+ PKR ${half.toLocaleString()}`,
      platformSplitType: selectedListing.category === 'trek' ? 'escrow' : 'credited',
      platformSplitRate:
        selectedListing.category === 'trek' ? 'On-Hold Escrow (50%)' : 'Auto-credited (50.0%)',
      vendorShare: half,
      vendorShareFormatted: `PKR ${half.toLocaleString()}`,
      vendorChannel: `${selectedListing.vendorName} Direct`,
      splitStatus: selectedListing.category === 'trek' ? 'in_progress' : 'confirmed',
      splitStatusLabel: selectedListing.category === 'trek' ? 'Trip in Progress' : 'Confirmed Split',
      rawWebhookPayload: {
        booking_id: newBookingId,
        gross: selectedListing.pricePkr,
        platform_split: half,
        vendor_split: half,
        idempotency_key: Math.random().toString(36).substring(2, 18),
        channel: `${selectedGateway.toUpperCase()}_API`,
      },
    };

    onNewBookingCreated(newBooking);
    setBookingSuccess(newBookingId);
  };

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen">
      {/* Top Banner Notice */}
      <div className="bg-[#006194] text-white px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-pulse"></span>
          <span>
            <strong>Traveler View:</strong> Gilgit-Baltistan Verified Marketplace. Every reservation automatically splits 50/50 via our Escrow Engine.
          </span>
        </div>
        <button
          onClick={onReturnToAdmin}
          className="px-3 py-1 bg-white text-[#006194] rounded-md font-semibold hover:bg-[#eff4ff] transition-colors"
        >
          ← Return to Admin Portal
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-[#e5eeff] text-[#006194] font-label-sm text-xs font-semibold uppercase tracking-wider">
            Gilgit-Baltistan Escrow Protected
          </span>
          <h1 className="font-headline-xl text-3xl sm:text-4xl font-extrabold text-[#0b1c30]">
            Expeditions, Stays &amp; 4×4 Jeeps
          </h1>
          <p className="text-sm text-[#565e74]">
            Backed by the Karakoram 100% Weather Guarantee. Instant booking with Easypaisa, JazzCash, &amp; Raast QR.
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MARKETPLACE_LISTINGS.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-[#bfc7d2]/40 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="h-44 w-full overflow-hidden relative bg-[#cbdbf5]">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#0b1c30]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                    {listing.categoryLabel}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#006194] px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[13px] text-amber-500">star</span>
                    {listing.vendorRating}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-[#006194] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {listing.location}
                  </span>
                  <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30] line-clamp-2">
                    {listing.title}
                  </h3>
                  <div className="space-y-1 pt-1">
                    {listing.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#565e74]">
                        <span className="material-symbols-outlined text-[13px] text-[#00685f]">check</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-[#eff4ff] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#565e74] block">All Inclusive</span>
                  <span className="font-price-display text-base font-extrabold text-[#0b1c30]">
                    {listing.priceFormatted}
                  </span>
                </div>
                <button
                  onClick={() => handleBookNow(listing)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-[#213145]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#bfc7d2]/30 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-[#eff4ff] flex items-center justify-between border-b border-[#bfc7d2]/30">
              <h3 className="font-headline-sm text-sm font-bold text-[#0b1c30]">
                Confirm Booking &amp; Escrow Deposit
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="w-7 h-7 rounded-lg bg-white text-[#565e74] hover:text-[#0b1c30] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#00685f]/15 text-[#00685f] mx-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                    Booking Confirmed: {bookingSuccess}
                  </h4>
                  <p className="text-xs text-[#565e74] mt-1">
                    Your reservation has been settled. 50% was debited to the platform and 50% allocated to vendor escrow!
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#e5eeff] text-xs font-mono text-[#006194]">
                  Split: PKR {(selectedListing.pricePkr / 2).toLocaleString()} Platform + PKR{' '}
                  {(selectedListing.pricePkr / 2).toLocaleString()} Vendor
                </div>
                <button
                  onClick={() => {
                    setSelectedListing(null);
                    onReturnToAdmin();
                  }}
                  className="w-full py-2 bg-[#006194] text-white rounded-lg text-xs font-bold hover:bg-[#007bb9]"
                >
                  View in Admin Portal Split Ledger →
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="p-5 space-y-3.5">
                <div className="p-3 rounded-lg bg-[#eff4ff] space-y-1">
                  <span className="font-bold text-xs text-[#0b1c30] block">{selectedListing.title}</span>
                  <div className="flex justify-between text-xs text-[#565e74]">
                    <span>Total Fare:</span>
                    <span className="font-bold text-[#006194]">{selectedListing.priceFormatted}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0b1c30]">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0b1c30]">Mobile Number (for SMS &amp; Webhook)</label>
                  <input
                    type="text"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#bfc7d2] rounded-lg text-xs focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#0b1c30]">Payment Gateway</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('easypaisa')}
                      className={`p-2 rounded-lg border text-center text-xs font-bold transition-all ${
                        selectedGateway === 'easypaisa'
                          ? 'border-[#14A05B] bg-[#14A05B]/10 text-[#14A05B]'
                          : 'border-[#bfc7d2]/40 bg-white text-[#565e74]'
                      }`}
                    >
                      Easypaisa
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('jazzcash')}
                      className={`p-2 rounded-lg border text-center text-xs font-bold transition-all ${
                        selectedGateway === 'jazzcash'
                          ? 'border-[#E61C24] bg-[#E61C24]/10 text-[#E61C24]'
                          : 'border-[#bfc7d2]/40 bg-white text-[#565e74]'
                      }`}
                    >
                      JazzCash
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('raast')}
                      className={`p-2 rounded-lg border text-center text-xs font-bold transition-all ${
                        selectedGateway === 'raast'
                          ? 'border-[#006194] bg-[#006194]/10 text-[#006194]'
                          : 'border-[#bfc7d2]/40 bg-white text-[#565e74]'
                      }`}
                    >
                      Raast QR
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#006194] hover:bg-[#007bb9] text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Pay {selectedListing.priceFormatted} &amp; Split
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

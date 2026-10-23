export interface BookingRecord {
  id: string;
  timestamp: string;
  displayTime: string;
  sha256Hash: string;
  serviceTitle: string;
  serviceCategory: 'jeep' | 'stay' | 'trek' | 'experience';
  serviceSubtext: string;
  location: string;
  region: 'hunza' | 'skardu' | 'gilgit' | 'fairymeadows' | 'khunjerab';
  customerName: string;
  customerPhone: string;
  paymentGateway: 'easypaisa' | 'jazzcash' | 'raast' | 'card';
  gatewayStatusText: string;
  grossTotal: number;
  grossTotalFormatted: string;
  paidStatus: string;
  platformSplit: number;
  platformSplitFormatted: string;
  platformSplitType: 'credited' | 'escrow' | 'reversed';
  platformSplitRate: string;
  vendorShare: number;
  vendorShareFormatted: string;
  vendorChannel: string;
  splitStatus: 'confirmed' | 'in_progress' | 'clawback';
  splitStatusLabel: string;
  weatherProtocolTriggered?: boolean;
  clawbackDetail?: ClawbackAuditDetail;
  rawWebhookPayload?: Record<string, unknown>;
}

export interface ClawbackAuditDetail {
  bookingId: string;
  cause: string;
  incidentRef: string;
  serviceTitle: string;
  description: string;
  guestLedger: {
    title: string;
    subtext: string;
    amount: string;
    txId: string;
  };
  platformLedger: {
    title: string;
    subtext: string;
    amount: string;
    note: string;
  };
  vendorLedger: {
    title: string;
    subtext: string;
    amount: string;
    note: string;
  };
  txHash: string;
  timestamp: string;
  status: string;
}

export interface TravelVertical {
  id: string;
  name: string;
  volPercent: number;
  amount: number;
  amountFormatted: string;
  tag: string;
  icon: string;
  barColor: string;
}

export interface TopVendor {
  id: string;
  initials: string;
  name: string;
  location: string;
  bookingCount: number;
  amount: number;
  amountFormatted: string;
  status: string;
  bank: string;
  verified: boolean;
}

export interface WebhookLogItem {
  timestamp: string;
  method: string;
  endpoint: string;
  statusCode: number;
  payload: {
    booking_id: string;
    gross: number;
    platform_split: number;
    vendor_split: number;
    idempotency_key: string;
  };
}

export interface SplitPolicyConfig {
  autoDisburseOnCheckout: boolean;
  platformCommissionPercent: number;
  idempotencyTtlMinutes: number;
  weatherRadarSyncIntervalSec: number;
  maxPaymentHookLatencyMs: number;
}

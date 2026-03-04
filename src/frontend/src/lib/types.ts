// ── SETE Domain Types ──────────────────────────────────────────────────────

export interface Offer {
  id: string;
  name: string;
  pieces: string;
  price: number; // EUR
  description: string;
  composition: string[];
  imageUrl: string;
  active: boolean;
  sortOrder: number;
}

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PAID"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELED";

export type DeliveryType = "DELIVERY" | "PICKUP";

export interface Order {
  id: string;
  offerId: string;
  offerName: string;
  pieces: string;
  price: number;
  deliveryType: DeliveryType;
  phone: string;
  address: string;
  time: string;
  note: string;
  status: OrderStatus;
  createdAt: string; // ISO
}

export interface WorkingHours {
  open: string; // "10:00"
  close: string; // "22:00"
  closed: boolean;
}

export interface Settings {
  pickupAddress: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  workingHours: {
    mon: WorkingHours;
    tue: WorkingHours;
    wed: WorkingHours;
    thu: WorkingHours;
    fri: WorkingHours;
    sat: WorkingHours;
    sun: WorkingHours;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  indexSite: boolean;
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeWebhookSecret: string;
  ga4MeasurementId: string;
}

export interface AdminAuth {
  passwordHash: string;
  sessionToken: string | null;
  sessionExpiry: number | null; // timestamp ms
  firstLogin: boolean;
}

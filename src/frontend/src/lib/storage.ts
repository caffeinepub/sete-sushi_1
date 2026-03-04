import type { AdminAuth, Offer, Order, OrderStatus, Settings } from "./types";

// ── Keys ──────────────────────────────────────────────────────────────────
const KEYS = {
  OFFERS: "sete_offers",
  ORDERS: "sete_orders",
  SETTINGS: "sete_settings",
  AUTH: "sete_admin_auth",
} as const;

// ── Default seed data ──────────────────────────────────────────────────────
const DEFAULT_OFFERS: Offer[] = [
  {
    id: "sete-01",
    name: "SETE 01",
    pieces: "48 gab.",
    price: 39,
    description:
      "Premium 48 gabalu sushi komplekts ar lasi, tunzivi, avokado un svaigiem dārzeņiem. Ideāli piemērots 2–4 personām.",
    composition: [
      "Laša nigiri × 8",
      "Tunzivju nigiri × 6",
      "Avokado maki × 8",
      "Lasis-gurķis maki × 8",
      "Fūzijas temaki × 4",
      "Krabja sashimi × 6",
      "Edamame & wasabi",
    ],
    imageUrl: "/assets/generated/sete-01-placeholder.dim_1200x800.jpg",
    active: true,
    sortOrder: 1,
  },
  {
    id: "sete-02",
    name: "SETE 02",
    pieces: "64 gab.",
    price: 52,
    description:
      "Lielais premium sushi komplekts 4–6 personām. Bagātīga izvēle ar eksotiskiem un klasiskiem garšu akcentiem.",
    composition: [
      "Laša nigiri × 10",
      "Tunzivju tataki nigiri × 8",
      "Garneles nigiri × 6",
      "Avokado-mango maki × 10",
      "Lasis-krēmsiers maki × 10",
      "Dragon roll × 6",
      "Sashimi assortment × 8",
      "Miso zupa × 2",
    ],
    imageUrl: "/assets/generated/sete-01-placeholder.dim_1200x800.jpg",
    active: true,
    sortOrder: 2,
  },
  {
    id: "sete-vege",
    name: "SETE Vege",
    pieces: "32 gab.",
    price: 27,
    description:
      "Veģetārais sushi komplekts 1–2 personām. Svaigi dārzeņi, avokado, gurķis un mango — elegants un gaišs.",
    composition: [
      "Avokado nigiri × 6",
      "Gurķa maki × 8",
      "Mango-salātu temaki × 4",
      "Dārzeņu hosomaki × 8",
      "Edamame",
      "Wasabi & ingvers",
    ],
    imageUrl: "/assets/generated/sete-01-placeholder.dim_1200x800.jpg",
    active: true,
    sortOrder: 3,
  },
];

const DEFAULT_SETTINGS: Settings = {
  pickupAddress: "Blaumaņa iela 34-2, Rīga",
  phone: "",
  whatsappNumber: "",
  email: "",
  workingHours: {
    mon: { open: "12:00", close: "22:00", closed: false },
    tue: { open: "12:00", close: "22:00", closed: false },
    wed: { open: "12:00", close: "22:00", closed: false },
    thu: { open: "12:00", close: "22:00", closed: false },
    fri: { open: "12:00", close: "23:00", closed: false },
    sat: { open: "12:00", close: "23:00", closed: false },
    sun: { open: "13:00", close: "21:00", closed: false },
  },
  seoTitle: "SETE — Premium Sushi Rīgā",
  seoDescription: "Premium sushi komplekti ar piegādi Rīgā. Pasūtī tiešsaistē.",
  seoKeywords: "sushi, sete, rīga, piegāde, premium",
  ogImageUrl: "/assets/generated/sete-01-placeholder.dim_1200x800.jpg",
  indexSite: true,
  stripeEnabled: false,
  stripePublicKey: "",
  stripeWebhookSecret: "",
  ga4MeasurementId: "",
};

const DEFAULT_AUTH: AdminAuth = {
  passwordHash: "1234", // plain text for MVP, forced change on first login
  sessionToken: null,
  sessionExpiry: null,
  firstLogin: true,
};

// ── Generic helpers ────────────────────────────────────────────────────────
function getItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(raw) as T;
  } catch {
    return defaultVal;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Offers ─────────────────────────────────────────────────────────────────
export function getOffers(): Offer[] {
  const stored = getItem<Offer[] | null>(KEYS.OFFERS, null);
  if (!stored) {
    setItem(KEYS.OFFERS, DEFAULT_OFFERS);
    return DEFAULT_OFFERS;
  }
  return stored;
}

export function saveOffers(offers: Offer[]): void {
  setItem(KEYS.OFFERS, offers);
}

export function getActiveOffers(): Offer[] {
  return getOffers()
    .filter((o) => o.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getOfferById(id: string): Offer | null {
  return getOffers().find((o) => o.id === id) ?? null;
}

export function addOffer(offer: Offer): void {
  const offers = getOffers();
  offers.push(offer);
  saveOffers(offers);
}

export function updateOffer(updated: Offer): void {
  const offers = getOffers().map((o) => (o.id === updated.id ? updated : o));
  saveOffers(offers);
}

export function deleteOffer(id: string): void {
  saveOffers(getOffers().filter((o) => o.id !== id));
}

// ── Orders ─────────────────────────────────────────────────────────────────
export function getOrders(): Order[] {
  return getItem<Order[]>(KEYS.ORDERS, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function saveOrders(orders: Order[]): void {
  setItem(KEYS.ORDERS, orders);
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, status } : o));
  saveOrders(orders);
}

export function getOrderById(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}

// ── Settings ───────────────────────────────────────────────────────────────
export function getSettings(): Settings {
  const stored = getItem<Settings | null>(KEYS.SETTINGS, null);
  if (!stored) {
    setItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  // Merge with defaults to handle new fields
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    workingHours: { ...DEFAULT_SETTINGS.workingHours, ...stored.workingHours },
  };
}

export function saveSettings(settings: Settings): void {
  setItem(KEYS.SETTINGS, settings);
}

// ── Admin Auth ─────────────────────────────────────────────────────────────
export function getAdminAuth(): AdminAuth {
  const stored = getItem<AdminAuth | null>(KEYS.AUTH, null);
  if (!stored) {
    setItem(KEYS.AUTH, DEFAULT_AUTH);
    return DEFAULT_AUTH;
  }
  return stored;
}

export function saveAdminAuth(auth: AdminAuth): void {
  setItem(KEYS.AUTH, auth);
}

export function adminLogin(password: string): {
  success: boolean;
  firstLogin: boolean;
} {
  const auth = getAdminAuth();
  if (auth.passwordHash !== password) {
    return { success: false, firstLogin: false };
  }
  // Generate session
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  saveAdminAuth({ ...auth, sessionToken: token, sessionExpiry: expiry });
  return { success: true, firstLogin: auth.firstLogin };
}

export function adminLogout(): void {
  const auth = getAdminAuth();
  saveAdminAuth({ ...auth, sessionToken: null, sessionExpiry: null });
}

export function isAdminAuthenticated(): boolean {
  const auth = getAdminAuth();
  if (!auth.sessionToken || !auth.sessionExpiry) return false;
  if (Date.now() > auth.sessionExpiry) {
    adminLogout();
    return false;
  }
  return true;
}

export function isFirstLogin(): boolean {
  return getAdminAuth().firstLogin;
}

export function changeAdminPassword(newPassword: string): void {
  const auth = getAdminAuth();
  saveAdminAuth({ ...auth, passwordHash: newPassword, firstLogin: false });
}

// ── WhatsApp ───────────────────────────────────────────────────────────────
export function generateWhatsAppLink(order: Order): string {
  const { whatsappNumber } = getSettings();
  if (!whatsappNumber) return "";

  const deliveryLabel =
    order.deliveryType === "DELIVERY" ? "Piegāde" : "Saņemt uz vietas";
  const addressLine =
    order.deliveryType === "DELIVERY" ? order.address : "Blaumaņa 34-2, Rīga";

  const msg = [
    "SETE pasūtījums:",
    `- Komplekts: ${order.offerName} (${order.pieces})`,
    `- Cena: ${order.price}€`,
    `- Saņemšana: ${deliveryLabel}`,
    `- Adrese: ${addressLine}`,
    `- Vēlamais laiks: ${order.time}`,
    `- Tālrunis: ${order.phone}`,
    order.note ? `- Komentārs: ${order.note}` : null,
    `- Pasūtījuma ID: ${order.id}`,
    "Paldies!",
  ]
    .filter(Boolean)
    .join("\n");

  const clean = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}

// ── Utility ────────────────────────────────────────────────────────────────
export function generateOrderId(): string {
  const prefix = "ST";
  const num = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${num}`;
}

export function generateTimeSlots(): string[] {
  const slots: string[] = ["Pēc iespējas ātrāk (ASAP)"];
  const now = new Date();
  const minutes = now.getMinutes();
  const next = 15 - (minutes % 15);
  now.setMinutes(now.getMinutes() + next);
  now.setSeconds(0);
  now.setMilliseconds(0);

  for (let i = 0; i < 12; i++) {
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    now.setMinutes(now.getMinutes() + 15);
  }
  return slots;
}

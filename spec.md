# SETE Sushi

## Current State

Full-stack sushi ordering SPA with:
- Hash-based router (Home, Offers, OfferDetail, Checkout, Success, Admin pages)
- localStorage storage adapter (offers, orders, settings, admin auth)
- Single-item checkout: user picks one offer → fills form → submits order
- Header with SETE logo + nav links (no cart)
- Seed data: 3 offers (SETE 01, SETE 02, SETE Vege)
- Order type: `{ id, offerId, offerName, pieces, price, deliveryType, phone, address, time, note, status, createdAt }`
- WhatsApp link generation after order submit
- Admin panel: offers CRUD, orders list with status update, settings

## Requested Changes (Diff)

### Add
- `CartContext` (React context) — holds `CartItem[]` with `{ offer: Offer, quantity: number }`, exposes `addToCart`, `removeFromCart`, `updateQty`, `clearCart`, `totalItems`, `totalPrice`
- Cart icon button in Header (top-right, desktop and mobile) showing item count badge when cart has items
- Cart drawer/sheet that slides in from right when cart icon is clicked: lists items with qty controls, subtotal, "Noformēt pasūtījumu" button → navigates to `/cart-checkout`
- `/cart-checkout` route in App.tsx — new `CartCheckout` page that uses cart items instead of a single offer
- Quantity selector on each product card in Offers page: `[-] N [+]` + "Pievienot grozam" button
- Sticky mobile cart bar (bottom, fixed): shown only when cart has items on mobile, shows "Jūsu pasūtījums • N preces • X€  [ SKATĪT GROZU ]"
- `CartCheckout` page: shows full cart summary (all items, quantities, subtotals, grand total) + same form fields (phone, delivery type, address, time, note, consent) + submit
- WhatsApp message updated to include all cart items
- New Order type: extend to support `items: CartOrderItem[]` where `CartOrderItem = { offerId, offerName, pieces, price, quantity }` alongside keeping backward compat single-offer fields
- `useCart` hook that reads from CartContext

### Modify
- `Header.tsx` — add cart icon (ShoppingCart from lucide) with gold badge showing item count; clicking opens cart drawer; accept `onCartOpen` prop or use context
- `Offers.tsx` / `OfferCard` — replace single "Pasūtīt" button with qty selector `[-] 1 [+]` + "Pievienot grozam" button; keep "Uzzināt vairāk" link
- `App.tsx` — wrap app in `CartProvider`; add `/cart-checkout` route; add `/cart` route alias
- `storage.ts` — update `generateWhatsAppLink` to accept multi-item orders; update `addOrder` to handle extended Order type
- `types.ts` — extend `Order` to include `items?: CartOrderItem[]`; add `CartOrderItem` type; add `CartItem` type
- Existing `Checkout.tsx` — keep working for direct `/checkout/:id` flow (single item); also pre-populate cart if arriving from OfferDetail

### Remove
- Nothing removed; existing single-item checkout remains functional as fallback

## Implementation Plan

1. Add `CartItem` and `CartOrderItem` to `types.ts`; extend `Order` with optional `items` field
2. Create `src/context/CartContext.tsx` with CartProvider and useCart hook
3. Update `storage.ts` → `generateWhatsAppLink` to handle multi-item orders
4. Update `Header.tsx` to consume cart context, show cart icon with count badge, open cart drawer
5. Create `CartDrawer` component (slides from right): item list with qty controls, total, CTA button
6. Update `OfferCard` in `Offers.tsx`: add qty state, `[-] N [+]` selector, "Pievienot grozam" button with toast feedback
7. Create `CartCheckout.tsx` page: cart summary table + existing form fields + submit logic
8. Add `CartMobileBar` component: sticky bottom bar on mobile when cart non-empty
9. Update `App.tsx`: wrap in CartProvider, add `/cart-checkout` and `/cart` routes
10. Typecheck and build validation

# SETE — Premium Sushi Ordering Platform

## Current State
New project. No existing code. Starting from blank Caffeine scaffold.

## Requested Changes (Diff)

### Add

**Backend (Motoko)**
- `Offer` entity: id (slug), name, pieces, price (EUR), description, composition (text[]), imageUrl, active (bool), sortOrder
- `Order` entity: id (auto), offerId, offerName, offerPieces, offerPrice, fulfillmentType (DELIVERY|PICKUP), address, desiredTime, phone, note, status (NEW|CONFIRMED|PAID|IN_PROGRESS|DONE|CANCELED), createdAt
- `Settings` entity (singleton): pickupAddress, phone, whatsappNumber, email, workingHours (per-day open/close), seoTitle, seoDescription, seoKeywords, ogImageUrl, indexSite (bool), stripeEnabled (bool), stripePublicKey, stripeWebhookSecret, ga4MeasurementId
- Admin auth: hashed password stored server-side, default `1234`, firstLoginFlag (forces password change), session token with 7-day expiry
- CRUD for Offers
- CRUD for Orders (status updates)
- Settings read/write
- Stripe: createCheckoutSession (server-side), webhook handler (verifies signature, sets order PAID)
- Seed: 1 active offer "SETE 01", 48 gab., 39€, placeholder image, default settings (Blaumaņa 34-2 Rīga, empty phone/whatsapp)

**Frontend (React + TypeScript)**
- SPA with hash router
- Routes:
  - `#/` Home
  - `#/offers` Piedāvājumi
  - `#/offer/:id` Detaļa
  - `#/checkout/:id` Checkout
  - `#/success` Paldies
  - `#/admin/login` Login
  - `#/admin` Dashboard
  - `#/admin/offers` Offers CRUD
  - `#/admin/orders` Orders list
  - `#/admin/settings` Settings
- Design system: dark suede luxury (CSS variables, noise texture, 3-layer background, gold hairline around images, NO overlay on product photos)
- Latvian UI only (all labels, copy, error messages)
- Admin: force redirect to password change page after first login
- Checkout: delivery/pickup toggle, address field (delivery only), time slots (ASAP + 15 min increments next 3h), phone, note, data consent checkbox
- WhatsApp deep link generation after order submit (Latvian message template)
- Stripe: full flow structure (createSession → redirect → webhook), disabled by default in settings
- SEO: meta tags in index.html, robots.txt, sitemap.xml stub, schema.org JSON-LD (LocalBusiness + Product per offer)
- Blob storage for offer images and OG image upload in admin

**Components**
- `SuedeBackground` — 3-layer textured background (radial gradient + suede gradient + noise overlay)
- `PremiumCard` — glass+suede card with gold hairline border around image area
- `GoldButton` — CTA button in gold accent
- `ImageFrame` — image container with gold hairline, no overlay on image itself
- `Header` / `Footer` — minimal luxury nav

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan

1. Select components: `authorization`, `blob-storage`, `stripe`
2. Generate Motoko backend with all entities, auth, CRUD, Stripe, seed data
3. Build frontend:
   a. CSS design system (variables, noise texture, suede background)
   b. Layout components (Header, Footer, SuedeBackground)
   c. UI primitives (PremiumCard, GoldButton, ImageFrame)
   d. Public pages: Home, Offers, OfferDetail, Checkout, Success
   e. Admin pages: Login (with force-change logic), Dashboard, OffersAdmin, OrdersAdmin, Settings
   f. WhatsApp link generator lib
   g. Stripe client redirect lib
   h. SEO: robots.txt, sitemap.xml, JSON-LD components
4. Wire backend bindings to frontend
5. Validate (typecheck, lint, build)
6. Deploy

# SETE Sushi

## Current State

Existing SPA with:
- Home page with hero section containing "Michelin līmeņa sushi." text
- Offers page with product cards (grid layout)
- OfferDetail page
- Checkout page with delivery/pickup logic, phone validation, time slots
- Success page with basic confirmation text
- Admin panel: AdminOrders (with status filter + modal), AdminOffers, AdminSettings, AdminDashboard, AdminLogin, AdminChangePassword
- Footer with working hours, address, phone
- localStorage-based storage with full CRUD for offers, orders, settings, auth
- OrderStatus type: NEW | CONFIRMED | PAID | IN_PROGRESS | DONE | CANCELED
- generateOrderId() uses Math.random() — not cryptographically unique
- Hero is a two-column layout (text + image), no fullscreen background
- Product cards show image, pieces label, name, price, description, two buttons
- No sticky mobile order bar
- No duplicate submission prevention on checkout

## Requested Changes (Diff)

### Add
- Hero fullscreen background image (`/assets/generated/sete-hero-bg.dim_1920x1080.jpg`) with subtle dark gradient overlay
- Second CTA button "SKATĪT KOMPLEKTUS" on hero (alongside "PASŪTĪT SUSHI")
- "Populārākais" badge on product cards (show on first/featured card)
- Sticky mobile order bar on OfferDetail / Checkout pages showing offer name + price + "PASŪTĪT" button
- `smooth-scroll` behavior on `html` element via CSS
- Hover glow effect on gold buttons
- Card hover animation (lift + subtle gold border brighten)
- Duplicate submission prevention flag in Checkout (disable submit button after click until navigation)
- Unique order ID using timestamp + random combo (e.g. `ST-${Date.now().toString(36).toUpperCase()}-${random4}`)
- Order statuses updated to: NEW | CONFIRMED | PREPARING | READY | COMPLETED (keep PAID, IN_PROGRESS, DONE, CANCELED as aliases or replace in admin display)

### Modify
- **Home hero**: Remove "Michelin līmeņa sushi." line; replace sub-headline with "Premium sushi komplekti Rīgā." and tagline "Pasūti tiešsaistē — saņem uz vietas vai ar piegādi."; rename CTA from "Apskatīt piedāvājumus" to "PASŪTĪT SUSHI"; add second button "SKATĪT KOMPLEKTUS" linking to /offers; hero becomes full-screen with background image
- **Checkout labels**: "Saņemšanas veids" label already present but options text: PICKUP option → "Saņemt uz vietas — Blaumaņa iela 34-2, Rīga"; DELIVERY option → "Piegāde uz adresi"; time label "VĒLAMAIS LAIKS"; comment label "KOMENTĀRS (neobligāts)"; comment placeholder "Īpaši vēlējumi vai piegādes instrukcijas"; time slot first option label → "ASAP"; subsequent slots → "Izvēlēties laiku: HH:MM" format
- **Success page**: Main heading → "Paldies par pasūtījumu!"; body text → "Mēs ar jums sazināsimies tuvāko minūšu laikā, lai apstiprinātu pasūtījumu."; back button label → "ATGRIEZTIES UZ SĀKUMU"
- **Product cards**: Price font size larger (2rem+); add hover animation (translateY(-4px) + box-shadow lift); show "Populārākais" gold badge on first card (sortOrder=1 or index=0)
- **Admin orders**: Update STATUS_LABELS to include PREPARING → "Gatavo", READY → "Gatavs", COMPLETED → "Pabeigts"; keep existing statuses, add new ones to the type and labels map; admin order list shows: order ID, time (createdAt formatted), phone, order type (Piegāde/Saņemt uz vietas), status
- **generateOrderId**: Use timestamp-based unique ID for better uniqueness
- **Footer brand tagline**: "Premium sushi Rīgā" (already close, minor cleanup)
- **Product images**: Ensure `loading="lazy"` on all offer/card images; hero background uses CSS background-image for performance

### Remove
- The text "Michelin līmeņa sushi." from Home hero
- The old single-column hero text layout (replace with fullscreen background hero)

## Implementation Plan

1. **index.css / global styles**: Add `html { scroll-behavior: smooth; }`. Add button hover glow keyframe. Add card hover animation classes.

2. **Home.tsx**: Replace hero section with fullscreen background image hero using `sete-hero-bg.dim_1920x1080.jpg`. Remove "Michelin līmeņa sushi." text. Update copy. Add two CTA buttons (PASŪTĪT SUSHI → /offers, SKATĪT KOMPLEKTUS → /offers).

3. **Offers.tsx / OfferCard**: Add hover animation (whileHover in framer-motion). Enlarge price. Add "Populārākais" badge on index=0 card. Ensure lazy loading on images.

4. **Checkout.tsx**: Update delivery option labels. Update time label and comment label/placeholder. Add duplicate submission guard (ref/flag). Update first time slot label from "Pēc iespējas ātrāk (ASAP)" display. Prevent double submit.

5. **Success.tsx**: Update heading, body text, button label.

6. **AdminOrders.tsx**: Update STATUS_LABELS to add PREPARING/READY/COMPLETED. Ensure order list columns show ID, time, phone, type, status clearly.

7. **lib/types.ts**: Add PREPARING | READY | COMPLETED to OrderStatus union. Keep existing ones.

8. **lib/storage.ts**: Update generateOrderId to use timestamp+random for better uniqueness. Update STATUS display maps.

9. **OfferDetail.tsx + Checkout.tsx**: Add sticky mobile order bar (fixed bottom bar on mobile showing offer name, price, and order button).

10. **Global CSS**: Button hover glow (box-shadow pulse on gold buttons), card hover lift.

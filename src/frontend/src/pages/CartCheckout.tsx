import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { useCart } from "../context/CartContext";
import { useAddOrder } from "../hooks/useQueries";
import {
  generateOrderId,
  generateTimeSlots,
  generateWhatsAppLink,
} from "../lib/storage";
import type { Order } from "../lib/types";

interface CartCheckoutProps {
  onNavigate: (path: string, state?: Record<string, string>) => void;
}

function BackButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-xs mb-10"
      style={{
        color: hovered ? "#C7A35A" : "rgba(243,240,230,0.4)",
        letterSpacing: "0.1em",
        transition: "color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ArrowLeft size={14} />
      Atpakaļ
    </button>
  );
}

export function CartCheckout({ onNavigate }: CartCheckoutProps) {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const addOrder = useAddOrder();
  const timeSlots = generateTimeSlots();

  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"DELIVERY" | "PICKUP">(
    "PICKUP",
  );
  const [address, setAddress] = useState("");
  const [time, setTime] = useState(timeSlots[0]);
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  // Redirect to /offers if cart is empty on mount
  useEffect(() => {
    if (totalItems === 0) {
      onNavigate("/offers");
    }
  }, [totalItems, onNavigate]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!phone.trim()) errs.phone = "Tālrunis ir obligāts";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(phone.trim()))
      errs.phone = "Ievadiet derīgu tālruņa numuru";
    if (deliveryType === "DELIVERY" && !address.trim())
      errs.address = "Adrese ir obligāta piegādei";
    if (!consent) errs.consent = "Jāpiekrīt datu apstrādes noteikumiem";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedRef.current) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (items.length === 0) return;

    submittedRef.current = true;
    setSubmitting(true);
    try {
      const orderId = generateOrderId();
      const order: Order = {
        id: orderId,
        offerId: items[0].offer.id,
        offerName: items.map((i) => i.offer.name).join(", "),
        pieces: items.map((i) => `${i.offer.pieces} ×${i.quantity}`).join(", "),
        price: totalPrice,
        deliveryType,
        phone: phone.trim(),
        address:
          deliveryType === "DELIVERY"
            ? address.trim()
            : "Blaumaņa iela 34-2, Rīga",
        time,
        note: note.trim(),
        status: "NEW",
        createdAt: new Date().toISOString(),
        items: items.map((i) => ({
          offerId: i.offer.id,
          offerName: i.offer.name,
          pieces: i.offer.pieces,
          price: i.offer.price,
          quantity: i.quantity,
        })),
      };

      await addOrder.mutateAsync(order);

      // WhatsApp
      const waLink = generateWhatsAppLink(order);
      if (waLink) {
        window.open(waLink, "_blank", "noopener,noreferrer");
      }

      clearCart();
      onNavigate("/success", { orderId });
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-sm text-sm bg-transparent transition-all duration-200 focus:outline-none";
  const inputStyle = {
    background: "rgba(11,11,13,0.8)",
    border: "1px solid rgba(199,163,90,0.2)",
    color: "#F3F0E6",
    fontSize: "16px",
  };
  const inputFocusStyle = {
    borderColor: "rgba(199,163,90,0.5)",
    boxShadow: "0 0 0 2px rgba(199,163,90,0.1)",
  };

  if (totalItems === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="cart_checkout.empty_state"
      >
        <p style={{ color: "rgba(243,240,230,0.4)" }}>Grozs ir tukšs…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header currentHash="/cart-checkout" />

      <div className="pt-28 pb-28 md:pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <BackButton onClick={() => onNavigate("/offers")} />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="gold-label mb-4">Noformēt pasūtījumu</p>
            <h1
              className="font-serif mb-8"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              }}
            >
              Pasūtījums
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Order summary box */}
            <div
              className="rounded-sm p-5 mb-8"
              style={{
                background: "rgba(199,163,90,0.05)",
                border: "1px solid rgba(199,163,90,0.2)",
              }}
            >
              <p className="gold-label mb-4">Pasūtījuma kopsavilkums</p>
              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li
                    key={item.offer.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 flex-shrink-0 overflow-hidden"
                        style={{
                          border: "1px solid rgba(199,163,90,0.2)",
                          borderRadius: "2px",
                        }}
                      >
                        <img
                          src={item.offer.imageUrl}
                          alt={item.offer.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <div
                          className="font-serif text-sm truncate"
                          style={{ color: "#F3F0E6" }}
                        >
                          {item.offer.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "rgba(243,240,230,0.4)" }}
                        >
                          {item.offer.pieces} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div
                      className="font-serif text-base flex-shrink-0"
                      style={{ color: "#C7A35A" }}
                    >
                      {item.offer.price * item.quantity}€
                    </div>
                  </li>
                ))}
              </ul>

              <hr
                className="gold-divider my-4"
                style={{ borderColor: "rgba(199,163,90,0.15)" }}
              />

              {/* Total */}
              <div className="flex items-baseline justify-between">
                <span
                  className="text-xs uppercase"
                  style={{
                    color: "rgba(243,240,230,0.5)",
                    letterSpacing: "0.14em",
                  }}
                >
                  Kopā
                </span>
                <span
                  className="font-serif"
                  style={{
                    color: "#C7A35A",
                    fontSize: "clamp(1.4rem, 3vw, 1.8rem)",
                  }}
                >
                  {totalPrice}€
                </span>
              </div>
            </div>

            {/* Form */}
            <form
              id="cart-checkout-form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              {/* Phone */}
              <div>
                <label className="gold-label block mb-2" htmlFor="cc-phone">
                  Tālrunis *
                </label>
                <input
                  id="cc-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+371 2X XXX XXX"
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, inputFocusStyle)
                  }
                  onBlur={(e) =>
                    Object.assign(e.currentTarget.style, {
                      borderColor: "rgba(199,163,90,0.2)",
                      boxShadow: "none",
                    })
                  }
                  data-ocid="cart_checkout.phone_input"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "#fca5a5" }}
                    data-ocid="cart_checkout.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Delivery type */}
              <div>
                <p className="gold-label mb-3">Saņemšanas veids *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        value: "PICKUP",
                        label: "Saņemt uz vietas",
                        sub: "Blaumaņa iela 34-2, Rīga",
                      },
                      {
                        value: "DELIVERY",
                        label: "Piegāde uz adresi",
                        sub: "Piegāde uz jūsu adresi",
                      },
                    ] as const
                  ).map(({ value, label, sub }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDeliveryType(value)}
                      className="text-left px-4 py-4 rounded-sm transition-all duration-200"
                      style={{
                        background:
                          deliveryType === value
                            ? "rgba(199,163,90,0.1)"
                            : "rgba(11,11,13,0.8)",
                        border:
                          deliveryType === value
                            ? "1px solid rgba(199,163,90,0.5)"
                            : "1px solid rgba(199,163,90,0.15)",
                      }}
                      data-ocid={
                        value === "PICKUP"
                          ? "cart_checkout.pickup_radio"
                          : "cart_checkout.delivery_radio"
                      }
                    >
                      <div
                        className="text-sm font-medium mb-0.5"
                        style={{
                          color: deliveryType === value ? "#C7A35A" : "#F3F0E6",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "rgba(243,240,230,0.4)" }}
                      >
                        {sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              {deliveryType === "DELIVERY" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="gold-label block mb-2" htmlFor="cc-address">
                    Piegādes adrese *
                  </label>
                  <input
                    id="cc-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Iela, māja, dzīvoklis, pilsēta"
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) =>
                      Object.assign(e.currentTarget.style, inputFocusStyle)
                    }
                    onBlur={(e) =>
                      Object.assign(e.currentTarget.style, {
                        borderColor: "rgba(199,163,90,0.2)",
                        boxShadow: "none",
                      })
                    }
                    data-ocid="cart_checkout.address_input"
                    autoComplete="street-address"
                  />
                  {errors.address && (
                    <p className="text-xs mt-1.5" style={{ color: "#fca5a5" }}>
                      {errors.address}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Time */}
              <div>
                <label className="gold-label block mb-2" htmlFor="cc-time">
                  Vēlamais laiks
                </label>
                <div className="relative">
                  <select
                    id="cc-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                    style={{ ...inputStyle }}
                    onFocus={(e) =>
                      Object.assign(e.currentTarget.style, inputFocusStyle)
                    }
                    onBlur={(e) =>
                      Object.assign(e.currentTarget.style, {
                        borderColor: "rgba(199,163,90,0.2)",
                        boxShadow: "none",
                      })
                    }
                    data-ocid="cart_checkout.time_select"
                  >
                    {timeSlots.map((slot) => (
                      <option
                        key={slot}
                        value={slot}
                        style={{ background: "#0B0B0D", color: "#F3F0E6" }}
                      >
                        {slot}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "rgba(199,163,90,0.5)" }}
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="gold-label block mb-2" htmlFor="cc-note">
                  Komentārs (neobligāts)
                </label>
                <textarea
                  id="cc-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Īpaši vēlējumi vai piegādes instrukcijas"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  onFocus={(e) =>
                    Object.assign(e.currentTarget.style, inputFocusStyle)
                  }
                  onBlur={(e) =>
                    Object.assign(e.currentTarget.style, {
                      borderColor: "rgba(199,163,90,0.2)",
                      boxShadow: "none",
                    })
                  }
                  data-ocid="cart_checkout.note_textarea"
                />
              </div>

              {/* Consent */}
              <div>
                <label
                  className="flex items-start gap-3 cursor-pointer"
                  htmlFor="cc-consent"
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      id="cc-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="sr-only"
                      data-ocid="cart_checkout.consent_checkbox"
                    />
                    <button
                      type="button"
                      aria-pressed={consent}
                      className="w-5 h-5 rounded-xs flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      style={{
                        background: consent
                          ? "rgba(199,163,90,0.9)"
                          : "transparent",
                        border: consent
                          ? "1px solid #C7A35A"
                          : "1px solid rgba(199,163,90,0.3)",
                      }}
                      onClick={() => setConsent((v) => !v)}
                    >
                      {consent && (
                        <svg
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M1 4L4 7L10 1"
                            stroke="#050506"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <span
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(243,240,230,0.55)" }}
                  >
                    Piekrītu datu apstrādes noteikumiem un apstiprinu, ka
                    sniegtā informācija ir pareiza.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs mt-2" style={{ color: "#fca5a5" }}>
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                data-ocid="cart_checkout.submit_button"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span data-ocid="cart_checkout.loading_state">
                      Apstrādā…
                    </span>
                  </>
                ) : (
                  "Nosūtīt pasūtījumu"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Sticky mobile bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-40 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(5,5,6,0.95)",
          borderTop: "1px solid rgba(199,163,90,0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div>
          <div style={{ color: "rgba(243,240,230,0.7)", fontSize: "12px" }}>
            {totalItems} {totalItems === 1 ? "prece" : "preces"}
          </div>
          <div
            className="font-serif"
            style={{ color: "#C7A35A", fontSize: "16px", fontWeight: 700 }}
          >
            {totalPrice}€
          </div>
        </div>
        <button
          type="submit"
          form="cart-checkout-form"
          className="btn-gold px-6 py-2.5 text-xs"
          data-ocid="cart_checkout.mobile_submit_button"
          disabled={submitting}
        >
          {submitting ? "Apstrādā…" : "Pasūtīt"}
        </button>
      </div>

      <Footer />
    </div>
  );
}

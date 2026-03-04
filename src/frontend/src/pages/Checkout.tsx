import { ArrowLeft, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

function CheckoutBackButton({ onClick }: { onClick: () => void }) {
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
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { useAddOrder, useOffer } from "../hooks/useQueries";
import {
  generateOrderId,
  generateTimeSlots,
  generateWhatsAppLink,
} from "../lib/storage";
import type { Order } from "../lib/types";

interface CheckoutProps {
  offerId: string;
  onNavigate: (path: string, state?: Record<string, string>) => void;
}

export function Checkout({ offerId, onNavigate }: CheckoutProps) {
  const { data: offer, isLoading } = useOffer(offerId);
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
    // Prevent duplicate submissions
    if (submittedRef.current) return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!offer) return;

    submittedRef.current = true;
    setSubmitting(true);
    try {
      const orderId = generateOrderId();
      const order: Order = {
        id: orderId,
        offerId: offer.id,
        offerName: offer.name,
        pieces: offer.pieces,
        price: offer.price,
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
      };

      await addOrder.mutateAsync(order);

      // WhatsApp
      const waLink = generateWhatsAppLink(order);
      if (waLink) {
        window.open(waLink, "_blank", "noopener,noreferrer");
      }

      onNavigate("/success", { orderId });
    } catch {
      // Reset on error so user can retry
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

  return (
    <div className="min-h-screen">
      <Header currentHash={`/checkout/${offerId}`} />

      <div className="pt-28 pb-16 md:pb-16 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <CheckoutBackButton onClick={() => onNavigate(`/offer/${offerId}`)} />

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

          {isLoading ? (
            <div
              className="h-32 premium-card animate-pulse mb-8"
              data-ocid="checkout.loading_state"
            />
          ) : !offer ? (
            <p style={{ color: "rgba(243,240,230,0.5)" }}>
              Piedāvājums nav atrasts.
            </p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Order summary */}
              <div
                className="rounded-sm p-5 mb-8"
                style={{
                  background: "rgba(199,163,90,0.05)",
                  border: "1px solid rgba(199,163,90,0.2)",
                }}
              >
                <p className="gold-label mb-3">Pasūtījuma kopsavilkums</p>
                <div className="flex items-start gap-4">
                  <div className="image-frame flex-shrink-0 w-16 h-16">
                    <img
                      src={offer.imageUrl}
                      alt={offer.name}
                      className="w-full h-full object-cover"
                      style={{ display: "block" }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-serif text-lg"
                      style={{ color: "#F3F0E6" }}
                    >
                      {offer.name}
                    </div>
                    <div
                      className="text-xs mt-1"
                      style={{ color: "rgba(243,240,230,0.5)" }}
                    >
                      {offer.pieces}
                    </div>
                  </div>
                  <div
                    className="font-serif text-xl flex-shrink-0"
                    style={{ color: "#C7A35A" }}
                  >
                    {offer.price}€
                  </div>
                </div>
              </div>

              {/* Form */}
              <form
                id="checkout-form"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >
                {/* Phone */}
                <div>
                  <label className="gold-label block mb-2" htmlFor="phone">
                    Tālrunis *
                  </label>
                  <input
                    id="phone"
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
                    data-ocid="checkout.phone_input"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p
                      className="text-xs mt-1.5"
                      style={{ color: "#fca5a5" }}
                      data-ocid="checkout.error_state"
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
                            ? "checkout.pickup_radio"
                            : "checkout.delivery_radio"
                        }
                      >
                        <div
                          className="text-sm font-medium mb-0.5"
                          style={{
                            color:
                              deliveryType === value ? "#C7A35A" : "#F3F0E6",
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

                {/* Address (only for delivery) */}
                {deliveryType === "DELIVERY" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label className="gold-label block mb-2" htmlFor="address">
                      Piegādes adrese *
                    </label>
                    <input
                      id="address"
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
                      data-ocid="checkout.address_input"
                      autoComplete="street-address"
                    />
                    {errors.address && (
                      <p
                        className="text-xs mt-1.5"
                        style={{ color: "#fca5a5" }}
                      >
                        {errors.address}
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Time */}
                <div>
                  <label className="gold-label block mb-2" htmlFor="time">
                    Vēlamais laiks
                  </label>
                  <div className="relative">
                    <select
                      id="time"
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
                      data-ocid="checkout.time_select"
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
                  <label className="gold-label block mb-2" htmlFor="note">
                    Komentārs (neobligāts)
                  </label>
                  <textarea
                    id="note"
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
                    data-ocid="checkout.note_textarea"
                  />
                </div>

                {/* Consent */}
                <div>
                  <label
                    className="flex items-start gap-3 cursor-pointer"
                    htmlFor="consent"
                  >
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        id="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="sr-only"
                        data-ocid="checkout.consent_checkbox"
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
                        onClick={() => setConsent(!consent)}
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
                  className="btn-gold w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-ocid="checkout.submit_button"
                >
                  {submitting ? "Apstrādā…" : "Nosūtīt pasūtījumu"}
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky mobile order bar */}
      {offer && (
        <div
          className="fixed bottom-0 left-0 right-0 md:hidden z-40 flex items-center justify-between px-4 py-3"
          style={{
            background: "rgba(5,5,6,0.95)",
            borderTop: "1px solid rgba(199,163,90,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div>
            <div
              style={{ color: "#F3F0E6", fontSize: "13px", fontWeight: 600 }}
            >
              {offer.name}
            </div>
            <div
              style={{ color: "#C7A35A", fontSize: "15px", fontWeight: 700 }}
            >
              {offer.price}€
            </div>
          </div>
          <button
            type="submit"
            form="checkout-form"
            className="btn-gold px-6 py-2.5 text-xs"
            data-ocid="checkout.mobile_submit_button"
            disabled={submitting}
          >
            {submitting ? "Apstrādā…" : "Pasūtīt"}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

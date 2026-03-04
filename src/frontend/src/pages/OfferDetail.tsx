import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { useOffer } from "../hooks/useQueries";

function BackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
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
      {label}
    </button>
  );
}

interface OfferDetailProps {
  id: string;
  onNavigate: (path: string) => void;
}

export function OfferDetail({ id, onNavigate }: OfferDetailProps) {
  const { data: offer, isLoading } = useOffer(id);

  return (
    <div className="min-h-screen">
      <Header currentHash={`/offer/${id}`} />

      <div className="pt-28 pb-16 md:pb-16 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back */}
          <BackButton
            onClick={() => onNavigate("/offers")}
            label="Atpakaļ uz piedāvājumiem"
          />

          {isLoading ? (
            <div
              className="h-96 premium-card animate-pulse"
              data-ocid="offer_detail.loading_state"
            />
          ) : !offer ? (
            <div
              className="text-center py-24"
              data-ocid="offer_detail.error_state"
            >
              <p
                className="font-serif text-2xl"
                style={{ color: "rgba(243,240,230,0.5)" }}
              >
                Piedāvājums nav atrasts
              </p>
              <button
                type="button"
                onClick={() => onNavigate("/offers")}
                className="btn-ghost-gold mt-6 text-xs"
              >
                Skatīt visus piedāvājumus
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Image — NO overlay */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="image-frame">
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="w-full h-auto object-cover"
                    style={{
                      display: "block",
                      minHeight: "280px",
                      maxHeight: "420px",
                    }}
                    loading="eager"
                  />
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <p className="gold-label mb-3">{offer.pieces}</p>
                <h1
                  className="font-serif mb-4"
                  style={{
                    color: "#F3F0E6",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                  }}
                >
                  {offer.name}
                </h1>

                <div
                  className="font-serif mb-8"
                  style={{
                    color: "#C7A35A",
                    fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  }}
                >
                  {offer.price}€
                </div>

                <hr className="gold-divider mb-8" />

                <p
                  className="text-sm leading-relaxed mb-8"
                  style={{ color: "rgba(243,240,230,0.65)" }}
                >
                  {offer.description}
                </p>

                {/* Composition */}
                {offer.composition && offer.composition.length > 0 && (
                  <div className="mb-8">
                    <p className="gold-label mb-4">Sastāvs</p>
                    <ul className="space-y-2">
                      {offer.composition.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm"
                        >
                          <Check
                            size={13}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: "rgba(199,163,90,0.6)" }}
                          />
                          <span style={{ color: "rgba(243,240,230,0.6)" }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  className="btn-gold flex items-center gap-2 w-full justify-center py-4"
                  onClick={() => onNavigate(`/checkout/${offer.id}`)}
                  data-ocid="offer_detail.order_button"
                >
                  <ShoppingBag size={16} />
                  Pasūtīt šo komplektu
                </button>
              </motion.div>
            </div>
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
            type="button"
            className="btn-gold px-6 py-2.5 text-xs"
            onClick={() => onNavigate(`/checkout/${offer.id}`)}
            data-ocid="offer_detail.mobile_order_button"
          >
            Pasūtīt
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

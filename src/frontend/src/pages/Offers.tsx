import { Minus, Plus, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { useCart } from "../context/CartContext";
import { useActiveOffers, useAddonOffers } from "../hooks/useQueries";
import type { Offer } from "../lib/types";

interface OffersProps {
  onNavigate: (path: string) => void;
}

function OfferCard({
  offer,
  index,
  onNavigate,
}: {
  offer: Offer;
  index: number;
  onNavigate: (path: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(offer, qty);
    toast.success(`${offer.name} pievienots grozam`, {
      description: `${qty} × ${offer.price}€`,
    });
    setQty(1);
  };

  return (
    <motion.article
      className="premium-card overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.55 }}
      data-ocid={`offers.item.${index + 1}`}
    >
      {/* Image — NO overlay on image */}
      <div
        className="image-frame flex-shrink-0"
        style={{
          borderRadius: "4px 4px 0 0",
          borderBottom: "none",
          position: "relative",
        }}
      >
        <img
          src={offer.imageUrl}
          alt={offer.name}
          className="w-full h-52 object-cover"
          style={{ display: "block" }}
          loading="lazy"
        />
        {/* "Populārākais" badge on first card */}
        {index === 0 && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(199,163,90,0.92)",
              color: "#050506",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: "3px 9px",
              borderRadius: "2px",
              textTransform: "uppercase",
              zIndex: 3,
            }}
          >
            Populārākais
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="gold-label mb-1">{offer.pieces}</p>
            {offer.persons && (
              <p
                className="text-xs mb-1"
                style={{
                  color: "rgba(243,240,230,0.4)",
                  letterSpacing: "0.03em",
                }}
              >
                {offer.persons}
              </p>
            )}
            <h3
              className="font-serif"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                letterSpacing: "0.01em",
              }}
            >
              {offer.name}
            </h3>
          </div>
          <div
            className="font-serif flex-shrink-0 ml-4"
            style={{
              color: "#C7A35A",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 400,
            }}
          >
            {offer.price}€
          </div>
        </div>

        <p
          className="text-sm flex-1 mb-5 leading-relaxed"
          style={{ color: "rgba(243,240,230,0.55)" }}
        >
          {offer.description.length > 100
            ? `${offer.description.slice(0, 100)}…`
            : offer.description}
        </p>

        {/* Qty selector row */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-150"
            style={{
              border: "1px solid rgba(199,163,90,0.3)",
              color: "rgba(199,163,90,0.7)",
            }}
            aria-label="Samazināt daudzumu"
            data-ocid={`offers.qty_decrease.${index + 1}`}
          >
            <Minus size={12} />
          </button>
          <span
            className="w-8 text-center text-sm"
            style={{ color: "#F3F0E6" }}
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((v) => Math.min(10, v + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-sm transition-colors duration-150"
            style={{
              border: "1px solid rgba(199,163,90,0.3)",
              color: "rgba(199,163,90,0.7)",
            }}
            aria-label="Palielināt daudzumu"
            data-ocid={`offers.qty_increase.${index + 1}`}
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn-ghost-gold flex-1 text-xs py-2.5"
            onClick={() => onNavigate(`/offer/${offer.id}`)}
          >
            Uzzināt vairāk
          </button>
          <button
            type="button"
            className="btn-gold flex items-center gap-1.5 px-4 py-2.5 text-xs"
            onClick={handleAddToCart}
            data-ocid={`offers.add_to_cart_button.${index + 1}`}
          >
            <ShoppingBag size={13} />
            Pievienot grozam
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function AddonCard({
  addon,
  index,
}: {
  addon: Offer;
  index: number;
}) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(addon, 1);
    toast.success("Pievienots grozam", {
      description: `${addon.name} — ${addon.price}€`,
    });
  };

  return (
    <motion.div
      className="premium-card flex-shrink-0 flex flex-col"
      style={{ minWidth: "160px", maxWidth: "180px" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      data-ocid={`addons.item.${index + 1}`}
    >
      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="gold-label" style={{ fontSize: "9px" }}>
          {addon.pieces}
        </p>
        <h4
          className="font-serif leading-tight"
          style={{
            color: "#F3F0E6",
            fontSize: "0.85rem",
            letterSpacing: "0.01em",
          }}
        >
          {addon.name}
        </h4>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span
            className="font-serif"
            style={{ color: "#C7A35A", fontSize: "1.1rem" }}
          >
            {addon.price}€
          </span>
          <button
            type="button"
            className="btn-gold px-3 py-1.5 text-xs flex items-center gap-1"
            onClick={handleAdd}
            aria-label={`Pievienot ${addon.name} grozam`}
            data-ocid={`addons.add_to_cart_button.${index + 1}`}
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Offers({ onNavigate }: OffersProps) {
  const { data: offers = [], isLoading } = useActiveOffers();
  const { data: addons = [] } = useAddonOffers();

  return (
    <div className="min-h-screen">
      <Header currentHash="/offers" />

      {/* Hero heading */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="gold-label mb-4">Sushi komplekti</p>
            <h1
              className="font-serif"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              Piedāvājumi
            </h1>
          </motion.div>
        </div>
      </section>

      <hr className="gold-divider mx-6 max-w-6xl md:mx-auto" />

      {/* Offers grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="premium-card h-80 animate-pulse"
                  style={{ background: "rgba(11,11,13,0.6)" }}
                  data-ocid="offers.loading_state"
                />
              ))}
            </div>
          ) : offers.length === 0 ? (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-ocid="offers.empty_state"
            >
              <div
                className="font-serif text-6xl mb-4"
                style={{ color: "rgba(199,163,90,0.2)" }}
              >
                —
              </div>
              <p
                className="font-serif text-xl mb-2"
                style={{ color: "rgba(243,240,230,0.5)" }}
              >
                Pagaidām nav aktīvu piedāvājumu
              </p>
              <p className="text-sm" style={{ color: "rgba(243,240,230,0.3)" }}>
                Lūdzu, ielūkojieties vēlāk.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer, i) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  index={i}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add-ons section */}
      {addons.length > 0 && (
        <section className="pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <hr className="gold-divider mb-12" />
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="gold-label mb-2">Populāri papildinājumi</p>
              <h2
                className="font-serif mb-8"
                style={{
                  color: "#F3F0E6",
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                }}
              >
                Bieži pievieno kopā
              </h2>
            </motion.div>
            <div
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: "none" }}
            >
              {addons.map((addon, i) => (
                <AddonCard key={addon.id} addon={addon} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

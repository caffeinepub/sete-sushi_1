import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../../context/CartContext";

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export function CartDrawer({ onNavigate }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeFromCart, updateQty, totalPrice } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(5,5,6,0.7)",
              backdropFilter: "blur(4px)",
            }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            key="cart-drawer"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full md:w-96"
            style={{
              background: "#0B0B0D",
              borderLeft: "1px solid rgba(199,163,90,0.18)",
              boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
            }}
            aria-label="Iepirkumu grozs"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(199,163,90,0.12)" }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart
                  size={18}
                  style={{ color: "rgba(199,163,90,0.7)" }}
                />
                <h2
                  className="font-serif text-lg"
                  style={{ color: "#F3F0E6", letterSpacing: "0.04em" }}
                >
                  Grozs
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 rounded-sm transition-colors duration-200"
                style={{ color: "rgba(243,240,230,0.5)" }}
                aria-label="Aizvērt grozu"
                data-ocid="cart.close_button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center h-full py-16 text-center"
                  data-ocid="cart.empty_state"
                >
                  <div
                    className="mb-4"
                    style={{
                      color: "rgba(199,163,90,0.2)",
                      fontSize: "3rem",
                      fontFamily: "serif",
                    }}
                  >
                    —
                  </div>
                  <p
                    className="font-serif text-base mb-2"
                    style={{ color: "rgba(243,240,230,0.4)" }}
                  >
                    Grozs ir tukšs
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(243,240,230,0.25)" }}
                  >
                    Pievienojiet sushi komplektus
                  </p>
                  <hr
                    className="w-12 mt-6"
                    style={{ borderColor: "rgba(199,163,90,0.2)" }}
                  />
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item, index) => (
                    <li
                      key={item.offer.id}
                      className="flex gap-4 py-4"
                      style={{
                        borderBottom: "1px solid rgba(199,163,90,0.08)",
                      }}
                    >
                      {/* Image */}
                      <div
                        className="flex-shrink-0 w-14 h-14 overflow-hidden"
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

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-serif text-sm truncate mb-0.5"
                          style={{ color: "#F3F0E6" }}
                        >
                          {item.offer.name}
                        </div>
                        <div
                          className="text-xs mb-2"
                          style={{ color: "rgba(243,240,230,0.4)" }}
                        >
                          {item.offer.pieces}
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(item.offer.id, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors duration-150"
                            style={{
                              border: "1px solid rgba(199,163,90,0.3)",
                              color: "rgba(199,163,90,0.7)",
                            }}
                            aria-label="Samazināt daudzumu"
                            data-ocid={`cart.item.qty_decrease.${index + 1}`}
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-6 text-center text-sm"
                            style={{ color: "#F3F0E6" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(item.offer.id, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors duration-150"
                            style={{
                              border: "1px solid rgba(199,163,90,0.3)",
                              color: "rgba(199,163,90,0.7)",
                            }}
                            aria-label="Palielināt daudzumu"
                            data-ocid={`cart.item.qty_increase.${index + 1}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Price + remove */}
                      <div className="flex flex-col items-end justify-between flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.offer.id)}
                          className="p-1 transition-colors duration-150"
                          style={{ color: "rgba(243,240,230,0.25)" }}
                          aria-label={`Noņemt ${item.offer.name}`}
                          data-ocid={`cart.item.delete_button.${index + 1}`}
                        >
                          <X size={14} />
                        </button>
                        <div
                          className="font-serif text-base"
                          style={{ color: "#C7A35A" }}
                        >
                          {item.offer.price * item.quantity}€
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer — only when items exist */}
            {items.length > 0 && (
              <div
                className="flex-shrink-0 px-6 py-5"
                style={{ borderTop: "1px solid rgba(199,163,90,0.15)" }}
              >
                {/* Total */}
                <div className="flex items-baseline justify-between mb-5">
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
                      fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    }}
                  >
                    {totalPrice}€
                  </span>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  className="btn-gold w-full justify-center py-4 text-sm"
                  onClick={() => {
                    closeCart();
                    onNavigate("/cart-checkout");
                  }}
                  data-ocid="cart.checkout_button"
                >
                  Noformēt pasūtījumu
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

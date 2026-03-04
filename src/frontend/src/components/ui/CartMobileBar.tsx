import { ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../../context/CartContext";

export function CartMobileBar() {
  const { totalItems, totalPrice, openCart } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          key="cart-mobile-bar"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
          style={{
            background: "rgba(11,11,13,0.97)",
            borderTop: "1px solid rgba(199,163,90,0.25)",
            backdropFilter: "blur(16px)",
          }}
          data-ocid="cart.mobile_bar"
        >
          <div className="flex items-center justify-between px-4 py-3">
            {/* Summary text */}
            <div className="flex items-center gap-2.5">
              <ShoppingCart
                size={16}
                style={{ color: "rgba(199,163,90,0.7)", flexShrink: 0 }}
              />
              <span
                className="text-xs"
                style={{
                  color: "rgba(243,240,230,0.75)",
                  letterSpacing: "0.03em",
                }}
              >
                Jūsu pasūtījums&nbsp;•&nbsp;
                <span style={{ color: "#F3F0E6" }}>
                  {totalItems} {totalItems === 1 ? "prece" : "preces"}
                </span>
                &nbsp;•&nbsp;
                <span
                  className="font-serif"
                  style={{ color: "#C7A35A", fontSize: "15px" }}
                >
                  {totalPrice}€
                </span>
              </span>
            </div>

            {/* CTA button */}
            <button
              type="button"
              onClick={openCart}
              className="btn-gold px-5 py-2 text-xs flex-shrink-0"
              data-ocid="cart.mobile_bar_button"
            >
              SKATĪT GROZU
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

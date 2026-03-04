import { Menu, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

interface HeaderProps {
  currentHash?: string;
}

export function Header({ currentHash = "" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#/", label: "Sākums" },
    { href: "#/offers", label: "Piedāvājumi" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(5,5,6,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(199,163,90,0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#/"
          className="font-serif text-3xl tracking-luxury"
          style={{ color: "#C7A35A", letterSpacing: "0.3em" }}
          data-ocid="nav.home_link"
        >
          SETE
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              currentHash === link.href.replace("#", "") ||
              (link.href === "#/" && currentHash === "");
            return (
              <NavAnchor
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActive}
                ocid={link.href === "#/" ? "nav.home_link" : "nav.offers_link"}
              />
            );
          })}
          {/* Cart button — desktop */}
          <CartIconButton totalItems={totalItems} onClick={openCart} />
        </nav>

        {/* Mobile right side: cart + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <CartIconButton totalItems={totalItems} onClick={openCart} />
          <button
            type="button"
            className="text-ivory p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Aizvērt izvēlni" : "Atvērt izvēlni"}
            style={{ color: "rgba(243,240,230,0.8)" }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(5,5,6,0.98)",
              borderBottom: "1px solid rgba(199,163,90,0.2)",
            }}
          >
            <nav className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs tracking-luxury uppercase py-2"
                  style={{
                    color: "rgba(243,240,230,0.8)",
                    letterSpacing: "0.18em",
                  }}
                  data-ocid={
                    link.href === "#/" ? "nav.home_link" : "nav.offers_link"
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartIconButton({
  totalItems,
  onClick,
}: {
  totalItems: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-1.5 transition-colors duration-200"
      aria-label={`Grozs${totalItems > 0 ? ` (${totalItems})` : ""}`}
      style={{ color: "rgba(243,240,230,0.7)" }}
      data-ocid="nav.cart_button"
    >
      <ShoppingCart size={20} />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-xs font-bold leading-none"
          style={{
            background: "#C7A35A",
            color: "#050506",
            minWidth: "17px",
            height: "17px",
            fontSize: "10px",
            padding: "0 3px",
          }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

function NavAnchor({
  href,
  label,
  isActive,
  ocid,
}: {
  href: string;
  label: string;
  isActive: boolean;
  ocid: string;
}) {
  const [hovered, setHovered] = useState(false);
  const color = hovered || isActive ? "#C7A35A" : "rgba(243,240,230,0.70)";
  return (
    <a
      href={href}
      className="text-xs uppercase transition-colors duration-200 font-sans"
      style={{ color, letterSpacing: "0.18em" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={ocid}
    >
      {label}
    </a>
  );
}

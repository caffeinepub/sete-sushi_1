import {
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { adminLogout } from "../../lib/storage";

function LogoutButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors duration-200"
      style={{ color: hovered ? "#fca5a5" : "rgba(243,240,230,0.4)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <LogOut size={16} />
      <span className="text-xs tracking-premium">Iziet</span>
    </button>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AdminLayout({
  children,
  currentPath,
  onNavigate,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/admin", label: "Pārskats", icon: LayoutDashboard },
    { path: "/admin/offers", label: "Piedāvājumi", icon: ShoppingBag },
    { path: "/admin/orders", label: "Pasūtījumi", icon: ClipboardList },
    { path: "/admin/settings", label: "Iestatījumi", icon: Settings },
  ];

  const handleLogout = () => {
    adminLogout();
    onNavigate("/admin/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="px-6 py-6 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(199,163,90,0.12)" }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center rounded-sm"
          style={{
            background: "rgba(199,163,90,0.1)",
            border: "1px solid rgba(199,163,90,0.3)",
          }}
        >
          <ChefHat size={16} style={{ color: "#C7A35A" }} />
        </div>
        <div>
          <div
            className="font-serif text-lg"
            style={{ color: "#C7A35A", letterSpacing: "0.2em" }}
          >
            SETE
          </div>
          <div
            className="text-xs"
            style={{ color: "rgba(243,240,230,0.35)", letterSpacing: "0.1em" }}
          >
            Admin
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path !== "/admin" && currentPath.startsWith(item.path));
          return (
            <button
              type="button"
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-200 text-left"
              style={{
                background: isActive ? "rgba(199,163,90,0.1)" : "transparent",
                color: isActive ? "#C7A35A" : "rgba(243,240,230,0.55)",
                border: isActive
                  ? "1px solid rgba(199,163,90,0.2)"
                  : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(243,240,230,0.8)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(243,240,230,0.55)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon size={16} />
              <span className="font-sans text-xs tracking-premium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(199,163,90,0.1)" }}
      >
        <LogoutButton onClick={handleLogout} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col fixed h-screen admin-sidebar z-40">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.7)" }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-screen w-56 z-50 admin-sidebar md:hidden"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-56 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center justify-between px-4 py-4 sticky top-0 z-30"
          style={{
            background: "rgba(5,5,6,0.95)",
            borderBottom: "1px solid rgba(199,163,90,0.12)",
          }}
        >
          <button type="button" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} style={{ color: "rgba(243,240,230,0.7)" }} />
          </button>
          <span
            className="font-serif text-lg"
            style={{ color: "#C7A35A", letterSpacing: "0.2em" }}
          >
            SETE Admin
          </span>
          <button type="button" onClick={handleLogout}>
            <LogOut size={18} style={{ color: "rgba(243,240,230,0.4)" }} />
          </button>
        </div>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

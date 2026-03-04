import {
  ArrowRight,
  ClipboardList,
  Package,
  Settings,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useAllOffers, useOrders } from "../../hooks/useQueries";
import type { OrderStatus } from "../../lib/types";

function QuickLinkButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm"
      style={{
        background: "rgba(199,163,90,0.06)",
        border: hovered
          ? "1px solid rgba(199,163,90,0.4)"
          : "1px solid rgba(199,163,90,0.18)",
        color: hovered ? "#C7A35A" : "rgba(243,240,230,0.7)",
        transition: "border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      <span className="text-xs tracking-premium">{label}</span>
      <ArrowRight size={12} />
    </button>
  );
}

function ViewAllButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs flex items-center gap-1"
      style={{
        color: hovered ? "#C7A35A" : "rgba(199,163,90,0.6)",
        transition: "color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Visi pasūtījumi
      <ArrowRight size={12} />
    </button>
  );
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Jauns",
  CONFIRMED: "Apstiprināts",
  PREPARING: "Gatavo",
  READY: "Gatavs",
  COMPLETED: "Pabeigts",
  PAID: "Apmaksāts",
  IN_PROGRESS: "Apstrādē",
  DONE: "Izpildīts",
  CANCELED: "Atcelts",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  NEW: "status-new",
  CONFIRMED: "status-confirmed",
  PREPARING: "status-preparing",
  READY: "status-ready",
  COMPLETED: "status-completed",
  PAID: "status-paid",
  IN_PROGRESS: "status-in_progress",
  DONE: "status-done",
  CANCELED: "status-canceled",
};

interface AdminDashboardProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AdminDashboard({
  currentPath,
  onNavigate,
}: AdminDashboardProps) {
  const { data: orders = [] } = useOrders();
  const { data: offers = [] } = useAllOffers();

  const recentOrders = orders.slice(0, 10);
  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === "NEW").length;
  const activeOffers = offers.filter((o) => o.active).length;
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  const stats = [
    { label: "Pavisam pasūtījumi", value: totalOrders, icon: ClipboardList },
    {
      label: "Jauni pasūtījumi",
      value: newOrders,
      icon: TrendingUp,
      highlight: newOrders > 0,
    },
    { label: "Aktīvie seti", value: activeOffers, icon: Package },
    { label: "Šodien", value: todayOrders, icon: TrendingUp },
  ];

  const quickLinks = [
    { label: "Pievienot jaunu seti", path: "/admin/offers", icon: Package },
    { label: "Skatīt pasūtījumus", path: "/admin/orders", icon: ClipboardList },
    { label: "Iestatījumi", path: "/admin/settings", icon: Settings },
  ];

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="gold-label mb-1">SETE Admin</p>
          <h1
            className="font-serif"
            style={{ color: "#F3F0E6", fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Pārskats
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="premium-card p-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                style={
                  stat.highlight
                    ? { borderColor: "rgba(199,163,90,0.35)" }
                    : undefined
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon
                    size={16}
                    style={{
                      color: stat.highlight
                        ? "#C7A35A"
                        : "rgba(199,163,90,0.5)",
                    }}
                  />
                </div>
                <div
                  className="font-serif text-3xl mb-1"
                  style={{
                    color: stat.highlight ? "#C7A35A" : "#F3F0E6",
                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs"
                  style={{
                    color: "rgba(243,240,230,0.4)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick links */}
        <div>
          <p className="gold-label mb-4">Ātrās saites</p>
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <QuickLinkButton
                  key={link.path}
                  label={link.label}
                  icon={<Icon size={14} />}
                  onClick={() => onNavigate(link.path)}
                />
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="gold-label">Pēdējie pasūtījumi</p>
            <ViewAllButton onClick={() => onNavigate("/admin/orders")} />
          </div>

          {recentOrders.length === 0 ? (
            <div
              className="text-center py-12 rounded-sm"
              style={{ border: "1px dashed rgba(199,163,90,0.15)" }}
              data-ocid="admin_dashboard.empty_state"
            >
              <p className="text-sm" style={{ color: "rgba(243,240,230,0.3)" }}>
                Nav neviena pasūtījuma
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  className="premium-card px-4 py-3 flex items-center justify-between gap-4 cursor-pointer"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => onNavigate("/admin/orders")}
                  data-ocid={`admin_dashboard.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#C7A35A" }}
                      >
                        {order.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-xs ${STATUS_CLASS[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div
                      className="text-xs mt-0.5 truncate"
                      style={{ color: "rgba(243,240,230,0.5)" }}
                    >
                      {order.offerName} · {order.phone}
                    </div>
                  </div>
                  <div
                    className="font-serif text-sm flex-shrink-0"
                    style={{ color: "rgba(243,240,230,0.6)" }}
                  >
                    {order.price}€
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

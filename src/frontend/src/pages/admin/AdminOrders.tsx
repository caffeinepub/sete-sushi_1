import { ChevronDown, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useOrders, useUpdateOrderStatus } from "../../hooks/useQueries";
import { generateWhatsAppLink } from "../../lib/storage";
import type { Order, OrderStatus } from "../../lib/types";

interface AdminOrdersProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const ALL_STATUSES: OrderStatus[] = [
  "NEW",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "PAID",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
];

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
  PAID: "status-paid",
  IN_PROGRESS: "status-in_progress",
  DONE: "status-done",
  CANCELED: "status-canceled",
  PREPARING: "status-preparing",
  READY: "status-ready",
  COMPLETED: "status-completed",
};

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const handleStatusSave = () => {
    onStatusChange(status);
    onClose();
  };

  const handleWhatsApp = () => {
    const link = generateWhatsAppLink(order);
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      alert("WhatsApp numurs nav iestatīts. Iestatiet to sadaļā Iestatījumi.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      data-ocid="admin_orders.dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md premium-card overflow-y-auto"
        style={{ maxHeight: "88vh" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(199,163,90,0.15)" }}
        >
          <div>
            <div className="font-serif text-base" style={{ color: "#C7A35A" }}>
              {order.id}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "rgba(243,240,230,0.4)" }}
            >
              {new Date(order.createdAt).toLocaleString("lv-LV")}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ color: "rgba(243,240,230,0.4)" }}
            data-ocid="admin_orders.close_button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 text-sm">
          {/* Offer */}
          <div
            className="rounded-sm p-4"
            style={{
              background: "rgba(199,163,90,0.05)",
              border: "1px solid rgba(199,163,90,0.15)",
            }}
          >
            <div className="font-medium" style={{ color: "#F3F0E6" }}>
              {order.offerName}
            </div>
            <div
              className="text-xs mt-1 flex gap-3"
              style={{ color: "rgba(243,240,230,0.5)" }}
            >
              <span>{order.pieces}</span>
              <span>·</span>
              <span style={{ color: "rgba(199,163,90,0.8)" }}>
                {order.price}€
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5">
            {[
              { label: "Tālrunis", value: order.phone },
              {
                label: "Saņemšana",
                value:
                  order.deliveryType === "DELIVERY"
                    ? "Piegāde"
                    : "Saņemt uz vietas",
              },
              { label: "Adrese", value: order.address },
              { label: "Laiks", value: order.time },
              ...(order.note
                ? [{ label: "Komentārs", value: order.note }]
                : []),
            ].map((row) => (
              <div key={row.label} className="flex gap-3">
                <span
                  className="text-xs w-28 flex-shrink-0"
                  style={{ color: "rgba(199,163,90,0.6)" }}
                >
                  {row.label}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(243,240,230,0.7)" }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Status change */}
          <div>
            <label className="gold-label block mb-2" htmlFor="order-status">
              Statuss
            </label>
            <div className="relative">
              <select
                id="order-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full px-4 py-2.5 rounded-sm text-sm appearance-none pr-8 focus:outline-none"
                style={{
                  background: "rgba(11,11,13,0.9)",
                  border: "1px solid rgba(199,163,90,0.2)",
                  color: "#F3F0E6",
                  fontSize: "14px",
                }}
                data-ocid="admin_orders.select"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s} style={{ background: "#0B0B0D" }}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(199,163,90,0.5)" }}
              />
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-3 px-6 py-4"
          style={{ borderTop: "1px solid rgba(199,163,90,0.12)" }}
        >
          <button
            type="button"
            onClick={handleWhatsApp}
            className="btn-ghost-gold flex items-center justify-center gap-2 py-2.5 flex-1 text-xs"
            data-ocid="admin_orders.button"
          >
            <MessageCircle size={14} />
            Sūtīt WhatsApp
          </button>
          <button
            type="button"
            onClick={handleStatusSave}
            className="btn-gold flex items-center justify-center gap-2 py-2.5 flex-1 text-xs"
            data-ocid="admin_orders.save_button"
          >
            Saglabāt statusu
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function AdminOrders({ currentPath, onNavigate }: AdminOrdersProps) {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered =
    activeFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  const filterTabs: { value: OrderStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "Visi" },
    ...ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
  ];

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="space-y-6">
        <div>
          <p className="gold-label mb-1">Pārvaldība</p>
          <h1
            className="font-serif"
            style={{
              color: "#F3F0E6",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
            }}
          >
            Pasūtījumi
          </h1>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-2 flex-wrap"
          data-ocid="admin_orders.status_filter.tab"
        >
          {filterTabs.map((tab) => {
            const count =
              tab.value === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === tab.value).length;
            return (
              <button
                type="button"
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className="px-3 py-1.5 rounded-xs text-xs transition-all duration-200 flex items-center gap-1.5"
                style={{
                  background:
                    activeFilter === tab.value
                      ? "rgba(199,163,90,0.1)"
                      : "transparent",
                  border:
                    activeFilter === tab.value
                      ? "1px solid rgba(199,163,90,0.35)"
                      : "1px solid rgba(199,163,90,0.12)",
                  color:
                    activeFilter === tab.value
                      ? "#C7A35A"
                      : "rgba(243,240,230,0.45)",
                }}
                data-ocid={"admin_orders.tab"}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="text-xs px-1 rounded-xs"
                    style={{
                      background:
                        activeFilter === tab.value
                          ? "rgba(199,163,90,0.2)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        activeFilter === tab.value
                          ? "#C7A35A"
                          : "rgba(243,240,230,0.3)",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Orders table */}
        {isLoading ? (
          <div className="space-y-2" data-ocid="admin_orders.loading_state">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 premium-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16"
            style={{
              border: "1px dashed rgba(199,163,90,0.12)",
              borderRadius: "4px",
            }}
            data-ocid="admin_orders.empty_state"
          >
            <p className="text-sm" style={{ color: "rgba(243,240,230,0.3)" }}>
              Nav pasūtījumu
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((order, i) => (
              <motion.div
                key={order.id}
                className="premium-card px-4 py-3 flex items-center gap-4 cursor-pointer"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedOrder(order)}
                data-ocid={`admin_orders.item.${i + 1}`}
              >
                {/* ID + status */}
                <div className="w-28 flex-shrink-0">
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#C7A35A", wordBreak: "break-all" }}
                  >
                    {order.id}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-xs mt-1 inline-block ${STATUS_CLASS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* Offer + phone + type */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-medium truncate"
                    style={{ color: "#F3F0E6" }}
                  >
                    {order.offerName}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(243,240,230,0.4)" }}
                  >
                    {order.phone}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(199,163,90,0.55)" }}
                  >
                    {order.deliveryType === "DELIVERY"
                      ? "Piegāde"
                      : "Saņemt uz vietas"}
                  </div>
                </div>

                {/* Time + price */}
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xs"
                    style={{ color: "rgba(243,240,230,0.5)" }}
                  >
                    {new Date(order.createdAt).toLocaleTimeString("lv-LV", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(243,240,230,0.3)" }}
                  >
                    {new Date(order.createdAt).toLocaleDateString("lv-LV", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </div>
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{ color: "rgba(199,163,90,0.8)" }}
                  >
                    {order.price}€
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(status) => {
              updateStatus.mutate({ id: selectedOrder.id, status });
              setSelectedOrder(null);
            }}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

import {
  Check,
  Pencil,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function OfferActionButton({
  children,
  onClick,
  title,
  defaultColor,
  hoverColor,
  ocid,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  defaultColor: string;
  hoverColor: string;
  ocid: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-xs"
      title={title}
      style={{
        color: hovered ? hoverColor : defaultColor,
        transition: "color 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={ocid}
    >
      {children}
    </button>
  );
}
import { AdminLayout } from "../../components/layout/AdminLayout";
import {
  useAddOffer,
  useAllOffers,
  useDeleteOffer,
  useUpdateOffer,
} from "../../hooks/useQueries";
import type { Offer } from "../../lib/types";

interface AdminOffersProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const EMPTY_OFFER: Omit<Offer, "id"> = {
  name: "",
  pieces: "",
  price: 0,
  description: "",
  composition: [],
  imageUrl: "",
  active: true,
  sortOrder: 1,
};

function OfferModal({
  offer,
  onClose,
  onSave,
}: {
  offer: Partial<Offer> & { id?: string };
  onClose: () => void;
  onSave: (offer: Offer) => void;
}) {
  const isEdit = !!offer.id;
  const [form, setForm] = useState<Omit<Offer, "id">>({
    name: offer.name ?? "",
    pieces: offer.pieces ?? "",
    price: offer.price ?? 0,
    description: offer.description ?? "",
    composition: offer.composition ?? [],
    imageUrl: offer.imageUrl ?? "",
    active: offer.active ?? true,
    sortOrder: offer.sortOrder ?? 1,
  });
  const [compositionText, setCompositionText] = useState(
    (offer.composition ?? []).join("\n"),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nosaukums ir obligāts";
    if (!form.pieces.trim()) errs.pieces = "Gabalos ir obligāts";
    if (form.price <= 0) errs.price = "Cenai jābūt lielākai par 0";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const composition = compositionText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const id =
      offer.id ||
      `${form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}-${Date.now().toString(36)}`;

    onSave({ ...form, composition, id });
  };

  const inputStyle = (hasError?: boolean) => ({
    background: "rgba(11,11,13,0.9)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(199,163,90,0.2)"}`,
    color: "#F3F0E6",
    borderRadius: "2px",
    fontSize: "16px" as const,
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      data-ocid="admin_offers.dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg premium-card overflow-y-auto"
        style={{ maxHeight: "90vh" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(199,163,90,0.15)" }}
        >
          <h2
            className="font-serif text-lg"
            style={{ color: "#F3F0E6", fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
          >
            {isEdit ? "Rediģēt seti" : "Pievienot jaunu seti"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ color: "rgba(243,240,230,0.4)" }}
            data-ocid="admin_offers.close_button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="gold-label block mb-1.5" htmlFor="offer-name">
              Nosaukums *
            </label>
            <input
              id="offer-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="SETE 01"
              style={inputStyle(!!errors.name)}
              data-ocid="admin_offers.input"
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: "#fca5a5" }}>
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Pieces */}
            <div>
              <label className="gold-label block mb-1.5" htmlFor="offer-pieces">
                Gabali *
              </label>
              <input
                id="offer-pieces"
                type="text"
                value={form.pieces}
                onChange={(e) =>
                  setForm((f) => ({ ...f, pieces: e.target.value }))
                }
                placeholder="48 gab."
                style={inputStyle(!!errors.pieces)}
              />
              {errors.pieces && (
                <p className="text-xs mt-1" style={{ color: "#fca5a5" }}>
                  {errors.pieces}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="gold-label block mb-1.5" htmlFor="offer-price">
                Cena (€) *
              </label>
              <input
                id="offer-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    price: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="39"
                style={inputStyle(!!errors.price)}
              />
              {errors.price && (
                <p className="text-xs mt-1" style={{ color: "#fca5a5" }}>
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="gold-label block mb-1.5" htmlFor="offer-desc">
              Apraksts
            </label>
            <textarea
              id="offer-desc"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Aprakstiet seti..."
              style={{ ...inputStyle(), resize: "vertical" }}
            />
          </div>

          {/* Composition */}
          <div>
            <label
              className="gold-label block mb-1.5"
              htmlFor="offer-composition"
            >
              Sastāvs (viena rinda — viens elements)
            </label>
            <textarea
              id="offer-composition"
              rows={4}
              value={compositionText}
              onChange={(e) => setCompositionText(e.target.value)}
              placeholder={"Laša nigiri × 8\nTunzivju nigiri × 6\n..."}
              style={{
                ...inputStyle(),
                resize: "vertical",
                fontFamily: "monospace",
                fontSize: "13px",
              }}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="gold-label block mb-1.5" htmlFor="offer-image">
              Attēla URL
            </label>
            <input
              id="offer-image"
              type="text"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageUrl: e.target.value }))
              }
              placeholder="/assets/generated/sete-01-placeholder.dim_1200x800.jpg"
              style={inputStyle()}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sort order */}
            <div>
              <label className="gold-label block mb-1.5" htmlFor="offer-sort">
                Kārtošanas nr.
              </label>
              <input
                id="offer-sort"
                type="number"
                min="1"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sortOrder: Number.parseInt(e.target.value) || 1,
                  }))
                }
                style={inputStyle()}
              />
            </div>

            {/* Active */}
            <div>
              <p className="gold-label block mb-1.5">Aktīvs</p>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className="flex items-center gap-2 px-4 py-2.5 rounded-sm transition-all duration-200"
                style={{
                  background: form.active
                    ? "rgba(199,163,90,0.1)"
                    : "rgba(11,11,13,0.8)",
                  border: form.active
                    ? "1px solid rgba(199,163,90,0.4)"
                    : "1px solid rgba(199,163,90,0.15)",
                  color: form.active ? "#C7A35A" : "rgba(243,240,230,0.4)",
                }}
                data-ocid="admin_offers.toggle"
              >
                {form.active ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
                <span className="text-xs">
                  {form.active ? "Aktīvs" : "Neaktīvs"}
                </span>
              </button>
            </div>
          </div>

          {/* Image preview */}
          {form.imageUrl && (
            <div>
              <p className="gold-label block mb-1.5">Priekšskatījums</p>
              <div className="image-frame">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                  style={{ display: "block" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div
          className="flex justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid rgba(199,163,90,0.12)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost-gold py-2 px-5 text-xs"
            data-ocid="admin_offers.cancel_button"
          >
            Atcelt
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"
            data-ocid="admin_offers.save_button"
          >
            <Check size={13} />
            {isEdit ? "Saglabāt" : "Pievienot"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function AdminOffers({ currentPath, onNavigate }: AdminOffersProps) {
  const { data: offers = [], isLoading } = useAllOffers();
  const addOffer = useAddOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();

  const [modalOffer, setModalOffer] = useState<Partial<Offer> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sortedOffers = [...offers].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSave = async (offer: Offer) => {
    if (modalOffer?.id) {
      await updateOffer.mutateAsync(offer);
    } else {
      await addOffer.mutateAsync(offer);
    }
    setModalOffer(null);
  };

  const handleDelete = async (id: string) => {
    await deleteOffer.mutateAsync(id);
    setDeleteConfirm(null);
  };

  const handleToggle = async (offer: Offer) => {
    await updateOffer.mutateAsync({ ...offer, active: !offer.active });
  };

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="gold-label mb-1">Katalogs</p>
            <h1
              className="font-serif"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              }}
            >
              Piedāvājumi
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setModalOffer(EMPTY_OFFER)}
            className="btn-gold py-2.5 px-5 text-xs flex items-center gap-1.5"
            data-ocid="admin_offers.add_button"
          >
            <Plus size={14} />
            Pievienot jaunu
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 premium-card animate-pulse"
                data-ocid="admin_offers.loading_state"
              />
            ))}
          </div>
        ) : sortedOffers.length === 0 ? (
          <div
            className="text-center py-16"
            style={{
              border: "1px dashed rgba(199,163,90,0.15)",
              borderRadius: "4px",
            }}
            data-ocid="admin_offers.empty_state"
          >
            <p className="text-sm" style={{ color: "rgba(243,240,230,0.4)" }}>
              Nav neviena seta
            </p>
            <button
              type="button"
              onClick={() => setModalOffer(EMPTY_OFFER)}
              className="btn-ghost-gold text-xs mt-4 py-2 px-4"
            >
              Pievienot pirmo seti
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                className="premium-card p-4 flex items-center gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`admin_offers.item.${i + 1}`}
              >
                {/* Thumb */}
                <div className="image-frame flex-shrink-0 w-12 h-12">
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="w-full h-full object-cover"
                    style={{ display: "block" }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#F3F0E6" }}
                    >
                      {offer.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-xs ${offer.active ? "status-new" : "status-canceled"}`}
                    >
                      {offer.active ? "Aktīvs" : "Neaktīvs"}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "rgba(243,240,230,0.4)" }}
                  >
                    <span>{offer.pieces}</span>
                    <span>·</span>
                    <span style={{ color: "rgba(199,163,90,0.8)" }}>
                      {offer.price}€
                    </span>
                    <span>·</span>
                    <span>Nr. {offer.sortOrder}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <OfferActionButton
                    onClick={() => handleToggle(offer)}
                    title={offer.active ? "Deaktivizēt" : "Aktivizēt"}
                    defaultColor={
                      offer.active
                        ? "rgba(199,163,90,0.7)"
                        : "rgba(243,240,230,0.3)"
                    }
                    hoverColor="#C7A35A"
                    ocid={`admin_offers.toggle.${i + 1}`}
                  >
                    {offer.active ? (
                      <ToggleRight size={18} />
                    ) : (
                      <ToggleLeft size={18} />
                    )}
                  </OfferActionButton>
                  <OfferActionButton
                    onClick={() => setModalOffer(offer)}
                    title="Rediģēt"
                    defaultColor="rgba(243,240,230,0.4)"
                    hoverColor="#C7A35A"
                    ocid={`admin_offers.edit_button.${i + 1}`}
                  >
                    <Pencil size={15} />
                  </OfferActionButton>
                  <OfferActionButton
                    onClick={() => setDeleteConfirm(offer.id)}
                    title="Dzēst"
                    defaultColor="rgba(243,240,230,0.3)"
                    hoverColor="#fca5a5"
                    ocid={`admin_offers.delete_button.${i + 1}`}
                  >
                    <Trash2 size={15} />
                  </OfferActionButton>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Offer modal */}
      <AnimatePresence>
        {modalOffer !== null && (
          <OfferModal
            offer={modalOffer}
            onClose={() => setModalOffer(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            data-ocid="admin_offers.dialog"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="premium-card p-6 max-w-sm w-full"
            >
              <h3
                className="font-serif text-lg mb-3"
                style={{
                  color: "#F3F0E6",
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                }}
              >
                Dzēst seti?
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(243,240,230,0.5)" }}
              >
                Šī darbība nav atceļama.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-ghost-gold py-2 px-4 text-xs"
                  data-ocid="admin_offers.cancel_button"
                >
                  Atcelt
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 rounded-sm text-xs transition-all duration-200"
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5",
                  }}
                  data-ocid="admin_offers.confirm_button"
                >
                  Dzēst
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

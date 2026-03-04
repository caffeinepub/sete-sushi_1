import { Check, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useSaveSettings, useSettings } from "../../hooks/useQueries";
import type { Settings, WorkingHours } from "../../lib/types";

function ChangePasswordLink({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs"
      style={{
        color: hovered ? "#C7A35A" : "rgba(199,163,90,0.5)",
        transition: "color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Mainīt administratora paroli →
    </button>
  );
}

interface AdminSettingsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const DAY_NAMES: Record<string, string> = {
  mon: "Pirmdiena",
  tue: "Otrdiena",
  wed: "Trešdiena",
  thu: "Ceturtdiena",
  fri: "Piektdiena",
  sat: "Sestdiena",
  sun: "Svētdiena",
};

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function AdminSettings({ currentPath, onNavigate }: AdminSettingsProps) {
  const { data: settingsData } = useSettings();
  const saveSettings = useSaveSettings();
  const [form, setForm] = useState<Settings | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    if (settingsData && !form) {
      setForm(settingsData);
    }
  }, [settingsData, form]);

  if (!form) {
    return (
      <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
        <div className="animate-pulse h-48 premium-card" />
      </AdminLayout>
    );
  }

  const handleSave = async (section: string) => {
    await saveSettings.mutateAsync(form);
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  const inputStyle = {
    background: "rgba(11,11,13,0.8)",
    border: "1px solid rgba(199,163,90,0.2)",
    color: "#F3F0E6",
    borderRadius: "2px",
    fontSize: "16px" as const,
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const sectionCard = (
    title: string,
    sectionId: string,
    children: React.ReactNode,
  ) => (
    <motion.section
      className="premium-card p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="flex items-center justify-between mb-6 pb-4"
        style={{ borderBottom: "1px solid rgba(199,163,90,0.12)" }}
      >
        <h2
          className="font-serif text-base"
          style={{ color: "#F3F0E6", fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={() => handleSave(sectionId)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xs text-xs transition-all duration-200"
          style={
            saved === sectionId
              ? {
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#86efac",
                }
              : {
                  background: "rgba(199,163,90,0.08)",
                  border: "1px solid rgba(199,163,90,0.2)",
                  color: "#C7A35A",
                }
          }
          data-ocid="admin_settings.save_button"
        >
          {saved === sectionId ? <Check size={13} /> : <Save size={13} />}
          {saved === sectionId ? "Saglabāts!" : "Saglabāt"}
        </button>
      </div>
      {children}
    </motion.section>
  );

  const Field = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div>
      <p className="gold-label block mb-1.5">{label}</p>
      {children}
    </div>
  );

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      <div className="space-y-6 max-w-2xl">
        <div>
          <p className="gold-label mb-1">Konfigurācija</p>
          <h1
            className="font-serif"
            style={{
              color: "#F3F0E6",
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
            }}
          >
            Iestatījumi
          </h1>
        </div>

        {/* Contacts */}
        {sectionCard(
          "Kontakti",
          "contacts",
          <div className="space-y-4">
            <Field label="Saņemšanas adrese">
              <input
                type="text"
                value={form.pickupAddress}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, pickupAddress: e.target.value } : f,
                  )
                }
                placeholder="Blaumaņa iela 34-2, Rīga"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
                data-ocid="admin_settings.input"
              />
            </Field>
            <Field label="Tālrunis">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, phone: e.target.value } : f))
                }
                placeholder="+371 XXXXXXXX"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="WhatsApp numurs (E.164, piemēram +37129XXXXXX)">
              <input
                type="tel"
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, whatsappNumber: e.target.value } : f,
                  )
                }
                placeholder="+37129XXXXXX"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="E-pasts">
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, email: e.target.value } : f))
                }
                placeholder="info@sete.lv"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
          </div>,
        )}

        {/* Working hours */}
        {sectionCard(
          "Darba laiks",
          "hours",
          <div className="space-y-3">
            {DAY_KEYS.map((day) => {
              const h: WorkingHours = form.workingHours[day];
              return (
                <div key={day} className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-xs w-24 flex-shrink-0"
                    style={{ color: "rgba(243,240,230,0.55)" }}
                  >
                    {DAY_NAMES[day]}
                  </span>
                  <input
                    type="time"
                    value={h.open}
                    disabled={h.closed}
                    onChange={(e) =>
                      setForm((f) =>
                        f
                          ? {
                              ...f,
                              workingHours: {
                                ...f.workingHours,
                                [day]: { ...h, open: e.target.value },
                              },
                            }
                          : f,
                      )
                    }
                    className="px-3 py-1.5 rounded-xs text-xs focus:outline-none"
                    style={{
                      ...inputStyle,
                      padding: "6px 10px",
                      width: "auto",
                      opacity: h.closed ? 0.4 : 1,
                    }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "rgba(243,240,230,0.3)" }}
                  >
                    —
                  </span>
                  <input
                    type="time"
                    value={h.close}
                    disabled={h.closed}
                    onChange={(e) =>
                      setForm((f) =>
                        f
                          ? {
                              ...f,
                              workingHours: {
                                ...f.workingHours,
                                [day]: { ...h, close: e.target.value },
                              },
                            }
                          : f,
                      )
                    }
                    className="px-3 py-1.5 rounded-xs text-xs focus:outline-none"
                    style={{
                      ...inputStyle,
                      padding: "6px 10px",
                      width: "auto",
                      opacity: h.closed ? 0.4 : 1,
                    }}
                  />
                  <div className="flex items-center gap-2 cursor-pointer ml-auto">
                    <span
                      className="text-xs"
                      style={{ color: "rgba(243,240,230,0.4)" }}
                    >
                      Slēgts
                    </span>
                    <button
                      type="button"
                      className="relative w-9 h-5 rounded-full transition-all duration-200 cursor-pointer"
                      aria-label={`${day} closed toggle`}
                      aria-pressed={h.closed}
                      style={{
                        background: h.closed
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(199,163,90,0.2)",
                        border: "1px solid rgba(199,163,90,0.2)",
                      }}
                      onClick={() =>
                        setForm((f) =>
                          f
                            ? {
                                ...f,
                                workingHours: {
                                  ...f.workingHours,
                                  [day]: { ...h, closed: !h.closed },
                                },
                              }
                            : f,
                        )
                      }
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                        style={{
                          background: h.closed ? "#fca5a5" : "#C7A35A",
                          left: h.closed ? "calc(100% - 18px)" : "2px",
                        }}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>,
        )}

        {/* SEO */}
        {sectionCard(
          "SEO",
          "seo",
          <div className="space-y-4">
            <Field label="Vietnes nosaukums">
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, seoTitle: e.target.value } : f))
                }
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="Meta apraksts">
              <textarea
                rows={2}
                value={form.seoDescription}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, seoDescription: e.target.value } : f,
                  )
                }
                style={{ ...inputStyle, resize: "vertical" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="Atslēgvārdi">
              <input
                type="text"
                value={form.seoKeywords}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, seoKeywords: e.target.value } : f,
                  )
                }
                placeholder="sushi, rīga, piegāde"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="OG attēla URL">
              <input
                type="text"
                value={form.ogImageUrl}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, ogImageUrl: e.target.value } : f))
                }
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="Indeksēt vietni">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => (f ? { ...f, indexSite: !f.indexSite } : f))
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xs text-xs transition-all duration-200"
                style={{
                  background: form.indexSite
                    ? "rgba(199,163,90,0.1)"
                    : "rgba(11,11,13,0.8)",
                  border: form.indexSite
                    ? "1px solid rgba(199,163,90,0.4)"
                    : "1px solid rgba(199,163,90,0.15)",
                  color: form.indexSite ? "#C7A35A" : "rgba(243,240,230,0.4)",
                }}
                data-ocid="admin_settings.toggle"
              >
                {form.indexSite ? "Jā — indexēt" : "Nē — noindex"}
              </button>
            </Field>
          </div>,
        )}

        {/* Stripe */}
        {sectionCard(
          "Stripe maksājumi",
          "stripe",
          <div className="space-y-4">
            <div
              className="rounded-sm px-4 py-3 text-xs"
              style={{
                background: "rgba(199,163,90,0.04)",
                border: "1px solid rgba(199,163,90,0.15)",
                color: "rgba(243,240,230,0.45)",
              }}
            >
              Stripe ir pēc noklusējuma atslēgts. Ieslēdziet, kad būsiet gatavs
              pieņemt maksājumus.
            </div>
            <Field label="Stripe maksājumi">
              <button
                type="button"
                onClick={() =>
                  setForm((f) =>
                    f ? { ...f, stripeEnabled: !f.stripeEnabled } : f,
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xs text-xs transition-all duration-200"
                style={{
                  background: form.stripeEnabled
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(11,11,13,0.8)",
                  border: form.stripeEnabled
                    ? "1px solid rgba(34,197,94,0.3)"
                    : "1px solid rgba(199,163,90,0.15)",
                  color: form.stripeEnabled
                    ? "#86efac"
                    : "rgba(243,240,230,0.4)",
                }}
                data-ocid="admin_settings.switch"
              >
                {form.stripeEnabled ? "✓ Ieslēgts" : "Atslēgts"}
              </button>
            </Field>
            <Field label="Stripe publiskā atslēga (pk_...)">
              <input
                type="text"
                value={form.stripePublicKey}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, stripePublicKey: e.target.value } : f,
                  )
                }
                placeholder="pk_test_..."
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
            <Field label="Stripe Webhook Secret">
              <input
                type="password"
                value={form.stripeWebhookSecret}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, stripeWebhookSecret: e.target.value } : f,
                  )
                }
                placeholder="whsec_..."
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
          </div>,
        )}

        {/* Analytics */}
        {sectionCard(
          "Analītika",
          "analytics",
          <div className="space-y-4">
            <Field label="Google Analytics 4 ID (G-XXXX)">
              <input
                type="text"
                value={form.ga4MeasurementId}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, ga4MeasurementId: e.target.value } : f,
                  )
                }
                placeholder="G-XXXXXXXXXX"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.2)";
                }}
              />
            </Field>
          </div>,
        )}

        {/* Change password link */}
        <div className="flex justify-end">
          <ChangePasswordLink
            onClick={() => onNavigate("/admin/change-password")}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

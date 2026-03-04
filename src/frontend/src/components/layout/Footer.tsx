import { Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useSettings } from "../../hooks/useQueries";

function CaffeineLink({ url }: { url: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors"
      style={{
        color: hovered ? "rgba(199,163,90,0.6)" : "rgba(243,240,230,0.25)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Built with ♥ using caffeine.ai
    </a>
  );
}

export function Footer() {
  const { data: settings } = useSettings();
  const year = new Date().getFullYear();

  const dayNames: Record<string, string> = {
    mon: "P",
    tue: "O",
    wed: "T",
    thu: "C",
    fri: "Pk",
    sat: "S",
    sun: "Sv",
  };

  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const hours = settings?.workingHours;

  return (
    <footer
      className="mt-24 border-t"
      style={{
        borderColor: "rgba(199,163,90,0.12)",
        background: "rgba(5,5,6,0.8)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div
              className="font-serif text-4xl mb-4 tracking-luxury"
              style={{ color: "#C7A35A", letterSpacing: "0.3em" }}
            >
              SETE
            </div>
            <p
              className="text-xs"
              style={{
                color: "rgba(243,240,230,0.45)",
                letterSpacing: "0.05em",
                lineHeight: 1.8,
              }}
            >
              Premium sushi. Rīga.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="gold-label mb-5">Kontakti</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin
                  size={14}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "#C7A35A" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "rgba(243,240,230,0.65)", lineHeight: 1.7 }}
                >
                  {settings?.pickupAddress || "Blaumaņa iela 34-2, Rīga"}
                </span>
              </div>
              {settings?.phone && (
                <div className="flex items-center gap-3">
                  <Phone
                    size={14}
                    className="flex-shrink-0"
                    style={{ color: "#C7A35A" }}
                  />
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-xs transition-colors"
                    style={{ color: "rgba(243,240,230,0.65)" }}
                  >
                    {settings.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Working hours */}
          <div>
            <p className="gold-label mb-5 flex items-center gap-2">
              <Clock size={12} />
              Darba laiks
            </p>
            {hours ? (
              <div className="space-y-1.5">
                {Object.entries(hours).map(([day, h]) => (
                  <div
                    key={day}
                    className="flex justify-between text-xs"
                    style={{ color: "rgba(243,240,230,0.55)" }}
                  >
                    <span
                      style={{
                        color: "rgba(243,240,230,0.4)",
                        minWidth: "2rem",
                      }}
                    >
                      {dayNames[day]}
                    </span>
                    <span>{h.closed ? "Slēgts" : `${h.open}–${h.close}`}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "rgba(243,240,230,0.4)" }}>
                P–Sv 12:00–22:00
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{
            borderTop: "1px solid rgba(199,163,90,0.1)",
            color: "rgba(243,240,230,0.3)",
          }}
        >
          <span>© {year} SETE</span>
          <CaffeineLink url={caffeineUrl} />
        </div>
      </div>
    </footer>
  );
}

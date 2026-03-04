import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface SuccessProps {
  orderId?: string;
  onNavigate: (path: string) => void;
}

export function Success({ orderId, onNavigate }: SuccessProps) {
  return (
    <div className="min-h-screen">
      <Header currentHash="/success" />

      <div className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", damping: 15 }}
            className="mb-8"
          >
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
              style={{
                background: "rgba(199,163,90,0.08)",
                border: "1px solid rgba(199,163,90,0.3)",
              }}
            >
              <CheckCircle2 size={36} style={{ color: "#C7A35A" }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="gold-label mb-4">Pasūtījums pieņemts</p>
            <h1
              className="font-serif mb-4"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              }}
            >
              Paldies par pasūtījumu!
            </h1>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "rgba(243,240,230,0.55)" }}
            >
              Mēs ar jums sazināsimies tuvāko minūšu laikā, lai apstiprinātu
              pasūtījumu.
            </p>

            {orderId && (
              <div
                className="inline-block px-5 py-2.5 rounded-sm mb-8 mt-4"
                style={{
                  background: "rgba(199,163,90,0.06)",
                  border: "1px solid rgba(199,163,90,0.2)",
                }}
              >
                <p className="gold-label text-xs mb-1">Pasūtījuma numurs</p>
                <p className="font-serif text-xl" style={{ color: "#C7A35A" }}>
                  {orderId}
                </p>
              </div>
            )}

            <button
              type="button"
              className="btn-gold flex items-center gap-2 mx-auto"
              onClick={() => onNavigate("/")}
              data-ocid="success.home_button"
            >
              Atgriezties uz sākumu
            </button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

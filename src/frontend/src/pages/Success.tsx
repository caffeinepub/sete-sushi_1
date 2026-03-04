import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface SuccessProps {
  onNavigate: (path: string) => void;
}

export function Success({ onNavigate }: SuccessProps) {
  // Read orderId from URL hash query param: e.g. #/success?orderId=ST-ABC-XYZ
  const orderId = new URLSearchParams(
    window.location.hash.split("?")[1] || "",
  ).get("orderId");

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
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              <CheckCircle2 size={36} style={{ color: "#4ade80" }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-ocid="success.success_state"
          >
            <h1
              className="font-serif mb-4"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              }}
            >
              Pasūtījums pieņemts.
            </h1>

            {orderId ? (
              <p
                className="text-sm leading-relaxed mb-2"
                style={{ color: "rgba(243,240,230,0.65)" }}
              >
                Jūsu pasūtījums{" "}
                <strong style={{ color: "#4ade80" }}>Nr. {orderId}</strong> ir
                pieņemts.
              </p>
            ) : null}

            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "rgba(243,240,230,0.65)" }}
            >
              Tuvākajā laikā sazināsimies ar Jums.
            </p>

            <button
              type="button"
              className="btn-gold flex items-center gap-2 mx-auto"
              onClick={() => onNavigate("/")}
              data-ocid="success.primary_button"
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

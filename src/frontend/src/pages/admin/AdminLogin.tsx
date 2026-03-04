import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { adminLogin } from "../../lib/storage";

function BackLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#/"
      className="text-xs"
      style={{
        color: hovered ? "rgba(199,163,90,0.5)" : "rgba(243,240,230,0.25)",
        transition: "color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      ← Atpakaļ uz veikalu
    </a>
  );
}

interface AdminLoginProps {
  onNavigate: (path: string) => void;
}

export function AdminLogin({ onNavigate }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Ievadiet paroli");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = adminLogin(password);
      setLoading(false);
      if (!result.success) {
        setError("Nepareiza parole");
        return;
      }
      if (result.firstLogin) {
        onNavigate("/admin/change-password");
      } else {
        onNavigate("/admin");
      }
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(26,11,16,0.5) 0%, transparent 60%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <div
            className="font-serif text-5xl mb-2 tracking-luxury"
            style={{ color: "#C7A35A", letterSpacing: "0.3em" }}
          >
            SETE
          </div>
          <p className="gold-label">Administratora pieslēgšanās</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-password" className="gold-label block mb-2">
              Parole
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ievadiet paroli"
                className="w-full px-4 py-3 pr-12 rounded-sm text-sm focus:outline-none"
                style={{
                  background: "rgba(11,11,13,0.9)",
                  border: error
                    ? "1px solid rgba(239,68,68,0.5)"
                    : "1px solid rgba(199,163,90,0.2)",
                  color: "#F3F0E6",
                  fontSize: "16px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(199,163,90,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error
                    ? "rgba(239,68,68,0.5)"
                    : "rgba(199,163,90,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                data-ocid="admin_login.password_input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "rgba(243,240,230,0.35)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && (
              <p
                className="text-xs mt-2"
                style={{ color: "#fca5a5" }}
                data-ocid="admin_login.error_state"
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center py-3.5 disabled:opacity-60"
            data-ocid="admin_login.submit_button"
          >
            {loading ? "Pārbauda…" : "Pieslēgties"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <BackLink />
        </div>
      </motion.div>
    </div>
  );
}

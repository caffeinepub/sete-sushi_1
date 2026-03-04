import { Eye, EyeOff, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { changeAdminPassword } from "../../lib/storage";

interface AdminChangePasswordProps {
  forced?: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AdminChangePassword({
  forced = false,
  currentPath,
  onNavigate,
}: AdminChangePasswordProps) {
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!newPass) errs.new = "Ievadiet jauno paroli";
    else if (newPass.length < 6) errs.new = "Parolei jābūt vismaz 6 simboliem";
    if (!confirmPass) errs.confirm = "Apstipriniet jauno paroli";
    else if (newPass !== confirmPass) errs.confirm = "Paroles nesakrīt";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    changeAdminPassword(newPass);
    setSuccess(true);
    setTimeout(() => onNavigate("/admin"), 1200);
  };

  const inputStyle = (hasError?: boolean) => ({
    background: "rgba(11,11,13,0.8)",
    border: `1px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(199,163,90,0.2)"}`,
    color: "#F3F0E6",
    fontSize: "16px" as const,
    borderRadius: "2px",
  });

  const content = (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center"
            style={{
              background: "rgba(199,163,90,0.1)",
              border: "1px solid rgba(199,163,90,0.3)",
            }}
          >
            <Shield size={18} style={{ color: "#C7A35A" }} />
          </div>
          <div>
            <h1
              className="font-serif text-xl"
              style={{
                color: "#F3F0E6",
                fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
              }}
            >
              Paroles maiņa
            </h1>
            {forced && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(199,163,90,0.7)" }}
              >
                Obligāti jāmaina pirms turpināšanas
              </p>
            )}
          </div>
        </div>

        {success ? (
          <div
            className="text-center py-8 rounded-sm"
            style={{
              background: "rgba(199,163,90,0.06)",
              border: "1px solid rgba(199,163,90,0.2)",
            }}
            data-ocid="admin_change_password.success_state"
          >
            <p className="font-serif text-lg" style={{ color: "#C7A35A" }}>
              Parole mainīta!
            </p>
            <p
              className="text-xs mt-2"
              style={{ color: "rgba(243,240,230,0.4)" }}
            >
              Pārsūtīšana…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New password */}
            <div>
              <label className="gold-label block mb-2" htmlFor="new-password">
                Jaunā parole
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Vismaz 6 simboli"
                  className="w-full px-4 py-3 pr-12 text-sm focus:outline-none"
                  style={inputStyle(!!errors.new)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(199,163,90,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.new
                      ? "rgba(239,68,68,0.5)"
                      : "rgba(199,163,90,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  data-ocid="admin_change_password.new_password_input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(243,240,230,0.35)" }}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.new && (
                <p className="text-xs mt-1.5" style={{ color: "#fca5a5" }}>
                  {errors.new}
                </p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label
                className="gold-label block mb-2"
                htmlFor="confirm-password"
              >
                Apstiprināt paroli
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Atkārtojiet jauno paroli"
                  className="w-full px-4 py-3 pr-12 text-sm focus:outline-none"
                  style={inputStyle(!!errors.confirm)}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(199,163,90,0.5)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(199,163,90,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.confirm
                      ? "rgba(239,68,68,0.5)"
                      : "rgba(199,163,90,0.2)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  data-ocid="admin_change_password.confirm_input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(243,240,230,0.35)" }}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-xs mt-1.5" style={{ color: "#fca5a5" }}>
                  {errors.confirm}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-gold w-full justify-center py-3.5 mt-2"
              data-ocid="admin_change_password.submit_button"
            >
              Saglabāt jauno paroli
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );

  if (forced) {
    // Not wrapped in AdminLayout since we're redirecting from login
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">{content}</div>
      </div>
    );
  }

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      {content}
    </AdminLayout>
  );
}

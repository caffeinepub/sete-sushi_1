import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { isAdminAuthenticated, isFirstLogin } from "./lib/storage";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { OfferDetail } from "./pages/OfferDetail";
import { Offers } from "./pages/Offers";
import { Success } from "./pages/Success";
import { AdminChangePassword } from "./pages/admin/AdminChangePassword";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminOffers } from "./pages/admin/AdminOffers";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminSettings } from "./pages/admin/AdminSettings";

// ── Hash router helpers ────────────────────────────────────────────────────

function getHashPath(): string {
  const hash = window.location.hash;
  if (!hash || hash === "#") return "/";
  return hash.startsWith("#/") ? hash.slice(1) : `/${hash.slice(1)}`;
}

function parseRoute(path: string): {
  page: string;
  params: Record<string, string>;
  search: Record<string, string>;
} {
  const [pathPart, queryPart] = path.split("?");
  const search: Record<string, string> = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => {
      search[k] = v;
    });
  }

  const segments = pathPart.split("/").filter(Boolean);

  // Admin routes
  if (segments[0] === "admin") {
    const sub = segments[1] || "";
    return { page: `admin/${sub || ""}`, params: {}, search };
  }

  // Public routes
  if (segments[0] === "offer" && segments[1]) {
    return { page: "offer", params: { id: segments[1] }, search };
  }
  if (segments[0] === "checkout" && segments[1]) {
    return { page: "checkout", params: { id: segments[1] }, search };
  }
  if (segments[0] === "offers") return { page: "offers", params: {}, search };
  if (segments[0] === "success") return { page: "success", params: {}, search };

  return { page: "home", params: {}, search };
}

// ── Admin route guard ──────────────────────────────────────────────────────
function isAdminRoute(page: string) {
  return page.startsWith("admin/") || page === "admin/";
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [path, setPath] = useState(getHashPath);
  const [successOrderId, setSuccessOrderId] = useState<string | undefined>();

  useEffect(() => {
    const handler = () => setPath(getHashPath());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((to: string, state?: Record<string, string>) => {
    if (to === "/success" && state?.orderId) {
      setSuccessOrderId(state.orderId);
    }
    window.location.hash = `#${to}`;
  }, []);

  const { page, params, search } = parseRoute(path);

  // Admin auth guard
  if (
    isAdminRoute(page) &&
    page !== "admin/login" &&
    page !== "admin/change-password"
  ) {
    if (!isAdminAuthenticated()) {
      window.location.hash = "#/admin/login";
      return null;
    }
    if (isFirstLogin()) {
      window.location.hash = "#/admin/change-password";
      return null;
    }
  }

  // Render pages
  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home onNavigate={navigate} />;
      case "offers":
        return <Offers onNavigate={navigate} />;
      case "offer":
        return <OfferDetail id={params.id ?? ""} onNavigate={navigate} />;
      case "checkout":
        return <Checkout offerId={params.id ?? ""} onNavigate={navigate} />;
      case "success":
        return (
          <Success
            orderId={search.orderId || successOrderId}
            onNavigate={navigate}
          />
        );
      case "admin/login":
        return <AdminLogin onNavigate={navigate} />;
      case "admin/":
      case "admin/dashboard":
        return <AdminDashboard currentPath="/admin" onNavigate={navigate} />;
      case "admin/offers":
        return (
          <AdminOffers currentPath="/admin/offers" onNavigate={navigate} />
        );
      case "admin/orders":
        return (
          <AdminOrders currentPath="/admin/orders" onNavigate={navigate} />
        );
      case "admin/settings":
        return (
          <AdminSettings currentPath="/admin/settings" onNavigate={navigate} />
        );
      case "admin/change-password":
        return (
          <AdminChangePassword
            forced={isFirstLogin()}
            currentPath="/admin/change-password"
            onNavigate={navigate}
          />
        );
      default:
        // 404 → redirect home
        window.location.hash = "#/";
        return null;
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0B0B0D",
            border: "1px solid rgba(199,163,90,0.25)",
            color: "#F3F0E6",
          },
        }}
      />
      {renderPage()}
    </>
  );
}

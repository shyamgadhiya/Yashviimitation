import { Suspense, lazy, useEffect, useState } from "react";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import MobileLeadBar from "./components/layout/MobileLeadBar.jsx";
import Seo from "./components/seo/Seo.jsx";
import ThemeToggle from "./components/layout/ThemeToggle.jsx";
import Spinner from "./components/ui/Spinner.jsx";
import { trackPageView } from "./lib/analytics.js";
import { checkAdminAccess, getAdminSetupError, getErrorMessage } from "./lib/supabase/admin.js";
import { db } from "./lib/supabase/client.js";

const AdminLogin = lazy(() => import("./features/admin/AdminLogin.jsx"));
const AdminPanel = lazy(() => import("./features/admin/AdminPanel.jsx"));
const CollectionPage = lazy(() => import("./features/catalog/CollectionPage.jsx"));
const ProductPage = lazy(() => import("./features/catalog/ProductPage.jsx"));
const HomePage = lazy(() => import("./features/home/HomePage.jsx"));

function RouteFallback() {
  return (
    <div style={{ minHeight: "60vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spinner />
    </div>
  );
}

function ScrollAndTrack() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackPageView(`${location.pathname}${location.search}`, document.title);
  }, [location.pathname, location.search]);

  return null;
}

function PublicLayout() {
  return (
    <>
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <main style={{ animation: "fadeUp .35s ease both" }}>
          <Outlet />
        </main>
      </Suspense>
      <Footer />
      <MobileLeadBar />
      <ThemeToggle />
    </>
  );
}

function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 100 }}>
      <Seo title="Page Not Found" description="The requested page could not be found." noindex />
      <div className="page-shell" style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem 80px", textAlign: "center" }}>
        <p style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 10 }}>Page Not Found</p>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, color: "var(--text)", marginBottom: 12 }}>Let us help you find the right jewellery.</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Browse our collection or head back to the home page for bridal, festive and daily wear inspiration.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn-primary" style={{ padding: "12px 24px", borderRadius: 8 }}>
            Back to Home
          </Link>
          <Link to="/collection" className="btn-outline" style={{ padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminRoutePage({ authReady, session, isAdmin, authError, onLogout }) {
  if (!authReady) {
    return (
      <>
        <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spinner />
        </div>
        <ThemeToggle />
      </>
    );
  }

  if (!session || !isAdmin) {
    return (
      <>
        <Seo title="Admin Login" description="Admin access for Yashvi Imitation." path="/admin" noindex />
        <Suspense fallback={<RouteFallback />}>
          <AdminLogin session={session} authError={authError} onLogout={onLogout} />
        </Suspense>
        <ThemeToggle />
      </>
    );
  }

  return (
    <>
      <Seo title="Admin Panel" description="Admin panel for Yashvi Imitation." path="/admin" noindex />
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <AdminPanel adminEmail={session.user.email} onLogout={onLogout} />
      </Suspense>
      <Footer />
      <ThemeToggle />
    </>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;

    const syncSession = async (nextSession) => {
      if (!active) return;

      setAuthReady(false);
      setSession(nextSession);
      setAuthError("");

      if (!nextSession?.user) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        const allowed = await checkAdminAccess(nextSession.user.id);
        if (!active) return;
        setIsAdmin(allowed);
        setAuthError(allowed ? "" : "This account is not approved for admin access.");
      } catch (error) {
        if (!active) return;
        setIsAdmin(false);
        setAuthError(getAdminSetupError(error));
      }

      if (active) setAuthReady(true);
    };

    db.auth.getSession().then(({ data: { session: nextSession } }) => syncSession(nextSession));
    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, nextSession) => {
      syncSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const { error } = await db.auth.signOut();
    if (error) {
      window.alert(getErrorMessage(error, "Sign out failed."));
    }
  };

  return (
    <>
      <ScrollAndTrack />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/occasion/:occasion" element={<CollectionPage />} />
          <Route path="/category/:slug" element={<CollectionPage />} />
          <Route path="/product/:id/:productSlug?" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/admin" element={<AdminRoutePage authReady={authReady} session={session} isAdmin={isAdmin} authError={authError} onLogout={logout} />} />
      </Routes>
    </>
  );
}

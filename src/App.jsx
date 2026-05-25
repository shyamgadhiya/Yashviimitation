import { useEffect, useState } from "react";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import ThemeToggle from "./components/layout/ThemeToggle.jsx";
import Spinner from "./components/ui/Spinner.jsx";
import AdminLogin from "./features/admin/AdminLogin.jsx";
import AdminPanel from "./features/admin/AdminPanel.jsx";
import CollectionPage from "./features/catalog/CollectionPage.jsx";
import HomePage from "./features/home/HomePage.jsx";
import { checkAdminAccess, getAdminSetupError, getErrorMessage } from "./lib/supabase/admin.js";
import { db } from "./lib/supabase/client.js";

export default function App() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");

  const go = (nextPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(nextPage);
  };

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
      return;
    }
    go("home");
  };

  if (page === "admin") {
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
          <AdminLogin session={session} authError={authError} onLogout={logout} />
          <ThemeToggle />
        </>
      );
    }

    return (
      <>
        <Header page={page} setPage={go} />
        <AdminPanel adminEmail={session.user.email} onLogout={logout} />
        <Footer />
        <ThemeToggle />
      </>
    );
  }

  return (
    <>
      <Header page={page} setPage={go} />
      <main style={{ animation: "fadeUp .35s ease both" }}>
        {page === "home" && <HomePage setPage={go} />}
        {(page === "collection" || page === "occasions") && <CollectionPage />}
      </main>
      <Footer />
      <ThemeToggle />
    </>
  );
}

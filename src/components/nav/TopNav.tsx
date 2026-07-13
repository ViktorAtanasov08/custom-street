import { Link } from "@tanstack/react-router";
import { ShoppingBag, User as UserIcon, Globe, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-context";

export function TopNav() {
  const { t, lang, setLang } = useI18n();
  const { count, setOpen } = useCart();
  const { user, signOut } = useAuth();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [menu]);

  const links: Array<{ to: string; key: "nav_shop" | "nav_about" | "nav_drop" }> = [
    { to: "/shop", key: "nav_shop" },
    { to: "/drop", key: "nav_drop" },
    { to: "/about", key: "nav_about" },
  ];

  const doSignOut = async () => {
    await signOut();
    setMenu(false);
    toast.success(t("auth_success_signout"));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-xl tracking-tight sm:text-2xl">
          MERCH<span className="text-holo">·</span>ANGO
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.key}>
              <Link
                to={l.to}
                className="group relative text-sm font-medium uppercase tracking-wider text-foreground/80 transition hover:text-foreground"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lang + l.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-block"
                  >
                    {t(l.key)}
                  </motion.span>
                </AnimatePresence>
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label="Toggle language"
            className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition hover:border-foreground sm:flex"
          >
            <Globe className="h-3.5 w-3.5" />
            <AnimatePresence mode="wait">
              <motion.span key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {t("lang_toggle")}
              </motion.span>
            </AnimatePresence>
          </button>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenu((v) => !v)}
                aria-label={t("my_account")}
                className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-xs font-medium transition hover:border-foreground"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground text-background">
                  {user.email?.[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden max-w-[120px] truncate sm:inline">{user.email}</span>
              </button>
              {menu && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
                  <div className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
                    {t("account")}
                    <p className="truncate text-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={doSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("sign_out")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              aria-label={t("sign_in")}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition hover:border-foreground"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("sign_in")}</span>
            </Link>
          )}

          <button
            onClick={() => setOpen(true)}
            aria-label={`Cart (${count} items)`}
            className="relative rounded-full p-2 transition hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

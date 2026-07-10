import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "@/components/catalog/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Merchango — Wear the future" },
      { name: "description", content: "150 customizable streetwear pieces. Built for the streets, designed by you." },
      { property: "og:title", content: "Merchango — Wear the future" },
      { property: "og:description", content: "150 customizable streetwear pieces. Built for the streets, designed by you." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const featured = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute -left-40 top-10 h-96 w-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, #ec489966, transparent 70%)" }} />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, #3b82f666, transparent 70%)" }} />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              {t("hero_kicker")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="font-display text-5xl uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-8xl"
            >
              {t("hero_title").split(" ")[0]} <br />
              <span className="text-holo">{t("hero_title").split(" ").slice(1).join(" ")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="mt-6 max-w-md text-base text-muted-foreground"
            >
              {t("hero_sub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/shop"
                className="holo-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm uppercase tracking-widest text-white shadow-[var(--gradient-holo-glow)] transition active:scale-95"
              >
                {t("hero_cta")} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-foreground px-6 py-3 font-display text-sm uppercase tracking-widest transition hover:bg-foreground hover:text-background"
              >
                {t("hero_cta2")}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-3xl border border-border grain-overlay"
            style={{ background: "linear-gradient(135deg, var(--cream), color-mix(in oklab, var(--purple-neon) 12%, var(--cream)))" }}
          >
            {featured[0]?.colors[0]?.image && (
              <img
                src={featured[0].colors[0].image}
                alt=""
                className="absolute inset-0 h-full w-full object-contain p-8 mix-blend-multiply"
              />
            )}
            <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              {featured[0]?.name}
            </div>
            <div className="absolute right-4 top-4 rounded-full holo-gradient px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
              {t("drop_tag")}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("nav_collections")}</p>
            <h2 className="font-display text-3xl uppercase tracking-tight sm:text-5xl">{t("featured")}</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest transition hover:gap-2"
          >
            {t("view_all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.code} p={p} i={i} />)}
        </div>
      </section>
    </div>
  );
}

import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products } from "@/data/products";
import { Viewer, type View } from "@/components/customizer/Viewer";
import { ControlPanel } from "@/components/customizer/ControlPanel";
import { useCart } from "@/lib/cart-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/product/$code")({
  loader: ({ params }) => {
    const p = getProduct(params.code);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — NEO·STREET` },
          { name: "description", content: `Customize the ${loaderData.name}. ${loaderData.desc}` },
          { property: "og:title", content: `${loaderData.name} — NEO·STREET` },
          { property: "og:description", content: `Customize the ${loaderData.name}.` },
          ...(loaderData.colors[0]?.image
            ? [{ property: "og:image", content: loaderData.colors[0].image }]
            : []),
        ]
      : [{ title: "Product — NEO·STREET" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center">
      <p className="font-display text-2xl uppercase">Product not found</p>
    </div>
  ),
});

function ProductPage() {
  const p = Route.useLoaderData();
  const nav = useNavigate();
  const { add, setOpen } = useCart();
  const { t } = useI18n();

  const [size, setSize] = useState(p.sizes[Math.min(2, p.sizes.length - 1)]);
  const [color, setColor] = useState(p.colors.find((c: typeof p.colors[number]) => c.image) ?? p.colors[0]);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<View>("front");
  const [logoPos, setLogoPos] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const [textFont, setTextFont] = useState("brutal");
  const [textColor, setTextColor] = useState("#0a0a0a");
  const [overlayPos, setOverlayPos] = useState({ x: 0, y: -10 });
  const [editMode, setEditMode] = useState(false);

  const unitPrice = useMemo(() => {
    let x = p.price;
    if (logoPos) x += 8;
    if (customText) x += 12;
    return x;
  }, [p.price, logoPos, customText]);
  const totalPrice = unitPrice * qty;

  const summary = `${t("summary_size")} ${size} · ${color.name}${customText ? ` · ${t("summary_text")}: "${customText}"` : ""}${logoPos ? ` · Logo` : ""}`;

  const onAdd = () => {
    add({
      code: p.code, name: p.name, image: color.image, size,
      colorName: color.name, colorHex: color.hex, qty, unitPrice,
      logoPlacement: logoPos, customText: customText || null,
      textFont: customText ? textFont : null, textColor: customText ? textColor : null,
    });
    toast.success(t("added"), { description: summary });
    setTimeout(() => setOpen(true), 400);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6">
      <button
        onClick={() => nav({ to: "/shop" })}
        className="mb-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("back_to_shop")}
      </button>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="h-[70vh] min-h-[420px] md:sticky md:top-20 md:h-[calc(100vh-8rem)]">
          <Viewer
            color={color} view={view} setView={setView}
            logoPos={logoPos} customText={customText}
            textColor={textColor} textFont={textFont}
            overlayPos={overlayPos} setOverlayPos={setOverlayPos}
            editMode={editMode} setEditMode={setEditMode}
          />
        </div>

        <ControlPanel
          product={p}
          size={size} setSize={setSize}
          color={color} setColor={setColor}
          qty={qty} setQty={setQty}
          logoPos={logoPos} setLogoPos={setLogoPos}
          customText={customText} setCustomText={setCustomText}
          textFont={textFont} setTextFont={setTextFont}
          textColor={textColor} setTextColor={setTextColor}
          totalPrice={totalPrice}
        />
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.name}</p>
            <p className="truncate text-sm font-medium">{summary}</p>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-right">{t("cart_total")}</p>
            <p className="text-lg font-semibold">${totalPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={onAdd}
            className="holo-gradient shrink-0 rounded-full px-5 py-3 font-display text-xs uppercase tracking-widest text-white shadow-[var(--gradient-holo-glow)] transition active:scale-95 sm:px-8 sm:text-sm"
          >
            {t("add_to_cart")} · ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

// Prevent tree-shaking of products import for HMR
void products;

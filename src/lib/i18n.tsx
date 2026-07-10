import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STRINGS = {
  en: {
    nav_shop: "Shop", nav_collections: "Collections", nav_about: "About", nav_drop: "Drop",
    hero_kicker: "Season 01 / Drop", hero_title: "Wear the future.",
    hero_sub: "150 pieces. Fully customizable. Built for the streets.",
    hero_cta: "Enter the shop", hero_cta2: "Watch the drop",
    shop_title: "The Catalog", shop_sub: "Every piece. Every colorway. Yours to design.",
    filter_all: "All", filter_category: "Category", filter_gender: "Gender", filter_search: "Search",
    empty_title: "Nothing matches", empty_sub: "Try a different filter or search term.",
    customize: "Customize", size: "Size", color: "Color", quantity: "Quantity",
    view_front: "Front", view_back: "Back", view_left: "Left", view_right: "Right",
    front_only: "Customization available on Front view only",
    tab_logo: "Logo Placement", tab_text: "Custom Text",
    logo_center: "Center Chest", logo_left: "Left Chest", logo_back: "Back",
    text_placeholder: "Your text (max 15)", text_font: "Font", text_color: "Text color",
    edit_position: "Edit Position", done_editing: "Done", printable_zone: "Printable zone",
    add_to_cart: "Add to cart", added: "Added to cart",
    cart_title: "Your cart", cart_empty: "Your cart is empty.", cart_total: "Total",
    cart_checkout: "Checkout", cart_remove: "Remove",
    summary_size: "Size", summary_qty: "Qty", summary_text: "Text",
    logo_surcharge: "Logo +$8", text_surcharge: "Text +$12",
    back_to_shop: "Back to shop", zoom_in: "Zoom in", zoom_out: "Zoom out",
    rotate_l: "Rotate left", rotate_r: "Rotate right", fabric_detail: "Fabric detail",
    lang_toggle: "Español",
    featured: "Featured", view_all: "View all", drop_tag: "Drop 01",
    load_more: "Load more", not_found: "Product not found",
    dec_qty: "Decrease quantity", inc_qty: "Increase quantity",
    logo_label: "Logo",
    // Auth
    sign_in: "Sign in", sign_up: "Sign up", sign_out: "Sign out",
    account: "Account", email: "Email", password: "Password",
    auth_signin_title: "Welcome back", auth_signup_title: "Create account",
    auth_signin_sub: "Sign in to continue designing.",
    auth_signup_sub: "Join Merchango to save your designs.",
    have_account: "Already have an account?", no_account: "Don't have an account?",
    auth_submit_signin: "Sign in", auth_submit_signup: "Create account",
    auth_success_signin: "Signed in", auth_success_signup: "Account created",
    auth_success_signout: "Signed out",
    auth_err_generic: "Something went wrong. Try again.",
    my_account: "My account",
  },
  es: {
    nav_shop: "Tienda", nav_collections: "Colecciones", nav_about: "Nosotros", nav_drop: "Drop",
    hero_kicker: "Temporada 01 / Drop", hero_title: "Viste el futuro.",
    hero_sub: "150 piezas. Totalmente personalizables. Hechas para la calle.",
    hero_cta: "Entrar a la tienda", hero_cta2: "Ver el drop",
    shop_title: "El Catálogo", shop_sub: "Cada pieza. Cada color. Diséñalo tú.",
    filter_all: "Todos", filter_category: "Categoría", filter_gender: "Género", filter_search: "Buscar",
    empty_title: "Sin resultados", empty_sub: "Prueba con otro filtro o búsqueda.",
    customize: "Personalizar", size: "Talla", color: "Color", quantity: "Cantidad",
    view_front: "Frente", view_back: "Espalda", view_left: "Izquierda", view_right: "Derecha",
    front_only: "Personalización disponible solo en vista frontal",
    tab_logo: "Ubicación del logo", tab_text: "Texto personalizado",
    logo_center: "Centro pecho", logo_left: "Pecho izquierdo", logo_back: "Espalda",
    text_placeholder: "Tu texto (máx 15)", text_font: "Fuente", text_color: "Color del texto",
    edit_position: "Editar posición", done_editing: "Listo", printable_zone: "Zona imprimible",
    add_to_cart: "Añadir al carrito", added: "Añadido al carrito",
    cart_title: "Tu carrito", cart_empty: "Tu carrito está vacío.", cart_total: "Total",
    cart_checkout: "Pagar", cart_remove: "Eliminar",
    summary_size: "Talla", summary_qty: "Cant", summary_text: "Texto",
    logo_surcharge: "Logo +$8", text_surcharge: "Texto +$12",
    back_to_shop: "Volver a la tienda", zoom_in: "Acercar", zoom_out: "Alejar",
    rotate_l: "Rotar izquierda", rotate_r: "Rotar derecha", fabric_detail: "Detalle tela",
    lang_toggle: "English",
    featured: "Destacados", view_all: "Ver todo", drop_tag: "Drop 01",
    load_more: "Cargar más", not_found: "Producto no encontrado",
    dec_qty: "Disminuir cantidad", inc_qty: "Aumentar cantidad",
    logo_label: "Logo",
    // Auth
    sign_in: "Iniciar sesión", sign_up: "Registrarse", sign_out: "Cerrar sesión",
    account: "Cuenta", email: "Correo", password: "Contraseña",
    auth_signin_title: "Bienvenido de vuelta", auth_signup_title: "Crea tu cuenta",
    auth_signin_sub: "Inicia sesión para seguir diseñando.",
    auth_signup_sub: "Únete a Merchango para guardar tus diseños.",
    have_account: "¿Ya tienes cuenta?", no_account: "¿No tienes cuenta?",
    auth_submit_signin: "Iniciar sesión", auth_submit_signup: "Crear cuenta",
    auth_success_signin: "Sesión iniciada", auth_success_signup: "Cuenta creada",
    auth_success_signout: "Sesión cerrada",
    auth_err_generic: "Algo salió mal. Inténtalo de nuevo.",
    my_account: "Mi cuenta",
  },
} as const;

type Lang = "en" | "es";
type Key = keyof typeof STRINGS.en;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en", setLang: () => {}, t: (k) => STRINGS.en[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("merchango.lang");
      if (saved === "en" || saved === "es") setLang(saved);
    } catch {}
  }, []);
  const set = (l: Lang) => {
    setLang(l);
    try { localStorage.setItem("merchango.lang", l); } catch {}
  };
  const t = (k: Key) => STRINGS[lang][k];
  return <Ctx.Provider value={{ lang, setLang: set, t }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);

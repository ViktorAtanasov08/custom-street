# Merchango — Custom Streetwear

A streetwear storefront prototype with product customization, a shopping cart and a simulated checkout.

Built with **React, TypeScript, TanStack Start and Tailwind CSS**, with Supabase for authentication. This repository is connected to Lovable and includes AI-assisted development.

> **Status:** portfolio prototype. Checkout does not process payments. Cart and order history use browser local storage; they are not backed by a shared order database.

## Explore the code

- **Product catalog:** product cards, search and category filters.
- **Customization:** choose a size and color, preview text and uploaded artwork, and see price adjustments.
- **Cart:** add, edit and remove configured items.
- **Demo checkout:** calculate a summary and create a local order.
- **Account flows:** Supabase sign-in, sign-up, sign-out and password reset.

Uploaded artwork and all preview settings are not fully carried into the saved cart item yet. The preview should not be treated as a production-ready print specification.

## Run locally

Prerequisites: Bun and a Supabase project with authentication configured.

```sh
git clone https://github.com/ViktorAtanasov08/custom-street.git
cd custom-street
bun install --frozen-lockfile
```

Set these variables in a local environment file such as `.env.local`, using your own project's values:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The shared authentication client uses the `VITE_` variables in the browser and the unprefixed variables as a server-rendering fallback. Use a publishable key, never a service-role or secret key in browser configuration. Configure allowed authentication redirect URLs in your Supabase project.

```sh
bun run dev
```

Open the local address printed by Vite.

## Useful commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start development |
| `bun run build` | Build the application |
| `bun run lint` | Run ESLint |
| `bun run preview` | Preview the build |

These are the repository's configured commands. Build and browser behaviour have not been independently verified as part of this documentation update.

## Code map

| Path | Responsibility |
| --- | --- |
| `src/routes/` | Catalog, product, checkout and account pages |
| `src/components/customizer/` | Garment preview and customization controls |
| `src/data/products.ts` | Product catalog data |
| `src/lib/cart-store.tsx` | Cart state and browser persistence |
| `src/lib/orders-store.tsx` | Local demo order history |
| `src/integrations/supabase/` | Authentication clients and generated types |
| `src/lib/i18n.tsx` | Interface translations |

## Next improvements

- Preserve uploaded artwork and all customization settings when editing a cart item.
- Add focused checks for price calculation and cart editing.
- Replace local demo orders with validated server-side storage before real commerce use.
- Document a verified build and add screenshots from a running version.

## Development notes

The project uses Lovable's TanStack/Vite configuration. See [AGENTS.md](AGENTS.md) before changing the build setup or publishing Git history. Keep commits additive so that the Lovable connection retains its history.

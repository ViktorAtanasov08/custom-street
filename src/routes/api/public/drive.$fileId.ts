import { createFileRoute } from "@tanstack/react-router";

// Proxies Google Drive images through the Lovable connector gateway so the
// browser can render private Drive photos without leaking credentials.
export const Route = createFileRoute("/api/public/drive/$fileId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fileId = params.fileId.replace(/[^A-Za-z0-9_-]/g, "");
        if (!fileId) return new Response("Bad id", { status: 400 });

        const lov = process.env.LOVABLE_API_KEY;
        const gd = process.env.GOOGLE_DRIVE_API_KEY;
        if (!lov || !gd) return new Response("Gateway not configured", { status: 500 });

        const upstream = await fetch(
          `https://connector-gateway.lovable.dev/google_drive/drive/v3/files/${fileId}?alt=media`,
          { headers: { Authorization: `Bearer ${lov}`, "X-Connection-Api-Key": gd } },
        );
        if (!upstream.ok || !upstream.body) {
          return new Response("Upstream error", { status: upstream.status || 502 });
        }
        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});

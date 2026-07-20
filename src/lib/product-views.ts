import map from "@/data/drive-views.json";

type ViewMap = Record<string, Record<string, Partial<Record<"1" | "7" | "8", string>>>>;
const views = map as ViewMap;

/** Extract the numeric product code from a code like "CA6665" → "6665". */
function normalizeCode(code: string): string {
  const m = code.match(/(\d{3,})/);
  return m ? m[1] : code;
}

/** Extract the Roly color id from a front-view CDN URL like ".../6665_02_2_1.jpg". */
export function colorIdFromImage(image: string | null | undefined): string | null {
  if (!image) return null;
  const m = image.match(/_(\d+)_2_1\.jpg/i);
  return m ? m[1] : null;
}

export type SideView = "back" | "left" | "right";
const VIEW_KEYS: Record<SideView, "1" | "7" | "8"> = {
  back: "1",
  left: "7",
  right: "8",
};

/**
 * Resolve the image URL for a non-front view.
 * - back: served by the public gorfactory CDN (works everywhere).
 * - left/right: proxied through /api/public/drive/{fileId} using photos
 *   the workspace owner curated in Google Drive.
 * Returns null when we have no matching asset.
 */
export function sideViewUrl(
  productCode: string,
  colorImage: string | null,
  view: SideView,
): string | null {
  const colorId = colorIdFromImage(colorImage);
  const code = normalizeCode(productCode);

  if (view === "back" && colorId) {
    // Same CDN pattern, view segment "1" instead of "2".
    return colorImage!.replace(/_(\d+)_2_1\.jpg/i, `_$1_1_1.jpg`);
  }

  const fileId = colorId ? views[code]?.[colorId]?.[VIEW_KEYS[view]] : undefined;
  if (!fileId) return null;
  return `/api/public/drive/${fileId}`;
}

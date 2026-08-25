import { renderPartyOgImage } from "@/lib/og-image";

export const alt = "Theresa wird 25 – Geburtstagsparty";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderPartyOgImage();
}

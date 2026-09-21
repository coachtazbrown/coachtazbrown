import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated 1200×630 Open Graph / Twitter card image. Applies to every route
 * automatically (Next file-based metadata), so social shares always have a
 * branded preview without anyone hand-making an image per page.
 *
 * Kept to the bundled default font (plain Latin text, no special glyphs) so it
 * renders offline / in CI without a dynamic font download. Every <div> with
 * multiple children declares an explicit display, as Satori requires.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #141034 0%, #06060F 100%)",
          color: "#EDEBFF",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#8C8AB8" }}>{SITE.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            Give me a topic.
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#E8FF5B" }}>
            I&apos;ll build the videos.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8C8AB8" }}>
          Faceless video · researched · fact-checked · ready to ship
        </div>
      </div>
    ),
    { ...size }
  );
}

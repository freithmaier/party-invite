import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const RANSOM_COLORS = [
  "#e0393e",
  "#2b6fb3",
  "#f3c630",
  "#4d9a51",
  "#e77fae",
  "#ee7f2d",
  "#7a4f9e",
];

async function toDataUri(file: string, mime: string) {
  const buf = await readFile(join(process.cwd(), "public", file));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function renderPartyOgImage(name?: string) {
  const [discoSrc, faceSrc] = await Promise.all([
    toDataUri("disco.png", "image/png"),
    toDataUri("face.png", "image/png"),
  ]);

  // Kept out of the central text block (roughly x 260-940, y 250-500).
  const confettiSpots = [
    { left: 40, top: 30 },
    { left: 250, top: 195 },
    { left: 60, top: 560 },
    { left: 400, top: 560 },
    { left: 950, top: 40 },
    { left: 1140, top: 195 },
    { left: 1100, top: 560 },
    { left: 760, top: 560 },
  ];
  const confetti = confettiSpots.map((spot, i) => ({
    ...spot,
    size: 10 + ((i * 13) % 16),
    color: RANSOM_COLORS[i % RANSOM_COLORS.length],
    round: i % 3 !== 0,
  }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fdf6ec",
          position: "relative",
          padding: "56px 70px",
          fontFamily: "sans-serif",
        }}
      >
        {confetti.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              position: "absolute",
              left: c.left,
              top: c.top,
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              borderRadius: c.round ? 999 : 4,
              opacity: 0.75,
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <img src={discoSrc} alt="" width={100} height={131} style={{ display: "flex" }} />

          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#e0393e" }}>THERESA</span>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#3d2f28", marginLeft: 16 }}>
              WIRD
            </span>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#2b6fb3", marginLeft: 16 }}>
              25!
            </span>
          </div>

          <div style={{ display: "flex", position: "relative" }}>
            <img
              src={faceSrc}
              alt=""
              width={120}
              height={110}
              style={{
                display: "flex",
                borderRadius: 20,
                objectFit: "cover",
                border: "4px solid #fdf6ec",
              }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: -14,
                right: -14,
                width: 44,
                height: 44,
                borderRadius: 999,
                backgroundColor: "#f3c630",
                color: "#3d2f28",
                fontSize: 20,
                fontWeight: 800,
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #fdf6ec",
              }}
            >
              25
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 20,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: "#7a4f2a" }}>
            {name ? `Hallo ${name}! 🎉` : "Du bist eingeladen! 🎉"}
          </div>
          <div style={{ display: "flex", fontSize: 42, fontWeight: 700, color: "#3d2f28" }}>
            5. September · ab 19:00 Uhr
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#7a5c40" }}>
            Buchenweg 1, 94447 Plattling
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

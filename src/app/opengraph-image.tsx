import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DevMinds Links — URL Shortener & Link-in-Bio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F9F7F2",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#B94047",
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(185,64,71,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(185,64,71,0.04)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 4,
                height: 48,
                background: "#B94047",
                borderRadius: 2,
              }}
            />
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "-0.5px",
              }}
            >
              DevMinds Links
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 300,
              color: "#111827",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            Shorten. Share.{" "}
            <span style={{ color: "#B94047" }}>Connect.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 26,
              color: "#4B5563",
              fontWeight: 300,
              margin: 0,
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            Create short links instantly or build your custom link-in-bio page.
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
            }}
          >
            {["Instant redirect", "Detailed analytics", "Link-in-bio page"].map(
              (feat) => (
                <div
                  key={feat}
                  style={{
                    background: "rgba(185,64,71,0.08)",
                    border: "1px solid rgba(185,64,71,0.2)",
                    borderRadius: 999,
                    padding: "8px 20px",
                    fontSize: 18,
                    color: "#B94047",
                    fontWeight: 500,
                  }}
                >
                  {feat}
                </div>
              )
            )}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 20,
            color: "#9CA3AF",
            letterSpacing: "0.5px",
          }}
        >
          l.devminds.online
        </div>
      </div>
    ),
    { ...size }
  );
}

"use client";
import { RotateCw } from "lucide-react";

export default function RootError({ error, reset }) {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#fff",
            fontFamily: "system-ui",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
              💥 Critical Error
            </h1>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              {error?.message || "Something went very wrong"}
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 20px",
                background: "#ff6b35",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

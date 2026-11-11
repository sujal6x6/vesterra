"use client";

import { useEffect, useState } from "react";

export default function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/maintenance")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load maintenance settings.");
        return response.json() as Promise<{ maintenance: { enabled: boolean } }>;
      })
      .then((data) => setEnabled(data.maintenance.enabled))
      .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load settings."))
      .finally(() => setLoading(false));
  }, []);

  async function save(nextEnabled: boolean) {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/maintenance", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ maintenance: { enabled: nextEnabled } }),
      });
      if (!response.ok) throw new Error("Could not save maintenance settings.");
      setEnabled(nextEnabled);
      setMessage(nextEnabled ? "Maintenance mode is now enabled." : "Maintenance mode is now disabled.");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f6f8", padding: "48px 24px", fontFamily: "Manrope, sans-serif" }}>
      <section style={{ maxWidth: 640, margin: "0 auto", background: "#fff", border: "1px solid #e5e8ed", borderRadius: 16, padding: "32px", boxShadow: "0 8px 30px #1419230d" }}>
        <a href="/admin" style={{ color: "#805a14", fontSize: 13, textDecoration: "none" }}>← Back to admin</a>
        <p style={{ margin: "32px 0 8px", color: "#96691a", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>Website control</p>
        <h1 style={{ margin: 0, color: "#17191d", fontFamily: "Outfit, sans-serif", fontSize: "clamp(30px, 6vw, 44px)" }}>Maintenance mode</h1>
        <p style={{ color: "#69707c", lineHeight: 1.65 }}>Temporarily replace the public website with the Vesterra maintenance page. Your admin panel remains available.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, marginTop: 28, padding: 20, borderRadius: 12, background: enabled ? "#fff6df" : "#f3f7f4" }}>
          <div><strong style={{ display: "block", color: "#17191d" }}>{enabled ? "Maintenance page is live" : "Website is live"}</strong><span style={{ color: "#69707c", fontSize: 13 }}>{enabled ? "Visitors currently see the maintenance page." : "Visitors currently see the normal website."}</span></div>
          <button type="button" disabled={loading || saving} onClick={() => void save(!enabled)} style={{ border: 0, borderRadius: 9, padding: "12px 18px", background: enabled ? "#17191d" : "#d5a640", color: enabled ? "#fff" : "#17120b", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{loading ? "Loading…" : saving ? "Saving…" : enabled ? "Turn off" : "Turn on"}</button>
        </div>
        {message && <p role="status" style={{ color: "#69707c", fontSize: 13, marginTop: 18 }}>{message}</p>}
      </section>
    </main>
  );
}

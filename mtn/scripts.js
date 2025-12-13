// /sites/scripts.js

// URL du backend local
const API_BASE = "http://127.0.0.1:8000";

// Prix officiels
const WEEK_PRICE = 500;
const MONTH_PRICE = 2000;

// ------------------------------
// HMAC SIGNATURE (client-side)
// ------------------------------
async function hmacSign(raw) {
  const encoder = new TextEncoder();

  // ⚠️ IMPORTANT : remplace "default_secret" par ton vrai HMAC_GLOBAL_SECRET
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode("Tokotedy123@@"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(raw));

  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ------------------------------
// Construit le payload propre
// ------------------------------
async function buildPaymentPayload({ provider, plan, tg_id }) {
  const raw = `${provider}|${plan}|${tg_id}`;
  const signature = await hmacSign(raw);

  return {
    provider,
    plan,
    tg_id,
    signature
  };
}

// ------------------------------
// Appelle le backend
// ------------------------------
async function createPayment(payload) {
  const res = await fetch(`${API_BASE}/api/pay/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return await res.json();
}

// ------------------------------
// Format prix
// ------------------------------
function formatPrice(plan) {
  return plan === "week"
    ? "Prix : 500 FCFA"
    : "Prix : 2000 FCFA";
}

// ------------------------------
// Status helper
// ------------------------------
function setStatus(el, msg) {
  el.textContent = msg;
}
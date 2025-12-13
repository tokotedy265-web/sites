// /sites/scripts.js
const API_BASE = "https://backend-bot-payement-4.onrender.com"; // Remplace par l’URL publique de ton backend
const WEEK_PRICE = 500;
const MONTH_PRICE = 2000;

// Helper: calcule le montant et prépare le payload standard
function buildPaymentPayload({ provider, plan, tg_id, has7 = false, autoRenew = false }) {
  const amount = plan === "week" ? WEEK_PRICE : MONTH_PRICE;
  return {
    provider, plan, amount,
    tg_id,                 // id Telegram à mapper côté backend vers user_id
    has_7_channels: has7,
    auto_renew: autoRenew
  };
}

// Appelle ton backend pour créer un paiement
async function createPayment(payload) {
  const res = await fetch(`${API_BASE}/api/pay/create`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return await res.json(); // { external_id, provider_redirect? }
}

// Utilitaire d’affichage
function setStatus(el, text){ el.textContent = text; }
function formatPrice(plan){
  return plan === "week" ? `${WEEK_PRICE} FCFA (7 jours)` : `${MONTH_PRICE} FCFA (30 jours)`;
}
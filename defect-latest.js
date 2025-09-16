// netlify/functions/defect-latest.js
import { getStore } from "@netlify/blobs";
export const config = { path: "/api/defect-latest" };

export default async () => {
  const store = getStore("defects");
  const latest = await store.get("latest.json", { type: "json", consistency: "strong" });
  if (!latest) return new Response(JSON.stringify({ key: null }), { headers: { "content-type": "application/json" } });
  const v = latest.ts || Date.now();
  return new Response(JSON.stringify({ key: latest.key, v }), { headers: { "content-type": "application/json" } });
};

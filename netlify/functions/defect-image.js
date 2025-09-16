// netlify/functions/defect-image.js
import { getStore } from "@netlify/blobs";
export const config = { path: "/api/defect-image/*" };

export default async (req, context) => {
  const key = context.params["*"]; // images/...
  if (!key) return new Response("Not found", { status: 404 });

  const store = getStore("defects");
  const { data, metadata } = await store.getWithMetadata(key, { type: "stream" });
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(data, {
    headers: {
      "content-type": metadata?.contentType || "application/octet-stream",
      "cache-control": "no-store"
    }
  });
};

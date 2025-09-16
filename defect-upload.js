// netlify/functions/defect-upload.js
import { getStore } from "@netlify/blobs";
import { Buffer } from "node:buffer";
import Busboy from "busboy";

export const config = { path: "/api/defect-upload" };

export default async (req, context) => {
  const keyHdr = req.headers.get("x-upload-key");
  if (process.env.NETLIFY_UPLOAD_KEY && keyHdr !== process.env.NETLIFY_UPLOAD_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const store = getStore("defects");
  const bb = Busboy({ headers: Object.fromEntries(req.headers) });

  const chunks = [];
  let filename = `latest.jpg`;
  let contentType = "image/jpeg";

  const finished = new Promise((resolve, reject) => {
    bb.on("file", (name, file, info) => {
      if (info && info.filename) filename = "latest-" + Date.now() + "-" + info.filename.replace(/[^\w.\-]/g,"");
      if (info && info.mimeType) contentType = info.mimeType;
      file.on("data", d => chunks.push(d));
      file.on("limit", () => reject(new Error("File too large")));
      file.on("end", () => {});
    });
    bb.on("error", reject);
    bb.on("finish", resolve);
  });

  const bodyBuf = Buffer.from(await req.arrayBuffer());
  bb.end(bodyBuf);
  await finished;

  if (!chunks.length) return new Response("No file", { status: 400 });

  const buf = Buffer.concat(chunks);
  const blobKey = `images/${filename}`;
  await store.set(blobKey, buf, { metadata: { contentType } });
  await store.setJSON("latest.json", { key: blobKey, ts: Date.now() });

  return new Response(JSON.stringify({ ok: true, key: blobKey }), {
    headers: { "content-type": "application/json" }
  });
};

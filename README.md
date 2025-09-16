# Barmill Photo Board (Netlify)

A super‑simple app to snap/upload a lab sample photo and show it instantly on a separate display.

- **Uploader:** `/` (camera-first on iPhone, HEIC → JPEG auto-convert)
- **Display:** `/display` (polls every ~1s for the latest photo)
- **Serverless:** Netlify Functions + Netlify Blobs (no external services)

## Deploy

1. Create a new GitHub repo and push this folder.
2. In Netlify, choose **New site from Git**, select your repo.
3. No build command required.

### Environment variable
Add the following in **Site settings → Environment variables**:

- `UPLOAD_PIN` — a short PIN you’ll type on the uploader before sending.

### Notes
- iPhone HEIC/HEIF is converted on-device to JPEG via `heic2any` WASM.
- All uploads overwrite `latest.jpg`. The display page auto-refreshes when `latest-meta.json` timestamp changes.
- To keep history: also save to `samples/{timestamp}.jpg` in `upload.js` and add a gallery page.

## Local testing
You can run Netlify dev locally if you want:

```bash
npm i -g netlify-cli
netlify dev
```

Then open `http://localhost:8888/`.

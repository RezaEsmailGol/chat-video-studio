# Chat Video Studio 🎬

A Persian-first, browser-based **fictional chat video creator** inspired by Telegram's visual layout. Build a scripted two-person conversation, preview the animation and export a video.

> **Development preview:** Work in progress. Do not treat generated conversations as authentic screenshots or evidence. This project is not affiliated with Telegram.

## Current features

- Two-sided text messages, emojis, replies, timestamps, photos, and video **thumbnails**.
- Chat preview, configurable timing, theme, profile avatar and wallpaper.
- PNG image export.
- Video export using WebCodecs H.264/MP4 where supported, falling back to MediaRecorder and the **actual** recorded format (MP4 or WebM).
- Save/recover one working project locally using IndexedDB.
- Export/import self-contained JSON project backups.

## Run locally

No build step yet:

1. Clone the repository.
2. Run a static HTTP server in the repository folder:

   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in a recent Chromium-based browser.

**Important:** Internet access is currently required for fonts, emojis and CDN scripts. Browser features, MP4/AAC encoders and performance vary by browser. Test a real export in your target browser before relying on it.

## Current limits

- Uploaded video attachments are represented as thumbnails, **not** embedded moving video or sound in the rendered conversation.
- MP4 encoding is not supported in every browser; WebM may be the honest fallback.
- Autosave keeps **one project per browser/profile**. JSON backups are recommended.
- Large images may use substantial IndexedDB space and JSON files may be large.
- No cloud sync, user accounts, multi-format templates or production-grade automated browser testing yet.
- Dependency licenses and redistribution terms must be reviewed before a public release.

## Local development

```bash
node scripts/check-source.mjs
```

## Roadmap

1. Stabilize export, progress, error handling, rendering consistency and browser tests.
2. Improve save/load, undo/redo, project library and media handling.
3. Add modular templates, resolutions, timeline editor, sound and documentation.
4. Optionally add cloud rendering and user accounts after a reliable local release.

## Safety

For fictional, educational, and authorized creative content only. Do not use this tool to forge evidence, impersonate real people or misrepresent a conversation as genuine.

## Status

Development work is tracked in pull requests. No production release or open-source license has been selected yet.

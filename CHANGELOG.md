# Changelog / تاریخچه تغییرات

Changes are documented in English and Persian, based on the features implemented and verified in the development branch. **No stable release is claimed.**

## [Unreleased] — Public Beta — 2026-10-22

### Added / افزوده شد
- Five messenger-inspired chat templates: Telegram, WhatsApp, Bale, Eitaa, Rubika / پنج قالب چت
- Browser-local multi-project library and JSON backups / چندپروژه‌ای و بکاپ JSON
- Editable Persian story templates, offline custom script drafts, Undo/Redo / سناریوهای قابل ویرایش
- PNG and browser-dependent MP4/WebM export / خروجی تصویر و ویدیو
- Vertical, square and landscape export compositions / نسبت‌های عمودی، مربعی و افقی
- Watermark, chroma-key background and locally selected background music / واترمارک، کروماکی و موسیقی
- Responsive navigation and a browser capability indicator / ناوبری موبایل و بررسی قابلیت‌ها
- Bilingual documentation, issue templates and original promotional SVG / مستندات دوزبانه

### Changed / تغییر کرد
- Replaced development-time Tailwind browser CDN with compiled inline CSS.
- Kept main application logic in a single HTML file.
- Improved project autosave, migration from older demos, and save ordering.
- Clarified actual export format and non-native 1080p upscaling.

### Verification / آزمون
- Automated Chromium and Firefox checks for five previews, scenarios, mobile sizes and project persistence.
- Encoded square video and upscaled 1080p portrait video tested in Chromium.
- Music track verified using WebM/Opus in Chromium.
- Real iOS/Safari and Android device testing remains outstanding.

[Successful V2 QA run](https://github.com/RezaEsmailGol/chat-video-studio/actions/runs/39745568024)

## Release policy / سیاست انتشار

Until real-device export reliability and long-video performance are verified, the product should be labeled **Beta** rather than stable or production-ready. Tagging a stable release will require an explicit release decision.

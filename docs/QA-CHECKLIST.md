# QA Checklist / چک‌لیست تست قبل از انتشار

## Fast browser smoke / تست سریع
- [ ] First visit shows the demo conversation; refreshing restores user data
- [ ] All five templates render correctly with Persian text
- [ ] Messages add/edit/reorder/delete; Undo/Redo works
- [ ] Deleting all messages persists an empty state after refresh
- [ ] Create, duplicate, switch and delete named projects
- [ ] JSON export/import restores the selected template and messages
- [ ] PNG download opens correctly
- [ ] Video export **decodes** with the expected width, height and duration
- [ ] Actual extension matches MP4/WebM file signature
- [ ] With music, playback contains an audible audio track (not merely a codec header)
- [ ] Watermark readable; chroma-key backing is actually green
- [ ] 320, 375, 390, 768 and 1280 px layouts have no sideways overflow
- [ ] Keyboard controls do not override native text-field Undo
- [ ] No JavaScript exceptions in browser console

## Real-device release gate / تست واقعی دستگاه
- [ ] iPhone Safari: editing, exporting and downloading a video
- [ ] Android Chrome: editing, exporting and downloading a video
- [ ] 1, 5 and 15 minute export memory / frame stability
- [ ] Audio quality, sync, speaker and mobile mute behavior
- [ ] Attached video playback in at least two target browsers
- [ ] Permission requests, autoplay and storage quota errors are understandable

**Status:** These checks are **not** all complete. Do not infer iOS/Android compatibility from desktop emulation or headless WebKit.

## Issue evidence / مستندات گزارش خطا

Attach anonymized browser name/version, device model, exact steps, expected versus actual results, resulting file format and (when safe) an anonymized JSON project. Do not attach passwords or personal conversations.

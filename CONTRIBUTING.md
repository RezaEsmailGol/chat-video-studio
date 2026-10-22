# مشارکت در Chat Video Studio / Contributing

[English below](#english)

## فارسی

از مشارکت در رفع باگ‌ها، بهبود کیفیت خروجی و سازگاری مرورگرها استقبال می‌کنیم.

1. قبل از شروع، Issueهای باز را بررسی کن و برای تغییر بزرگ ابتدا یک Issue ثبت کن.
2. مخزن را Fork کن؛ شاخه‌ای با نامی شبیه feature/mobile-preview یا fix/video-audio بساز.
3. ساختار **تک‌فایلی برنامه** را حفظ کن؛ افزودن فایل مستندات، تصویر یا تست مجاز است.
4. کلید API، اطلاعات واقعی مکالمات، داده کاربران و تصاویر دارای حق نشر بدون مجوز را Commit نکن.
5. پیش از PR، برنامه را روی یک مرورگر Chromium و در صورت امکان Firefox بررسی کن؛ مخصوصاً ذخیره JSON، عوض‌کردن پنج قالب، پیش‌نمایش و خروجی ویدیو.
6. PR باید هدف، مراحل تست، محدودیت‌ها و در تغییرات بصری تصویر مقایسه‌ای داشته باشد.
7. متن‌های فارسی باید راست‌به‌چپ، خوانا و سازگار با صفحه موبایل باشند.

### گزارش باگ

داخل [Issues](https://github.com/RezaEsmailGol/chat-video-studio/issues/new/choose) مرورگر/نسخه، سیستم‌عامل، مراحل بازتولید، انتظار، نتیجه واقعی و لاگ بدون اطلاعات حساس را بنویس.

**استفاده مسئولانه:** مکالمات واقعیِ بدون رضایت دیگران، مدارک خصوصی و مواردی که برای جعل یا گمراه‌کردن استفاده می‌شوند را منتشر نکن.

## English

Contributions to browser compatibility, reliable exporting, localization and accessibility are welcome.

1. Search existing Issues before starting. Open an Issue for substantial changes.
2. Fork the repo and work on a descriptive feature/fix branch.
3. Preserve the **single-file application** approach; documentation, assets and testing files are welcome.
4. Never commit tokens, private conversations, sensitive data or unlicensed assets.
5. Smoke-test Chromium and, if possible, Firefox: all five skins, JSON restore, preview, and video output.
6. Include purpose, reproduction/verification steps, known limitations, and screenshots for visual changes in each PR.
7. Keep Persian UI text readable and RTL-friendly on mobile.

Security-sensitive reports should follow [SECURITY.md](./SECURITY.md), not public Issues.

## Style

Prefer small, reviewable changes, avoid unnecessary runtime dependencies, and be explicit about what has **not** been tested. No generated conversation should be represented as authentic evidence.

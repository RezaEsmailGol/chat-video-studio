# Security / امنیت

## فارسی

نسخه فعلی یک برنامه مرورگری بدون بک‌اند ذخیره گفتگو است؛ ولی داده‌ها در **IndexedDB** مرورگر نگهداری می‌شوند و منابع خارجی ممکن است درخواست شبکه دریافت کنند.

- هرگز رمز عبور، توکن، API Key، شناسه خصوصی یا مکالمه واقعی کاربران را در Issues، PR یا فایل JSON عمومی منتشر نکن.
- پاک‌کردن داده سایت و مرورگر می‌تواند پروژه‌ها را حذف کند؛ پیش از آن فایل JSON پشتیبان بگیر.
- فقط از فایل‌ها و رسانه‌هایی استفاده کن که حق استفاده از آن‌ها را داری.
- اگر احتمال افشای داده یا اجرای کد غیرمجاز پیدا کردی، گزارش عمومی با جزئیات سوءاستفاده منتشر نکن.

**گزارش خصوصی آسیب‌پذیری:** از [GitHub Security](https://github.com/RezaEsmailGol/chat-video-studio/security/advisories) و گزینه Report a vulnerability (در صورت فعال‌بودن) استفاده کن. اگر این مسیر در دسترس نیست، ابتدا از طریق پروفایل مالک مخزن یک کانال تماس خصوصی پیدا کن؛ تا هماهنگی، جزئیات فنی حساس را در Issue عمومی نگذار.

## English

This browser-first beta stores local projects in IndexedDB, with no application chat-storage backend. Remote assets may still make network requests.

- Never publish real private conversations, credentials, API keys, access tokens or personal information in Issues or sample JSON.
- Keep JSON backups before clearing site data.
- Use only media you are licensed to include.
- Avoid publicly disclosing exploit details before the maintainer can review the report.

**Private vulnerability reporting:** use [GitHub Security Advisories](https://github.com/RezaEsmailGol/chat-video-studio/security/advisories) and Report a vulnerability if enabled. Otherwise contact the repository maintainer privately first rather than exposing sensitive exploit details in a public issue.

No security warranty is provided; see the project MIT License.

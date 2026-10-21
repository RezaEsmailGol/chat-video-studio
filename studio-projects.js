/* Chat Video Studio: offline-first project persistence (schema v1). */
(() => {
    'use strict';
    const DB_NAME = 'chat-video-studio';
    const DB_STORE = 'projects';
    const AUTO_KEY = 'autosave';
    const MAX_IMPORT_BYTES = 40 * 1024 * 1024;
    let dbPromise = null;
    let saveTimer = null;
    let restoring = false;
    let projectName = 'پروژه جدید';

    function el(id) { return document.getElementById(id); }
    function status(message, error = false) {
        const node = el('projectStatus');
        if (node) {
            node.textContent = message;
            node.style.color = error ? '#fda4af' : '#94a3b8';
        }
    }
    function imageData(url) {
        return typeof url === 'string' && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(url) ? url : null;
    }
    function snapshot() {
        const s = appSettings;
        return {
            format: 'chat-video-studio',
            schemaVersion: 1,
            name: projectName,
            savedAt: new Date().toISOString(),
            settings: {
                msgIntervalMs: s.msgIntervalMs, fontFamily: s.fontFamily,
                fontSize: s.fontSize, timeGap: s.timeGap, theme: s.theme,
                headerMode: s.headerMode, showTyping: s.showTyping,
                soundEffects: s.soundEffects, contactName: s.contactName,
                avatar: imageData(s.contactAvatarImg && s.contactAvatarImg.src),
                wallpaper: imageData(s.customBgImage && s.customBgImage.src)
            },
            messages: messages.map(m => ({
                id: String(m.id || ''), side: m.side === 'right' ? 'right' : 'left',
                text: String(m.text || ''), time: String(m.time || ''),
                delaySec: Number(m.delaySec) || 1.5,
                replyName: String(m.replyName || ''),
                replyText: String(m.replyText || ''),
                mediaType: m.mediaType === 'video' ? 'video' : m.mediaType === 'photo' ? 'photo' : null,
                mediaDataUrl: imageData(m.mediaDataUrl),
                mediaDuration: String(m.mediaDuration || '')
            }))
        };
    }
    function openDatabase() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            if (!window.indexedDB) { reject(new Error('IndexedDB unavailable')); return; }
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error || new Error('Failed to open project database'));
        });
        return dbPromise;
    }
    async function storeProject(data) {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DB_STORE, 'readwrite');
            tx.objectStore(DB_STORE).put(data, AUTO_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || new Error('Write cancelled'));
        });
    }
    async function readProject() {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(DB_STORE, 'readonly');
            const req = tx.objectStore(DB_STORE).get(AUTO_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    }
    async function loadImage(url) {
        if (!imageData(url)) return null;
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }
    async function applyProject(data) {
        if (!data || data.format !== 'chat-video-studio' || data.schemaVersion !== 1 ||
            !Array.isArray(data.messages) || data.messages.length > 1000 ||
            !data.settings || typeof data.settings !== 'object') {
            throw new Error('فرمت پروژه نامعتبر یا پشتیبانی‌نشده است.');
        }
        const normalized = await Promise.all(data.messages.map(async (m, i) => {
            if (!m || typeof m !== 'object') throw new Error('پیام نامعتبر است.');
            const url = imageData(m.mediaDataUrl);
            const mediaImg = await loadImage(url);
            return {
                id: String(m.id || ('imported_' + i)).slice(0, 100),
                side: m.side === 'right' ? 'right' : 'left',
                text: String(m.text || '').slice(0, 10000),
                time: String(m.time || '').slice(0, 30),
                delaySec: Math.max(0.2, Math.min(20, Number(m.delaySec) || 1.5)),
                replyName: String(m.replyName || '').slice(0, 200),
                replyText: String(m.replyText || '').slice(0, 300),
                mediaType: mediaImg && ['photo', 'video'].includes(m.mediaType) ? m.mediaType : null,
                mediaDataUrl: mediaImg ? url : null,
                mediaImg: mediaImg, mediaVideo: null,
                mediaDuration: String(m.mediaDuration || '').slice(0, 20)
            };
        }));
        const s = data.settings;
        const allowedThemes = ['classic_green', 'dark_telegram', 'sky_blue', 'custom_image'];
        const settings = {
            msgIntervalMs: Math.max(300, Math.min(20000, Number(s.msgIntervalMs) || 1500)),
            fontFamily: ["'Vazirmatn', Tahoma, sans-serif", "Tahoma, 'Segoe UI', Arial, sans-serif", "'Segoe UI', Tahoma, sans-serif"].includes(s.fontFamily) ? s.fontFamily : "'Vazirmatn', Tahoma, sans-serif",
            fontSize: Math.max(12, Math.min(50, Number(s.fontSize) || 22)),
            timeGap: Math.max(0, Math.min(100, Number(s.timeGap) || 26)),
            theme: allowedThemes.includes(s.theme) ? s.theme : 'classic_green',
            headerMode: s.headerMode === 'clean' ? 'clean' : 'with_header',
            showTyping: Boolean(s.showTyping),
            soundEffects: Boolean(s.soundEffects),
            contactName: String(s.contactName || '').slice(0, 150)
        };
        const [avatar, wallpaper] = await Promise.all([loadImage(s.avatar), loadImage(s.wallpaper)]);
        settings.contactAvatarImg = avatar;
        settings.customBgImage = wallpaper;
        if (settings.theme === 'custom_image' && !wallpaper) settings.theme = 'classic_green';

        restoring = true;
        try {
            stopPreviewAnimation();
            messages = normalized;
            Object.assign(appSettings, settings);
            projectName = String(data.name || 'پروژه جدید').slice(0, 120);
            el('projectName').value = projectName;
            el('settingFont').value = settings.fontFamily;
            el('settingTheme').value = settings.theme;
            el('settingHeaderMode').value = settings.headerMode;
            el('settingShowTyping').checked = settings.showTyping;
            el('settingSoundEffects').checked = settings.soundEffects;
            el('settingContactName').value = settings.contactName;
            el('newReplyName').value = settings.contactName;
            el('contactAvatarPlaceholder').textContent = (settings.contactName.trim()[0] || 'P').toUpperCase();
            el('contactAvatarPreview').classList.toggle('hidden', !avatar);
            el('contactAvatarPlaceholder').classList.toggle('hidden', !!avatar);
            el('btnRemoveAvatar').classList.toggle('hidden', !avatar);
            if (avatar) el('contactAvatarPreview').src = avatar.src;
            syncFontSizeControl(settings.fontSize);
            syncTimeSpacingControl(settings.timeGap);
            el('newMsgDelay').value = settings.msgIntervalMs / 1000;
            renderMessagesListUI();
            showStaticFullChat();
        } finally {
            restoring = false;
        }
    }
    async function saveNow() {
        clearTimeout(saveTimer);
        if (restoring) return;
        try {
            projectName = el('projectName').value.trim() || 'پروژه جدید';
            await storeProject(snapshot());
            status('ذخیره محلی انجام شد');
        } catch (err) {
            console.warn('Project autosave failed', err);
            status('ذخیره محلی انجام نشد؛ از خروجی JSON استفاده کنید.', true);
        }
    }
    function scheduleSave() {
        if (restoring) return;
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveNow, 800);
    }
    function downloadJSON() {
        projectName = el('projectName').value.trim() || 'پروژه جدید';
        const json = JSON.stringify(snapshot(), null, 2);
        const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat-video-project-' + Date.now() + '.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        status('نسخه پشتیبان JSON ساخته شد');
    }
    async function importJSON(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        try {
            if (file.size > MAX_IMPORT_BYTES) throw new Error('فایل پروژه بیشتر از ۴۰ مگابایت است.');
            const data = JSON.parse(await file.text());
            await applyProject(data);
            await saveNow();
            status('پروژه بازیابی شد (ویدیوهای ضمیمه به شکل تصویر بندانگشتی باز می‌شوند)');
        } catch (err) {
            console.error(err);
            status(err.message || 'فایل پروژه قابل خواندن نیست', true);
        } finally {
            event.target.value = '';
        }
    }
    function initialize() {
        const controls = document.createElement('section');
        controls.className = 'max-w-7xl w-full mx-auto px-4 lg:px-8 pt-4';
        controls.innerHTML = '<div class="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-wrap items-center gap-2">' +
            '<label for="projectName" class="text-sm text-slate-300">نام پروژه:</label>' +
            '<input id="projectName" value="پروژه جدید" maxlength="120" aria-label="نام پروژه" class="bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-white flex-1 min-w-32">' +
            '<button id="saveProject" class="rounded-lg bg-emerald-700 px-3 py-2 text-sm text-white">ذخیره</button>' +
            '<button id="downloadProject" class="rounded-lg bg-slate-700 px-3 py-2 text-sm text-white">دانلود پروژه JSON</button>' +
            '<label for="importProject" class="cursor-pointer rounded-lg bg-slate-700 px-3 py-2 text-sm text-white">بازکردن پروژه JSON</label>' +
            '<input type="file" id="importProject" accept=".json,application/json" class="hidden">' +
            '<span id="projectStatus" role="status" aria-live="polite" class="text-xs text-slate-400 w-full">ذخیره خودکار در همین مرورگر فعال است</span>' +
            '</div>';
        document.querySelector('header').insertAdjacentElement('afterend', controls);
        el('saveProject').addEventListener('click', saveNow);
        el('downloadProject').addEventListener('click', downloadJSON);
        el('importProject').addEventListener('change', importJSON);
        document.addEventListener('input', event => {
            if (event.target && event.target.id !== 'newMsgText' && event.target.id !== 'importProject') scheduleSave();
        });
        document.addEventListener('change', event => {
            if (event.target && event.target.id !== 'importProject') scheduleSave();
        });
        document.addEventListener('click', event => {
            if (event.target && event.target.closest('button') && !event.target.closest('#downloadProject')) scheduleSave();
        });
        readProject().then(async saved => {
            if (saved) { await applyProject(saved); status('آخرین پروژه ذخیره‌شده بازیابی شد'); }
        }).catch(err => { console.warn('No local project loaded', err); status('ذخیره خودکار در این مرورگر در دسترس نیست', true); });
    }
    if (document.readyState === 'complete') initialize();
    else window.addEventListener('load', initialize, { once: true });
})();

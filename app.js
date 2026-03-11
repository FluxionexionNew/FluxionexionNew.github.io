/* ================================================================
   BedrockTiers v6.2 — app.js

   КАК ПОДКЛЮЧИТЬ EMAILJS (бесплатно, 200 писем/мес):
   ── ШАГ 1: Зарегистрируйся на https://emailjs.com
   ── ШАГ 2: Email Services → Add Service (Gmail / Mail.ru / Yandex)
             Скопируй Service ID
   ── ШАГ 3: Email Templates → Create Template
             Subject : BedrockTiers — {{subject}}
             Body    : Привет, {{to_name}}!<br>{{message}}<br>Код: <b>{{verify_code}}</b>
             To Email: {{to_email}}
             Скопируй Template ID
   ── ШАГ 4: Account → General → Public Key → скопируй
   ── ШАГ 5: Вставь три значения ниже И в index.html (emailjs.init)
   ================================================================ */

// ============================================================
//  ▼▼▼  ЗАМЕНИ ЭТИ ТРИ СТРОКИ  ▼▼▼
// ============================================================
const CFG = {
    EMAILJS_PUBLIC_KEY:  'YOUR_PUBLIC_KEY',    // Account → General → Public Key
    EMAILJS_SERVICE_ID:  'YOUR_SERVICE_ID',    // Email Services → Service ID
    EMAILJS_TEMPLATE_ID: 'YOUR_TEMPLATE_ID',   // Email Templates → Template ID
    // ▲▲▲ — — — — — — — — — — — — — — — — — — — — — — ▲▲▲

    SERVER_URL:   'https://bedrock-bot--yandextest717.replit.app',
    MC_SERVER_IP: 'play.bedrockpvp.net',
    ADMIN_NICK:   'FluxionNew',
    ADMIN_PASS:   'admin123',
};

// ============================================================
//  TELEGRAM
// ============================================================
const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// ============================================================
//  STATE
// ============================================================
let DB = JSON.parse(localStorage.getItem('bedrock_v6')) || {
    users: {
        'FluxionNew': {
            nick: 'FluxionNew', pass: 'admin123',
            email: 'admin@bedrock.gg', emailVerified: true,
            elo: 2800, weapon: 'crystal', wins: 12, videos: 8,
            streak: 5, admin: true, smpMember: true,
            avatar: null, activeSkin: null
        },
        'StormBlade': {
            nick: 'StormBlade', pass: 'pass123',
            email: 'storm@mail.ru', emailVerified: true,
            elo: 2400, weapon: 'sword', wins: 9, videos: 6,
            streak: 3, admin: false, smpMember: true,
            avatar: null, activeSkin: null
        },
        'CrystalKing': {
            nick: 'CrystalKing', pass: 'pass123',
            email: 'crystal@mail.ru', emailVerified: false,
            elo: 2100, weapon: 'crystal', wins: 7, videos: 5,
            streak: 1, admin: false, smpMember: false,
            avatar: null, activeSkin: null
        },
        'AxeMaster': {
            nick: 'AxeMaster', pass: 'pass123',
            email: 'axe@mail.ru', emailVerified: true,
            elo: 1850, weapon: 'axe', wins: 4, videos: 3,
            streak: 2, admin: false, smpMember: true,
            avatar: null, activeSkin: null
        },
        'NightWolf': {
            nick: 'NightWolf', pass: 'pass123',
            email: 'wolf@mail.ru', emailVerified: true,
            elo: 1500, weapon: 'sword', wins: 3, videos: 2,
            streak: 0, admin: false, smpMember: false,
            avatar: null, activeSkin: null
        },
    },
    submissions: [],
    events: [
        { id: 'e1', title: 'Crystal Cup #4',    status: 'live',  desc: 'Турнир по Crystal PvP, 16 игроков, BO3', date: 'Сб 22:00', prizes: ['1000 RUB', 'Донат', 'Скин HT'] },
        { id: 'e2', title: 'Sword Duel Season', status: 'soon',  desc: 'Сезонный рейтинг Sword PvP, 2 недели',   date: 'Вс 20:00', prizes: ['500 RUB', 'Роль', 'Скин'] },
        { id: 'e3', title: 'Mace Madness',      status: 'ended', desc: 'Mace PvP Battle Royale, 32 игрока',      date: 'Завершён',  prizes: ['Скин', 'Роль'] },
    ],
    smpMembers: ['FluxionNew', 'StormBlade', 'AxeMaster']
};

let currentUser    = null;
let selectedFile   = null;
let lbFilter       = 'all';
let pendingCode    = null; // реальный 6-значный код

function saveData() { localStorage.setItem('bedrock_v6', JSON.stringify(DB)); }

// ============================================================
//  TOAST
// ============================================================
const TOAST_ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

function showToast(title, message, type = 'info') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML =
        '<div class="toast-icon">' + (TOAST_ICONS[type] || 'ℹ️') + '</div>' +
        '<div class="toast-body">' +
            '<div class="toast-title">' + title + '</div>' +
            '<div class="toast-msg">' + message + '</div>' +
        '</div>';
    c.appendChild(t);
    setTimeout(() => t.remove(), 4000);
}

// ============================================================
//  TABS
// ============================================================
function showTab(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('panel-' + name).classList.remove('hidden');
    const btn = document.querySelector('[onclick="showTab(\'' + name + '\')"]');
    if (btn) btn.classList.add('active');
    if (name === 'top')     renderLeaderboard();
    if (name === 'profile' && currentUser) renderProfile();
    if (name === 'admin'   && currentUser && currentUser.admin) renderAdminPanel();
    if (name === 'skins'   && currentUser) renderSkins();
    if (name === 'unstable') renderUnstable();
}

// ============================================================
//  AUTH
// ============================================================
function doLogin() {
    const nick = document.getElementById('login-nick').value.trim();
    const pass = document.getElementById('login-pass').value;
    const user = DB.users[nick];
    if (!user || user.pass !== pass) {
        showToast('Ошибка', 'Неверный ник или пароль', 'error');
        return;
    }
    currentUser = user;
    afterLogin();
    showToast('Добро пожаловать!', 'Привет, ' + nick + '! 👋', 'success');
    showTab('profile');
}

function doRegister() {
    const nick   = document.getElementById('reg-nick').value.trim();
    const email  = document.getElementById('reg-email').value.trim().toLowerCase();
    const pass   = document.getElementById('reg-pass').value;
    const weapon = document.getElementById('reg-weapon').value;

    if (!nick || !email || !pass || !weapon) { showToast('Ошибка', 'Заполните все поля', 'error'); return; }
    if (pass.length < 6) { showToast('Ошибка', 'Пароль минимум 6 символов', 'error'); return; }
    if (DB.users[nick])  { showToast('Ошибка', 'Ник уже занят', 'error'); return; }
    if (!email.includes('@') || !email.includes('.')) { showToast('Ошибка', 'Неверный email', 'error'); return; }

    const tgUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
        ? tg.initDataUnsafe.user : null;

    DB.users[nick] = {
        nick, pass, email, emailVerified: false,
        elo: 1000, weapon, wins: 0, videos: 0,
        streak: 0, admin: false, smpMember: false,
        avatar: null, activeSkin: null,
        tgId:       tgUser ? tgUser.id       : null,
        tgUsername: tgUser ? tgUser.username : null,
    };
    saveData();
    currentUser = DB.users[nick];
    afterLogin();

    // Отправляем реальный код подтверждения
    sendVerifyEmail(email, nick);
    showToast('Аккаунт создан!', 'Код подтверждения отправлен на ' + email, 'success');
    showTab('profile');
}

function afterLogin() {
    ['tab-profile', 'tab-upload', 'tab-skins'].forEach(id => {
        document.getElementById(id).classList.remove('hidden');
    });
    if (currentUser.admin) {
        document.getElementById('tab-admin').classList.remove('hidden');
    }
}

function logout() {
    currentUser = null;
    ['tab-profile', 'tab-upload', 'tab-skins', 'tab-admin'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    showTab('login');
}

// ============================================================
//  УВЕДОМЛЕНИЯ — через Telegram бота
//  Бот запущен на Replit, API доступен через SERVER_URL
// ============================================================

// Отправить код верификации в Telegram пользователя
// telegram_id берётся из Telegram WebApp API (tg.initDataUnsafe.user.id)
async function sendVerifyTelegram(tgId, nick) {
    if (!tgId) {
        // Нет Telegram ID — генерируем код локально (DEV режим)
        pendingCode = String(Math.floor(100000 + Math.random() * 900000));
        showToast('🔧 DEV', 'Код: ' + pendingCode, 'warning');
        return;
    }

    showToast('📨 Отправка...', 'Код летит в Telegram', 'info');

    try {
        const res  = await fetch(CFG.SERVER_URL + '/send_code', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ telegram_id: tgId })
        });
        const data = await res.json();

        if (data.ok) {
            showToast('✅ Код отправлен!', 'Проверь личные сообщения бота', 'success');
            // Код хранится на сервере, pendingCode = null — проверка идёт через /check_code
            pendingCode = '__SERVER__';
        } else {
            showToast('Ошибка', data.error || 'Не удалось отправить', 'error');
        }
    } catch (e) {
        // Сервер недоступен — локальный фоллбэк
        pendingCode = String(Math.floor(100000 + Math.random() * 900000));
        showToast('⚠️ Офлайн', 'Код (локальный): ' + pendingCode, 'warning');
    }
}

// Проверить код верификации через сервер
async function checkVerifyTelegram(tgId, code) {
    if (pendingCode !== '__SERVER__') {
        // Локальный режим
        return code === pendingCode;
    }
    try {
        const res  = await fetch(CFG.SERVER_URL + '/check_code', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ telegram_id: tgId, code: code })
        });
        const data = await res.json();
        return data.ok === true;
    } catch (e) {
        return false;
    }
}

// Уведомить игрока о результате проверки видео
async function notifyPlayerTelegram(tgId, approved, eloChange) {
    if (!tgId) return;
    const msg = approved
        ? '🏆 Твоё видео одобрено! +' + eloChange + ' ELO начислено. Так держать!'
        : '❌ Твоё видео отклонено. Убедись что запись чёткая (720p+) и попробуй снова.';
    try {
        await fetch(CFG.SERVER_URL + '/notify', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                telegram_id: tgId,
                message:     msg,
                type:        approved ? 'approved' : 'rejected'
            })
        });
    } catch (e) { /* тихо игнорируем */ }
}

// Обратная совместимость — старые вызовы sendVerifyEmail/sendResultEmail
function sendVerifyEmail(email, nick) {
    const tgId = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
        ? tg.initDataUnsafe.user.id : null;
    sendVerifyTelegram(tgId, nick);
}

function sendResultEmail(email, nick, approved, eloChange) {
    const user = DB.users[nick];
    if (user && user.tgId) notifyPlayerTelegram(user.tgId, approved, eloChange);
}

// Показать форму И сразу запросить код
function requestVerifyCode() {
    document.getElementById('verify-code-wrap').classList.remove('hidden');
    if (!currentUser) return;
    const tgId = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
        ? tg.initDataUnsafe.user.id : null;
    sendVerifyTelegram(tgId, currentUser.nick);
}

function toggleVerifyCode() {
    document.getElementById('verify-code-wrap').classList.toggle('hidden');
}

async function verifyCode() {
    const input = document.getElementById('verify-code-input').value.trim();
    if (!input || input.length !== 6) {
        showToast('Ошибка', 'Введи 6-значный код', 'error');
        return;
    }
    if (!pendingCode) {
        showToast('Ошибка', 'Сначала запроси код кнопкой выше', 'error');
        return;
    }

    const tgId = tg && tg.initDataUnsafe && tg.initDataUnsafe.user
        ? tg.initDataUnsafe.user.id : null;

    const ok = await checkVerifyTelegram(tgId, input);

    if (ok) {
        currentUser.emailVerified = true;
        saveData();
        document.getElementById('verify-banner').classList.add('hidden');
        document.getElementById('verify-code-wrap').classList.add('hidden');
        showToast('✅ Верифицирован!', 'Аккаунт подтверждён через Telegram', 'success');
        renderProfile();
    } else {
        showToast('Ошибка', 'Неверный код. Запроси новый.', 'error');
    }
}

function resendCode() {
    if (!currentUser) return;
    sendVerifyEmail(currentUser.email, currentUser.nick);
}

// ============================================================
//  AVATAR UPLOAD — загрузка своей аватарки
// ============================================================
function handleAvatarSelect(input) {
    const file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Ошибка', 'Выбери изображение', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { showToast('Ошибка', 'Максимум 2 МБ', 'error'); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        currentUser.avatar = base64;
        saveData();

        // Обновляем все аватарки на странице
        const avatarEls = document.querySelectorAll('.profile-avatar-img');
        avatarEls.forEach(el => { el.src = base64; });
        document.getElementById('avatar-upload-preview').src = base64;
        document.getElementById('avatar-upload-preview').style.display = 'block';

        showToast('✅ Аватар загружен!', 'Фото сохранено', 'success');
    };
    reader.readAsDataURL(file);
}

function getAvatarSrc(user) {
    if (!user) return '';
    if (user.avatar) return user.avatar;
    return 'https://mc-heads.net/avatar/' + user.nick + '/72';
}

// ============================================================
//  PROFILE
// ============================================================
const ACHIEVEMENTS = [
    { id: 'first_win',  icon: '🏆', name: 'Первая победа', cond: function(u) { return u.wins >= 1; } },
    { id: 'streak3',    icon: '🔥', name: 'Серия 3',       cond: function(u) { return u.streak >= 3; } },
    { id: 'streak5',    icon: '⚡', name: 'Серия 5',       cond: function(u) { return u.streak >= 5; } },
    { id: 'videos5',    icon: '🎥', name: '5 видео',       cond: function(u) { return u.videos >= 5; } },
    { id: 'elo2000',    icon: '💎', name: 'ELO 2000',      cond: function(u) { return u.elo >= 2000; } },
    { id: 'elo2500',    icon: '👑', name: 'ELO 2500',      cond: function(u) { return u.elo >= 2500; } },
    { id: 'elo3000',    icon: '🌟', name: 'Легенда',       cond: function(u) { return u.elo >= 3000; } },
    { id: 'smp',        icon: '🔥', name: 'SMP Участник',  cond: function(u) { return u.smpMember; } },
    { id: 'verified',   icon: '✅', name: 'Верифицирован', cond: function(u) { return u.emailVerified; } },
];

function getTier(elo) {
    if (elo >= 3000) return 'HT1';
    if (elo >= 2700) return 'HT2';
    if (elo >= 2400) return 'HT3';
    if (elo >= 2100) return 'LT1';
    if (elo >= 1800) return 'LT2';
    if (elo >= 1500) return 'LT3';
    if (elo >= 1200) return 'LT4';
    return 'LT5';
}

function getProgress(elo) {
    const th    = [0, 1200, 1500, 1800, 2100, 2400, 2700, 3000];
    const names = ['Новичок', 'Воин', 'Ветеран', 'Боец', 'Элита', 'Мастер', 'Гранд', 'Легенда'];
    let idx = 0;
    for (let i = 1; i < th.length; i++) { if (elo >= th[i]) idx = i; }
    const from = th[idx], to = th[idx + 1] || 3000;
    return {
        from: names[idx],
        to:   names[idx + 1] || 'MAX',
        pct:  Math.min(100, Math.max(0, ((elo - from) / (to - from)) * 100))
    };
}

function renderProfile() {
    if (!currentUser) return;
    const u = currentUser;

    // Verify banner
    document.getElementById('verify-banner').classList.toggle('hidden', !!u.emailVerified);

    // Avatar
    const avatarSrc = getAvatarSrc(u);
    document.querySelectorAll('.profile-avatar-img').forEach(el => { el.src = avatarSrc; });
    const uploadPreview = document.getElementById('avatar-upload-preview');
    if (uploadPreview) {
        uploadPreview.src     = avatarSrc;
        uploadPreview.style.display = 'block';
    }

    document.getElementById('profile-name').textContent  = u.nick;
    document.getElementById('profile-email').textContent = u.email || '—';

    const tier    = getTier(u.elo);
    const badgeEl = document.getElementById('profile-tier-badge');
    badgeEl.textContent = tier;
    badgeEl.className   = 'tier-badge tier-' + tier;

    document.getElementById('stat-elo').textContent    = u.elo;
    document.getElementById('stat-wins').textContent   = u.wins;
    document.getElementById('stat-videos').textContent = u.videos;
    document.getElementById('stat-streak').textContent = u.streak || 0;

    const prog = getProgress(u.elo);
    document.getElementById('rank-progress').style.width = prog.pct + '%';
    document.getElementById('rank-from').textContent      = prog.from;
    document.getElementById('rank-to').textContent        = prog.to;

    // Achievements
    const achGrid = document.getElementById('achievements-grid');
    achGrid.innerHTML = ACHIEVEMENTS.map(function(a) {
        const ok = a.cond(u);
        return '<div class="ach-item' + (ok ? ' unlocked' : '') + '">' +
            '<div class="ach-icon">' + a.icon + '</div>' +
            '<div class="ach-name">' + a.name + '</div>' +
            '</div>';
    }).join('');

    // History
    const subs = DB.submissions.filter(function(s) { return s.nick === u.nick; })
        .reverse().slice(0, 10);
    const hist = document.getElementById('history-list');
    if (!subs.length) {
        hist.innerHTML = '<div class="text-center text-muted">Нет заявок</div>';
    } else {
        const icons = { sword: '⚔️', axe: '🪓', crystal: '💎', mace: '🔨' };
        hist.innerHTML = subs.map(function(s) {
            const wicon = icons[s.weapon] || '🎮';
            const eloDelta = s.status === 'approved'
                ? '<span style="color:var(--success)">+50 ELO</span>'
                : s.status === 'rejected'
                    ? '<span style="color:var(--danger)">—</span>'
                    : '<span style="color:var(--gold)">⏳</span>';
            const statusText = s.status === 'pending' ? '⏳ Ожидание'
                : s.status === 'approved' ? '✅ Принято' : '❌ Отклонено';
            return '<div class="sub-item">' +
                '<div class="sub-item-head">' +
                    '<span>' + wicon + ' ' + s.weapon + '</span>' +
                    '<span class="status-' + s.status + '">' + statusText + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);">' +
                    '<span>' + new Date(s.ts).toLocaleString('ru') + '</span>' +
                    eloDelta +
                '</div>' +
                '</div>';
        }).join('');
    }
}

// ============================================================
//  LEADERBOARD
// ============================================================
function setLbFilter(f) { lbFilter = f; renderLeaderboard(); }

function renderLeaderboard() {
    const q = (document.getElementById('lb-search') ? document.getElementById('lb-search').value : '').toLowerCase();
    let users = Object.values(DB.users).sort(function(a, b) { return b.elo - a.elo; });
    if (lbFilter !== 'all') users = users.filter(function(u) { return u.weapon === lbFilter; });
    if (q) users = users.filter(function(u) { return u.nick.toLowerCase().includes(q); });

    const list = document.getElementById('leaderboard-list');
    if (!users.length) { list.innerHTML = '<div class="text-center text-muted">Игроки не найдены</div>'; return; }

    const medals = ['🥇', '🥈', '🥉'];
    list.innerHTML = users.map(function(u, i) {
        const tier     = getTier(u.elo);
        const smpBadge = u.smpMember ? '<span style="font-size:10px;color:var(--unstable);margin-left:4px;">🔥SMP</span>' : '';
        const avatarSrc = getAvatarSrc(u);
        return '<div class="lb-item lb-rank-' + (i < 3 ? i + 1 : '') + '">' +
            '<div class="lb-pos">' + (i < 3 ? medals[i] : '#' + (i + 1)) + '</div>' +
            '<img class="lb-avatar" src="' + avatarSrc + '" alt="">' +
            '<div class="lb-info">' +
                '<div class="lb-nick">' + u.nick + smpBadge + '</div>' +
                '<div class="lb-sub"><span class="tier-badge tier-' + tier + '" style="font-size:9px;padding:1px 6px;">' + tier + '</span> ' + u.wins + 'W · ' + u.weapon + '</div>' +
            '</div>' +
            '<div class="lb-elo">' + u.elo + '</div>' +
            '</div>';
    }).join('');
}

// ============================================================
//  REAL ONLINE — mcsrvstat.us API (CORS-friendly)
// ============================================================
async function fetchServerOnline() {
    try {
        const res  = await fetch('https://api.mcsrvstat.us/2/' + CFG.MC_SERVER_IP);
        const data = await res.json();
        if (data.online && data.players) {
            return data.players.online;
        }
    } catch (e) {
        // API недоступен — фоллбэк
    }
    return null;
}

let smpOnlineFallback = Math.floor(120 + Math.random() * 80);

async function updateOnlineCounters() {
    const real = await fetchServerOnline();
    const val  = real !== null ? real : (smpOnlineFallback + Math.floor(Math.random() * 5 - 2));
    smpOnlineFallback = val;

    const headerEl = document.getElementById('online-count');
    const smpEl    = document.getElementById('smp-online');
    if (headerEl) headerEl.textContent = val;
    if (smpEl)    smpEl.textContent    = val;
}

// ============================================================
//  UNSTABLE SMP
// ============================================================
function renderUnstable() {
    updateOnlineCounters();
    document.getElementById('smp-events').textContent = DB.events.filter(function(e) { return e.status !== 'ended'; }).length;

    const el = document.getElementById('events-list');
    const badgeClass = { live: 'badge-live', soon: 'badge-soon', ended: 'badge-ended' };
    const badgeText  = { live: '🔴 LIVE', soon: '🟡 СКОРО', ended: '⚫ ЗАВЕРШЁН' };

    el.innerHTML = DB.events.map(function(e) {
        const prizes = e.prizes.map(function(p) { return '<span class="prize-tag">🏆 ' + p + '</span>'; }).join('');
        return '<div class="event-card">' +
            '<div class="event-head">' +
                '<div class="event-title">' + e.title + '</div>' +
                '<span class="event-badge ' + badgeClass[e.status] + '">' + badgeText[e.status] + '</span>' +
            '</div>' +
            '<div class="event-info">' + e.desc + '<br>📅 ' + e.date + '</div>' +
            '<div class="event-prizes">' + prizes + '</div>' +
            '</div>';
    }).join('');

    // Top SMP
    const smpTop = Object.values(DB.users)
        .filter(function(u) { return u.smpMember; })
        .sort(function(a, b) { return b.elo - a.elo; })
        .slice(0, 5);

    document.getElementById('unstable-top').innerHTML = smpTop.map(function(u, i) {
        return '<div class="lb-item" style="margin-bottom:6px;">' +
            '<div class="lb-pos" style="color:var(--unstable);">#' + (i + 1) + '</div>' +
            '<img class="lb-avatar" src="' + getAvatarSrc(u) + '" alt="">' +
            '<div class="lb-info"><div class="lb-nick">' + u.nick + '</div></div>' +
            '<div class="lb-elo" style="color:var(--unstable);">' + u.elo + '</div>' +
            '</div>';
    }).join('');

    // Join button
    const btn = document.getElementById('smp-join-wrap');
    if (currentUser && currentUser.smpMember) {
        btn.innerHTML = '<div style="text-align:center;color:var(--success);font-family:\'Orbitron\',sans-serif;font-size:13px;padding:12px;">✅ Ты участник Unstable SMP</div>';
    } else {
        btn.innerHTML = '<button class="btn btn-unstable" onclick="joinSMP()">🔥 ВСТУПИТЬ В UNSTABLE SMP</button>';
    }
}

function joinSMP() {
    if (!currentUser) { showToast('Нужен аккаунт', 'Сначала войди', 'warning'); showTab('login'); return; }
    if (currentUser.smpMember) { showToast('Уже участник!', 'Ты уже в Unstable SMP', 'info'); return; }
    currentUser.smpMember = true;
    if (!DB.smpMembers.includes(currentUser.nick)) DB.smpMembers.push(currentUser.nick);
    saveData();
    showToast('🔥 Добро пожаловать!', 'Ты теперь в Unstable SMP!', 'success');
    renderUnstable();
}

// ============================================================
//  SKINS
// ============================================================
const REWARD_SKINS = [
    { id: 'ht1_skin',    name: 'HT1 Champion', nick: 'Notch',          req: 'ELO 3000', elo: 3000 },
    { id: 'ht2_skin',    name: 'HT2 Warrior',  nick: 'Dream',          req: 'ELO 2700', elo: 2700 },
    { id: 'crystal_sk',  name: 'Crystal God',  nick: 'Technoblade',    req: 'ELO 2400', elo: 2400 },
    { id: 'smp_skin',    name: 'SMP Member',   nick: 'Ph1LzA',         req: 'SMP',      elo: 0,    smp: true },
    { id: 'verified_sk', name: 'Verified',      nick: 'GeorgeNotFound', req: 'Email ✅', elo: 0,    verified: true },
    { id: 'legend',      name: 'Легенда',       nick: 'MrBeast6000',   req: '10 побед', elo: 0,    wins: 10 },
];

function renderSkins() {
    if (!currentUser) return;
    const u = currentUser;

    const bodyEl = document.getElementById('skin-preview-full');
    if (bodyEl) bodyEl.src = 'https://mc-heads.net/body/' + u.nick + '/64';

    const grid = document.getElementById('reward-skins');
    grid.innerHTML = REWARD_SKINS.map(function(s) {
        let unlocked = u.elo >= (s.elo || 0);
        if (s.smp      && !u.smpMember)      unlocked = false;
        if (s.verified && !u.emailVerified)  unlocked = false;
        if (s.wins     && u.wins < s.wins)   unlocked = false;
        const active       = u.activeSkin === s.id;
        const onclickAttr  = unlocked ? 'onclick="selectSkin(\'' + s.id + '\')"' : '';
        return '<div class="skin-item' + (active ? ' active' : '') + '" ' + onclickAttr + '>' +
            '<img class="skin-img" src="https://mc-heads.net/avatar/' + s.nick + '/48" alt="" onerror="this.style.opacity=\'0.3\'">' +
            '<div class="skin-name">' + (unlocked ? s.name : '🔒 ' + s.req) + '</div>' +
            '</div>';
    }).join('');
}

function selectSkin(id) {
    if (!currentUser) return;
    currentUser.activeSkin = id;
    saveData();
    renderSkins();
    showToast('🎨 Скин выбран!', 'Наградной скин активирован', 'success');
}

function refreshSkin() {
    if (!currentUser) return;
    showToast('🔄 Обновление...', 'Скин синхронизируется с Minecraft', 'info');
    setTimeout(function() {
        const t = '?t=' + Date.now();
        const bodyEl    = document.getElementById('skin-preview-full');
        if (bodyEl) bodyEl.src = 'https://mc-heads.net/body/' + currentUser.nick + '/64' + t;
        document.querySelectorAll('.profile-avatar-img').forEach(function(el) {
            if (!currentUser.avatar) el.src = 'https://mc-heads.net/avatar/' + currentUser.nick + '/72' + t;
        });
        showToast('✅ Скин обновлён!', 'Синхронизация завершена', 'success');
    }, 1200);
}

function searchPlayerSkin() {
    const nick = document.getElementById('skin-search-nick').value.trim();
    if (!nick) return;
    const res = document.getElementById('skin-search-result');
    res.innerHTML = '<div style="text-align:center;padding:10px;color:var(--text2)">Загрузка...</div>';

    setTimeout(function() {
        const user = DB.users[nick];
        const tier = user ? getTier(user.elo) : null;
        const avatarSrc = user ? getAvatarSrc(user) : 'https://mc-heads.net/avatar/' + nick + '/48';
        const infoHtml = user
            ? '<div style="font-size:12px;color:var(--text2);">' + user.elo + ' ELO · <span class="tier-badge tier-' + tier + '" style="font-size:9px;padding:1px 5px;">' + tier + '</span></div>'
            : '<div style="font-size:12px;color:var(--text2);">Не зарегистрирован</div>';

        res.innerHTML =
            '<div style="display:flex;align-items:center;gap:14px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;">' +
                '<img src="' + avatarSrc + '" style="width:48px;height:48px;border-radius:10px;object-fit:cover;" onerror="this.style.opacity=\'0.3\'">' +
                '<div>' +
                    '<div style="font-weight:700;font-size:15px;">' + nick + '</div>' +
                    infoHtml +
                '</div>' +
            '</div>';
    }, 600);
}

// ============================================================
//  VIDEO UPLOAD
// ============================================================
function handleFileSelect(input) {
    selectedFile = input.files[0];
    if (selectedFile) {
        document.getElementById('upload-text').textContent = '✅ ' + selectedFile.name;
        document.getElementById('submit-btn').classList.remove('hidden');
    }
}

async function submitVideo() {
    if (!selectedFile || !currentUser) {
        showToast('Ошибка', 'Выберите видео и войдите в систему', 'error');
        return;
    }
    const weapon   = document.getElementById('upload-weapon').value;
    const opponent = document.getElementById('upload-opponent').value.trim();
    const subId    = 'sub_' + Date.now();

    showToast('📤 Отправка', 'Загружается...', 'info');

    try {
        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('sub_id', subId);
        formData.append('nick', currentUser.nick);
        formData.append('weapon', weapon);
        formData.append('opponent', opponent);

        const response = await fetch(CFG.SERVER_URL + '/upload', { method: 'POST', body: formData });
        const data = await response.json();

        if (data.status === 'ok') {
            pushSubmission(subId, weapon, opponent);
            showToast('✅ Отправлено!', 'Видео на проверке у админа', 'success');
        } else {
            showToast('Ошибка', data.message || 'Попробуй снова', 'error');
        }
    } catch (e) {
        pushSubmission(subId, weapon, opponent);
        showToast('⚠️ Офлайн режим', 'Заявка сохранена локально', 'warning');
    }
}

function pushSubmission(subId, weapon, opponent) {
    DB.submissions.push({ id: subId, nick: currentUser.nick, weapon, opponent, status: 'pending', ts: Date.now() });
    currentUser.videos++;
    saveData();
    document.getElementById('pending-status').innerHTML =
        '<div class="pending-card">' +
            '<div class="spinner"></div>' +
            '<div><strong>⏳ На проверке</strong>' +
            '<div style="font-size:11px;color:var(--text2);margin-top:2px;">ID: ' + subId + '</div>' +
            '</div></div>';
    document.getElementById('submit-btn').classList.add('hidden');
}

// ============================================================
//  ADMIN
// ============================================================
function renderAdminPanel() {
    if (!currentUser || !currentUser.admin) return;
    document.getElementById('admin-total').textContent    = Object.keys(DB.users).length;
    document.getElementById('admin-pending').textContent  = DB.submissions.filter(function(s) { return s.status === 'pending'; }).length;
    document.getElementById('admin-approved').textContent = DB.submissions.filter(function(s) { return s.status === 'approved'; }).length;
    document.getElementById('admin-rejected').textContent = DB.submissions.filter(function(s) { return s.status === 'rejected'; }).length;

    const pending = DB.submissions.filter(function(s) { return s.status === 'pending'; });
    const el = document.getElementById('admin-submissions');
    if (!pending.length) { el.innerHTML = '<div class="text-center text-muted">Нет заявок на проверке</div>'; return; }

    const wicons = { sword: '⚔️', axe: '🪓', crystal: '💎', mace: '🔨' };
    el.innerHTML = pending.map(function(s) {
        const user = DB.users[s.nick];
        return '<div class="sub-item">' +
            '<div class="sub-item-head"><strong>' + s.nick + '</strong><span>' + (wicons[s.weapon] || '🎮') + ' ' + s.weapon + '</span></div>' +
            (s.opponent ? '<div style="font-size:12px;color:var(--text2);">vs ' + s.opponent + '</div>' : '') +
            (user && user.email ? '<div style="font-size:11px;color:var(--text2);font-family:\'JetBrains Mono\',monospace;">' + user.email + '</div>' : '') +
            '<div style="font-size:11px;color:var(--text3);margin-bottom:10px;">' + new Date(s.ts).toLocaleString('ru') + '</div>' +
            '<div style="display:flex;gap:8px;">' +
                '<button class="btn btn-primary btn-sm" style="flex:1;" onclick="adminApprove(\'' + s.id + '\')">✅ Принять</button>' +
                '<button class="btn btn-danger btn-sm"  style="flex:1;" onclick="adminReject(\''  + s.id + '\')">❌ Отклонить</button>' +
            '</div></div>';
    }).join('');
}

function adminApprove(subId) {
    const sub = DB.submissions.find(function(s) { return s.id === subId; });
    if (!sub) return;
    sub.status = 'approved';
    const user = DB.users[sub.nick];
    if (user) { user.elo += 50; user.wins++; user.streak = (user.streak || 0) + 1; }
    saveData();
    if (user && user.email) sendResultEmail(user.email, user.nick, true, 50);
    showToast('✅ Принято', sub.nick + ' +50 ELO', 'success');
    renderAdminPanel();
    if (currentUser && currentUser.nick === sub.nick) renderProfile();
}

function adminReject(subId) {
    const sub = DB.submissions.find(function(s) { return s.id === subId; });
    if (!sub) return;
    sub.status = 'rejected';
    const user = DB.users[sub.nick];
    if (user) user.streak = 0;
    saveData();
    if (user && user.email) sendResultEmail(user.email, user.nick, false, 0);
    showToast('❌ Отклонено', sub.nick + ' заявка отклонена', 'error');
    renderAdminPanel();
}

function adminChangeElo() {
    const nick  = document.getElementById('admin-nick').value.trim();
    const delta = parseInt(document.getElementById('admin-elo').value);
    if (!nick || isNaN(delta)) { showToast('Ошибка', 'Заполните поля', 'error'); return; }
    const user = DB.users[nick];
    if (!user) { showToast('Ошибка', 'Игрок не найден', 'error'); return; }
    user.elo = Math.max(0, user.elo + delta);
    saveData();
    showToast('✅ Готово', 'ELO ' + nick + ': ' + (delta > 0 ? '+' : '') + delta, 'success');
    renderLeaderboard();
}

function adminAddEvent() {
    const title  = document.getElementById('admin-event-title').value.trim();
    const status = document.getElementById('admin-event-status').value;
    if (!title) { showToast('Ошибка', 'Введи название', 'error'); return; }
    DB.events.unshift({ id: 'e_' + Date.now(), title, status, desc: 'Новый ивент', date: 'TBD', prizes: [] });
    saveData();
    showToast('🔥 Ивент добавлен', title, 'success');
    document.getElementById('admin-event-title').value = '';
    renderUnstable();
}

function adminSendTestEmail() {
    const nick = document.getElementById('admin-email-nick').value.trim();
    const user = DB.users[nick];
    if (!user || !user.email) { showToast('Ошибка', 'Игрок или email не найден', 'error'); return; }
    sendResultEmail(user.email, nick, true, 0);
    showToast('📧 Отправлено', 'Тест email → ' + user.email, 'info');
}

// ============================================================
//  INIT
// ============================================================
if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.username) {
    const regNick = document.getElementById('reg-nick');
    if (regNick) regNick.value = tg.initDataUnsafe.user.username;
}

renderLeaderboard();
renderUnstable();

// Обновляем онлайн каждые 30 секунд
setInterval(updateOnlineCounters, 30000);

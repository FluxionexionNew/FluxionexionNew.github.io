// ========== BEDROCKTIERS ==========
let users = [];
let currentUser = null;
let pendingVideos = [];
let currentFilter = 'all';
let selectedCategory = 'Sword';
let selectedVideoWeapon = 'Sword';
let videoFile = null;

// Админ
const ADMIN_USER = 'FluxionNew';
const ADMIN_PASS = 'admin123';

// Загрузка данных
function loadData() {
    const saved = localStorage.getItem('bt_data');
    if (saved) {
        const data = JSON.parse(saved);
        users = data.users || [];
        pendingVideos = data.videos || [];
    } else {
        // Создаем админа
        users = [{
            name: ADMIN_USER,
            password: ADMIN_PASS,
            category: 'Admin',
            elo: 9999,
            wins: 999,
            matches: 999,
            kills: 999,
            isAdmin: true
        }];
    }
}

// Сохранение данных
function saveData() {
    localStorage.setItem('bt_data', JSON.stringify({
        users: users,
        videos: pendingVideos
    }));
}

// Показать уведомление
function notify(msg) {
    const div = document.createElement('div');
    div.className = 'notification';
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

// Переключение вкладок
function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    document.querySelector(`.tab[onclick="showTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
    
    if (tab === 'leaderboard') updateLeaderboard();
    if (tab === 'admin' && currentUser?.isAdmin) updateAdminPanel();
}

// Выбор категории
function selectCat(cat) {
    selectedCategory = cat;
    document.querySelectorAll('.cat').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
}

// Выбор оружия для видео
function selectVideoWeapon(weapon) {
    selectedVideoWeapon = weapon;
    document.querySelectorAll('#videoUpload .cat').forEach(c => c.classList.remove('selected'));
    event.target.classList.add('selected');
}

// ========== АВТОРИЗАЦИЯ ==========
function login() {
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    const msg = document.getElementById('loginMsg');
    
    const found = users.find(u => u.name === user && u.password === pass);
    
    if (found) {
        currentUser = found;
        msg.style.color = '#00ff00';
        msg.textContent = '✅ Успешно!';
        
        setTimeout(() => {
            showTab('profile');
            updateProfile();
            updateOnlineCount();
        }, 1000);
    } else {
        msg.style.color = '#ff4444';
        msg.textContent = '❌ Неверный логин или пароль';
    }
}

function register() {
    const user = document.getElementById('regUser').value;
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regConfirm').value;
    const msg = document.getElementById('regMsg');
    
    if (!user || !pass || !confirm) {
        msg.style.color = '#ff4444';
        msg.textContent = '❌ Заполни все поля';
        return;
    }
    
    if (pass !== confirm) {
        msg.style.color = '#ff4444';
        msg.textContent = '❌ Пароли не совпадают';
        return;
    }
    
    if (users.find(u => u.name === user)) {
        msg.style.color = '#ff4444';
        msg.textContent = '❌ Ник уже занят';
        return;
    }
    
    const newUser = {
        name: user,
        password: pass,
        category: selectedCategory,
        elo: 1000,
        wins: 0,
        matches: 0,
        kills: 0,
        isAdmin: false
    };
    
    users.push(newUser);
    currentUser = newUser;
    saveData();
    
    msg.style.color = '#00ff00';
    msg.textContent = '✅ Аккаунт создан!';
    
    setTimeout(() => {
        showTab('profile');
        updateProfile();
        updateOnlineCount();
    }, 1000);
}

function logout() {
    currentUser = null;
    showTab('login');
    updateOnlineCount();
}

function updateOnlineCount() {
    document.getElementById('onlineCount').textContent = `${users.length} ONLINE`;
}

// ========== ПРОФИЛЬ ==========
function updateProfile() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileCat').textContent = currentUser.category;
    document.getElementById('profileElo').textContent = currentUser.elo;
    document.getElementById('playerWins').textContent = currentUser.wins || 0;
    document.getElementById('playerMatches').textContent = currentUser.matches || 0;
    document.getElementById('playerKills').textContent = currentUser.kills || 0;
    
    const rank = getRank(currentUser.elo);
    document.getElementById('profileRank').textContent = rank;
    document.getElementById('currentRank').textContent = rank;
    
    const next = getNextRank(currentUser.elo);
    document.getElementById('nextRank').textContent = next.name;
    document.getElementById('needElo').textContent = next.need;
    document.getElementById('currentElo').textContent = currentUser.elo;
    
    const progress = ((currentUser.elo - next.min) / (next.max - next.min)) * 100;
    document.getElementById('rankProgress').style.width = Math.min(100, Math.max(0, progress)) + '%';
}

function getRank(elo) {
    if (elo >= 4000) return 'Миф';
    if (elo >= 3000) return 'Легенда';
    if (elo >= 2400) return 'Элита';
    if (elo >= 1800) return 'Ветеран';
    if (elo >= 1200) return 'Воин';
    return 'Новичок';
}

function getNextRank(elo) {
    if (elo >= 4000) return { name: 'Миф', min: 4000, max: 5000, need: 5000 };
    if (elo >= 3000) return { name: 'Миф', min: 3000, max: 4000, need: 4000 };
    if (elo >= 2400) return { name: 'Легенда', min: 2400, max: 3000, need: 3000 };
    if (elo >= 1800) return { name: 'Элита', min: 1800, max: 2400, need: 2400 };
    if (elo >= 1200) return { name: 'Ветеран', min: 1200, max: 1800, need: 1800 };
    return { name: 'Воин', min: 0, max: 1200, need: 1200 };
}

// ========== ЛИДЕРБОРД ==========
function filterLeaderboard(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
    event.target.classList.add('active');
    updateLeaderboard();
}

function updateLeaderboard() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = users.filter(u => !u.isAdmin);
    
    if (currentFilter !== 'all') {
        filtered = filtered.filter(u => u.category === currentFilter);
    }
    
    if (search) {
        filtered = filtered.filter(u => u.name.toLowerCase().includes(search));
    }
    
    filtered.sort((a, b) => b.elo - a.elo);
    
    const list = document.getElementById('playersList');
    list.innerHTML = '';
    
    filtered.slice(0, 50).forEach((user, i) => {
        const div = document.createElement('div');
        div.className = 'player-item';
        
        const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
        
        div.innerHTML = `
            <div class="player-rank ${rankClass}">${i + 1}</div>
            <div class="player-info">
                <div class="player-avatar">👤</div>
                <div class="player-details">
                    <div class="player-name">${user.name}</div>
                    <div class="player-cat">${user.category}</div>
                </div>
            </div>
            <div class="player-elo">${user.elo}</div>
        `;
        
        list.appendChild(div);
    });
    
    if (filtered.length > 0) {
        document.getElementById('topElo').textContent = filtered[0].elo;
    }
    document.getElementById('totalPlayers').textContent = users.length;
}

// ========== ВИДЕО ==========
function showVideoUpload() {
    showTab('videoUpload');
}

function backToProfile() {
    showTab('profile');
}

function handleVideoSelect(input) {
    videoFile = input.files[0];
    if (videoFile) {
        document.getElementById('submitVideoBtn').disabled = false;
        document.getElementById('videoProgress').style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('videoProgressBar').style.width = progress + '%';
            document.getElementById('videoProgressText').textContent = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                notify('✅ Видео загружено!');
            }
        }, 200);
    }
}

function submitVideo() {
    if (!videoFile || !currentUser) return;
    
    const video = {
        id: Date.now(),
        player: currentUser.name,
        weapon: selectedVideoWeapon,
        time: new Date().toLocaleString(),
        status: 'pending'
    };
    
    pendingVideos.push(video);
    saveData();
    
    notify('✅ Видео отправлено на проверку!');
    backToProfile();
    
    if (currentUser?.isAdmin) updateAdminPanel();
}

// ========== АДМИНКА ==========
function updateAdminPanel() {
    document.getElementById('adminUsersCount').textContent = users.length;
    document.getElementById('adminVideosCount').textContent = pendingVideos.length;
    
    const list = document.getElementById('videosList');
    list.innerHTML = '';
    
    if (pendingVideos.length === 0) {
        list.innerHTML = '<div style="color: #8f9bb5; text-align: center; padding: 20px;">Нет видео на проверке</div>';
        return;
    }
    
    pendingVideos.forEach(video => {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
            <div class="video-header">
                <span class="video-player">${video.player}</span>
                <span class="video-weapon">${video.weapon}</span>
            </div>
            <div class="video-time">${video.time}</div>
            <div class="video-actions">
                <button class="video-btn accept" onclick="acceptVideo(${video.id})">✅ Принять</button>
                <button class="video-btn reject" onclick="rejectVideo(${video.id})">❌ Отклонить</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function acceptVideo(id) {
    const video = pendingVideos.find(v => v.id === id);
    if (!video) return;
    
    const player = users.find(u => u.name === video.player);
    if (player) {
        const gain = Math.floor(Math.random() * 300) + 200;
        player.elo += gain;
        player.matches = (player.matches || 0) + 1;
        player.wins = (player.wins || 0) + 1;
        notify(`✅ ${player.name} получил +${gain} ELO`);
    }
    
    pendingVideos = pendingVideos.filter(v => v.id !== id);
    saveData();
    updateAdminPanel();
    updateLeaderboard();
}

function rejectVideo(id) {
    pendingVideos = pendingVideos.filter(v => v.id !== id);
    saveData();
    updateAdminPanel();
    notify('❌ Видео отклонено');
}

// ========== ЗАПУСК ==========
loadData();
updateOnlineCount();
showTab('login');

// Сохраняем функции в глобальную область
window.showTab = showTab;
window.selectCat = selectCat;
window.selectVideoWeapon = selectVideoWeapon;
window.login = login;
window.register = register;
window.logout = logout;
window.filterLeaderboard = filterLeaderboard;
window.updateLeaderboard = updateLeaderboard;
window.showVideoUpload = showVideoUpload;
window.backToProfile = backToProfile;
window.handleVideoSelect = handleVideoSelect;
window.submitVideo = submitVideo;
window.acceptVideo = acceptVideo;
window.rejectVideo = rejectVideo;

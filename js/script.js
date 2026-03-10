// ========== BEDROCKTIERS С ВЕРИФИКАЦИЕЙ ВИДЕО ==========
class BedrockTiers {
    constructor() {
        // Данные
        this.users = [];
        this.pendingVideos = [];
        this.currentUser = null;
        this.videoFile = null;
        this.selectedWeapon = 'Sword';
        this.adminUsername = 'FluxionNew';
        this.adminPassword = 'admin123';
        
        // Настройки тиров
        this.tierSettings = {
            ht1: 3000,
            ht2: 2700,
            ht3: 2400,
            top550: 2400
        };
        
        // Система званий
        this.ranks = [
            { name: 'Новичок', min: 0, max: 1199 },
            { name: 'Воин', min: 1200, max: 1799 },
            { name: 'Ветеран', min: 1800, max: 2399 },
            { name: 'Элита', min: 2400, max: 2999 },
            { name: 'Легенда', min: 3000, max: 3999 },
            { name: 'Миф', min: 4000, max: 5000 }
        ];
        
        this.init();
    }

    init() {
        this.loadData();
        this.createAdmin();
        this.setupEventListeners();
        this.showTab('login');
        this.updateLeaderboard();
    }

    // ========== ЗАГРУЗКА/СОХРАНЕНИЕ ==========
    loadData() {
        // Загружаем пользователей
        const savedUsers = localStorage.getItem('bedrockUsers');
        this.users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // Загружаем видео на проверке
        const savedVideos = localStorage.getItem('pendingVideos');
        this.pendingVideos = savedVideos ? JSON.parse(savedVideos) : [];
        
        // Загружаем настройки
        const savedSettings = localStorage.getItem('tierSettings');
        if (savedSettings) {
            this.tierSettings = JSON.parse(savedSettings);
        }
    }

    saveData() {
        localStorage.setItem('bedrockUsers', JSON.stringify(this.users));
        localStorage.setItem('pendingVideos', JSON.stringify(this.pendingVideos));
        localStorage.setItem('tierSettings', JSON.stringify(this.tierSettings));
    }

    createAdmin() {
        if (!this.users.find(u => u.name === this.adminUsername)) {
            this.users.push({
                name: this.adminUsername,
                password: this.adminPassword,
                category: 'Admin',
                region: 'NA',
                elo: 9999,
                avatar: null,
                wins: 999,
                matches: 999,
                kills: 999,
                isAdmin: true,
                verified: true
            });
            this.saveData();
        }
    }

    // ========== СИСТЕМА ТИРОВ ==========
    getTier(elo) {
        if (elo >= this.tierSettings.ht1) return 'HT1';
        if (elo >= this.tierSettings.ht2) return 'HT2';
        if (elo >= this.tierSettings.ht3) return 'HT3';
        if (elo >= 2100) return 'HT4';
        if (elo >= 1800) return 'HT5';
        if (elo >= 1500) return 'LT5';
        if (elo >= 1200) return 'LT4';
        if (elo >= 900) return 'LT3';
        if (elo >= 600) return 'LT2';
        return 'LT1';
    }

    getRank(elo) {
        for (let rank of this.ranks) {
            if (elo >= rank.min && elo <= rank.max) {
                return rank.name;
            }
        }
        return this.ranks[0].name;
    }

    getNextRank(elo) {
        for (let rank of this.ranks) {
            if (elo < rank.max) {
                return rank;
            }
        }
        return this.ranks[this.ranks.length - 1];
    }

    getRankProgress(elo) {
        const nextRank = this.getNextRank(elo);
        if (!nextRank) return 100;
        const progress = ((elo - nextRank.min) / (nextRank.max - nextRank.min)) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    // ========== АВТОРИЗАЦИЯ ==========
    login() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const messageEl = document.getElementById('loginMessage');
        
        const user = this.users.find(u => u.name === username && u.password === password);
        
        if (!user) {
            this.showMessage(messageEl, '❌ Неверный ник или пароль', '#ff4444');
            return;
        }
        
        this.currentUser = user;
        this.showMessage(messageEl, '✅ Вход выполнен!', '#00ff00');
        
        setTimeout(() => {
            this.showProfile();
        }, 1000);
    }

    register() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirm').value;
        const category = document.querySelector('.pvp-cat.selected').dataset.cat;
        const messageEl = document.getElementById('registerMessage');
        
        if (!username || !password || !confirm) {
            this.showMessage(messageEl, '❌ Заполните все поля', '#ff4444');
            return;
        }
        
        if (password !== confirm) {
            this.showMessage(messageEl, '❌ Пароли не совпадают', '#ff4444');
            return;
        }
        
        if (this.users.find(u => u.name === username)) {
            this.showMessage(messageEl, '❌ Ник уже занят', '#ff4444');
            return;
        }
        
        const regions = ['NA', 'EU', 'AS'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        
        const newUser = {
            name: username,
            password: password,
            category: category,
            region: region,
            elo: 1000,
            avatar: null,
            wins: 0,
            matches: 0,
            kills: 0,
            isAdmin: false,
            verified: false,
            pendingVideos: []
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveData();
        
        this.showMessage(messageEl, '✅ Аккаунт создан!', '#00ff00');
        
        setTimeout(() => {
            this.showProfile();
        }, 1000);
    }

    logout() {
        this.currentUser = null;
        this.showTab('login');
        this.updateLeaderboard();
    }

    showMessage(element, text, color) {
        element.style.color = color;
        element.innerText = text;
        setTimeout(() => {
            element.innerText = '';
        }, 3000);
    }

    // ========== ОТОБРАЖЕНИЕ ==========
    showTab(tabName) {
        document.getElementById('loginSection').classList.remove('active');
        document.getElementById('registerSection').classList.remove('active');
        document.getElementById('leaderboardSection').classList.remove('active');
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        
        if (tabName === 'login') {
            document.getElementById('loginSection').classList.add('active');
            document.querySelector('[data-tab="login"]').classList.add('active');
        } else if (tabName === 'register') {
            document.getElementById('registerSection').classList.add('active');
            document.querySelector('[data-tab="register"]').classList.add('active');
        } else if (tabName === 'leaderboard') {
            document.getElementById('leaderboardSection').classList.add('active');
            document.querySelector('[data-tab="leaderboard"]').classList.add('active');
            this.updateLeaderboard();
        }
    }

    showProfile() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('leaderboardSection').style.display = 'none';
        document.getElementById('videoUploadSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'none';
        
        document.getElementById('profileSection').style.display = 'block';
        
        this.updateProfile();
        
        // Показываем админку если админ
        if (this.currentUser.isAdmin) {
            document.getElementById('adminBadge').style.display = 'block';
            document.getElementById('adminSection').style.display = 'block';
            this.updateAdminPanel();
        }
        
        // Проверяем есть ли видео на проверке
        const hasPending = this.pendingVideos.some(v => v.player === this.currentUser.name && v.status === 'pending');
        if (hasPending) {
            document.getElementById('verificationBadge').style.display = 'block';
            document.getElementById('verificationStatus').style.display = 'block';
        } else {
            document.getElementById('verificationBadge').style.display = 'none';
            document.getElementById('verificationStatus').style.display = 'none';
        }
        
        this.updateOnlineCount();
    }

    updateProfile() {
        if (!this.currentUser) return;
        
        document.getElementById('profileName').innerText = this.currentUser.name;
        document.getElementById('profileCategory').innerText = this.currentUser.category;
        document.getElementById('profileElo').innerText = this.currentUser.elo;
        
        document.getElementById('playerWins').innerText = this.currentUser.wins || 0;
        document.getElementById('playerMatches').innerText = this.currentUser.matches || 0;
        document.getElementById('playerKills').innerText = this.currentUser.kills || 0;
        
        const rank = this.getRank(this.currentUser.elo);
        document.getElementById('profileRank').innerText = rank;
        document.getElementById('currentRankTitle').innerText = rank;
        
        const nextRank = this.getNextRank(this.currentUser.elo);
        document.getElementById('nextRankTitle').innerText = nextRank.name;
        document.getElementById('nextRankElo').innerText = nextRank.max;
        document.getElementById('currentElo').innerText = this.currentUser.elo;
        
        const progress = this.getRankProgress(this.currentUser.elo);
        document.getElementById('rankProgress').style.width = progress + '%';
        
        if (this.currentUser.avatar) {
            document.getElementById('avatarImage').src = this.currentUser.avatar;
            document.getElementById('avatarImage').style.display = 'block';
            document.getElementById('avatarEmoji').style.display = 'none';
        }
    }

    updateOnlineCount() {
        document.getElementById('onlineCount').innerText = `${this.users.length} ONLINE`;
    }

    updateLeaderboard() {
        const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
        
        let filtered = this.users.filter(u => u.verified !== false); // Только верифицированные
        
        if (filter !== 'all') {
            filtered = filtered.filter(u => u.category === filter);
        }
        
        if (search) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(search));
        }
        
        filtered.sort((a, b) => b.elo - a.elo);
        
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = '';
        
        filtered.forEach((user, index) => {
            if (index >= 100) return;
            
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
            
            item.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                <div class="leaderboard-player">
                    <div class="leaderboard-avatar">
                        ${user.avatar ? `<img src="${user.avatar}">` : user.name.charAt(0)}
                    </div>
                    <div>
                        <div class="leaderboard-name">${user.name}</div>
                        <div class="leaderboard-category">${user.category}</div>
                    </div>
                </div>
                <div class="leaderboard-elo">${user.elo}</div>
            `;
            
            leaderboard.appendChild(item);
        });
        
        if (filtered.length > 0) {
            document.getElementById('top1Elo').innerText = filtered[0].elo;
        }
        document.getElementById('totalPlayers').innerText = this.users.length;
    }

    // ========== АВАТАР ==========
    uploadAvatar(file) {
        if (!file || !this.currentUser) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentUser.avatar = e.target.result;
            
            const user = this.users.find(u => u.name === this.currentUser.name);
            if (user) user.avatar = e.target.result;
            
            document.getElementById('avatarImage').src = e.target.result;
            document.getElementById('avatarImage').style.display = 'block';
            document.getElementById('avatarEmoji').style.display = 'none';
            
            this.saveData();
            this.showNotification('✅ Аватар загружен!');
            this.updateLeaderboard();
        };
        reader.readAsDataURL(file);
    }

    // ========== ЗАГРУЗКА ВИДЕО ==========
    showVideoUpload() {
        document.getElementById('profileSection').style.display = 'none';
        document.getElementById('videoUploadSection').style.display = 'block';
        
        // Сбрасываем выбор
        this.videoFile = null;
        document.getElementById('submitVideoBtn').disabled = true;
        document.getElementById('videoUploadProgress').style.display = 'none';
    }

    handleVideoSelect(file) {
        if (!file) return;
        
        this.videoFile = file;
        document.getElementById('submitVideoBtn').disabled = false;
        
        // Показываем прогресс
        document.getElementById('videoUploadProgress').style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('videoProgressBar').style.width = progress + '%';
            document.getElementById('videoProgressText').innerText = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showNotification('✅ Видео готово к отправке!');
            }
        }, 200);
    }

    submitVideo() {
        if (!this.videoFile || !this.currentUser) return;
        
        const weapon = document.querySelector('#videoWeaponSelector .selected').dataset.weapon;
        
        // Создаем запись о видео
        const videoData = {
            id: Date.now(),
            player: this.currentUser.name,
            weapon: weapon,
            timestamp: new Date().toISOString(),
            status: 'pending',
            fileName: this.videoFile.name,
            fileSize: this.videoFile.size
        };
        
        // Сохраняем видео в localStorage (в реальности нужно на сервер)
        const reader = new FileReader();
        reader.onload = (e) => {
            videoData.videoData = e.target.result;
            this.pendingVideos.push(videoData);
            this.saveData();
            
            this.showNotification('✅ Видео отправлено на проверку!');
            
            // Возвращаемся в профиль
            document.getElementById('videoUploadSection').style.display = 'none';
            document.getElementById('profileSection').style.display = 'block';
            
            // Показываем статус ожидания
            document.getElementById('verificationBadge').style.display = 'block';
            document.getElementById('verificationStatus').style.display = 'block';
        };
        reader.readAsDataURL(this.videoFile);
    }

    // ========== АДМИН ПАНЕЛЬ ==========
    updateAdminPanel() {
        if (!this.currentUser?.isAdmin) return;
        
        document.getElementById('adminTotalUsers').innerText = this.users.length;
        
        const pendingCount = this.pendingVideos.filter(v => v.status === 'pending').length;
        document.getElementById('adminPendingVideos').innerText = pendingCount;
        
        this.updatePendingVideosList();
        this.updateAdminUsersList();
        this.updateSettings();
    }

    updatePendingVideosList() {
        const container = document.getElementById('pendingVideos');
        container.innerHTML = '';
        
        const pending = this.pendingVideos.filter(v => v.status === 'pending');
        
        if (pending.length === 0) {
            container.innerHTML = '<div class="info-text" style="text-align: center; padding: 20px;">Нет видео на проверке</div>';
            return;
        }
        
        pending.forEach(video => {
            const item = document.createElement('div');
            item.className = 'pending-video-item';
            
            // Находим игрока
            const player = this.users.find(u => u.name === video.player);
            
            item.innerHTML = `
                <div class="pending-video-header">
                    <span class="pending-video-player">${video.player}</span>
                    <span class="pending-video-time">${new Date(video.timestamp).toLocaleString()}</span>
                </div>
                <div class="pending-video-info">
                    <div class="pending-video-stat">
                        <div class="pending-video-stat-label">ОРУЖИЕ</div>
                        <div class="pending-video-stat-value">${video.weapon}</div>
                    </div>
                    <div class="pending-video-stat">
                        <div class="pending-video-stat-label">ТЕКУЩИЙ ELO</div>
                        <div class="pending-video-stat-value">${player?.elo || 1000}</div>
                    </div>
                    <div class="pending-video-stat">
                        <div class="pending-video-stat-label">ТИР</div>
                        <div class="pending-video-stat-value">${this.getTier(player?.elo || 1000)}</div>
                    </div>
                </div>
                <div class="pending-video-actions">
                    <button class="verify-btn preview" onclick="app.previewVideo(${video.id})">👁️ Смотреть</button>
                    <button class="verify-btn accept" onclick="app.acceptVideo(${video.id})">✅ Принять</button>
                    <button class="verify-btn reject" onclick="app.rejectVideo(${video.id})">❌ Отклонить</button>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    previewVideo(videoId) {
        const video = this.pendingVideos.find(v => v.id === videoId);
        if (!video || !video.videoData) return;
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <video controls style="width: 100%; max-height: 300px;">
                    <source src="${video.videoData}" type="video/mp4">
                </video>
                <div class="modal-actions">
                    <button class="modal-btn" onclick="app.acceptVideo(${videoId})" style="background: #00aa00;">✅ Принять</button>
                    <button class="modal-btn" onclick="app.rejectVideo(${videoId})" style="background: #ff4444;">❌ Отклонить</button>
                    <button class="modal-btn" onclick="this.closest('.modal').remove()">✖️ Закрыть</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    acceptVideo(videoId) {
        const video = this.pendingVideos.find(v => v.id === videoId);
        if (!video) return;
        
        const player = this.users.find(u => u.name === video.player);
        if (!player) return;
        
        // Генерируем оценку (в реальности админ ставит сам)
        const eloGain = Math.floor(Math.random() * 300) + 200;
        const newElo = player.elo + eloGain;
        
        // Обновляем игрока
        player.elo = newElo;
        player.matches = (player.matches || 0) + 1;
        player.verified = true;
        
        // Удаляем видео из очереди
        this.pendingVideos = this.pendingVideos.filter(v => v.id !== videoId);
        
        this.saveData();
        
        // Убираем модальное окно если есть
        document.querySelector('.modal')?.remove();
        
        this.showNotification(`✅ Видео принято! Игрок ${video.player} получил +${eloGain} ELO`);
        this.updatePendingVideosList();
        this.updateLeaderboard();
        this.updateAdminPanel();
    }

    rejectVideo(videoId) {
        const video = this.pendingVideos.find(v => v.id === videoId);
        if (!video) return;
        
        // Просто удаляем видео
        this.pendingVideos = this.pendingVideos.filter(v => v.id !== videoId);
        this.saveData();
        
        document.querySelector('.modal')?.remove();
        
        this.showNotification(`❌ Видео ${video.player} отклонено`);
        this.updatePendingVideosList();
        this.updateAdminPanel();
    }

    updateAdminUsersList() {
        const container = document.getElementById('adminUsersList');
        const search = document.getElementById('adminUserSearch')?.value.toLowerCase() || '';
        
        let filtered = this.users.filter(u => !u.isAdmin);
        
        if (search) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(search));
        }
        
        container.innerHTML = '';
        
        filtered.forEach(user => {
            const item = document.createElement('div');
            item.className = 'admin-user-item';
            
            item.innerHTML = `
                <div class="admin-user-info">
                    <div class="admin-user-name">${user.name}</div>
                    <div class="admin-user-details">ELO: ${user.elo} | ${user.category} | Боёв: ${user.matches || 0}</div>
                </div>
                <div class="admin-user-actions">
                    <button class="admin-user-btn edit" onclick="app.adminEditUser('${user.name}')">✏️</button>
                    <button class="admin-user-btn delete" onclick="app.adminDeleteUser('${user.name}')">🗑️</button>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    updateSettings() {
        document.getElementById('settingHT1').value = this.tierSettings.ht1;
        document.getElementById('settingHT2').value = this.tierSettings.ht2;
        document.getElementById('settingTop550').value = this.tierSettings.top550;
    }

    saveSettings() {
        this.tierSettings.ht1 = parseInt(document.getElementById('settingHT1').value) || 3000;
        this.tierSettings.ht2 = parseInt(document.getElementById('settingHT2').value) || 2700;
        this.tierSettings.top550 = parseInt(document.getElementById('settingTop550').value) || 2400;
        
        this.saveData();
        this.showNotification('✅ Настройки сохранены');
        this.updateLeaderboard();
    }

    adminEditUser(username) {
        const user = this.users.find(u => u.name === username);
        if (!user) return;
        
        const newElo = prompt(`Введите новый ELO для ${username}:`, user.elo);
        if (newElo && !isNaN(newElo)) {
            user.elo = parseInt(newElo);
            this.saveData();
            this.updateAdminUsersList();
            this.updateLeaderboard();
            this.showNotification(`✅ ELO игрока ${username} изменен`);
        }
    }

    adminDeleteUser(username) {
        if (!confirm(`Точно удалить игрока ${username}?`)) return;
        
        this.users = this.users.filter(u => u.name !== username);
        this.saveData();
        this.updateAdminUsersList();
        this.updateLeaderboard();
        this.showNotification(`✅ Игрок ${username} удален`);
    }

    adminResetAll() {
        if (!confirm('Точно сбросить всё? Будут удалены все игроки кроме админа!')) return;
        
        this.users = this.users.filter(u => u.isAdmin);
        this.pendingVideos = [];
        this.saveData();
        
        this.updateAdminPanel();
        this.updateLeaderboard();
        this.showNotification('✅ Все данные сброшены');
    }

    adminClearData() {
        if (!confirm('Точно очистить все данные? Это удалит вообще всё!')) return;
        
        localStorage.clear();
        this.users = [];
        this.pendingVideos = [];
        this.createAdmin();
        this.saveData();
        
        this.showTab('login');
        this.showNotification('✅ Все данные очищены');
    }

    adminExport() {
        const data = {
            users: this.users,
            pendingVideos: this.pendingVideos,
            settings: this.tierSettings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bedrocktiers_backup_${Date.now()}.json`;
        a.click();
        
        this.showNotification('✅ Данные экспортированы');
    }

    // ========== УВЕДОМЛЕНИЯ ==========
    showNotification(text) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerText = text;
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.remove();
        }, 2000);
    }

    // ========== СОБЫТИЯ ==========
    setupEventListeners() {
        // Вкладки
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.showTab(tab.dataset.tab);
            });
        });
        
        // Вход
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        
        // Регистрация
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        
        // Выбор категории
        document.querySelectorAll('.pvp-cat').forEach(cat => {
            cat.addEventListener('click', function() {
                document.querySelectorAll('.pvp-cat').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Фильтры лидерборда
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                app.updateLeaderboard();
            });
        });
        
        // Поиск
        document.getElementById('searchInput')?.addEventListener('input', () => this.updateLeaderboard());
        
        // Аватар
        document.getElementById('avatarUploadBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });
        
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            if (e.target.files[0]) this.uploadAvatar(e.target.files[0]);
        });
        
        // Загрузка видео
        document.getElementById('calibrateBtn').addEventListener('click', () => this.showVideoUpload());
        document.getElementById('backFromVideo').addEventListener('click', () => {
            document.getElementById('videoUploadSection').style.display = 'none';
            document.getElementById('profileSection').style.display = 'block';
        });
        
        // Выбор оружия для видео
        document.querySelectorAll('#videoWeaponSelector .weapon-option').forEach(weapon => {
            weapon.addEventListener('click', function() {
                document.querySelectorAll('#videoWeaponSelector .weapon-option').forEach(w => w.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Загрузка файла
        document.getElementById('videoUploadArea').addEventListener('click', () => {
            document.getElementById('videoFileInput').click();
        });
        
        document.getElementById('videoFileInput').addEventListener('change', (e) => {
            this.handleVideoSelect(e.target.files[0]);
        });
        
        // Отправка на проверку
        document.getElementById('submitVideoBtn').addEventListener('click', () => this.submitVideo());
        
        // Выход
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Админ вкладки
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(`admin${this.dataset.adminTab}Tab`).classList.add('active');
            });
        });
        
        // Поиск в админке
        document.getElementById('adminUserSearch')?.addEventListener('input', () => this.updateAdminUsersList());
        
        // Настройки
        document.getElementById('settingHT1')?.addEventListener('change', () => this.saveSettings());
        document.getElementById('settingHT2')?.addEventListener('change', () => this.saveSettings());
        document.getElementById('settingTop550')?.addEventListener('change', () => this.saveSettings());
        
        // Админ кнопки
        document.getElementById('adminResetAll').addEventListener('click', () => this.adminResetAll());
        document.getElementById('adminClearData').addEventListener('click', () => this.adminClearData());
        document.getElementById('adminExport').addEventListener('click', () => this.adminExport());
    }
}

// Запуск
const app = new BedrockTiers();
window.app = app;

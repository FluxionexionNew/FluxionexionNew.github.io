// ========== BEDROCKTIERS - ОСНОВНОЙ КЛАСС ==========
class BedrockTiers {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.videoUploaded = false;
        this.selectedWeapon = 'Sword';
        
        // Система званий
        this.ranks = [
            { name: 'Новичок', minElo: 0, maxElo: 1199 },
            { name: 'Воин', minElo: 1200, maxElo: 1799 },
            { name: 'Ветеран', minElo: 1800, maxElo: 2399 },
            { name: 'Элита', minElo: 2400, maxElo: 2999 },
            { name: 'Легенда', minElo: 3000, maxElo: 3999 },
            { name: 'Миф', minElo: 4000, maxElo: 5000 }
        ];
        
        this.init();
    }

    init() {
        // Скрываем загрузчик
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1000);
        
        this.loadUsers();
        this.render();
        this.setupEventListeners();
        this.updateOnlineCount();
    }

    // ========== РАБОТА С ДАННЫМИ ==========
    loadUsers() {
        const saved = localStorage.getItem('bedrockUsers');
        if (saved) {
            this.users = JSON.parse(saved);
        } else {
            // Демо-игроки
            this.users = [
                { name: 'Marlo', category: 'Sword', region: 'NA', elo: 3150, tier: 'HT1', avatar: null },
                { name: 'ItzReal', category: 'Axe', region: 'NA', elo: 2980, tier: 'HT2', avatar: null },
                { name: 'xQc', category: 'Crystal', region: 'EU', elo: 2750, tier: 'HT2', avatar: null },
                { name: 'Techno', category: 'Mace', region: 'NA', elo: 3120, tier: 'HT1', avatar: null },
                { name: 'Dream', category: 'Sword', region: 'NA', elo: 2640, tier: 'HT3', avatar: null },
                { name: 'Clarity', category: 'Sword', region: 'EU', elo: 2550, tier: 'HT3', avatar: null },
                { name: 'Flame', category: 'Crystal', region: 'AS', elo: 2430, tier: 'HT3', avatar: null }
            ];
        }
    }

    saveUsers() {
        localStorage.setItem('bedrockUsers', JSON.stringify(this.users));
    }

    // ========== ПОЛУЧЕНИЕ ДАННЫХ ==========
    getSkinUrl(username) {
        return `https://ely.by/api/skin?user=${username}&size=64`;
    }

    getTier(elo) {
        if (elo >= 3000) return 'HT1';
        if (elo >= 2700) return 'HT2';
        if (elo >= 2400) return 'HT3';
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
            if (elo >= rank.minElo && elo <= rank.maxElo) {
                return rank.name;
            }
        }
        return 'Новичок';
    }

    getNextRank(elo) {
        for (let i = 0; i < this.ranks.length; i++) {
            if (elo < this.ranks[i].maxElo) {
                return this.ranks[i];
            }
        }
        return this.ranks[this.ranks.length - 1];
    }

    getRankProgress(elo) {
        const currentRank = this.getRank(elo);
        const nextRank = this.getNextRank(elo);
        
        if (currentRank === 'Миф') return 100;
        
        const progress = ((elo - nextRank.minElo) / (nextRank.maxElo - nextRank.minElo)) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    // ========== НЕЙРОСЕТЬ ==========
    analyzePVP(weapon) {
        // Симуляция нейросети с реалистичными значениями
        const combo = Math.floor(Math.random() * 30) + 70;
        const wtap = Math.floor(Math.random() * 30) + 65;
        const straf = Math.floor(Math.random() * 30) + 68;
        const crit = Math.floor(Math.random() * 30) + 72;
        
        // Бонус за оружие
        const weaponBonuses = {
            'Sword': 5,
            'Axe': 4,
            'Crystal': 7,
            'Mace': 6
        };
        
        const weaponBonus = weaponBonuses[weapon] || 0;
        const avgSkill = (combo + wtap + straf + crit) / 4 + weaponBonus;
        
        // Определяем тир
        let tier = '';
        if (avgSkill >= 95) tier = 'HT1';
        else if (avgSkill >= 90) tier = 'HT2';
        else if (avgSkill >= 85) tier = 'HT3';
        else if (avgSkill >= 80) tier = 'HT4';
        else if (avgSkill >= 75) tier = 'HT5';
        else if (avgSkill >= 70) tier = 'LT5';
        else if (avgSkill >= 65) tier = 'LT4';
        else if (avgSkill >= 60) tier = 'LT3';
        else if (avgSkill >= 55) tier = 'LT2';
        else tier = 'LT1';
        
        const eloGain = Math.floor(avgSkill * 3);
        
        return {
            combo, wtap, straf, crit,
            tier,
            elo: 1000 + eloGain,
            eloGain
        };
    }

    // ========== ОТОБРАЖЕНИЕ ==========
    render() {
        const category = document.querySelector('.category.active')?.dataset.cat || 'all';
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        
        let filtered = [...this.users];
        
        if (category !== 'all') {
            filtered = filtered.filter(u => u.category === category);
        }
        
        if (searchQuery) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(searchQuery));
        }
        
        filtered.sort((a, b) => b.elo - a.elo);
        
        const tbody = document.getElementById('playersTable');
        tbody.innerHTML = '';
        
        filtered.forEach((user, index) => {
            const tier = user.tier || this.getTier(user.elo);
            const row = document.createElement('div');
            row.className = 'player-row';
            
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
            
            // Аватар или скин
            let avatarHtml = '';
            if (user.avatar) {
                avatarHtml = `<img src="${user.avatar}" style="width:100%;height:100%;object-fit:cover;">`;
            } else {
                avatarHtml = `<span>${user.name.charAt(0)}</span>`;
            }
            
            row.innerHTML = `
                <div class="rank ${rankClass}">${index + 1}</div>
                <div class="player-info">
                    <div class="player-skin">
                        ${avatarHtml}
                    </div>
                    <div class="player-name">${user.name}</div>
                </div>
                <div><span class="category-badge">${user.category}</span></div>
                <div class="region">${user.region || 'INT'}</div>
                <div><span class="tier-badge tier-${tier.toLowerCase()}">${tier}</span></div>
                <div class="elo">${user.elo}</div>
            `;
            
            tbody.appendChild(row);
        });
        
        const top550Count = this.users.filter(u => u.elo >= 2400).length;
        document.getElementById('topStats').innerHTML = `${top550Count} ИГРОКОВ`;
    }

    updateOnlineCount() {
        document.getElementById('onlineCount').innerHTML = `${this.users.length} ONLINE`;
    }

    updateProfile() {
        if (!this.currentUser) return;
        
        document.getElementById('profileName').innerText = this.currentUser.name;
        document.getElementById('profileCategory').innerText = this.currentUser.category;
        document.getElementById('profileElo').innerText = this.currentUser.elo;
        
        // Обновляем звание
        const rank = this.getRank(this.currentUser.elo);
        document.getElementById('profileRank').innerText = rank;
        document.getElementById('currentRankTitle').innerText = rank;
        
        const nextRank = this.getNextRank(this.currentUser.elo);
        document.getElementById('nextRankTitle').innerText = nextRank.name;
        document.getElementById('nextRankElo').innerText = nextRank.maxElo;
        document.getElementById('currentElo').innerText = this.currentUser.elo;
        
        const progress = this.getRankProgress(this.currentUser.elo);
        document.getElementById('rankProgress').style.width = progress + '%';
        
        // Аватар
        if (this.currentUser.avatar) {
            document.getElementById('avatarImage').src = this.currentUser.avatar;
            document.getElementById('avatarImage').style.display = 'block';
            document.getElementById('avatarEmoji').style.display = 'none';
        }
    }

    // ========== РЕГИСТРАЦИЯ ==========
    register() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const selectedCat = document.querySelector('.pvp-cat.selected')?.dataset.cat || 'Sword';
        
        if (!username || !password) {
            this.showNotification('❌ Заполните все поля');
            return;
        }
        
        if (this.users.find(u => u.name === username)) {
            this.showNotification('❌ Ник уже занят');
            return;
        }
        
        const regions = ['NA', 'EU', 'AS'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        
        const newUser = {
            name: username,
            password: password,
            category: selectedCat,
            region: region,
            elo: 1000,
            tier: 'Uncalibrated',
            calibrated: false,
            avatar: null
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveUsers();
        
        // Показываем профиль и калибровку
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'block';
        document.getElementById('calibrationSection').style.display = 'block';
        
        this.updateProfile();
        
        // Пробуем загрузить скин с ely.by
        const skinUrl = this.getSkinUrl(username);
        const profileImg = document.getElementById('avatarImage');
        profileImg.src = skinUrl;
        profileImg.onload = () => {
            profileImg.style.display = 'block';
            document.getElementById('avatarEmoji').style.display = 'none';
        };
        
        this.showNotification(`✅ Добро пожаловать, ${username}! Пройди калибровку`);
        this.render();
        this.updateOnlineCount();
    }

    // ========== ЗАГРУЗКА АВАТАРА ==========
    uploadAvatar(file) {
        if (!file || !this.currentUser) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarUrl = e.target.result;
            
            // Сохраняем в текущего пользователя
            this.currentUser.avatar = avatarUrl;
            
            // Обновляем в общем списке
            const user = this.users.find(u => u.name === this.currentUser.name);
            if (user) {
                user.avatar = avatarUrl;
            }
            
            // Обновляем отображение
            document.getElementById('avatarImage').src = avatarUrl;
            document.getElementById('avatarImage').style.display = 'block';
            document.getElementById('avatarEmoji').style.display = 'none';
            
            this.saveUsers();
            this.render();
            this.showNotification('✅ Аватар загружен!');
        };
        reader.readAsDataURL(file);
    }

    // ========== ЗАГРУЗКА ВИДЕО ==========
    handleVideoUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        this.videoUploaded = true;
        document.getElementById('analyzeBtn').disabled = false;
        
        // Показываем прогресс
        document.getElementById('uploadProgress').style.display = 'block';
        document.getElementById('uploadArea').style.opacity = '0.5';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressText').innerHTML = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showNotification('✅ Видео загружено! Нажми анализировать');
            }
        }, 200);
    }

    // ========== АНАЛИЗ ВИДЕО ==========
    analyzeVideo() {
        if (!this.videoUploaded) {
            this.showNotification('❌ Сначала загрузи видео');
            return;
        }
        
        // Показываем анализ
        document.getElementById('analyzeBtn').disabled = true;
        document.getElementById('analyzeBtn').innerHTML = '⏳ АНАЛИЗ...';
        
        setTimeout(() => {
            const results = this.analyzePVP(this.selectedWeapon);
            
            // Обновляем пользователя
            const user = this.users.find(u => u.name === this.currentUser.name);
            if (user) {
                user.elo = results.elo;
                user.tier = results.tier;
                user.calibrated = true;
                this.saveUsers();
            }
            
            this.currentUser.elo = results.elo;
            this.currentUser.tier = results.tier;
            
            // Показываем результаты
            document.getElementById('calibrationSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';
            
            document.getElementById('resultTier').innerHTML = results.tier;
            document.getElementById('resultCombo').innerHTML = results.combo;
            document.getElementById('resultWtap').innerHTML = results.wtap;
            document.getElementById('resultStraf').innerHTML = results.straf;
            document.getElementById('resultCrit').innerHTML = results.crit;
            document.getElementById('resultElo').innerHTML = `+${results.eloGain} ELO`;
            
            this.updateProfile();
            
            this.showNotification(`🎉 Твой тир: ${results.tier}`);
            this.render();
        }, 3000);
    }

    // ========== ПРОДОЛЖИТЬ ПОСЛЕ КАЛИБРОВКИ ==========
    continueToRankings() {
        document.getElementById('resultsSection').style.display = 'none';
        this.showNotification('✅ Калибровка завершена!');
    }

    // ========== УВЕДОМЛЕНИЯ ==========
    showNotification(text) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = text;
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.remove();
        }, 2000);
    }

    // ========== СОБЫТИЯ ==========
    setupEventListeners() {
        // Регистрация
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        
        // Выбор категории при регистрации
        document.querySelectorAll('.pvp-cat').forEach(cat => {
            cat.addEventListener('click', function() {
                document.querySelectorAll('.pvp-cat').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Загрузка аватара
        document.getElementById('avatarUploadBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });
        
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.uploadAvatar(e.target.files[0]);
            }
        });
        
        // Выбор оружия для калибровки
        document.querySelectorAll('.weapon-option').forEach(weapon => {
            weapon.addEventListener('click', function() {
                document.querySelectorAll('.weapon-option').forEach(w => w.classList.remove('selected'));
                this.classList.add('selected');
                this.self?.selectedWeapon = this.dataset.weapon;
            });
        });
        
        // Сохраняем this для вложенных функций
        const self = this;
        
        document.querySelectorAll('.weapon-option').forEach(weapon => {
            weapon.addEventListener('click', function() {
                document.querySelectorAll('.weapon-option').forEach(w => w.classList.remove('selected'));
                this.classList.add('selected');
                self.selectedWeapon = this.dataset.weapon;
            });
        });
        
        // Загрузка видео
        document.getElementById('uploadArea').addEventListener('click', () => {
            document.getElementById('videoInput').click();
        });
        
        document.getElementById('videoInput').addEventListener('change', (e) => {
            this.handleVideoUpload(e.target);
        });
        
        // Анализ видео
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeVideo());
        
        // Продолжить после калибровки
        document.getElementById('continueBtn').addEventListener('click', () => this.continueToRankings());
        
        // Навигация по категориям
        document.querySelectorAll('.category').forEach(cat => {
            cat.addEventListener('click', function() {
                document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                self.render();
            });
        });
        
        // Поиск
        document.getElementById('searchInput').addEventListener('input', () => this.render());
        
        // Фильтр топ 550
        document.getElementById('filterBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.render();
        });
    }
}

// ========== ЗАПУСК ==========
document.addEventListener('DOMContentLoaded', () => {
    new BedrockTiers();
});

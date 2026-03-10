// ========== BEDROCKTIERS ==========
class BedrockTiers {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.videoUploaded = false;
        this.selectedWeapon = 'Sword';
        
        this.ranks = [
            { name: 'Новичок', min: 0, max: 1199 },
            { name: 'Воин', min: 1200, max: 1799 },
            { name: 'Ветеран', min: 1800, max: 2399 },
            { name: 'Элита', min: 2400, max: 2999 },
            { name: 'Легенда', min: 3000, max: 3999 },
            { name: 'Миф', min: 4000, max: 5000 }
        ];
        
        this.loadUsers();
        this.setupEventListeners();
        this.updateOnlineCount();
    }

    loadUsers() {
        const saved = localStorage.getItem('bedrockUsers');
        if (saved) {
            this.users = JSON.parse(saved);
        } else {
            this.users = [];
        }
    }

    saveUsers() {
        localStorage.setItem('bedrockUsers', JSON.stringify(this.users));
    }

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
            if (elo >= rank.min && elo <= rank.max) {
                return rank.name;
            }
        }
        return 'Новичок';
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

    analyzePVP(weapon) {
        const combo = Math.floor(Math.random() * 30) + 70;
        const wtap = Math.floor(Math.random() * 30) + 65;
        const straf = Math.floor(Math.random() * 30) + 68;
        const crit = Math.floor(Math.random() * 30) + 72;
        
        const bonuses = { Sword: 5, Axe: 4, Crystal: 7, Mace: 6 };
        const bonus = bonuses[weapon] || 0;
        
        const avg = (combo + wtap + straf + crit) / 4 + bonus;
        
        let tier = '';
        if (avg >= 95) tier = 'HT1';
        else if (avg >= 90) tier = 'HT2';
        else if (avg >= 85) tier = 'HT3';
        else if (avg >= 80) tier = 'HT4';
        else if (avg >= 75) tier = 'HT5';
        else if (avg >= 70) tier = 'LT5';
        else if (avg >= 65) tier = 'LT4';
        else if (avg >= 60) tier = 'LT3';
        else if (avg >= 55) tier = 'LT2';
        else tier = 'LT1';
        
        return {
            combo, wtap, straf, crit,
            tier,
            eloGain: Math.floor(avg * 3)
        };
    }

    updateOnlineCount() {
        document.getElementById('onlineCount').innerText = `${this.users.length} ONLINE`;
    }

    updateProfile() {
        if (!this.currentUser) return;
        
        document.getElementById('profileName').innerText = this.currentUser.name;
        document.getElementById('profileCategory').innerText = this.currentUser.category;
        document.getElementById('profileElo').innerText = this.currentUser.elo;
        
        const rank = this.getRank(this.currentUser.elo);
        document.getElementById('profileRank').innerText = rank;
        document.getElementById('currentRankTitle').innerText = rank;
        
        const nextRank = this.getNextRank(this.currentUser.elo);
        document.getElementById('nextRankTitle').innerText = nextRank.name;
        document.getElementById('nextRankElo').innerText = nextRank.max;
        document.getElementById('currentElo').innerText = this.currentUser.elo;
        
        const progress = this.getRankProgress(this.currentUser.elo);
        document.getElementById('rankProgress').style.width = progress + '%';
    }

    register() {
        const name = document.getElementById('regUsername').value.trim();
        const pass = document.getElementById('regPassword').value;
        const category = document.querySelector('.pvp-cat.selected').dataset.cat;
        
        if (!name || !pass) {
            this.showNotification('❌ Заполните все поля');
            return;
        }
        
        if (this.users.find(u => u.name === name)) {
            this.showNotification('❌ Ник уже занят');
            return;
        }
        
        const regions = ['NA', 'EU', 'AS'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        
        const newUser = {
            name, password: pass, category, region,
            elo: 1000, avatar: null
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveUsers();
        
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'block';
        document.getElementById('calibrationSection').style.display = 'block';
        
        this.updateProfile();
        this.updateOnlineCount();
        this.showNotification(`✅ Добро пожаловать, ${name}!`);
    }

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
            
            this.saveUsers();
            this.showNotification('✅ Аватар загружен!');
        };
        reader.readAsDataURL(file);
    }

    handleVideoUpload(file) {
        if (!file) return;
        
        this.videoUploaded = true;
        document.getElementById('analyzeBtn').disabled = false;
        document.getElementById('uploadProgress').style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressText').innerText = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showNotification('✅ Видео загружено!');
            }
        }, 200);
    }

    analyzeVideo() {
        if (!this.videoUploaded) {
            this.showNotification('❌ Сначала загрузи видео');
            return;
        }
        
        document.getElementById('analyzeBtn').disabled = true;
        document.getElementById('analyzeBtn').innerText = '⏳ АНАЛИЗ...';
        
        setTimeout(() => {
            const results = this.analyzePVP(this.selectedWeapon);
            
            const user = this.users.find(u => u.name === this.currentUser.name);
            if (user) {
                user.elo = 1000 + results.eloGain;
                this.currentUser.elo = user.elo;
                this.saveUsers();
            }
            
            document.getElementById('calibrationSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';
            
            document.getElementById('resultTier').innerText = results.tier;
            document.getElementById('resultCombo').innerText = results.combo;
            document.getElementById('resultWtap').innerText = results.wtap;
            document.getElementById('resultStraf').innerText = results.straf;
            document.getElementById('resultCrit').innerText = results.crit;
            document.getElementById('resultElo').innerText = `+${results.eloGain} ELO`;
            
            this.updateProfile();
            this.showNotification(`🎉 Твой тир: ${results.tier}`);
        }, 3000);
    }

    showNotification(text) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.innerText = text;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }

    setupEventListeners() {
        // Регистрация
        document.getElementById('registerBtn').addEventListener('click', () => this.register());
        
        // Выбор категории
        document.querySelectorAll('.pvp-cat').forEach(cat => {
            cat.addEventListener('click', function() {
                document.querySelectorAll('.pvp-cat').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Аватар
        document.getElementById('avatarUploadBtn').addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });
        
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            if (e.target.files[0]) this.uploadAvatar(e.target.files[0]);
        });
        
        // Выбор оружия
        document.querySelectorAll('.weapon-option').forEach(weapon => {
            weapon.addEventListener('click', function() {
                document.querySelectorAll('.weapon-option').forEach(w => w.classList.remove('selected'));
                this.classList.add('selected');
                window.app.selectedWeapon = this.dataset.weapon;
            });
        });
        
        // Загрузка видео
        document.getElementById('uploadArea').addEventListener('click', () => {
            document.getElementById('videoInput').click();
        });
        
        document.getElementById('videoInput').addEventListener('change', (e) => {
            this.handleVideoUpload(e.target.files[0]);
        });
        
        // Анализ
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeVideo());
        
        // Продолжить
        document.getElementById('continueBtn').addEventListener('click', () => {
            document.getElementById('resultsSection').style.display = 'none';
        });
        
        window.app = this;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    new BedrockTiers();
});

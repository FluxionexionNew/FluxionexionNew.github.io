// ========== BEDROCKTIERS - ПОЛНЫЙ САЙТ ==========

// ========== СТИЛИ CSS ==========
const styles = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
    background: linear-gradient(145deg, #0f1a2f 0%, #1a2a3f 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
}

/* Главный контейнер */
.bedrock {
    width: 1500px;
    max-width: 100%;
    background: rgba(10, 15, 25, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 255, 255, 0.2);
    overflow: hidden;
    border: 1px solid rgba(0, 255, 255, 0.2);
}

/* Шапка */
.header {
    padding: 20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.3);
}

.logo {
    font-size: 28px;
    font-weight: 900;
    background: linear-gradient(135deg, #00ffff, #00aaff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 1px;
}

.logo span {
    background: linear-gradient(135deg, #ffaa00, #ff5500);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.online-count {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid #00ffff;
    color: #00ffff;
    padding: 8px 20px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 14px;
}

/* Регистрация */
.register-section {
    padding: 30px;
    background: rgba(0, 255, 255, 0.03);
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.register-title {
    color: #00ffff;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 600;
}

.register-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.input-group {
    margin-bottom: 15px;
}

.input-label {
    color: #8a9bb5;
    margin-bottom: 5px;
    font-size: 13px;
}

.input-field {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 12px;
    padding: 14px 18px;
    color: white;
    font-size: 15px;
    outline: none;
    transition: all 0.2s;
}

.input-field:focus {
    border-color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.pvp-categories {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 15px 0;
}

.pvp-cat {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px;
    text-align: center;
    color: #8a9bb5;
    cursor: pointer;
    transition: all 0.2s;
}

.pvp-cat.selected {
    background: rgba(0, 255, 255, 0.1);
    border-color: #00ffff;
    color: #00ffff;
}

.register-btn {
    background: linear-gradient(135deg, #00ffff, #0088ff);
    border: none;
    border-radius: 12px;
    padding: 16px;
    color: #000;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    margin-top: 10px;
}

.register-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.4);
}

/* Профиль */
.profile-section {
    padding: 30px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    display: none;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
}

.skin-preview {
    width: 80px;
    height: 80px;
    border-radius: 15px;
    background: linear-gradient(135deg, #1a2a3f, #0f1a2f);
    border: 2px solid #00ffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    overflow: hidden;
    cursor: pointer;
}

.skin-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.profile-info h2 {
    color: white;
    margin-bottom: 5px;
}

.profile-info p {
    color: #00ffff;
    font-weight: 600;
}

.elo-display {
    font-size: 24px;
    color: white;
    margin-left: auto;
}

.elo-display span {
    color: #00ffff;
    font-weight: 700;
}

/* Категории ПВП */
.categories-nav {
    display: flex;
    padding: 15px 30px;
    gap: 25px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.2);
    overflow-x: auto;
}

.category {
    color: #8a9bb5;
    font-weight: 600;
    cursor: pointer;
    padding: 5px 0;
    white-space: nowrap;
}

.category.active {
    color: #00ffff;
    border-bottom: 3px solid #00ffff;
}

/* Загрузка скина */
.skin-upload {
    padding: 20px 30px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 20px;
}

.skin-btn {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid #00ffff;
    border-radius: 50px;
    padding: 12px 25px;
    color: #00ffff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.skin-btn:hover {
    background: #00ffff;
    color: #000;
}

.skin-note {
    color: #8a9bb5;
    font-size: 14px;
}

/* Поиск */
.search-section {
    padding: 20px 30px;
    display: flex;
    gap: 15px;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.search-box {
    flex: 1;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 50px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.search-box input {
    background: none;
    border: none;
    color: white;
    width: 100%;
    outline: none;
}

.search-box input::placeholder {
    color: #5a6b85;
}

.search-icon {
    color: #00ffff;
}

.filter-btn {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid #00ffff;
    border-radius: 50px;
    padding: 8px 20px;
    color: #00ffff;
    cursor: pointer;
}

/* Таблица */
.table-header {
    display: grid;
    grid-template-columns: 70px 250px 150px 120px 1fr 100px;
    padding: 15px 30px;
    background: rgba(0, 0, 0, 0.4);
    color: #8a9bb5;
    font-weight: 600;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.player-row {
    display: grid;
    grid-template-columns: 70px 250px 150px 120px 1fr 100px;
    padding: 12px 30px;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s;
}

.player-row:hover {
    background: rgba(0, 255, 255, 0.05);
}

.rank {
    font-weight: 700;
    font-size: 18px;
    color: #8a9bb5;
}

.rank-1 { color: #ffd700; }
.rank-2 { color: #c0c0c0; }
.rank-3 { color: #cd7f32; }

.player-skin {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1a2a3f, #0f1a2f);
    border: 2px solid #00ffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    overflow: hidden;
}

.player-skin img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.player-name {
    color: white;
    font-weight: 600;
}

.player-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.category-badge {
    background: rgba(0, 255, 255, 0.1);
    border: 1px solid #00ffff;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    color: #00ffff;
}

.region {
    color: #8a9bb5;
}

.tier-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 12px;
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    border: 1px solid #00ffff;
}

.elo {
    color: #00ffff;
    font-weight: 700;
}

/* Инфо о топе */
.top-info {
    padding: 20px 30px;
    background: rgba(0, 255, 255, 0.05);
    border-top: 1px solid rgba(0, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
    color: white;
}

.top-info span {
    color: #00ffff;
    font-weight: 700;
}

/* Футер */
.footer {
    padding: 20px 30px;
    color: #5a6b85;
    border-top: 1px solid rgba(0, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
}

/* Уведомление */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #00ffff;
    border-radius: 15px;
    padding: 15px 25px;
    color: white;
    box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
    z-index: 9999;
    animation: slideIn 0.3s;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.hidden {
    display: none !important;
}

/* Адаптивность */
@media (max-width: 1200px) {
    .table-header {
        grid-template-columns: 50px 200px 120px 100px 1fr 80px;
    }
    .player-row {
        grid-template-columns: 50px 200px 120px 100px 1fr 80px;
    }
}
`;

// ========== ОСНОВНОЙ КОД ==========

class BedrockTiers {
    constructor() {
        this.users = [];
        this.currentUser = null;
        self = this;
        
        // Добавляем стили
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        this.init();
    }

    init() {
        this.createStructure();
        this.loadUsers();
        this.render();
        this.setupEventListeners();
        this.updateOnlineCount();
    }

    createStructure() {
        const app = document.createElement('div');
        app.className = 'bedrock';
        app.id = 'bedrockApp';
        app.innerHTML = `
            <!-- Шапка -->
            <div class="header">
                <div class="logo">BEDROCK<span>TIERS</span></div>
                <div class="online-count" id="onlineCount">0 ONLINE</div>
            </div>

            <!-- Регистрация (видна только гостям) -->
            <div id="registerSection" class="register-section">
                <div class="register-title">⚡ РЕГИСТРАЦИЯ - ВЫБЕРИ КАТЕГОРИЮ PVP</div>
                <div class="register-grid">
                    <div>
                        <div class="input-group">
                            <div class="input-label">НИКНЕЙМ</div>
                            <input type="text" id="regUsername" class="input-field" placeholder="Введите ник">
                        </div>
                        <div class="input-group">
                            <div class="input-label">ПАРОЛЬ</div>
                            <input type="password" id="regPassword" class="input-field" placeholder="••••••••">
                        </div>
                    </div>
                    <div>
                        <div class="input-label">ТВОЯ ОСНОВНАЯ КАТЕГОРИЯ</div>
                        <div class="pvp-categories" id="pvpCategories">
                            <div class="pvp-cat selected" data-cat="Sword">⚔️ Sword</div>
                            <div class="pvp-cat" data-cat="Axe">🪓 Axe</div>
                            <div class="pvp-cat" data-cat="Crystal">💎 Crystal</div>
                            <div class="pvp-cat" data-cat="Mace">🔨 Mace</div>
                        </div>
                        <button class="register-btn" id="registerBtn">🔓 ЗАРЕГИСТРИРОВАТЬСЯ</button>
                    </div>
                </div>
            </div>

            <!-- Профиль (виден после регистрации) -->
            <div id="profileSection" class="profile-section">
                <div class="profile-header">
                    <div class="skin-preview" id="profileSkin" onclick="document.getElementById('skinInput').click()">
                        <span id="profileSkinEmoji">👤</span>
                        <img id="profileSkinImage" style="display: none;">
                    </div>
                    <div class="profile-info">
                        <h2 id="profileName">Игрок</h2>
                        <p id="profileCategory">Sword</p>
                    </div>
                    <div class="elo-display">
                        ELO <span id="profileElo">1000</span>
                    </div>
                </div>
            </div>

            <!-- Загрузка скина -->
            <div class="skin-upload" id="skinUploadSection">
                <input type="file" id="skinInput" accept="image/*" style="display: none;">
                <div class="skin-btn" onclick="document.getElementById('skinInput').click()">📸 ЗАГРУЗИТЬ СКИН</div>
                <div class="skin-note">Загрузи скин чтобы появиться в топе</div>
            </div>

            <!-- Навигация по категориям -->
            <div class="categories-nav" id="categoriesNav">
                <div class="category active" data-cat="all">ВСЕ</div>
                <div class="category" data-cat="Sword">⚔️ SWORD</div>
                <div class="category" data-cat="Axe">🪓 AXE</div>
                <div class="category" data-cat="Crystal">💎 CRYSTAL</div>
                <div class="category" data-cat="Mace">🔨 MACE</div>
            </div>

            <!-- Поиск -->
            <div class="search-section">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="searchInput" placeholder="Поиск игрока...">
                </div>
                <div class="filter-btn" id="filterBtn">ТОП 550</div>
            </div>

            <!-- Таблица -->
            <div class="table-header">
                <div>#</div>
                <div>ИГРОК</div>
                <div>КАТЕГОРИЯ</div>
                <div>РЕГИОН</div>
                <div>ТИР</div>
                <div>ELO</div>
            </div>
            <div id="playersTable"></div>

            <!-- Инфо о топе -->
            <div class="top-info">
                <div>🏆 ДЛЯ ПОПАДАНИЯ В ТОП 550 НУЖНО <span>2400 ELO</span></div>
                <div id="topStats"></div>
            </div>

            <!-- Футер -->
            <div class="footer">
                <div>© 2026 BEDROCKTIERS - BEDROCK PVP ELO</div>
                <div>v1.0 • РЕАЛЬНЫЙ ОНЛАЙН</div>
            </div>
        `;
        
        document.body.appendChild(app);
    }

    loadUsers() {
        const saved = localStorage.getItem('bedrockUsers');
        if (saved) {
            this.users = JSON.parse(saved);
        } else {
            // Демо-игроки
            this.users = [
                { name: 'Marlo', password: '', category: 'Sword', region: 'NA', elo: 3150, skin: null, online: false },
                { name: 'ItzReal', password: '', category: 'Axe', region: 'NA', elo: 2980, skin: null, online: false },
                { name: 'xQc', password: '', category: 'Crystal', region: 'EU', elo: 2750, skin: null, online: false },
                { name: 'Dream', password: '', category: 'Sword', region: 'NA', elo: 2640, skin: null, online: false },
                { name: 'Techno', password: '', category: 'Mace', region: 'NA', elo: 3120, skin: null, online: false },
                { name: 'Clarity', password: '', category: 'Sword', region: 'EU', elo: 2550, skin: null, online: false },
                { name: 'Flame', password: '', category: 'Crystal', region: 'AS', elo: 2430, skin: null, online: false },
                { name: 'Vortex', password: '', category: 'Axe', region: 'NA', elo: 2380, skin: null, online: false },
                { name: 'Zenith', password: '', category: 'Mace', region: 'EU', elo: 2290, skin: null, online: false },
                { name: 'Nova', password: '', category: 'Sword', region: 'AS', elo: 2150, skin: null, online: false }
            ];
        }
    }

    saveUsers() {
        localStorage.setItem('bedrockUsers', JSON.stringify(this.users));
    }

    updateOnlineCount() {
        const online = this.users.filter(u => u.online).length;
        document.getElementById('onlineCount').innerHTML = `${online} ONLINE`;
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

    render() {
        const category = document.querySelector('.category.active')?.dataset.cat || 'all';
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        
        let filtered = [...this.users];
        
        // Фильтр по категории
        if (category !== 'all') {
            filtered = filtered.filter(u => u.category === category);
        }
        
        // Фильтр по поиску
        if (searchQuery) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(searchQuery));
        }
        
        // Сортировка по ELO
        filtered.sort((a, b) => b.elo - a.elo);
        
        const tbody = document.getElementById('playersTable');
        tbody.innerHTML = '';
        
        filtered.forEach((user, index) => {
            const tier = this.getTier(user.elo);
            const row = document.createElement('div');
            row.className = 'player-row';
            
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
            
            row.innerHTML = `
                <div class="rank ${rankClass}">${index + 1}</div>
                <div class="player-info">
                    <div class="player-skin">
                        ${user.skin ? 
                            `<img src="${user.skin}" style="width:100%;height:100%;object-fit:cover;">` : 
                            `<span>${user.name.charAt(0)}</span>`
                        }
                    </div>
                    <div>
                        <div class="player-name">${user.name}</div>
                    </div>
                </div>
                <div><span class="category-badge">${user.category}</span></div>
                <div class="region">${user.region || 'INT'}</div>
                <div><span class="tier-badge">${tier}</span></div>
                <div class="elo">${user.elo}</div>
            `;
            
            tbody.appendChild(row);
        });
        
        // Обновляем статистику топа
        const top550Count = this.users.filter(u => u.elo >= 2400).length;
        document.getElementById('topStats').innerHTML = `🎯 В ТОПЕ 550: ${top550Count} ИГРОКОВ`;
    }

    register() {
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const selectedCat = document.querySelector('.pvp-cat.selected')?.dataset.cat || 'Sword';
        
        if (!username || !password) {
            this.showNotification('❌ Заполните все поля!');
            return;
        }
        
        if (this.users.find(u => u.name === username)) {
            this.showNotification('❌ Игрок уже существует!');
            return;
        }
        
        // Определяем регион (для демо - рандом)
        const regions = ['NA', 'EU', 'AS'];
        const region = regions[Math.floor(Math.random() * regions.length)];
        
        const newUser = {
            name: username,
            password: password,
            category: selectedCat,
            region: region,
            elo: 1000,
            skin: null,
            online: true
        };
        
        this.users.push(newUser);
        this.currentUser = newUser;
        this.saveUsers();
        
        // Показываем профиль
        document.getElementById('registerSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'block';
        document.getElementById('skinUploadSection').style.display = 'flex';
        
        document.getElementById('profileName').innerText = username;
        document.getElementById('profileCategory').innerText = selectedCat;
        document.getElementById('profileElo').innerText = '1000';
        
        this.showNotification(`✅ Добро пожаловать, ${username}! Твой тир: ${this.getTier(1000)}`);
        this.render();
        this.updateOnlineCount();
    }

    uploadSkin(file, isProfile = false) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            if (this.currentUser) {
                this.currentUser.skin = e.target.result;
                
                // Обновляем в общем списке
                const user = this.users.find(u => u.name === this.currentUser.name);
                if (user) {
                    user.skin = e.target.result;
                }
                
                // Обновляем превью
                const img = document.getElementById('profileSkinImage');
                const emoji = document.getElementById('profileSkinEmoji');
                img.src = e.target.result;
                img.style.display = 'block';
                emoji.style.display = 'none';
                
                this.saveUsers();
                this.render();
                this.showNotification('✅ Скин загружен!');
            }
        };
        reader.readAsDataURL(file);
    }

    showNotification(text) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = text;
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.remove();
        }, 3000);
    }

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
        
        // Загрузка скина
        document.getElementById('skinInput').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.uploadSkin(e.target.files[0]);
            }
        });
        
        // Фильтр топ 550
        document.getElementById('filterBtn').addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            searchInput.value = '';
            this.render();
            this.showNotification('🎯 Показаны все игроки');
        });
        
        // Проверка сохраненной сессии
        const savedUser = localStorage.getItem('bedrockCurrentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.currentUser = this.users.find(u => u.name === user.name);
            if (this.currentUser) {
                this.currentUser.online = true;
                document.getElementById('registerSection').style.display = 'none';
                document.getElementById('profileSection').style.display = 'block';
                document.getElementById('skinUploadSection').style.display = 'flex';
                
                document.getElementById('profileName').innerText = this.currentUser.name;
                document.getElementById('profileCategory').innerText = this.currentUser.category;
                document.getElementById('profileElo').innerText = this.currentUser.elo;
                
                if (this.currentUser.skin) {
                    document.getElementById('profileSkinImage').src = this.currentUser.skin;
                    document.getElementById('profileSkinImage').style.display = 'block';
                    document.getElementById('profileSkinEmoji').style.display = 'none';
                }
            }
        }
    }
}

// ========== ЗАПУСК ==========
window.onload = () => {
    new BedrockTiers();
};
import { getCurrentUser, logout } from './auth.js';
import { getProfile, getTeams, getNews, updateProfile } from './api.js';
import { showLoading, hideLoading, formatDate, showNotification } from './utils.js';

// Состояние приложения
let currentUser = null;
let teamsList = [];
let newsList = [];

// Инициализация дашборда
export async function initDashboard() {
    try {
        // Получаем текущего пользователя
        currentUser = getCurrentUser();
        
        // Отображаем имя пользователя
        updateUserName();
        
        // Загружаем все данные
        await loadAllData();
        
        // Настраиваем обработчики событий
        setupEventListeners();
        
    } catch (error) {
        console.error('Ошибка инициализации дашборда:', error);
        showNotification('Ошибка загрузки данных', 'error');
    }
}

// Обновление имени пользователя в шапке
function updateUserName() {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.fullName;
    }
}

// Загрузка всех данных
async function loadAllData() {
    await Promise.all([
        loadProfileData(),
        loadTeamsData(),
        loadNewsData()
    ]);
}

// Загрузка данных профиля
async function loadProfileData() {
    try {
        const profile = await getProfile();
        
        // Обновляем отображение профиля
        document.getElementById('profile-fullname').textContent = profile.fullName;
        document.getElementById('profile-group').textContent = profile.group;
        document.getElementById('profile-email').textContent = profile.email;
        
        if (profile.teamId) {
            document.getElementById('profile-team').textContent = `Команда #${profile.teamId}`;
        } else {
            document.getElementById('profile-team').textContent = 'Не выбрана';
        }
        
        // Обновляем данные в localStorage
        localStorage.setItem('user', JSON.stringify(profile));
        currentUser = profile;
        updateUserName();
        
        return profile;
        
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        showNotification('Не удалось загрузить профиль', 'error');
        throw error;
    }
}

// Загрузка команд
async function loadTeamsData() {
    const teamsContainer = document.getElementById('teams-list');
    
    try {
        showLoading('teams-list');
        
        const teams = await getTeams();
        teamsList = teams;
        
        if (!teams || teams.length === 0) {
            teamsContainer.innerHTML = `
                <div class="empty-state">
                    <p>Пока нет команд</p>
                    <button class="btn-create-team">Создать команду</button>
                </div>
            `;
            return;
        }
        
        // Отображаем команды
        teamsContainer.innerHTML = teams.map(team => `
            <div class="team-card" data-team-id="${team.id}">
                <div class="team-info">
                    <h3>${escapeHtml(team.name)}</h3>
                    <p class="team-members">👥 Участников: ${team.membersCount}</p>
                </div>
                <div class="team-actions">
                    ${currentUser.teamId === team.id ? 
                        '<span class="team-badge">Ваша команда</span>' : 
                        `<button class="btn-join" data-team-id="${team.id}">Вступить</button>`
                    }
                </div>
            </div>
        `).join('');
        
        // Добавляем обработчики для кнопок вступления
        document.querySelectorAll('.btn-join').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const teamId = parseInt(btn.dataset.teamId);
                await joinTeam(teamId);
            });
        });
        
        // Добавляем обработчик для создания команды
        const createTeamBtn = document.querySelector('.btn-create-team');
        if (createTeamBtn) {
            createTeamBtn.addEventListener('click', showCreateTeamModal);
        }
        
    } catch (error) {
        console.error('Ошибка загрузки команд:', error);
        teamsContainer.innerHTML = `
            <div class="error-state">
                <p>❌ Ошибка загрузки команд</p>
                <button class="btn-retry" onclick="location.reload()">Повторить</button>
            </div>
        `;
    }
}

// Загрузка новостей
async function loadNewsData() {
    const newsContainer = document.getElementById('news-list');
    
    try {
        showLoading('news-list');
        
        const news = await getNews();
        newsList = news;
        
        if (!news || news.length === 0) {
            newsContainer.innerHTML = `
                <div class="empty-state">
                    <p>📭 Новостей пока нет</p>
                </div>
            `;
            return;
        }
        
        // Отображаем новости
        newsContainer.innerHTML = news.map(item => `
            <div class="news-card">
                <div class="news-header">
                    <h3>${escapeHtml(item.title)}</h3>
                    <span class="news-date">${formatDate(item.publishedAt)}</span>
                </div>
                <p class="news-content">${escapeHtml(item.content)}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки новостей:', error);
        newsContainer.innerHTML = `
            <div class="error-state">
                <p>❌ Ошибка загрузки новостей</p>
                <button class="btn-retry" onclick="location.reload()">Повторить</button>
            </div>
        `;
    }
}

// Вступление в команду
export async function joinTeam(teamId) {
    try {
        // Здесь должен быть запрос на вступление в команду
        // Пока что имитируем
        showNotification('Подача заявки на вступление...', 'info');
        
        // TODO: Сделать реальный запрос
        // const response = await apiRequest('/teams/join', {
        //     method: 'POST',
        //     body: JSON.stringify({ teamId })
        // });
        
        // Имитация успешного ответа
        setTimeout(async () => {
            showNotification('Вы успешно вступили в команду!', 'success');
            await loadProfileData(); // Обновляем профиль
            await loadTeamsData();   // Обновляем список команд
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка вступления в команду:', error);
        showNotification(error.message || 'Не удалось вступить в команду', 'error');
    }
}

// Показать модальное окно создания команды
function showCreateTeamModal() {
    const modal = document.getElementById('create-team-modal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        // Если модального окна нет, создаем его динамически
        createTeamModal();
    }
}

// Создание модального окна для команды
function createTeamModal() {
    const modalHTML = `
        <div id="create-team-modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Создать команду</h3>
                <form id="create-team-form">
                    <div class="form-group">
                        <label for="team-name">Название команды:</label>
                        <input type="text" id="team-name" required minlength="3" maxlength="50">
                    </div>
                    <button type="submit" class="btn-primary">Создать</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('create-team-modal');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('create-team-form');
    
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        const teamName = document.getElementById('team-name').value;
        await createTeam(teamName);
        modal.style.display = 'none';
    };
    
    modal.style.display = 'block';
}

// Создание команды
async function createTeam(teamName) {
    try {
        showNotification('Создание команды...', 'info');
        
        // TODO: Сделать реальный запрос на создание команды
        // const response = await apiRequest('/teams', {
        //     method: 'POST',
        //     body: JSON.stringify({ name: teamName })
        // });
        
        // Имитация успешного ответа
        setTimeout(async () => {
            showNotification(`Команда "${teamName}" создана!`, 'success');
            await loadTeamsData(); // Обновляем список команд
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка создания команды:', error);
        showNotification(error.message || 'Не удалось создать команду', 'error');
    }
}

// Редактирование профиля
export function setupProfileEditing() {
    const modal = document.getElementById('edit-modal');
    const editBtn = document.getElementById('edit-profile-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('edit-profile-form');
    
    if (!editBtn || !modal) return;
    
    // Открытие модального окна
    editBtn.onclick = () => {
        const user = getCurrentUser();
        document.getElementById('edit-fullname').value = user.fullName;
        document.getElementById('edit-group').value = user.group;
        modal.style.display = 'block';
    };
    
    // Закрытие модального окна
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    // Закрытие при клике вне окна
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Обработка отправки формы
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('edit-fullname').value;
            const group = document.getElementById('edit-group').value;
            
            try {
                showNotification('Обновление профиля...', 'info');
                
                await updateProfile({ fullName, group });
                await loadProfileData();
                
                modal.style.display = 'none';
                showNotification('Профиль успешно обновлен!', 'success');
                
            } catch (error) {
                console.error('Ошибка обновления профиля:', error);
                showNotification(error.message || 'Не удалось обновить профиль', 'error');
            }
        };
    }
}

// Обновление данных в реальном времени
export function startAutoRefresh() {
    // Обновляем данные каждые 30 секунд
    setInterval(async () => {
        console.log('Автообновление данных...');
        await loadTeamsData();
        await loadNewsData();
    }, 30000); // 30 секунд
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Редактирование профиля
    setupProfileEditing();
    
    // Кнопка выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Автообновление
    startAutoRefresh();
}

// Экранирование HTML для безопасности
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Экспорт функций для использования в HTML
export { loadProfileData, loadTeamsData, loadNewsData };
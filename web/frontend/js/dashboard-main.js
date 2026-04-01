import { requireAuth, logout, getCurrentUser } from './auth.js';
import { getProfile, getTeams, getNews, updateProfile } from './api.js';
import { showNotification, formatDate, escapeHtml } from './utils.js';

// Проверка авторизации
requireAuth();

// Загрузка данных
async function loadDashboard() {
    try {
        await Promise.all([
            loadProfile(),
            loadMyTeam(),
            loadNews()
        ]);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showNotification('Ошибка загрузки данных', 'error');
    }
}

// Загрузка профиля
async function loadProfile() {
    try {
        const profile = await getProfile();
        
        document.getElementById('profile-fullname').textContent = escapeHtml(profile.fullName);
        document.getElementById('profile-group').textContent = escapeHtml(profile.group);
        document.getElementById('profile-email').textContent = escapeHtml(profile.email);
        
        // Отображаем роль
        let roleText = '';
        switch(profile.role) {
            case 'captain':
                roleText = '👑 Капитан команды';
                break;
            case 'member':
                roleText = '👥 Участник команды';
                break;
            default:
                roleText = '👤 Участник';
        }
        document.getElementById('profile-role').textContent = roleText;
        
        localStorage.setItem('user', JSON.stringify(profile));
        document.getElementById('user-name').textContent = profile.fullName;
        
        return profile;
        
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        document.getElementById('profile-fullname').textContent = 'Ошибка загрузки';
        showNotification('Не удалось загрузить профиль', 'error');
    }
}

// Загрузка информации о команде пользователя
async function loadMyTeam() {
    const teamContainer = document.getElementById('my-team-info');
    
    try {
        const profile = await getProfile();
        
        if (!(profile ?. team ?. id)) {
            teamContainer.innerHTML = `
                <div class="empty-state">
                    <p>🏠 Вы пока не состоите в команде</p>
                    <p class="hint" style="font-size: 12px; color: #666; margin-top: 10px;">
                        Зарегистрируйте команду на главной странице
                    </p>
                </div>
            `;
            return;
        }
        
        // Получаем все команды и находим нужную
        const teams = await getTeams();
        const myTeam = teams.find(team => team.id === profile.team.id);
        
        if (!myTeam) {
            teamContainer.innerHTML = `
                <div class="empty-state">
                    <p>❌ Информация о команде не найдена</p>
                </div>
            `;
            return;
        }
        
        teamContainer.innerHTML = `
            <div class="team-details">
                <h3>${escapeHtml(myTeam.name)}</h3>
                <div class="team-stats">
                    <p><strong> Участников:</strong> ${myTeam.membersCount}</p>
                    <p><strong> Создана:</strong> ${formatDate(myTeam.createdAt || new Date().toISOString())}</p>
                </div>
                <span class="team-badge">${profile.role === 'captain' ? 'Вы капитан' : 'Вы участник'}</span>
            </div>
        `;
        
    } catch (error) {
        console.error('Ошибка загрузки команды:', error);
        teamContainer.innerHTML = `
            <div class="error-state">
                <p>❌ Ошибка загрузки команды</p>
            </div>
        `;
    }
}

// Загрузка новостей
async function loadNews() {
    const newsContainer = document.getElementById('news-list');
    
    try {
        const news = await getNews();
        
        if (!news || news.length === 0) {
            newsContainer.innerHTML = `
                <div class="empty-state">
                    <p>📭 Новостей пока нет</p>
                </div>
            `;
            return;
        }
        
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
            </div>
        `;
    }
}

// Настройка редактирования профиля
function setupProfileEditing() {
    const modal = document.getElementById('edit-modal');
    const editBtn = document.getElementById('edit-profile-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('edit-profile-form');
    
    if (!editBtn || !modal) return;
    
    editBtn.onclick = () => {
        const user = getCurrentUser();
        document.getElementById('edit-fullname').value = user.fullName;
        document.getElementById('edit-group').value = user.group;
        modal.style.display = 'block';
    };
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('edit-fullname').value;
            const group = document.getElementById('edit-group').value;
            
            try {
                await updateProfile({ fullName, group });
                await loadProfile();
                modal.style.display = 'none';
                showNotification('Профиль успешно обновлен!', 'success');
            } catch (error) {
                showNotification('Ошибка обновления профиля', 'error');
            }
        };
    }
}

// Кнопка выхода
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Настройка редактирования
setupProfileEditing();

// Загрузка данных
loadDashboard();
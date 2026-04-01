// Базовый URL вашего сервера
const apiPort = 1904;
const apiPath = '/api';
const API_URL = `${window.location.protocol}//${window.location.hostname}:${apiPort}${apiPath}`;


// Универсальная функция для запросов
export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка запроса');
        }
        
        return data;
    } catch (error) {
        console.error(`Ошибка при запросе к ${endpoint}:`, error);
        throw error;
    }
}

// Регистрация команды
export async function registerTeam(teamData) {
    return apiRequest('/auth/register-team', {
        method: 'POST',
        body: JSON.stringify(teamData)
    });
}

// Вход
export async function login(credentials) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

// Получить профиль
export async function getProfile() {
    return apiRequest('/auth/me');
}

// Получить все команды
export async function getTeams() {
    return apiRequest('/teams');
}

// Получить новости
export async function getNews() {
    return apiRequest('/news');
}

// Обновить профиль
export async function updateProfile(userData) {
    return apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
}
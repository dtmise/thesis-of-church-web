import { login, registerTeam } from './api.js';

// Проверка авторизации
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Получение текущего пользователя
export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Выход из системы
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Проверка токена при загрузке страницы
export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Обработка входа
export async function handleLogin(email, password) {
    try {
        const data = await login({ email, password });
        
        console.log('Успешный вход, получен токен:', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true, user: data.user };
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, error: error.message };
    }
}

// Обработка регистрации команды
export async function handleTeamRegister(teamData) {
    try {
        console.log('Отправка данных на сервер:', teamData);
        const data = await registerTeam(teamData);
        
        console.log('Ответ сервера:', data);
        
        // Сохраняем токен и данные капитана
        if (data.token && data.user) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('Токен сохранен:', data.token);
            return { success: true, user: data.user, token: data.token };
        } else {
            console.error('Сервер не вернул token или user');
            return { success: false, error: 'Ошибка сервера: не получены данные авторизации' };
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, error: error.message };
    }
}
// ==================== ОБРАБОТКА ОШИБОК ====================

// Показать сообщение об ошибке
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // Автоматически скрыть через 5 секунд
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Очистить все ошибки
export function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// Показать уведомление
export function showNotification(message, type = 'info') {
    // Проверяем, существует ли контейнер для уведомлений
    let notification = document.getElementById('notification');
    
    // Если нет, создаем
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
        
        // Добавляем стили для уведомления, если их нет
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                #notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    z-index: 10000;
                    display: none;
                    animation: slideInRight 0.3s ease;
                    max-width: 350px;
                    word-wrap: break-word;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                #notification.info {
                    background: linear-gradient(135deg, #4299e1, #3182ce);
                }
                
                #notification.success {
                    background: linear-gradient(135deg, #48bb78, #38a169);
                }
                
                #notification.error {
                    background: linear-gradient(135deg, #f56565, #e53e3e);
                }
                
                #notification.warning {
                    background: linear-gradient(135deg, #ed8936, #dd6b20);
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    notification.style.animation = 'slideInRight 0.3s ease';
    
    // Автоматически скрыть через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

// ==================== ЗАГРУЗКА ====================

// Показать индикатор загрузки
export function showLoading(elementId, customText = 'Загрузка...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-container">
                <div class="spinner"></div>
                <p class="loading-text">${customText}</p>
            </div>
        `;
        
        // Добавляем стили для спиннера, если их нет
        if (!document.querySelector('#loading-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loading-styles';
            styles.textContent = `
                .loading-container {
                    text-align: center;
                    padding: 40px;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    margin: 0 auto 15px;
                    border: 3px solid #e2e8f0;
                    border-top: 3px solid #667eea;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loading-text {
                    color: #a0aec0;
                    font-size: 14px;
                    margin: 0;
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Скрыть индикатор загрузки и показать контент
export function hideLoading(elementId, content) {
    const element = document.getElementById(elementId);
    if (element && content !== undefined) {
        element.innerHTML = content;
    }
}

// ==================== ВАЛИДАЦИЯ ====================

// Валидация email
export function validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация пароля
export function validatePassword(password) {
    if (!password) return false;
    return password.length >= 6;
}

// Валидация имени (только буквы, пробелы и дефисы)
export function validateName(name) {
    if (!name) return false;
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,50}$/;
    return nameRegex.test(name);
}

// Валидация группы (например: ИУ5-51Б, ИУ5-51, ИУ5-51М)
export function validateGroup(group) {
    if (!group) return false;
    const groupRegex = /^[A-ZА-Я]{2,3}-\d{2,3}[A-ZА-Я]?$/;
    return groupRegex.test(group);
}

// Валидация названия команды
export function validateTeamName(name) {
    if (!name) return false;
    return name.length >= 3 && name.length <= 50;
}

// ==================== ФОРМАТИРОВАНИЕ ====================

// Форматирование даты
export function formatDate(dateString) {
    if (!dateString) return 'Дата неизвестна';
    
    try {
        const date = new Date(dateString);
        
        // Проверка на валидность даты
        if (isNaN(date.getTime())) return 'Дата неизвестна';
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Ошибка форматирования даты:', error);
        return 'Дата неизвестна';
    }
}

// Форматирование относительной даты (например: "2 дня назад")
export function formatRelativeDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) return 'только что';
        if (diffMin < 60) return `${diffMin} ${declOfNum(diffMin, ['минуту', 'минуты', 'минут'])} назад`;
        if (diffHour < 24) return `${diffHour} ${declOfNum(diffHour, ['час', 'часа', 'часов'])} назад`;
        if (diffDay < 7) return `${diffDay} ${declOfNum(diffDay, ['день', 'дня', 'дней'])} назад`;
        
        return formatDate(dateString);
    } catch (error) {
        return formatDate(dateString);
    }
}

// Склонение числительных
function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// Экранирование HTML для безопасности (защита от XSS)
export function escapeHtml(str) {
    if (!str) return '';
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    return String(str).replace(/[&<>"'`=/]/g, function(char) {
        return map[char];
    });
}

// Обрезать текст до определенной длины
export function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// ==================== РАБОТА С LOCALSTORAGE ====================

// Сохранить данные в localStorage
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error);
        return false;
    }
}

// Получить данные из localStorage
export function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Ошибка чтения из localStorage:', error);
        return defaultValue;
    }
}

// Удалить данные из localStorage
export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Ошибка удаления из localStorage:', error);
        return false;
    }
}

// Очистить все данные пользователя
export function clearUserData() {
    removeFromLocalStorage('token');
    removeFromLocalStorage('user');
}

// ==================== РАБОТА С URL ====================

// Получить параметры URL
export function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams.entries()) {
        params[key] = value;
    }
    
    return params;
}

// Добавить параметр в URL без перезагрузки
export function updateUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

// ==================== ОБРАБОТКА ФОРМ ====================

// Собрать данные формы
export function getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Заполнить форму данными
export function populateForm(formId, data) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    for (const [key, value] of Object.entries(data)) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = value;
        }
    }
    
    return true;
}

// Очистить форму
export function clearForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    form.reset();
    return true;
}

// ==================== КОПИРОВАНИЕ В БУФЕР ОБМЕНА ====================

// Скопировать текст в буфер обмена
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Скопировано в буфер обмена', 'success');
        return true;
    } catch (error) {
        console.error('Ошибка копирования:', error);
        
        // Fallback для старых браузеров
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
            showNotification('Скопировано в буфер обмена', 'success');
        } else {
            showNotification('Не удалось скопировать текст', 'error');
        }
        
        return success;
    }
}

// ==================== ДЕБАУНС (задержка выполнения) ====================

// Дебаунс для поиска/валидации
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Троттлинг (ограничение частоты выполнения)
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== ПРОВЕРКИ ====================

// Проверка, авторизован ли пользователь
export function isAuthenticated() {
    const token = getFromLocalStorage('token');
    return !!token;
}

// Проверка, является ли строка валидным JSON
export function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

// Проверка, пустой ли объект
export function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

// ==================== ГЕНЕРАЦИЯ ====================

// Генерация случайного ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Генерация случайного цвета
export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// ==================== МОДАЛЬНЫЕ ОКНА ====================

// Показать модальное окно
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        
        // Закрытие по клику на крестик
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        // Закрытие по клику вне окна
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Скрыть модальное окно
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==================== ЭКСПОРТ ВСЕХ ФУНКЦИЙ ====================

// Экспортируем всё для удобства
export default {
    // Ошибки и уведомления
    showError,
    clearErrors,
    showNotification,
    
    // Загрузка
    showLoading,
    hideLoading,
    
    // Валидация
    validateEmail,
    validatePassword,
    validateName,
    validateGroup,
    validateTeamName,
    
    // Форматирование
    formatDate,
    formatRelativeDate,
    escapeHtml,
    truncateText,
    
    // localStorage
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
    clearUserData,
    isAuthenticated,
    
    // URL
    getUrlParams,
    updateUrlParam,
    
    // Формы
    getFormData,
    populateForm,
    clearForm,
    
    // Утилиты
    copyToClipboard,
    debounce,
    throttle,
    isValidJSON,
    isEmptyObject,
    generateId,
    getRandomColor,
    
    // Модальные окна
    showModal,
    hideModal
};
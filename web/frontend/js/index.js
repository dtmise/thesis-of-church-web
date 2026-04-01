import { handleLogin, handleTeamRegister } from './auth.js';
import { showError, clearErrors, validatePassword, validateEmail } from './utils.js';

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен');
    
    // Переключение между формами
    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    console.log('Найдено табов:', tabs.length);
    console.log('Найдено форм:', forms.length);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.tab;
            console.log('Переключение на:', tabName);
            
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            const activeForm = document.getElementById(`${tabName}-form`);
            if (activeForm) {
                activeForm.classList.add('active');
            }
            
            clearErrors();
        });
    });
    
    // Управление участниками
    let memberCount = 1;
    const MAX_MEMBERS = 3;
    const MIN_MEMBERS = 1;
    
    function addMember() {
        console.log('Добавление участника, текущее количество:', memberCount);
        
        if (memberCount >= MAX_MEMBERS) {
            const hint = document.getElementById('member-limit-hint');
            if (hint) hint.textContent = `Максимум ${MAX_MEMBERS} участника`;
            return;
        }
        
        memberCount++;
        const container = document.getElementById('members-container');
        if (!container) {
            console.error('Контейнер members-container не найден');
            return;
        }
        
        const newMember = document.createElement('div');
        newMember.className = 'member-card';
        newMember.setAttribute('data-member-index', memberCount - 1);
        
        newMember.innerHTML = `
            <div class="member-header">
                <span class="member-badge">Участник ${memberCount}</span>
                <button type="button" class="remove-member-btn">✕</button>
            </div>
            <div class="form-group">
                <label>ФИО *</label>
                <input type="text" class="member-fullname" placeholder="Фамилия, имя и отчество участника" required>
            </div>
            <div class="form-group">
                <label>Группа *</label>
                <input type="text" class="member-group" placeholder="Номер группы участника" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" class="member-email" placeholder="example@mail.ru" required>
            </div>
            <div class="form-group">
                <label>Пароль *</label>
                <input type="password" class="member-password" placeholder="Минимум 6 символов" required minlength="6">
            </div>
        `;
        
        container.appendChild(newMember);
        
        // Добавляем обработчик для кнопки удаления
        const removeBtn = newMember.querySelector('.remove-member-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeMember(newMember));
        }
        
        updateAddButton();
    }
    
    function removeMember(memberElement) {
        if (memberCount <= MIN_MEMBERS) {
            showError('register-error', 'В команде должен быть хотя бы один участник (капитан)');
            return;
        }
        
        memberElement.remove();
        memberCount--;
        
        // Обновляем номера участников
        const members = document.querySelectorAll('.member-card');
        members.forEach((member, index) => {
            const badge = member.querySelector('.member-badge');
            if (badge) {
                if (index === 0) {
                    badge.textContent = 'Капитан';
                    badge.classList.add('captain');
                } else {
                    badge.textContent = `Участник ${index + 1}`;
                    badge.classList.remove('captain');
                }
            }
        });
        
        updateAddButton();
        const hint = document.getElementById('member-limit-hint');
        if (hint) hint.textContent = '';
    }
    
    function updateAddButton() {
        const addBtn = document.getElementById('add-member-btn');
        if (!addBtn) return;
        
        if (memberCount >= MAX_MEMBERS) {
            addBtn.disabled = true;
            addBtn.style.opacity = '0.5';
            const hint = document.getElementById('member-limit-hint');
            if (hint) hint.textContent = `Максимум ${MAX_MEMBERS} участника`;
        } else {
            addBtn.disabled = false;
            addBtn.style.opacity = '1';
            const hint = document.getElementById('member-limit-hint');
            if (hint) hint.textContent = `Можно добавить еще ${MAX_MEMBERS - memberCount} участника`;
        }
    }
    
    // Сбор данных формы
    function getTeamData() {
        const teamName = document.getElementById('team-name');
        if (!teamName) return null;
        
        const members = [];
        const memberCards = document.querySelectorAll('.member-card');
        
        for (let i = 0; i < memberCards.length; i++) {
            const card = memberCards[i];
            const fullName = card.querySelector('.member-fullname')?.value || '';
            const group = card.querySelector('.member-group')?.value || '';
            const email = card.querySelector('.member-email')?.value || '';
            const password = card.querySelector('.member-password')?.value || '';
            
            members.push({ fullName, group, email, password });
        }
        
        return { teamName: teamName.value, members };
    }
    
    // Валидация формы
    function validateTeamData(teamData) {
        if (!teamData.teamName || teamData.teamName.length < 3) {
            showError('register-error', 'Название команды должно быть не менее 3 символов');
            return false;
        }
        
        if (teamData.members.length < 1 || teamData.members.length > 3) {
            showError('register-error', 'В команде должно быть от 1 до 3 участников');
            return false;
        }
        
        for (let i = 0; i < teamData.members.length; i++) {
            const member = teamData.members[i];
            
            if (!member.fullName || member.fullName.length < 2) {
                showError('register-error', `Участник ${i + 1}: укажите ФИО`);
                return false;
            }
            
            if (!member.group) {
                showError('register-error', `Участник ${i + 1}: укажите группу`);
                return false;
            }
            
            if (!validateEmail(member.email)) {
                showError('register-error', `Участник ${i + 1}: укажите корректный email`);
                return false;
            }
            
            if (!validatePassword(member.password)) {
                showError('register-error', `Участник ${i + 1}: пароль должен быть не менее 6 символов`);
                return false;
            }
        }
        
        return true;
    }
    
    // Регистрация команды
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Отправка формы регистрации');
            
            const teamData = getTeamData();
            if (!teamData) return;
            
            if (!validateTeamData(teamData)) {
                return;
            }
            
            const result = await handleTeamRegister(teamData);
            console.log('Результат регистрации:', result);
            
            if (result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'dashboard.html';
            } else {
                showError('register-error', result.error);
            }
        });
    } else {
        console.error('Форма регистрации не найдена');
    }
    
    // Вход
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Отправка формы входа');
            
            const email = document.getElementById('login-email')?.value;
            const password = document.getElementById('login-password')?.value;
            
            const result = await handleLogin(email, password);
            console.log('Результат входа:', result);
            
            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                showError('login-error', result.error);
            }
        });
    } else {
        console.error('Форма входа не найдена');
    }
    
    // Кнопка добавления участника
    const addMemberBtn = document.getElementById('add-member-btn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', addMember);
        console.log('Кнопка добавления участника подключена');
    } else {
        console.error('Кнопка добавления участника не найдена');
    }
    
    // Инициализация
    updateAddButton();
    console.log('Инициализация завершена');
});
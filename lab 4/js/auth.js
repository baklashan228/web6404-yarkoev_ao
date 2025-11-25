// Класс для хранения данных пользователя
class UserAuth {
    constructor(email, password, remember, agreement) {
        this.email = email;
        this.password = this.maskPassword(password);
        this.remember = remember;
        this.agreement = agreement;
        this.loginDate = new Date();
        this.userId = this.generateUserId();
    }

    // Метод для маскировки пароля
    maskPassword(password) {
        return '*'.repeat(password.length);
    }

    // Генерация ID пользователя
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    // Метод форматированного вывода в консоль
    displayToConsole() {
        console.log('🎯 === ДАННЫЕ АВТОРИЗАЦИИ === 🎯');
        console.log(`📧 Email: ${this.email}`);
        console.log(`🔐 Пароль: ${this.password}`);
        console.log(`💾 Запомнить: ${this.remember ? '✅ Да' : '❌ Нет'}`);
        console.log(`📝 Согласие на обработку: ${this.agreement ? '✅ Да' : '❌ Нет'}`);
        console.log(`🆔 ID пользователя: ${this.userId}`);
        console.log(`⏰ Время входа: ${this.loginDate.toLocaleString('ru-RU')}`);
        console.log('🎯 =========================== 🎯');
    }

    // Дополнительный метод для проверки валидности
    isValid() {
        const emailValid = this.email.includes('@') && this.email.includes('.');
        const passwordValid = this.password.length >= 6;
        const agreementValid = this.agreement === true;
        
        return emailValid && passwordValid && agreementValid;
    }

    // Метод для получения данных в виде объекта
    getData() {
        return {
            email: this.email,
            password: this.password,
            remember: this.remember,
            agreement: this.agreement,
            loginDate: this.loginDate,
            userId: this.userId
        };
    }
}

// Обработка формы
document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const agreementCheckbox = document.getElementById('agreement');

    // Анимация для полей формы
    function addInputAnimations() {
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 0 0 3px rgba(139, 69, 19, 0.3)';
            });
            
            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 0 0 0 rgba(139, 69, 19, 0.3)';
            });
        });
    }

    // Валидация в реальном времени
    function addRealTimeValidation() {
        emailInput.addEventListener('input', function() {
            if (this.value.includes('@') && this.value.includes('.')) {
                this.style.borderColor = '#228B22';
            } else {
                this.style.borderColor = '#8B0000';
            }
        });

        passwordInput.addEventListener('input', function() {
            if (this.value.length >= 6) {
                this.style.borderColor = '#228B22';
            } else {
                this.style.borderColor = '#8B0000';
            }
        });
    }

    authForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Получаем данные из формы
        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;
        const agreement = agreementCheckbox.checked;
        
        // Создаем объект класса UserAuth
        const user = new UserAuth(email, password, remember, agreement);
        
        // Валидация
        if (!user.isValid()) {
            alert('❌ Пожалуйста, заполните все поля правильно!\n\n• Email должен содержать @ и .\n• Пароль минимум 6 символов\n• Необходимо согласие на обработку данных');
            return;
        }
        
        // Выводим в консоль
        user.displayToConsole();
        
        // Показываем сообщение об успехе
        showSuccessMessage();
        
        // Очищаем форму
        authForm.reset();
        
        // Сбрасываем стили полей
        emailInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
    });

    function showSuccessMessage() {
        const submitBtn = document.querySelector('.auth-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '✅ Успешно!';
        submitBtn.style.backgroundColor = '#228B22';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
        }, 2000);
    }

    // Инициализация анимаций и валидации
    addInputAnimations();
    addRealTimeValidation();
});
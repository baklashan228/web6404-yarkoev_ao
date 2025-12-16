class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.inputs = {};
        this.hints = {};
        this.init();
    }

    init() {
        // Находим все поля и создаём для них подсказки[citation:1]
        this.form.querySelectorAll('input').forEach(input => {
            const hint = document.createElement('div');
            hint.className = 'form-hint';
            hint.style.fontSize = '0.8em';
            hint.style.marginTop = '5px';
            hint.style.minHeight = '20px';
            
            input.parentNode.appendChild(hint);
            
            this.inputs[input.name] = input;
            this.hints[input.name] = hint;
            
            // Добавляем обработчики событий[citation:1][citation:7]
            input.addEventListener('input', (e) => this.validateField(e.target));
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });

        // Обработчик отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(field) {
        let isValid = true;
        let message = '';
        
        switch(field.name) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                message = isValid ? '✅ Email корректен' : '❌ Введите корректный email';
                break;
            case 'password':
                isValid = field.value.length >= 6;
                message = isValid ? '✅ Пароль подходит' : `❌ Минимум 6 символов (${field.value.length}/6)`;
                break;
            case 'agreement':
                isValid = field.checked;
                message = isValid ? '✅ Согласие получено' : '❌ Необходимо согласие';
                break;
        }
        
        this.hints[field.name].textContent = message;
        this.hints[field.name].style.color = isValid ? '#28a745' : '#dc3545';
        field.style.borderColor = isValid ? '#28a745' : '#dc3545';
        
        return isValid;
    }

    validateForm() {
        let isValid = true;
        Object.values(this.inputs).forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault(); // Предотвращаем стандартную отправку[citation:7]
        
        if (!this.validateForm()) {
            this.showMessage('❌ Исправьте ошибки в форме', 'error');
            return;
        }
        
        // Собираем данные формы
        const formData = {
            email: this.inputs.email.value,
            password: this.inputs.password.value,
            remember: this.inputs.remember?.checked || false,
            agreement: this.inputs.agreement.checked,
            timestamp: new Date().toISOString()
        };
        
        // Отображаем статус отправки
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Шаг 2: Отправка POST-запроса[citation:2][citation:8]
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Успешная отправка:', result);
            this.showMessage('✅ Данные успешно отправлены!', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            this.showMessage('❌ Ошибка при отправке данных', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = text;
        messageDiv.style.padding = '15px';
        messageDiv.style.margin = '15px 0';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        messageDiv.style.color = type === 'success' ? '#155724' : '#721c24';
        messageDiv.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
        
        this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('authForm')) {
        new FormValidator('authForm');
    }
});
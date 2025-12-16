console.log('=== МЕНЮ ЗАГРУЗЧИК: Начало выполнения ===');

class MenuLoader {
    constructor() {
        console.log('MenuLoader: конструктор вызван');
        this.apiUrl = 'http://localhost:3000/menu';
        this.init();
    }

    init() {
        console.log('MenuLoader: init() вызван');
        console.log('Первая загрузка данных...');
        this.loadMenuData();
        
        console.log('Настройка периодического обновления (каждые 5 минут)...');
        setInterval(() => {
            console.log('🔄 Периодическое обновление данных (каждые 5 минут)');
            this.loadMenuData();
        }, 5 * 60 * 1000);
    }

    async loadMenuData() {
        console.log('loadMenuData: начало загрузки');
        
        const loadingIndicator = this.createLoadingIndicator();
        console.log('Индикатор загрузки создан');
        
        try {
            console.log(`Делаем GET запрос к: ${this.apiUrl}`);
            
            const response = await fetch(this.apiUrl);
            console.log('Ответ получен, статус:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка! статус: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ УСПЕШНАЯ ОТПРАВКА:', result);
            
            // Структура ответа mock-json-server: {data: [...]}
            const menuData = result.data || result;
            console.log('Данные меню извлечены:', menuData);
            
            this.updateMenuFromServer(menuData);
            loadingIndicator.textContent = '✅ Данные обновлены с сервера';
            loadingIndicator.style.color = '#28a745';
            
        } catch (error) {
            console.error('❌ Ошибка загрузки меню:', error);
            loadingIndicator.textContent = '❌ Ошибка загрузки данных';
            loadingIndicator.style.color = '#dc3545';
            this.showCachedData();
        }
        
        console.log('loadMenuData: завершено');
    }

    createLoadingIndicator() {
        console.log('createLoadingIndicator: создание индикатора');
        
        let indicator = document.getElementById('menu-loading');
        if (!indicator) {
            console.log('Создаю новый индикатор загрузки');
            indicator = document.createElement('div');
            indicator.id = 'menu-loading';
            indicator.style.textAlign = 'center';
            indicator.style.padding = '20px';
            indicator.style.fontWeight = 'bold';
            
            const menuIntro = document.querySelector('.menu-intro');
            if (menuIntro) {
                console.log('Найден .menu-intro, добавляю индикатор');
                menuIntro.parentNode.insertBefore(indicator, menuIntro.nextSibling);
            } else {
                console.warn('Элемент .menu-intro не найден!');
            }
        }
        
        indicator.textContent = '⏳ Загрузка данных меню с сервера...';
        indicator.style.color = '#007bff';
        return indicator;
    }

    updateMenuFromServer(menuData) {
        console.log('updateMenuFromServer: начало, данные:', menuData);
        
        // 1. Находим контейнер меню
        const menuGrid = document.querySelector('.menu-grid');
        if (!menuGrid) {
            console.error('❌ Не найден .menu-grid контейнер!');
            return;
        }
        console.log('Найден .menu-grid контейнер');
        
        // 2. Находим все категории меню
        const categories = menuGrid.querySelectorAll('.menu-category');
        console.log(`Найдено категорий на странице: ${categories.length}`);
        
        // 3. Очищаем существующие элементы (оставляем только заголовки)
        categories.forEach(category => {
            const menuItems = category.querySelectorAll('.menu-item');
            menuItems.forEach(item => item.remove());
            console.log(`Очищена категория: ${category.querySelector('h3').textContent}`);
        });
        
        // 4. Добавляем новые данные из сервера
        menuData.forEach((serverCategory, index) => {
            if (categories[index]) {
                console.log(`Обновляю категорию "${serverCategory.category}"`);
                
                serverCategory.items.forEach(item => {
                    this.createMenuItem(categories[index], item);
                });
                
                console.log(`Добавлено ${serverCategory.items.length} элементов`);
            } else {
                console.warn(`Нет HTML категории для данных: ${serverCategory.category}`);
            }
        });
        
        console.log('updateMenuFromServer: завершено');
    }

    createMenuItem(categoryContainer, itemData) {
        // Создаём элемент меню по образцу из HTML
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        menuItem.innerHTML = `
            <span class="item-name">${itemData.name}</span>
            <span class="item-price">${itemData.price} ₽</span>
            <p class="item-description">${itemData.description}</p>
        `;
        
        categoryContainer.appendChild(menuItem);
        console.log(`Создан элемент: ${itemData.name} - ${itemData.price}₽`);
    }

    showCachedData() {
        console.log('showCachedData: показ кэшированных данных');
        // Здесь можно показать данные из localStorage
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаю MenuLoader...');
    
    if (window.location.pathname.includes('menu.html')) {
        console.log('✅ Это страница menu.html, создаю MenuLoader');
        new MenuLoader();
    }
});

console.log('=== МЕНЮ ЗАГРУЗЧИК: Код загружен ===');
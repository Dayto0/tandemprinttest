const translations = {
    ru: {
        headerTitle: "Тандем Принт",
        sendingTitle: "Калькулятор цен",
        widthLabel: "Ширина (м):",
        heightLabel: "Высота (м):",
        materialLabel: "Материал:",
        densityLabel: "Плотность печати:",
        calculateBtn: "Рассчитать",
        sendBtn: "Зарегистрировать заказ",
        result: "Цена: ",
        placeholderName: "Введите имя",
        placeholderPhone: "Введите номер телефона",
    },
    am: {
        headerTitle: "Տանդեմ Պրինտ",
        sendingTitle: "Գինը հաշվարկելու առարք",
        widthLabel: "Լայնություն (մ):",
        heightLabel: "Բարձրություն (մ):",
        materialLabel: "Մատերիալ:",
        densityLabel: "Տպման խտությունը:",
        calculateBtn: "Հաշվել",
        sendBtn: "Գրանցեք ձեր պատվերը",
        result: "Գինը: ",
        placeholderName: "Մուտքագրեք անունը",
        placeholderPhone: "Մուտքագրեք հեռախոսահամարը",
    },
    en: {
        headerTitle: "Tandem Print",
        sendingTitle: "Price Calculator",
        widthLabel: "Width (m):",
        heightLabel: "Height (m):",
        materialLabel: "Material:",
        densityLabel: "Printing density:",
        calculateBtn: "Calculate",
        sendBtn: "Register Order",
        result: "Price: ",
        placeholderName: "Enter name",
        placeholderPhone: "Enter phone number",
    },
};

// Функция для изменения языка
function changeLanguage(language) {
    document.getElementById("headerTitle").innerText = translations[language].headerTitle;
    document.getElementById("sendingTitle").innerText = translations[language].sendingTitle;
    document.getElementById("widthLabel").innerText = translations[language].widthLabel;
    document.getElementById("heightLabel").innerText = translations[language].heightLabel;
    document.getElementById("materialLabel").innerText = translations[language].materialLabel;
    document.getElementById("densityLabel").innerText = translations[language].densityLabel;
    document.getElementById("calculateBtn").innerText = translations[language].calculateBtn;
    document.getElementById("sendBtn").innerText = translations[language].sendBtn;
    document.getElementById("result").innerText = translations[language].result;
    document.getElementById("name").placeholder = translations[language].placeholderName;
    document.getElementById("phone").placeholder = translations[language].placeholderPhone;
    document.title = translations[language].sendingTitle;
}

// Устанавливаем язык по умолчанию
changeLanguage('ru'); // по умолчанию русский


// Функция для расчёта стоимости
function calculatePrice() {
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const materialCost = parseFloat(document.getElementById('material').value);
    const densityCost = parseFloat(document.getElementById('density').value);

    if (isNaN(width) || isNaN(height)) {
        alert("Пожалуйста, введите правильные размеры!");
        return;
    }

    const area = width * height;
    let basePrice = area * materialCost;
    basePrice += densityCost;

    // Рассчитываем цену от реальной (не меняем ее вниз)
    let minPrice = basePrice;

    // Цена до — изменяется динамически (+10% от базовой цены)
    let maxPrice = basePrice + (basePrice * 0.1);

    // Округляем обе цены
    minPrice = Math.round(minPrice);
    maxPrice = Math.round(maxPrice);

    const resultText = `От ${minPrice} до ${maxPrice} драм.`;
    document.getElementById('result').innerText = resultText;
}

// Функция для отправки данных на Telegram
function sendOrder() {
    // Проверяем и получаем данные из полей
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);
    const materialCost = parseFloat(document.getElementById('material').value);
    const densityCost = parseFloat(document.getElementById('density').value);
    const material = document.getElementById('material').selectedOptions[0].text;
    const density = document.getElementById('density').selectedOptions[0].text;
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Проверка на заполнение имени и телефона
    if (!name || !phone) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    // Проверка на корректные размеры
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert("Пожалуйста, введите правильные размеры!");
        return;
    }

    // Расчет цены, если результат пустой или не рассчитан
    let resultPrice = document.getElementById('result').innerText.trim();
    if (!resultPrice || resultPrice === "Цена:" || resultPrice === "") {
        const area = width * height;
        let basePrice = area * materialCost;
        basePrice += densityCost;

        const minPrice = Math.round(basePrice);
        const maxPrice = Math.round(basePrice + (basePrice * 0.1));
        resultPrice = `От ${minPrice} до ${maxPrice} драм.`;

        // Обновляем #result для синхронности
        document.getElementById('result').innerText = `Цена: ${resultPrice}`;
    }

    // Получаем текущую дату и время (GMT+4)
    const now = new Date();
    const offsetHours = 4; // GMT+4
    const gmtPlus4 = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
    const orderDate = `${gmtPlus4.toLocaleDateString()} ${gmtPlus4.getHours()}:${gmtPlus4.getMinutes().toString().padStart(2, '0')}`;

    // Формируем сообщение для Telegram
    const message = `
    Новый заказ:
    \n👤Имя: ${name}
    \n📞Телефон: ${phone}
    \n📐Размеры: ${width} x ${height} м
    \n📄Материал: ${material}
    \n📈Плотность печати: ${density}
    \n💰Цена: ${resultPrice}
    \n📅Дата заказа: ${orderDate}`;

    // Отправляем данные в Telegram
    const token = '7475133843:AAGdtr_FAPQmn772HJOyU1gYRMK8hYJsoeY';
    const chatId = '878014553';
    const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const url = `${apiUrl}?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("Заказ успешно отправлен!");
                location.reload(); // Обновляем страницу после отправки
            } else {
                alert("Ошибка при отправке заказа.");
            }
        })
        .catch(error => {
            alert("Ошибка при отправке заказа.");
        });
}

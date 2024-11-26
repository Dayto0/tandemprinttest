// Переводы для разных языков
const translations = {
    ru: {
        sendingTitle: "Калькулятор цен",
        widthLabel: "Ширина (м):",
        heightLabel: "Высота (м):",
        materialLabel: "Материал:",
        densityLabel: "Плотность печати:",
        calculateBtn: "Рассчитать",
        sendBtn: "Зарегистрировать заказ",
        result: "Цена: ",
        namePlaceholder: "Введите имя",
        phonePlaceholder: "Введите номер телефона",
        widthPlaceholder: "Введите ширину",
        heightPlaceholder: "Введите высоту"
    },
    am: {
        sendingTitle: "Գինը հաշվարկելու առարք",
        widthLabel: "Լայնություն (մ):",
        heightLabel: "Բարձրություն (մ):",
        materialLabel: "Մատերիալ:",
        densityLabel: "Տպման խտությունը:",
        calculateBtn: "Հաշվել",
        sendBtn: "Գրանցեք ձեր պատվերը",
        result: "Գինը: ",
        namePlaceholder: "Մուտքագրեք անունը",
        phonePlaceholder: "Մուտքագրեք հեռախոսահամարը",
        widthPlaceholder: "Մուտքագրեք լայնությունը",
        heightPlaceholder: "Մուտքագրեք բարձրությունը"
    },
    en: {
        sendingTitle: "Price Calculator",
        widthLabel: "Width (m):",
        heightLabel: "Height (m):",
        materialLabel: "Material:",
        densityLabel: "Printing density:",
        calculateBtn: "Calculate",
        sendBtn: "Register Order",
        result: "Price: ",
        namePlaceholder: "Enter name",
        phonePlaceholder: "Enter phone number",
        widthPlaceholder: "Enter width",
        heightPlaceholder: "Enter height"
    }
};

// Функция для изменения языка
function changeLanguage(language) {
    document.getElementById("sendingTitle").innerText = translations[language].sendingTitle;
    document.getElementById("widthLabel").innerText = translations[language].widthLabel;
    document.getElementById("heightLabel").innerText = translations[language].heightLabel;
    document.getElementById("materialLabel").innerText = translations[language].materialLabel;
    document.getElementById("densityLabel").innerText = translations[language].densityLabel;
    document.getElementById("calculateBtn").innerText = translations[language].calculateBtn;
    document.getElementById("sendBtn").innerText = translations[language].sendBtn;
    document.getElementById("result").innerText = translations[language].result;
    document.title = translations[language].sendingTitle;

    // Переводим placeholder для всех полей
    document.getElementById("name").placeholder = translations[language].namePlaceholder;
    document.getElementById("phone").placeholder = translations[language].phonePlaceholder;
    document.getElementById("width").placeholder = translations[language].widthPlaceholder;
    document.getElementById("height").placeholder = translations[language].heightPlaceholder;
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
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // Проверка на заполнение имени и телефона
    if (!name || !phone) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    // Проверка на корректные размеры
    if (isNaN(width) || isNaN(height)) {
        alert("Пожалуйста, введите правильные размеры!");
        return;
    }

    // Расчет цены
    const area = width * height;
    let basePrice = area * materialCost;
    basePrice += densityCost;

    let minPrice = Math.round(basePrice);
    let maxPrice = Math.round(basePrice + (basePrice * 0.1));

    const resultPrice = `От ${minPrice} до ${maxPrice} драм.`;

    // Записываем цену в элемент #result (на случай, если она потребуется на экране)
    document.getElementById('result').innerText = resultPrice;

    // Получаем текущую дату и время (GMT+4)
    const now = new Date();
    const offsetHours = 4; // GMT+4
    const gmtPlus4 = new Date(now.getTime() + offsetHours * 60 * 60 * 1000);
    const orderTime = `${gmtPlus4.getHours()}:${gmtPlus4.getMinutes().toString().padStart(2, '0')}`;

    // Формируем сообщение для Telegram
    const message = `
    Новый заказ:
    \n👤Имя: ${name}
    \n📞Телефон: ${phone}
    \n📐Размеры: ${width} x ${height} м
    \n📄Материал: ${material}
    \n📈Плотность печати: ${density}
    \n💰Цена: ${resultPrice}
    \n🕒Дата и время заказа: ${orderTime}`;

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

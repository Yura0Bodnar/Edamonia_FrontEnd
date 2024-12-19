// Глобальна змінна для зберігання значення моделі
let selectedModel = "";

document.getElementById("executeBtn").addEventListener("click", async function () {
    document.getElementById("loading").style.display = "block";
    try {
        console.log("Кнопка 'Execute' натиснута");

        // Отримуємо значення параметрів
        const dateInput = document.getElementById("time").value; // Дата у форматі YYYY-MM-DD
        const eventInput = document.getElementById("events").value; // Значення події
        const modelInput = document.getElementById("model").value; // Назва моделі

        console.log("Отримані значення:");
        console.log("Дата:", dateInput);
        console.log("Подія:", eventInput);
        console.log("Модель:", modelInput);

        selectedModel = modelInput;

        // Валідація введених даних
        if (!dateInput || !eventInput || !modelInput) {
            alert("Please fill in all fields before executing the prediction.");
            console.error("Не заповнені всі обов'язкові поля.");
            return;
        }

        // Сховати повідомлення про успіх чи помилку
        document.getElementById("success").style.display = "none";
        document.getElementById("error").style.display = "none";

        // Формуємо запит
        const requestData = {
            date: formatDate(dateInput), // Форматуємо дату у DD.MM.YYYY
            event: eventInput,
            model: modelInput,
        };

        console.log("Дані для запиту (requestData):", requestData);

        // Викликаємо ендпоінт /predict
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        console.log("Відправлено запит на /predict, очікуємо відповідь...");

        // Перевіряємо статус відповіді
        if (response.ok) {
            const responseData = await response.json();
            console.log("Отримано відповідь від сервера:", responseData);

            // Формуємо окремі рядки для параметрів
            const parametersHtml = `
                <p>Iterations: ${responseData.parameters.iterations}</p>
                <p>Learning Rate: ${responseData.parameters.learning_rate}</p>
                <p>Depth: ${responseData.parameters.depth}</p>
                <p>MSE (Cross-validation): ${responseData.cv_metrics.mse.toFixed(4)}</p>
            `;

            // Формуємо окремі рядки для метрик
            const testMetricsHtml = `
                <p>MSE: ${responseData.test_metrics.mse.toFixed(4)}</p>
                <p>RMSE: ${responseData.test_metrics.rmse.toFixed(4)}</p>
                <p>MAE: ${responseData.test_metrics.mae.toFixed(4)}</p>
                <p>R²: ${responseData.test_metrics.r2.toFixed(4)}</p>
            `;

            // Вставляємо текст у відповідні елементи HTML
            document.getElementById("parameters").innerHTML = parametersHtml;
            document.getElementById("testMetrics").innerHTML = testMetricsHtml;

            // Показуємо повідомлення про успіх
            document.getElementById("success").style.display = "block";

            // Показуємо блок результатів
            document.getElementById("results").style.display = "block";

            document.getElementById("error").style.display = "none";
        } else {
            const errorData = await response.json();
            console.error("Помилка відповіді від сервера:", errorData);
            document.getElementById("error").style.display = "block";
        }
    } catch (error) {
        console.error("Network or Server Error:", error);
        document.getElementById("error").style.display = "block";
    } finally {
        // Ховаємо спінер
        document.getElementById("loading").style.display = "none";
        console.log("Обробка завершена.");
    }
});

// Функція для форматування дати у DD.MM.YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    console.log("Форматована дата:", `${day}.${month}.${year}`);
    return `${day}.${month}.${year}`;
}

// Додаємо логіку до кнопки "Download Table"
document.querySelector(".download-btn").addEventListener("click", function () {
    if (!selectedModel) {
        alert("Модель не вибрана. Будь ласка, натисніть 'Execute' перед завантаженням таблиці.");
        return;
    }

    // Формуємо URL для завантаження таблиці
    const downloadUrl = `http://localhost:8000/download-result-table?model=${encodeURIComponent(selectedModel)}`;
    console.log("URL для завантаження таблиці:", downloadUrl);

    // Використовуємо redirect для завантаження файлу
    window.location.href = downloadUrl;
});
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
        document.getElementById("results").style.display = "none";

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

            // Формуємо окремі рядки для метрик
            document.getElementById("testMetrics").innerHTML = `
                <p>MSE: ${responseData.test_metrics.mse.toFixed(4)}</p>
                <p>RMSE: ${responseData.test_metrics.rmse.toFixed(4)}</p>
                <p>MAE: ${responseData.test_metrics.mae.toFixed(4)}</p>
                <p>R²: ${responseData.test_metrics.r2.toFixed(4)}</p>
            `;

            // Динамічне відображення параметрів
            if (responseData.parameters) {
                // Якщо параметри існують, формуємо HTML
                let parametersHtml = "";
                for (const [key, value] of Object.entries(responseData.parameters)) {
                    const keyFormatted = key
                        .replace(/_/g, " ") // Замінюємо підкреслення на пробіли
                        .replace(/\b\w/g, (char) => char.toUpperCase()); // Робимо першу літеру кожного слова великою
                    parametersHtml += `<p>${keyFormatted}: ${value}</p>`;
                }
                document.getElementById("parameters").innerHTML = parametersHtml;
                document.getElementById("block2").style.display = "block";
            } else if (selectedModel === "LinearRegression") {
                // Якщо це LinearRegression, параметрів немає
                document.getElementById("parameters").innerHTML = "<p>Параметри відсутні для цієї моделі.</p>";
                document.getElementById("block2").style.display = "block";
            } else {
                // У будь-якому іншому випадку приховуємо block2
                document.getElementById("block2").style.display = "none";
            }

            // Викликаємо ендпоінт для завантаження файлу з сервера
            try {
                const fileName = `${modelInput}.csv`; // Формуємо назву файлу
                console.log("Формуємо запит до /files для завантаження файлу:", fileName);

                // Отримуємо файл із сервера
                const fileResponse = await fetch(`http://localhost:8000/files/${fileName}`);
                if (!fileResponse.ok) {
                    throw new Error(`Не вдалося завантажити файл: ${fileName}`);
                }
                const fileBlob = await fileResponse.blob(); // Завантажуємо файл як Blob
                const file = new File([fileBlob], fileName, { type: "text/csv" }); // Створюємо об'єкт File

                console.log("Файл успішно завантажено:", fileName);

                // Формуємо дані форми для запиту
                const formData = new FormData();
                formData.append("files", file); // Додаємо файл у форму

                // Викликаємо ендпоінт для обробки файлу
                try {
                    console.log("Формуємо запит до /process-file для обробки файлу:", fileName);

                    const processFileResponse = await fetch("http://localhost:8000/process-file/", {
                        method: "POST",
                        body: formData, // Передаємо FormData
                    });

                    if (processFileResponse.ok) {
                        const processFileData = await processFileResponse.json();
                        console.log("Ендпоінт /process-file виконаний успішно.");
                        console.log("Дані від /process-file:", processFileData);
                    } else {
                        const errorData = await processFileResponse.json();
                        console.error("Помилка при виконанні /process-file:", errorData);
                        document.getElementById("error").style.display = "block";
                    }
                } catch (error) {
                    console.error("Сталася помилка при виконанні /process-file:", error);
                    document.getElementById("error").style.display = "block";
                }
            } catch (error) {
                console.error("Сталася помилка при завантаженні файлу з /files:", error);
                document.getElementById("error").style.display = "block";
            }

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

// Додаємо логіку до кнопки "Download Table"
document.querySelector(".test_predict-btn").addEventListener("click", function () {
    if (!selectedModel) {
        alert("Модель не вибрана. Будь ласка, натисніть 'Execute' перед завантаженням таблиці.");
        return;
    }

    // Формуємо URL для завантаження таблиці
    const downloadUrl = `http://localhost:8000/download-test-results?model=${encodeURIComponent(selectedModel)}`;
    console.log("URL для завантаження таблиці:", downloadUrl);

    // Використовуємо redirect для завантаження файлу
    window.location.href = downloadUrl;
});
document.addEventListener('DOMContentLoaded', function () {
    // Елемент для анімації друку
    const typingElement = document.getElementById('typing');
    const messages = [
        "Привіт! Як я можу допомогти вам сьогодні?",
        "Я тут, щоб допомогти з вашими завданнями.",
        "Задайте питання, і я дам відповідь!"
    ];

    let messageIndex = 0;

    function typeMessage() {
        if (!typingElement) {
            console.error("Елемент 'typing' не знайдено.");
            return;
        }

        if (messageIndex < messages.length) {
            const currentMessage = messages[messageIndex];
            let charIndex = 0;

            const typingInterval = setInterval(() => {
                typingElement.textContent = currentMessage.substring(0, charIndex);
                charIndex++;

                if (charIndex > currentMessage.length) {
                    clearInterval(typingInterval);
                    messageIndex++;
                    setTimeout(typeMessage, 1000); // Затримка перед наступним повідомленням
                }
            }, 100);
        } else {
            typingElement.textContent = "Чекаю ваших питань..."; // Завершення друку
        }
    }

    // Запуск анімації друку
    typeMessage();

    // Подія для активного елемента в списку чатів
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            chatItems.forEach(i => i.classList.remove('active')); // Знімаємо активний клас
            item.classList.add('active'); // Додаємо активний клас до натиснутого елемента
        });
    });

    // Елементи для завантаження файлів
    const uploadDatasetBtn = document.getElementById("upload-dataset-btn");
    const uploadAiDatasetBtn = document.getElementById("upload-ai-dataset-btn");
    const fileUploadInput = document.getElementById("file-upload-input");

    // Перевірка наявності елементів
    if (!uploadDatasetBtn || !uploadAiDatasetBtn || !fileUploadInput) {
        console.error("Елементи для завантаження файлів не знайдено.");
        return;
    }

    // Додавання обробників подій для кнопок
    uploadDatasetBtn.addEventListener("click", () => {
        fileUploadInput.click(); // Відкриває файловий провідник
    });

    uploadAiDatasetBtn.addEventListener("click", () => {
        fileUploadInput.click(); // Відкриває файловий провідник
    });

    // Обробка вибору файлу
    fileUploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0]; // Отримує вибраний файл
        if (file) {
            alert(`Файл обрано: ${file.name}`);
            // Додайте логіку для завантаження файлу на сервер, якщо потрібно
        }
    });
});

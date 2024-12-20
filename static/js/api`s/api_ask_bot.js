// Функція для збереження даних у LocalStorage
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Функція для отримання даних з LocalStorage
function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Відображення історії чату з LocalStorage після завантаження сторінки
window.onload = () => {
    const chatMessages = document.getElementById("chat-messages");
    const chatHistory = getFromLocalStorage("chatHistory");

    chatHistory.forEach((entry) => {
        chatMessages.innerHTML += `<p><strong>${entry.sender}:</strong> ${entry.message}</p>`;
    });
};

// Обробка події натискання кнопки "Send"
document.getElementById("send-btn").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return; // Перевірка на порожній ввід

    const chatMessages = document.getElementById("chat-messages");

    // Додаємо повідомлення користувача до історії
    const chatHistory = getFromLocalStorage("chatHistory");
    chatHistory.push({ sender: "User", message: userInput });

    // Відображення повідомлення користувача
    chatMessages.innerHTML += `<p><strong>User:</strong> ${userInput}</p>`;
    document.getElementById("user-input").value = ""; // Очищення поля вводу

    // Надсилаємо запит до бота
    try {
        const response = await fetch("http://127.0.0.1:8000/ask-bot/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: userInput })
        });

        const data = await response.json();
        const botResponse = data.assistant_response;

        // Додаємо відповідь бота до історії
        chatHistory.push({ sender: "AI-bot", message: botResponse });
        saveToLocalStorage("chatHistory", chatHistory); // Збереження в LocalStorage

        // Відображення відповіді бота
        chatMessages.innerHTML += `<p><strong>AI-bot:</strong> ${botResponse}</p>`;
    } catch (error) {
        chatMessages.innerHTML += `<p><strong>AI-bot:</strong> Помилка: ${error.message}</p>`;
    }

    // Автоматичний скрол до останнього повідомлення
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

document.addEventListener('DOMContentLoaded', function () {
    const typingElement = document.getElementById('typing');
    const messages = [
        "Привіт! Як я можу допомогти вам сьогодні?",
        "Я тут, щоб допомогти з вашими завданнями.",
        "Задайте питання, і я дам відповідь!"
    ];

    let messageIndex = 0;

    function typeMessage() {
        if (messageIndex < messages.length) {
            let currentMessage = messages[messageIndex];
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
            typingElement.textContent = ""; // Завершення друку
        }
    }

    typeMessage();

    // Подія для активного елемента в списку чатів
    document.querySelectorAll('.chat-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
});

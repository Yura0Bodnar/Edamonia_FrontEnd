

document.getElementById("clear-btn").addEventListener("click", function() {
    // Очищення вмісту елементу чату
    document.getElementById("chat-messages").innerHTML = "";

    localStorage.removeItem("chatHistory");
});

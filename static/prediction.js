document.getElementById('executeBtn').addEventListener('click', function() {
    // Сховати всі блоки
    document.getElementById('success').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Імітація затримки завантаження
    setTimeout(function() {
        document.getElementById('loading').style.display = 'none';

        // Генерація випадкового результату (успіх чи помилка)
        const isSuccess = Math.random() > 0.5;

        if (isSuccess) {
            document.getElementById('success').style.display = 'block';
        } else {
            document.getElementById('error').style.display = 'block';
        }
    }, 3000); // Затримка 3 секунди
});

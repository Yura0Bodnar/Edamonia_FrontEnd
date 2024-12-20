

document.addEventListener("DOMContentLoaded", function ()
{
    const uploadDatasetBtn = document.getElementById("upload-dataset-btn");
    const fileUploadInput = document.getElementById("file-upload-input");

    // Перевірка наявності елементів
    if (!uploadDatasetBtn || !fileUploadInput) {
        console.error("Елементи для завантаження файлів не знайдено.");
        return;
    }

    // Кнопка для відкриття інпуту
    uploadDatasetBtn.addEventListener("click", () => fileUploadInput.click());

    // Обробка події вибору файлу
    fileUploadInput.addEventListener("change", (event) => {
        const files = event.target.files; // Отримуємо файли
        if (files.length === 0) {
            console.warn("Файл не обрано.");
            return;
        }

        uploadFilesToBackend(files);
    });

    // Функція відправки файлів на сервер
    async function uploadFilesToBackend(files) {
        const formData = new FormData();

        // Додаємо файли у FormData
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]); // Назва ключа 'files', як на бекенді
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/process-file/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Помилка завантаження: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Успішно завантажено:", result);
            alert("Файл(и) успішно завантажено!");
        } catch (error) {
            console.error("Помилка при завантаженні файлів:", error);
            alert("Сталася помилка при завантаженні файлів.");
        }
    }
});

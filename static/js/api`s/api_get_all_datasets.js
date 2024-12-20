

document.addEventListener("DOMContentLoaded", async () => {
    const datasetContainer = document.querySelector(".dataset-container");

    async function fetchDatasets() {
        try {
            // Запит до бекенду
            const response = await fetch("http://127.0.0.1:8000/datasets/", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (response.ok) {
                // Якщо файли знайдені
                if (data.datasets && data.datasets.length > 0) {
                    datasetContainer.innerHTML = ""; // Очищаємо контейнер

                    data.datasets.forEach((dataset) => {
                        // Створюємо новий елемент для кожного датасету
                        const datasetItem = document.createElement("div");
                        datasetItem.classList.add("dataset-item");
                        datasetItem.innerHTML = `
                            ${dataset}
                            <button class="btn delete-dataset" data-filename="${dataset}">&#128465;</button>
                        `;

                        datasetContainer.appendChild(datasetItem);
                    });

                    // Підключаємо обробники подій для кнопок видалення
                    attachDeleteHandlers();
                } else {
                    datasetContainer.innerHTML = "<p>No datasets found.</p>";
                }
            } else {
                throw new Error(data.detail || "Failed to fetch datasets.");
            }
        } catch (error) {
            console.error("Error fetching datasets:", error);
            datasetContainer.innerHTML = "<p>Error loading datasets.</p>";
        }
    }

    // Функція для підключення видалення після оновлення DOM
    function attachDeleteHandlers() {
        const deleteButtons = document.querySelectorAll(".delete-dataset");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                const fileName = button.dataset.filename;
                const confirmDelete = confirm(`Are you sure you want to delete ${fileName}?`);

                if (confirmDelete) {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/delete-file/?file_name=${encodeURIComponent(fileName)}`, {
                            method: "DELETE",
                        });

                        const result = await response.json();
                        if (response.ok) {
                            alert(result.message);
                            button.parentElement.remove(); // Видаляємо елемент із DOM
                        } else {
                            alert(`Error: ${result.detail}`);
                        }
                    } catch (err) {
                        console.error("Error deleting file:", err);
                        alert("Failed to delete the dataset.");
                    }
                }
            });
        });
    }

    // Викликаємо функцію для завантаження датасетів
    fetchDatasets();
});

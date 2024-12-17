const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 150;

// Клас для зірок
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1; // Більші зірки
        this.alpha = Math.random() * 0.8 + 0.2; // Прозорість від 0.2 до 1
        this.speed = Math.random() * 0.5 + 0.2;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // Яскраві білі зірки
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.radius;
            this.x = Math.random() * canvas.width;
        }
    }
}

// Ініціалізація зірок
function initStars() {
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

// Анімація зірок
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}

// Оновлення розміру canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.length = 0; // Очищення масиву зірок
    initStars();
}

window.addEventListener('resize', resizeCanvas);

// Виклик функцій
resizeCanvas();
initStars();
animateStars();

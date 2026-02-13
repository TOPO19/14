/**
 * Coeurs flottants en arrière-plan + contrôle musique
 */
(function () {
    const canvas = document.getElementById('hearts-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let hearts = [];
    const HEART_COUNT = 15;
    const COLORS = ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function createHeart() {
        return {
            x: Math.random() * canvas.width,
            y: canvas.height + 20,
            size: Math.random() * 14 + 6,
            speed: Math.random() * 0.8 + 0.3,
            drift: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.3 + 0.1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
        };
    }

    for (let i = 0; i < HEART_COUNT; i++) {
        const h = createHeart();
        h.y = Math.random() * canvas.height;
        hearts.push(h);
    }

    function drawHeart(x, y, size, color, opacity, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size, -size, -size * 0.4, 0, size * 0.5);
        ctx.bezierCurveTo(size, -size * 0.4, size * 0.5, -size, 0, -size * 0.3);
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hearts.forEach((h, i) => {
            h.y -= h.speed;
            h.x += h.drift;
            h.rotation += h.rotSpeed;

            if (h.y < -30 || h.x < -30 || h.x > canvas.width + 30) {
                hearts[i] = createHeart();
            }

            drawHeart(h.x, h.y, h.size, h.color, h.opacity, h.rotation);
        });

        requestAnimationFrame(animate);
    }

    animate();
})();

/* Contrôle musique */
let musicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    const icon = document.getElementById('music-icon');

    if (musicPlaying) {
        audio.pause();
        icon.textContent = '🔇';
    } else {
        audio.volume = 0.3;
        audio.play().catch(() => {});
        icon.textContent = '🎵';
    }
    musicPlaying = !musicPlaying;
}

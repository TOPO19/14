/**
 * Page finale : typing animation, compteurs, love burst
 */
(function () {
    const lines = [
        'Depuis le 22/10/2018, tu es mon plus beau choix.',
        '',
        'Depuis le 10/01/2026, tu es ma promesse pour la vie.',
        '',
        'Joyeuse Saint-Valentin mon amour ❤️',
    ];

    const typedEl = document.getElementById('typed-cursor');
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';

    function typeWriter() {
        if (lineIndex >= lines.length) {
            // Terminé : retirer le curseur et afficher le reste
            typedEl.classList.add('done');
            setTimeout(showCountersAndButton, 500);
            return;
        }

        const line = lines[lineIndex];

        if (line === '') {
            currentText += '<br><br>';
            typedEl.innerHTML = currentText;
            lineIndex++;
            charIndex = 0;
            setTimeout(typeWriter, 300);
            return;
        }

        if (charIndex < line.length) {
            currentText += line[charIndex];
            typedEl.innerHTML = currentText;
            charIndex++;
            const delay = line[charIndex - 1] === '.' || line[charIndex - 1] === ',' ? 120 : 45;
            setTimeout(typeWriter, delay);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeWriter, 400);
        }
    }

    // Lancer le typing après un court délai
    setTimeout(typeWriter, 800);

    // Compteurs de jours
    function daysSince(dateStr) {
        const [d, m, y] = dateStr.split('/').map(Number);
        const target = new Date(y, m - 1, d);
        const now = new Date();
        const diff = Math.abs(now - target);
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString('fr-FR');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function showCountersAndButton() {
        const counters = document.getElementById('counters');
        const loveBtn = document.getElementById('love-btn-wrap');

        counters.style.opacity = '1';
        setTimeout(() => {
            loveBtn.style.opacity = '1';
        }, 600);

        const daysTogether = daysSince('22/10/2018');
        const daysEngaged = daysSince('10/01/2026');

        animateCounter(document.getElementById('counter-together'), daysTogether);
        animateCounter(document.getElementById('counter-engaged'), daysEngaged);
    }
})();

/**
 * Love burst : explosion de coeurs au clic du bouton
 */
function loveBurst() {
    const btn = document.getElementById('love-btn');
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const emojis = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝', '🥰', '😘', '✨'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'love-heart-burst';
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const angle = (Math.PI * 2 * i) / 20;
        const dist = 100 + Math.random() * 150;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 80;
        const rot = (Math.random() - 0.5) * 720;

        heart.style.left = cx + 'px';
        heart.style.top = cy + 'px';
        heart.style.setProperty('--tx', tx + 'px');
        heart.style.setProperty('--ty', ty + 'px');
        heart.style.setProperty('--rot', rot + 'deg');
        heart.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
        heart.style.animationDelay = (Math.random() * 0.3) + 's';

        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2500);
    }

    // Petit effet de scale sur le bouton
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 300);
}

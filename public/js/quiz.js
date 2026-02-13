/**
 * Quiz interactif romantique
 * 7 questions normales + 1 question finale spéciale (bouton qui fuit)
 */
let currentStep = 0;
let isProcessing = false;

/* ---- Soumission d'une réponse normale ---- */
function submitAnswer(step, choice) {
    if (isProcessing || step !== currentStep) return;
    isProcessing = true;

    const questionEl = document.querySelector(`.quiz-question[data-step="${step}"]`);
    const buttons = questionEl.querySelectorAll('.quiz-choice');
    buttons.forEach(btn => btn.disabled = true);
    buttons[choice].classList.add('ring-2', 'ring-rose-deep');

    fetch(QUIZ_CHECK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `step=${step}&choice=${choice}`,
    })
        .then(res => res.json())
        .then(data => {
            if (data.correct) {
                buttons[choice].classList.add('correct');
                showFeedback(true, data.message, data.finished);
            } else {
                buttons[choice].classList.add('wrong');
                showFeedback(false, data.message, false);
            }
        })
        .catch(() => {
            isProcessing = false;
            buttons.forEach(btn => btn.disabled = false);
        });
}

/* ---- Afficher le feedback après une réponse ---- */
function showFeedback(correct, message, finished) {
    const questionEl = document.querySelector(`.quiz-question[data-step="${currentStep}"]`);

    questionEl.style.transition = 'opacity 0.4s, transform 0.4s';
    questionEl.style.opacity = '0';
    questionEl.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        questionEl.classList.remove('active');
        questionEl.style.opacity = '';
        questionEl.style.transform = '';

        const feedback = document.getElementById('feedback');
        const icon = document.getElementById('feedback-icon');
        const msg = document.getElementById('feedback-message');
        const nextBtn = document.getElementById('feedback-next');

        feedback.classList.remove('hidden');
        feedback.style.animation = 'fadeInUp 0.5s ease-out';

        if (correct) {
            icon.textContent = '💖';
            msg.textContent = message;

            if (finished) {
                // Après les 7 questions : on passe à la question spéciale
                nextBtn.textContent = 'Dernière question ✨';
                nextBtn.classList.remove('hidden');
                nextBtn.onclick = showSpecialQuestion;
            } else {
                nextBtn.textContent = 'Question suivante';
                nextBtn.classList.remove('hidden');
                nextBtn.onclick = nextQuestion;
            }
        } else {
            icon.textContent = '🥺';
            msg.textContent = message;
            nextBtn.textContent = 'Réessayer';
            nextBtn.classList.remove('hidden');
            nextBtn.onclick = retryQuestion;
        }
    }, 400);
}

/* ---- Passer à la question suivante (normales) ---- */
function nextQuestion() {
    currentStep++;
    isProcessing = false;

    const feedback = document.getElementById('feedback');
    feedback.classList.add('hidden');
    document.getElementById('feedback-next').classList.add('hidden');

    // Progression : inclut la question spéciale comme dernière étape
    const pct = ((currentStep + 1) / TOTAL_STEPS) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${currentStep + 1} / ${TOTAL_STEPS}`;

    const nextEl = document.querySelector(`.quiz-question[data-step="${currentStep}"]`);
    if (nextEl) {
        nextEl.classList.add('active');
    }
}

/* ---- Réessayer la question en cours ---- */
function retryQuestion() {
    isProcessing = false;

    const feedback = document.getElementById('feedback');
    feedback.classList.add('hidden');
    document.getElementById('feedback-next').classList.add('hidden');

    const questionEl = document.querySelector(`.quiz-question[data-step="${currentStep}"]`);
    const buttons = questionEl.querySelectorAll('.quiz-choice');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('wrong', 'correct', 'ring-2', 'ring-rose-deep');
    });
    questionEl.classList.add('active');
}

/* ==================================================
   QUESTION FINALE SPÉCIALE — Bouton "Non…" qui fuit
   ================================================== */

function showSpecialQuestion() {
    const feedback = document.getElementById('feedback');
    feedback.classList.add('hidden');
    document.getElementById('feedback-next').classList.add('hidden');

    // Barre de progression à 100%
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('progress-text').textContent = `${TOTAL_STEPS} / ${TOTAL_STEPS}`;

    const special = document.getElementById('special-question');
    special.classList.add('active');

    // Initialiser le bouton qui fuit
    initFleeButton();
}

/* Quand elle clique "Toujours avec toi" */
function acceptFinal() {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = FINAL_URL;
    }, 500);
}

/* ---- Bouton qui fuit : "Non…" — bouge dans la carte du quiz ---- */
function initFleeButton() {
    const btn = document.getElementById('btn-no');
    const container = document.querySelector('.special-buttons-area');
    const yesBtn = document.getElementById('btn-yes');
    let fleeing = false;

    // Agrandir la zone pour que le bouton ait de la place où fuir
    container.style.minHeight = '250px';

    function flee() {
        if (fleeing) return;
        fleeing = true;

        const containerRect = container.getBoundingClientRect();
        const btnW = btn.offsetWidth;
        const btnH = btn.offsetHeight;
        const yesRect = yesBtn.getBoundingClientRect();
        const curLeft = parseFloat(btn.style.left) || 0;
        const curTop = parseFloat(btn.style.top) || 0;

        const maxX = containerRect.width - btnW;
        const maxY = containerRect.height - btnH;
        const MIN_DIST = 80;

        let newX, newY, tries = 0;

        // Trouver une position loin de la position actuelle et sans chevauchement
        do {
            newX = Math.random() * Math.max(maxX, 0);
            newY = Math.random() * Math.max(maxY, 0);

            const dist = Math.hypot(newX - curLeft, newY - curTop);

            const absX = containerRect.left + newX;
            const absY = containerRect.top + newY;
            const overlap =
                absX < yesRect.right + 10 &&
                absX + btnW > yesRect.left - 10 &&
                absY < yesRect.bottom + 10 &&
                absY + btnH > yesRect.top - 10;

            if (!overlap && dist > MIN_DIST) break;
            tries++;
        } while (tries < 50);

        // Couper les pointer-events pendant le déplacement
        // pour que le navigateur détecte un nouveau mouseenter après
        btn.style.pointerEvents = 'none';
        btn.style.position = 'absolute';
        btn.style.left = newX + 'px';
        btn.style.top = newY + 'px';
        btn.style.width = btnW + 'px';
        btn.style.transition = 'left 0.25s ease-out, top 0.25s ease-out';

        // Réactiver après la fin de la transition
        setTimeout(() => {
            btn.style.pointerEvents = '';
            fleeing = false;
        }, 280);
    }

    // Desktop : mouseenter + mousemove comme filet de sécurité
    btn.addEventListener('mouseenter', flee);
    btn.addEventListener('mouseover', flee);

    // Mobile
    btn.addEventListener('touchstart', function (e) {
        e.preventDefault();
        flee();
    });

    // Bloquer le clic
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        flee();
    });
}

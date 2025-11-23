let deck = [];
let currentSpread = '';
let userQuestion = '';
let userCategory = 'Generale';
let totalCardsNeeded = 0;
let cardsDrawn = 0;
let shuffledDeck = [];

// Carica Dati
async function loadDeck() {
    try {
        const response = await fetch('tarot_data.json');
        deck = await response.json();
    } catch (e) { }
}
loadDeck();

// Mescolamento Reale
function shuffleDeck(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// UI Managers
function selectCategory(btnElement, category) {
    userCategory = category;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goHome() { showScreen('screen-home'); }
function goToInput(type) { currentSpread = type; showScreen('screen-input'); }

// Start Reading
function startReading() {
    userQuestion = document.getElementById('user-question').value;
    showScreen('screen-shuffle');

    shuffledDeck = shuffleDeck([...deck]);
    cardsDrawn = 0;

    // DEFINIZIONE DEL NUMERO DI CARTE
    if (currentSpread === 'one-card') totalCardsNeeded = 1;
    else if (currentSpread === 'three-cards') totalCardsNeeded = 3;
    else if (currentSpread === 'celtic-cross') totalCardsNeeded = 10;

    const container = document.getElementById('carousel-container');
    container.innerHTML = '';
    addDeckSlide(container);

    setTimeout(() => {
        showScreen('screen-reading');
        updateStatus();
    }, 2000);
}

function updateStatus() {
    const text = cardsDrawn < totalCardsNeeded
        ? `PESCA LA CARTA ${cardsDrawn + 1} DI ${totalCardsNeeded}`
        : "LETTURA COMPLETATA";
    document.getElementById('reading-step').innerText = text;
}

function addDeckSlide(container) {
    const div = document.createElement('div');
    div.className = 'slide slide-active';
    div.id = 'deck-slide';
    div.innerHTML = `
        <div class="card-back-pattern" onclick="revealNextCard()">
            ✦
        </div>
        <div style="margin-top:20px; color:#444; font-size:0.75rem; letter-spacing:1px">TOCCA IL MAZZO</div>
    `;
    container.appendChild(div);
    setTimeout(() => div.scrollIntoView({ behavior: "auto", inline: "center" }), 100);
}

function revealNextCard() {
    if (cardsDrawn >= totalCardsNeeded) return;

    const container = document.getElementById('carousel-container');
    const card = shuffledDeck[cardsDrawn];

    // GESTIONE DEI NOMI DELLE POSIZIONI
    let positionNames = [];

    if (currentSpread === 'one-card') {
        positionNames = ["LA RISPOSTA"];
    } else if (currentSpread === 'three-cards') {
        positionNames = ["IL PASSATO", "IL PRESENTE", "IL FUTURO"];
    } else if (currentSpread === 'celtic-cross') {
        positionNames = [
            "1. IL PRESENTE (La Situazione)",
            "2. L'OSTACOLO (Ciò che incrocia)",
            "3. IL FONDAMENTO (Le radici)",
            "4. IL PASSATO RECENTE",
            "5. IL POTENZIALE (L'obiettivo)",
            "6. IL FUTURO PROSSIMO",
            "7. TU (L'Atteggiamento)",
            "8. L'AMBIENTE ESTERNO",
            "9. SPERANZE E PAURE",
            "10. L'ESITO FINALE"
        ];
    }

    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
        <div class="label" style="color:#gold; margin-bottom:5px; font-size:0.75rem; color:#888;">${positionNames[cardsDrawn]}</div>
        <img class="card-visual" src="${card.image}" alt="${card.name}">
        <div class="meaning-content">
            <h3>${card.name}</h3>
            <p>${card.modern_meaning}</p>
            <span class="reflection">${card.reflection}</span>
        </div>
    `;

    const deckSlide = document.getElementById('deck-slide');
    container.insertBefore(slide, deckSlide);

    cardsDrawn++;
    updateStatus();

    // Focus sulla carta
    slide.scrollIntoView({ behavior: "smooth", inline: "center" });

    document.querySelectorAll('.slide').forEach(s => s.classList.remove('slide-active'));
    slide.classList.add('slide-active');

    if (cardsDrawn < totalCardsNeeded) {
        showScrollHint();
        deckSlide.classList.remove('slide-active');
    } else {
        deckSlide.style.display = 'none';
        hideScrollHint();
    }
}

function showScrollHint() {
    const hint = document.getElementById('scroll-hint');
    hint.style.display = 'block';
    setTimeout(() => { hint.style.display = 'none'; }, 4000);
}

function hideScrollHint() {
    document.getElementById('scroll-hint').style.display = 'none';
}

document.getElementById('carousel-container').addEventListener('scroll', () => {
    hideScrollHint();
    const container = document.getElementById('carousel-container');
    const center = container.scrollLeft + (container.offsetWidth / 2);

    document.querySelectorAll('.slide').forEach(slide => {
        const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
        const dist = Math.abs(center - slideCenter);
        if (dist < 100) {
            slide.classList.add('slide-active');
        } else {
            slide.classList.remove('slide-active');
        }
    });
});
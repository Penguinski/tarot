let deck = [];
let currentSpread = '';
let userQuestion = '';
let totalCardsNeeded = 0;
let cardsDrawn = 0;
let shuffledDeck = [];
let allowReversed = false;

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
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
}
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function goHome() { showScreen('screen-home'); }
function goToInput(type) { currentSpread = type; showScreen('screen-input'); }

// --- BIBLIOTECA ---
function openLibrary() {
    const grid = document.getElementById('library-grid');
    grid.innerHTML = '';
    deck.forEach(card => {
        const div = document.createElement('div');
        div.className = 'lib-card-thumb';
        div.style.backgroundImage = `url('${card.image}')`;
        div.onclick = () => showCardDetail(card);
        grid.appendChild(div);
    });
    showScreen('screen-library');
}

function showCardDetail(card) {
    const overlay = document.getElementById('card-overlay');
    overlay.innerHTML = `
        <img src="${card.image}" style="max-height:50vh; border-radius:10px; box-shadow:0 0 30px rgba(0,0,0,0.8); margin-bottom:20px;">
        <h2 style="color:#c5a059; margin-bottom:5px;">${card.name}</h2>
        <p style="color:#fff; text-align:center; max-width:300px;">${card.modern_meaning}</p>
        <p style="color:#888; font-size:0.8rem; margin-top:20px;">Tocca per chiudere</p>
    `;
    overlay.style.display = 'flex';
}
function closeOverlay() { document.getElementById('card-overlay').style.display = 'none'; }


// --- LETTURA ---
function startReading() {
    userQuestion = document.getElementById('user-question').value;
    allowReversed = document.getElementById('allow-reversed').checked;

    showScreen('screen-shuffle');

    // JUMPER CARD CHECK (5% di probabilità)
    const isJumper = Math.random() < 0.05;

    shuffledDeck = shuffleDeck([...deck]);
    cardsDrawn = 0;

    if (currentSpread === 'one-card') totalCardsNeeded = 1;
    else if (currentSpread === 'three-cards') totalCardsNeeded = 3;
    else if (currentSpread === 'celtic-cross') totalCardsNeeded = 10;

    const container = document.getElementById('carousel-container');
    container.innerHTML = '';
    addDeckSlide(container);

    setTimeout(() => {
        if (isJumper) {
            alert("Un'energia ha insistito per manifestarsi...");
            // Non cambia la logica, ma crea atmosfera prima di entrare
        }
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
        <div class="card-back-pattern" onclick="revealNextCard()">✦</div>
        <div style="margin-top:20px; color:#444; font-size:0.75rem; letter-spacing:1px">TOCCA IL MAZZO</div>
    `;
    container.appendChild(div);
    setTimeout(() => div.scrollIntoView({ behavior: "auto", inline: "center" }), 100);
}

function revealNextCard() {
    if (cardsDrawn >= totalCardsNeeded) return;

    const container = document.getElementById('carousel-container');
    const rawCard = shuffledDeck[cardsDrawn];

    // Logica Rovesciata
    const isReversed = allowReversed && Math.random() < 0.5;

    // Se rovesciata, usa il significato alternativo (se esiste), altrimenti avvisa
    const meaning = isReversed ? (rawCard.reversed_meaning || "Significato rovesciato in arrivo...") : rawCard.modern_meaning;
    const visualClass = isReversed ? "card-visual reversed-img" : "card-visual";
    const revLabel = isReversed ? `<span class="rev-label">⚡ ROVESCIATA</span>` : "";

    let positionNames = [];
    if (currentSpread === 'one-card') positionNames = ["LA RISPOSTA"];
    else if (currentSpread === 'three-cards') positionNames = ["IL PASSATO", "IL PRESENTE", "IL FUTURO"];
    else if (currentSpread === 'celtic-cross') positionNames = ["1. SITUAZIONE", "2. OSTACOLO", "3. BASI", "4. PASSATO", "5. OBIETTIVO", "6. FUTURO", "7. TU", "8. ESTERNO", "9. SPERANZE", "10. ESITO"];

    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
        <div class="label" style="color:#888; margin-bottom:5px; font-size:0.75rem;">${positionNames[cardsDrawn] || ""}</div>
        ${revLabel}
        <img class="${visualClass}" src="${rawCard.image}" alt="${rawCard.name}">
        <div class="meaning-content">
            <h3>${rawCard.name}</h3>
            <p>${meaning}</p>
            <span class="reflection">${rawCard.reflection}</span>
        </div>
    `;

    const deckSlide = document.getElementById('deck-slide');
    container.insertBefore(slide, deckSlide);
    cardsDrawn++;
    updateStatus();

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
function hideScrollHint() { document.getElementById('scroll-hint').style.display = 'none'; }


// --- PARALLAX EFFECT 3D (Sottile) ---
document.addEventListener('mousemove', (e) => {
    const activeSlide = document.querySelector('.slide-active .card-visual');
    if (!activeSlide) return;

    const x = (window.innerWidth / 2 - e.pageX) / 25;
    const y = (window.innerHeight / 2 - e.pageY) / 25;

    activeSlide.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});
// Versione Mobile (Giroscopio simulato da tocco o base)
// Nota: Accedere al vero giroscopio richiede permessi HTTPS e click utente, 
// per ora usiamo un effetto base legato allo scroll del carosello che è già incluso nel CSS.

// --- SCREENSHOT ---
function takeScreenshot() {
    const element = document.getElementById('screen-reading');
    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = 'tarocchi-lettura.jpg';
        link.href = canvas.toDataURL();
        link.click();
    });
}
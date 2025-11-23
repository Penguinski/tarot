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
    } catch (e) { console.error("No JSON"); }
}
loadDeck();

// Mescolamento Reale (Fisher-Yates)
function shuffleDeck(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// --- UI MANAGERS ---
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

// --- LOGICA AVVIO E MESCOLA ---
function startReading() {
    userQuestion = document.getElementById('user-question').value;

    // 1. Mostra schermata di caricamento (Rito)
    showScreen('screen-shuffle');

    // 2. Dietro le quinte mescoliamo
    shuffledDeck = shuffleDeck([...deck]);
    cardsDrawn = 0;
    totalCardsNeeded = (currentSpread === 'three-cards') ? 3 : 1;

    const container = document.getElementById('carousel-container');
    container.innerHTML = '';

    // Aggiungi il mazzo iniziale
    addDeckSlide(container);

    // 3. Aspetta 2 secondi e poi vai al tavolo
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
        <div style="margin-top:20px; color:#666; font-size:0.8rem">TOCCA PER PESCARE</div>
    `;
    container.appendChild(div);
    // Assicuriamoci che sia centrato all'avvio
    setTimeout(() => div.scrollIntoView({ behavior: "auto", inline: "center" }), 100);
}

function revealNextCard() {
    if (cardsDrawn >= totalCardsNeeded) return;

    const container = document.getElementById('carousel-container');
    const card = shuffledDeck[cardsDrawn];

    const positionNames = currentSpread === 'three-cards'
        ? ["IL PASSATO", "IL PRESENTE", "IL FUTURO"]
        : ["LA RISPOSTA"];

    // Crea la slide della carta
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
        <div class="label" style="color:#888; margin-bottom:10px; font-size:0.7rem;">${positionNames[cardsDrawn]}</div>
        <img class="card-visual" src="${card.image}" alt="${card.name}">
        <div class="meaning-content">
            <h3>${card.name}</h3>
            <p>${card.modern_meaning}</p>
            <span class="reflection">${card.reflection}</span>
        </div>
    `;

    // Inserisci la carta PRIMA del mazzo
    const deckSlide = document.getElementById('deck-slide');
    container.insertBefore(slide, deckSlide);

    cardsDrawn++;
    updateStatus();

    // FOCUS SULLA CARTA APPENA PESCATA
    slide.scrollIntoView({ behavior: "smooth", inline: "center" });

    // Gestione classi visuali
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('slide-active'));
    slide.classList.add('slide-active');

    // LOGICA HINT: Se ci sono ancora carte da pescare, mostra la freccia
    if (cardsDrawn < totalCardsNeeded) {
        showScrollHint();
        // Togli focus visivo dal mazzo per invogliare a cercarlo
        deckSlide.classList.remove('slide-active');
    } else {
        // Se abbiamo finito, nascondi il mazzo definitivamente
        deckSlide.style.display = 'none';
        hideScrollHint();
    }
}

// Funzioni per la freccia suggerimento
function showScrollHint() {
    const hint = document.getElementById('scroll-hint');
    hint.style.display = 'block';
    // Nascondila dopo 4 secondi per non disturbare
    setTimeout(() => {
        hint.style.display = 'none';
    }, 4000);
}

function hideScrollHint() {
    document.getElementById('scroll-hint').style.display = 'none';
}

// Gestione dell'effetto "Focus" e spegnimento hint allo scroll manuale
document.getElementById('carousel-container').addEventListener('scroll', () => {
    hideScrollHint(); // Se l'utente scorre, ha capito: via la freccia!

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
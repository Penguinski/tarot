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

// --- UI MANAGERS ---
function selectCategory(btnElement, category) {
    userCategory = category;
    // Rimuovi 'selected' da tutti i bottoni
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    // Aggiungi a quello cliccato
    btnElement.classList.add('selected');
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goHome() { showScreen('screen-home'); }
function goToInput(type) { currentSpread = type; showScreen('screen-input'); }

// --- LOGICA LETTURA ---
function startReading() {
    userQuestion = document.getElementById('user-question').value;
    shuffledDeck = [...deck].sort(() => 0.5 - Math.random());
    cardsDrawn = 0;

    // Imposta quante carte servono
    totalCardsNeeded = (currentSpread === 'three-cards') ? 3 : 1;

    // Pulisci il carosello
    const container = document.getElementById('carousel-container');
    container.innerHTML = '';

    // Aggiungi il primo elemento: IL MAZZO COPERTO
    addDeckSlide(container);

    showScreen('screen-reading');
    updateStatus();
}

function updateStatus() {
    const text = cardsDrawn < totalCardsNeeded
        ? `PESCA LA CARTA ${cardsDrawn + 1} DI ${totalCardsNeeded}`
        : "LETTURA COMPLETATA";
    document.getElementById('reading-step').innerText = text;
}

// Crea la slide con il mazzo coperto
function addDeckSlide(container) {
    const div = document.createElement('div');
    div.className = 'slide slide-active'; // Parte attivo
    div.id = 'deck-slide';
    div.innerHTML = `
        <div class="card-back-pattern" onclick="revealNextCard()">
            ✦
        </div>
        <div style="margin-top:20px; color:#666; font-size:0.8rem">TOCCA PER PESCARE</div>
    `;
    container.appendChild(div);

    // Scrolla subito su di lui
    div.scrollIntoView({ behavior: "smooth", inline: "center" });
}

// Quando clicchi sul mazzo
function revealNextCard() {
    if (cardsDrawn >= totalCardsNeeded) return;

    const container = document.getElementById('carousel-container');

    // 1. Rimuovi il mazzo (o spostalo in fondo? Meglio sostituirlo per la UX clean)
    // Se vuoi vedere la carta "uscire", aggiungiamo la carta DOPO il mazzo, e poi spostiamo il mazzo in fondo.

    const card = shuffledDeck[cardsDrawn];
    const positionNames = currentSpread === 'three-cards'
        ? ["PASSATO", "PRESENTE", "FUTURO"]
        : ["RISPOSTA"];

    // Crea la slide della carta
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
        <div class="label" style="color:#666; margin-bottom:10px; font-size:0.8rem;">${positionNames[cardsDrawn]}</div>
        <img class="card-visual" src="${card.image}" alt="${card.name}">
        <div class="meaning-content">
            <h3>${card.name}</h3>
            <p>${card.modern_meaning}</p>
            <span class="reflection">${card.reflection}</span>
        </div>
    `;

    // Inserisci la carta PRIMA del mazzo (che è l'ultimo elemento)
    const deckSlide = document.getElementById('deck-slide');
    container.insertBefore(slide, deckSlide);

    cardsDrawn++;
    updateStatus();

    // Focus sulla nuova carta
    slide.scrollIntoView({ behavior: "smooth", inline: "center" });

    // Animazione di attivazione classe
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('slide-active'));
    slide.classList.add('slide-active');

    // Se abbiamo finito, nascondi il mazzo
    if (cardsDrawn >= totalCardsNeeded) {
        deckSlide.style.display = 'none';
    } else {
        // Se mancano carte, lascia il mazzo lì a destra, così l'utente scorre per pescare ancora
        deckSlide.scrollIntoView({ behavior: "smooth", inline: "center" }); // Ops, no, rimaniamo sulla carta appena pescata per leggerla!

        // Logica migliorata: Rimani sulla carta letta. L'utente vedrà "spuntare" il mazzo a destra e scorrerà quando è pronto.
        setTimeout(() => {
            // Piccolo trucco per evidenziare che c'è altro a destra
            deckSlide.classList.remove('slide-active');
        }, 100);
    }
}

// Gestione dell'effetto "Focus" durante lo scroll manuale
document.getElementById('carousel-container').addEventListener('scroll', () => {
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
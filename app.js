let deck = [];
let currentSpread = '';
let userQuestion = '';
let userCategory = 'Generale';

// Variabili di stato per la lettura
let shuffledDeck = [];     // Il mazzo mescolato per questa sessione
let cardsDrawn = 0;        // Quante ne ho pescate finora
let totalCardsNeeded = 0;  // Quante ne devo pescare in totale (1 o 3)
let spreadPositions = [];  // Le etichette (es. "Passato", "Presente")

async function loadDeck() {
    try {
        const response = await fetch('tarot_data.json');
        deck = await response.json();
    } catch (e) { alert("Errore caricamento."); }
}
loadDeck();

// --- NAVIGAZIONE ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    showScreen('screen-home');
}

function goToInput(spreadType) {
    currentSpread = spreadType;
    showScreen('screen-input');
}

// --- AVVIO SESSIONE ---
function startReading() {
    userQuestion = document.getElementById('user-question').value;
    userCategory = document.getElementById('user-category').value;

    // 1. Resetta variabili
    cardsDrawn = 0;
    shuffledDeck = [...deck].sort(() => 0.5 - Math.random()); // Mescola
    document.getElementById('cards-carousel').innerHTML = ""; // Pulisci tavolo

    // 2. Imposta regole in base al tipo di lettura
    if (currentSpread === 'one-card') {
        totalCardsNeeded = 1;
        spreadPositions = ["La Risposta"];
    } else if (currentSpread === 'three-cards') {
        totalCardsNeeded = 3;
        spreadPositions = ["Il Passato / L'Origine", "Il Presente / L'Azione", "Il Futuro / L'Esito"];
    }

    // 3. Prepara interfaccia
    document.getElementById('deck-container').style.display = 'block'; // Mostra mazzo
    document.getElementById('cards-carousel').style.display = 'none'; // Nascondi carte
    document.getElementById('reading-status').innerText = `Pesca la carta 1 di ${totalCardsNeeded}`;

    showScreen('screen-reading');
}

// --- CUORE DEL RITUALE: PESCA UNA CARTA ALLA VOLTA ---
function drawNextCard() {
    if (cardsDrawn >= totalCardsNeeded) return; // Finito

    // 1. Dati della carta
    const card = shuffledDeck[cardsDrawn];
    const positionName = spreadPositions[cardsDrawn];

    // 2. Nascondi mazzo se è la prima carta, o mantienilo se serve spazio?
    // Strategia: Quando peschi, il carosello appare. Se devi pescarne altre,
    // il mazzo rimane accessibile o aggiungiamo un bottone "pesca ancora"?
    // PER SEMPLICITÀ: Nascondiamo il mazzo e lo facciamo riapparire in fondo al carosello? 
    // NO, MEGLIO: Quando clicchi il mazzo, aggiungiamo la carta al carosello e scrolliamo lì.

    const carousel = document.getElementById('cards-carousel');
    carousel.style.display = 'flex'; // Assicurati che sia visibile
    document.getElementById('deck-container').style.display = 'none'; // Nascondi mazzo temporaneamente

    // 3. Crea HTML Carta
    const cardHTML = `
        <div class="tarot-card-display">
            <span class="position-label">✦ ${positionName}</span>
            <h2 class="card-name">${card.name}</h2>
            <img class="card-img-result" src="${card.image}" alt="${card.name}">
            <div class="meaning-text">
                ${card.modern_meaning}
                <br><br>
                <em style="color:#c5a059; font-size:0.9em">"${card.reflection}"</em>
            </div>
            ${cardsDrawn < totalCardsNeeded - 1 ?
            `<button onclick="prepareNextDraw()" style="margin-top:20px;">Pesca la prossima ➝</button>` :
            `<div style="margin-top:20px; color:#666; font-size:0.8em">Lettura Completata</div>`
        }
        </div>
    `;

    // 4. Inserisci e Scrolla
    carousel.insertAdjacentHTML('beforeend', cardHTML);

    // Incrementa contatore
    cardsDrawn++;

    // Scrolla verso la nuova carta
    const newCard = carousel.lastElementChild;
    setTimeout(() => {
        newCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 100);
}

// Funzione per tornare a mostrare il mazzo per la prossima carta
function prepareNextDraw() {
    document.getElementById('deck-container').style.display = 'block';
    document.getElementById('cards-carousel').style.display = 'none';
    document.getElementById('reading-status').innerText = `Pesca la carta ${cardsDrawn + 1} di ${totalCardsNeeded}`;
}
let deck = [];
let currentSpread = '';
let userQuestion = '';
let userCategory = 'Generale';

// Carica il DB all'avvio
async function loadDeck() {
    try {
        const response = await fetch('tarot_data.json');
        deck = await response.json();
        console.log("Mazzo caricato:", deck.length);
    } catch (e) {
        alert("Errore caricamento carte. Ricarica la pagina.");
    }
}
loadDeck();

// --- NAVIGAZIONE ---

function showScreen(screenId) {
    // Nasconde tutte le schermate
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    // Mostra quella richiesta
    document.getElementById(screenId).classList.add('active');
}

function goHome() {
    showScreen('screen-home');
    // Resetta i campi
    document.getElementById('user-question').value = "";
}

function goToInput(spreadType) {
    currentSpread = spreadType;
    showScreen('screen-input');
}

// --- FASE 1: MESCOLARE ---
function startShuffle() {
    // Salva i dati inseriti dall'utente
    userQuestion = document.getElementById('user-question').value;
    userCategory = document.getElementById('user-category').value;

    // Mostra schermata shuffle
    showScreen('screen-shuffle');

    // Finto ritardo di 2 secondi per "mescolare"
    setTimeout(() => {
        showScreen('screen-deck');
    }, 2000);
}

// --- FASE 2: PESCARE E RIVELARE ---
function revealCard() {
    if (deck.length === 0) return;

    // Pesca casuale
    const r = Math.floor(Math.random() * deck.length);
    const card = deck[r];

    // Popola i dati nella schermata finale
    document.getElementById('display-question').innerText =
        userQuestion ? `Domanda: "${userQuestion}" (${userCategory})` : `Lettura ${userCategory}`;

    document.getElementById('res-card-name').innerText = card.name;
    document.getElementById('res-card-img').src = card.image;

    // Qui in futuro potremo usare l'AI per personalizzare il testo in base alla domanda
    // Per ora usiamo il significato standard
    document.getElementById('res-meaning').innerText = card.modern_meaning;
    document.getElementById('res-reflection').innerText = card.reflection;

    // Mostra risultato
    showScreen('screen-result');
    window.scrollTo(0, 0);
}
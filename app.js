let deck = [];

// 1. Appena l'app si apre, carica i dati dal file JSON
async function loadDeck() {
    try {
        const response = await fetch('tarot_data.json');
        deck = await response.json();
        console.log("Mazzo caricato:", deck.length, "carte");
    } catch (error) {
        console.error("Errore nel caricamento del mazzo:", error);
        alert("Impossibile caricare le carte.");
    }
}

// 2. Funzione per pescare una carta
function drawOneCard() {
    if (deck.length === 0) return;

    // Scegli un indice casuale
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];

    // 3. Aggiorna l'HTML con i dati della carta
    document.getElementById('landing').style.display = 'none'; // Nasconde l'intro
    const display = document.getElementById('card-display');
    display.style.display = 'block'; // Mostra la carta

    // Inserisce i testi
    document.getElementById('card-name').innerText = card.name;
    document.getElementById('card-image').alt = card.name;
    // Nota: L'immagine non si vedrà ancora, apparirà un box grigio per ora

    document.getElementById('card-keywords').innerText = card.keywords.join(" • ");
    document.getElementById('modern-meaning').innerText = card.modern_meaning;
    document.getElementById('reflection').innerText = card.reflection;

    // Scrolla in alto
    window.scrollTo(0, 0);
}

// Avvia il caricamento
loadDeck();

let currentIntent = "Generale";

function setIntent(intent) {
    currentIntent = intent;
    // Cambiamo il testo nella schermata successiva
    document.getElementById('section-meaning-title').innerText = "Significato per: " + intent;

    // Pesca la carta
    drawOneCard();
}
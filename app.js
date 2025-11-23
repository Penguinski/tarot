let deck = [];

// 1. Carica i dati
async function loadDeck() {
    try {
        const response = await fetch('tarot_data.json');
        if (!response.ok) throw new Error("File JSON non trovato");

        deck = await response.json();
        console.log("Mazzo caricato:", deck.length, "carte");
    } catch (error) {
        console.error("Errore:", error);
        alert("Errore nel caricamento delle carte. Ricarica la pagina.");
    }
}

// 2. Pesca carta
function drawOneCard() {
    // PROTEZIONE: Se il mazzo è vuoto, avvisiamo invece di non fare nulla
    if (deck.length === 0) {
        alert("Sto ancora mescolando il mazzo... Riprova tra un secondo!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck[randomIndex];

    // Nascondi intro e mostra risultato
    document.getElementById('landing').style.display = 'none';
    const display = document.getElementById('card-display');
    display.style.display = 'block';

    // Aggiorna i testi
    document.getElementById('card-name').innerText = card.name;

    // --- QUESTA È LA RIGA CHE MANCAVA PER LE IMMAGINI ---
    document.getElementById('card-image').src = card.image;
    document.getElementById('card-image').alt = card.name;
    // ----------------------------------------------------

    document.getElementById('card-keywords').innerText = card.keywords.join(" • ");
    document.getElementById('modern-meaning').innerText = card.modern_meaning;
    document.getElementById('reflection').innerText = card.reflection;

    window.scrollTo(0, 0);
}

// Avvia il caricamento subito
loadDeck();

// Gestione Intento
let currentIntent = "Generale";

function setIntent(intent) {
    currentIntent = intent;
    document.getElementById('section-meaning-title').innerText = "Significato per: " + intent;
    drawOneCard();
}
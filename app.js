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
    if (deck.length < 3) return; // Sicurezza

    // 1. Prepara l'intestazione
    const questionText = userQuestion ? `"${userQuestion}"` : "Lettura Intuitiva";
    document.getElementById('display-question').innerText = `${questionText} (${userCategory})`;

    // 2. Pulisci il contenitore vecchio
    const container = document.getElementById('cards-container');
    container.innerHTML = ""; // Svuota tutto
    container.className = "spread-container"; // Resetta classi

    // 3. Logica in base al metodo scelto
    let drawnCards = [];

    // MESCOLA IL MAZZO (Shuffle algorithm)
    // Creiamo una copia del mazzo e la mescoliamo per non rovinare l'originale
    let shuffledDeck = [...deck].sort(() => 0.5 - Math.random());

    if (currentSpread === 'one-card') {
        // Pesca 1 carta
        drawnCards = [{
            data: shuffledDeck[0],
            position: "Risposta"
        }];

    } else if (currentSpread === 'three-cards') { // ORA FUNZIONA!
        // Aggiungi una classe CSS specifica per gestire lo stile a 3 colonne
        container.classList.add('spread-mode-3');

        // Pesca 3 carte
        drawnCards = [
            { data: shuffledDeck[0], position: "Passato / Origine" },
            { data: shuffledDeck[1], position: "Presente / Azione" },
            { data: shuffledDeck[2], position: "Futuro / Esito" }
        ];
    }

    // 4. Genera l'HTML per ogni carta pescata
    drawnCards.forEach(item => {
        const card = item.data;

        // Creiamo il blocco HTML per la carta
        const cardHTML = `
            <div class="card-slot">
                <span class="position-label">${item.position}</span>
                <h3 class="card-title">${card.name}</h3>
                <img class="card-img-result" src="${card.image}" alt="${card.name}">
                <div class="card-desc">
                    <strong>Significato:</strong> ${card.modern_meaning}<br><br>
                    <em style="color:#d4af37">Riflessione: ${card.reflection}</em>
                </div>
            </div>
        `;

        // Inseriamo il blocco nel contenitore
        container.innerHTML += cardHTML;
    });

    // Mostra risultato
    showScreen('screen-result');
    window.scrollTo(0, 0);
}
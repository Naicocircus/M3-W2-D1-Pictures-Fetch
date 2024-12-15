// Attende che il DOM sia completamente caricato prima di eseguire il codice
document.addEventListener('DOMContentLoaded', function() {
    // Definizione delle costanti principali
    // API key per accedere al servizio Pexels
    const apiKey = 'B0J6R6uBnRL2XUaNb6xS2zWflzItGHR5OXCGwv6jGRBJPhOgBhB5uqYq';
    // Numero massimo di card da visualizzare
    const maxCards = 18;

    // Creazione della sidebar per i filtri
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    
    // Verifica l'esistenza dell'elemento main, se non esiste lo crea
    if (!document.querySelector('main')) {
        const main = document.createElement('main');
        document.body.appendChild(main);
    }
    
    // Array delle categorie disponibili per il filtro
    const categories = ['Nature', 'People', 'Tigers', 'Ocean'];
    // Creazione dei bottoni per ogni categoria
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        // Aggiunge event listener per ogni bottone che chiama fetchImages con la categoria selezionata
        button.addEventListener('click', () => fetchImages(category.toLowerCase()));
        sidebar.appendChild(button);
    });
    
    // Inserisce la sidebar prima dell'elemento main nel DOM
    document.body.insertBefore(sidebar, document.querySelector('main'));

    // Funzione asincrona per recuperare le immagini dall'API di Pexels
    async function fetchImages(query) {
        try {
            // Effettua la chiamata API a Pexels con la query e il numero massimo di immagini
            const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${maxCards}`, {
                headers: {
                    'Authorization': apiKey
                }
            });
            
            // Verifica se la risposta è valida
            if (!response.ok) {
                throw new Error('Errore nella risposta API');
            }
            
            // Converte la risposta in JSON
            const data = await response.json();
            const mainContainer = document.querySelector('main');
            // Pulisce il contenitore principale
            mainContainer.innerHTML = '';

            // Verifica se ci sono foto nei risultati
            if (data.photos && data.photos.length > 0) {
                // Itera su ogni foto per creare le card
                data.photos.forEach(photo => {
                    // Crea il container della card
                    const card = document.createElement('div');
                    card.className = 'card';
                    
                    // Crea l'elemento immagine
                    const img = document.createElement('img');
                    img.src = photo.src.medium;
                    img.alt = photo.alt || 'Pexels Image';
                    
                    // Crea il paragrafo con il nome del fotografo
                    const photographer = document.createElement('p');
                    photographer.textContent = `Foto di: ${photo.photographer}`;
                    
                    // Assembla la card e la aggiunge al container principale
                    card.appendChild(img);
                    card.appendChild(photographer);
                    mainContainer.appendChild(card);
                });
            } else {
                // Messaggio se non vengono trovate immagini
                mainContainer.innerHTML = '<p>Nessuna immagine trovata.</p>';
            }

        } catch (error) {
            // Gestione degli errori durante il caricamento
            console.error('Errore nel caricamento delle immagini:', error);
            const mainContainer = document.querySelector('main');
            mainContainer.innerHTML = '<p>Si è verificato un errore nel caricamento delle immagini.</p>';
        }
    }

    // Carica automaticamente le immagini della natura all'avvio dell'applicazione
    fetchImages('nature');
});

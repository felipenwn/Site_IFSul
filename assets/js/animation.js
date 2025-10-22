document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card-container');

    cards.forEach(card => {
        // 1. O 'ouvinte' original para virar o card continua o mesmo
        card.addEventListener('click', () => {
            const cardInner = card.querySelector('.card-inner');
            cardInner.classList.toggle('is-flipped');
        });

        // 2. Adicionamos um 'ouvinte' específico para o link de download
        const downloadLink = card.querySelector('.download-link');

        // Verifica se o link existe dentro do card antes de adicionar o listener
        if (downloadLink) {
            downloadLink.addEventListener('click', (event) => {
                // event.stopPropagation() impede que o clique "borbulhe" para o card
                event.stopPropagation();
            });
        }
    });
});
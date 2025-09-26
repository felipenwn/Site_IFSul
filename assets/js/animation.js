document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card-container');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const cardInner = card.querySelector('.card-inner');
            cardInner.classList.toggle('is-flipped');
        });
    });
});
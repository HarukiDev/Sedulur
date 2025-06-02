const cards = document.querySelectorAll(".card");
const carouselTrack = document.querySelector(".carousel-track");
let currentIndex = 0;
let isAnimating = false;
let autoplayIntervalId;

let isDragging = false;
let startX = 0;
let dragThreshold = 50;

function onCenterCardHover() {
    stopAutoplay();
}

function onCenterCardLeave() {
    startAutoplay();
}

function updateCarousel(newIndex) {
    if (isAnimating) return;
    isAnimating = true;

    const currentCenterCard = document.querySelector(".card.center");
    if (currentCenterCard) {
        currentCenterCard.removeEventListener('mouseenter', onCenterCardHover);
        currentCenterCard.removeEventListener('mouseleave', onCenterCardLeave);
    }

    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card, i) => {
        const offset = (i - currentIndex + cards.length) % cards.length;

        card.classList.remove("center", "left-1", "right-1", "hidden");

        if (offset === 0) {
            card.classList.add("center");
            card.addEventListener('mouseenter', onCenterCardHover);
            card.addEventListener('mouseleave', onCenterCardLeave);
        } else if (offset === 1) {
            card.classList.add("right-1");
        } else if (offset === cards.length - 1) {
            card.classList.add("left-1");
        } else {
            card.classList.add("hidden");
        }
    });

    setTimeout(() => {
        isAnimating = false;
    }, 800); 
}

function startAutoplay() {
    stopAutoplay();
    autoplayIntervalId = setInterval(() => {
        updateCarousel(currentIndex + 1);
    }, 3000);
}

function stopAutoplay() {
    clearInterval(autoplayIntervalId);
}

function onDragStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    stopAutoplay(); 
    if (carouselTrack) {
        carouselTrack.style.cursor = 'grabbing';
    }
}

function onDragging(e) {
    if (!isDragging) return;
    if (e.type === 'touchmove') {
        e.preventDefault();
    }
}

function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    if (carouselTrack) {
        carouselTrack.style.cursor = 'grab';
    }

    const endX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : startX);
    const dragDistance = endX - startX;

    if (dragDistance > dragThreshold) {
        updateCarousel(currentIndex - 1); // Geser ke kanan -> kartu sebelumnya
    } else if (dragDistance < -dragThreshold) {
        updateCarousel(currentIndex + 1); // Geser ke kiri -> kartu berikutnya
    }

    startAutoplay(); 
}

if (carouselTrack) {
    // Event untuk Mouse
    carouselTrack.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragging);
    document.addEventListener('mouseup', onDragEnd);
    carouselTrack.addEventListener('mouseleave', (e) => {
        if (isDragging) onDragEnd(e);
    });

    // Event untuk Sentuhan (Touch)
    carouselTrack.addEventListener('touchstart', onDragStart);
    carouselTrack.addEventListener('touchmove', onDragging);
    carouselTrack.addEventListener('touchend', onDragEnd);
    carouselTrack.addEventListener('touchcancel', onDragEnd);
}

updateCarousel(0); 
startAutoplay();   
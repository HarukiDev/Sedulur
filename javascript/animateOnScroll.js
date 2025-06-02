document.addEventListener('DOMContentLoaded', () => {
    const aosElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Pemicu saat 10% dari elemen terlihat di viewport
    };

    const aosObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            } else {
                entry.target.classList.remove('aos-animate');
            }
        });
    }, observerOptions);

    aosElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('aos-animate');
        } else {
            aosObserver.observe(element);
        }
        aosObserver.observe(element);
    });
});
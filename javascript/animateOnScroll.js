document.addEventListener('DOMContentLoaded', () => {
    const aosElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('aos-animate');
            } else {
                el.classList.remove('aos-animate');
            }
        });
    }, observerOptions);

    aosElements.forEach(el => {
        observer.observe(el);
    });
});
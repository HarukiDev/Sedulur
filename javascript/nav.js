document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero'); 
    let heroHeight = heroSection.offsetHeight; 

    function checkNavbarSticky() {
        // Mendapatkan posisi bawah hero section
        const heroBottom = heroSection.getBoundingClientRect().bottom;

        const scrollThreshold = 100; // Muncul setelah scroll 100px dari atas

        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }

    window.addEventListener('scroll', checkNavbarSticky);

    checkNavbarSticky();

    window.addEventListener('resize', () => {
        heroHeight = heroSection.offsetHeight;
        checkNavbarSticky();
    });
});
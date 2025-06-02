document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNavMobile = document.querySelector('.navbar-nav-mobile');

    let heroHeight = heroSection.offsetHeight; 

    function checkNavbarSticky() {
        const scrollThreshold = 100; 

        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('sticky');

            if (window.innerWidth <= 768) {
                navbarToggler.style.display = 'block';
            }
        } else {
            navbar.classList.remove('sticky');
            if (window.innerWidth <= 768) {
                navbarToggler.style.display = 'none';
                navbarToggler.classList.remove('open');
                navbarNavMobile.classList.remove('open');
            }
        }
    }

    // Toggle mobile navigation
    navbarToggler.addEventListener('click', () => {
        navbarToggler.classList.toggle('open');
        navbarNavMobile.classList.toggle('open');
    });

    window.addEventListener('scroll', checkNavbarSticky);

    checkNavbarSticky();

    window.addEventListener('resize', () => {
        heroHeight = heroSection.offsetHeight;
        checkNavbarSticky(); 
        if (window.innerWidth > 768) {
            navbarToggler.classList.remove('open');
            navbarNavMobile.classList.remove('open');
            navbarToggler.style.display = 'none'; 
        }
    });
});
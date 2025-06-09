document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarNavMobile = document.querySelector(".navbar-nav-mobile");

    function checkNavbarSticky() {
        const scrollThreshold = 50; // Tingkatkan ambang batas untuk stabilitas
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add("sticky");
            if (window.innerWidth <= 960) {
                navbarToggler.style.display = "block";
                navbarNavMobile.style.top = navbar.offsetHeight + "px";
            }
        } else {
            navbar.classList.remove("sticky");
            if (window.innerWidth <= 960) {
                navbarToggler.style.display = "none";
                navbarToggler.classList.remove("open");
                navbarNavMobile.classList.remove("open");
                navbarNavMobile.style.maxHeight = "0";
            }
        }
    }

    navbarToggler.addEventListener("click", () => {
        navbarToggler.classList.toggle("open");
        navbarNavMobile.classList.toggle("open");
        if (navbarNavMobile.classList.contains("open")) {
            navbarNavMobile.style.maxHeight = "300px";
        } else {
            navbarNavMobile.style.maxHeight = "0";
        }
    });

    window.addEventListener("scroll", checkNavbarSticky);
    window.addEventListener("resize", () => {
        checkNavbarSticky();
        if (window.innerWidth > 960) {
            navbarToggler.classList.remove("open");
            navbarNavMobile.classList.remove("open");
            navbarToggler.style.display = "none";
            navbarNavMobile.style.maxHeight = "0";
        } else {
            navbarNavMobile.style.top = navbar.offsetHeight + "px";
        }
    });

    checkNavbarSticky();

    // Nav Active on Scroll
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll('a[href^="#"]');

    const navObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute("id");
                const linkMatches = document.querySelectorAll(`a[href="#${id}"]`);

                if (entry.isIntersecting) {
                    navLinks.forEach((a) => a.classList.remove("active"));
                    linkMatches.forEach((link) => link.classList.add("active"));
                }
            });
        },
        { threshold: 0.4 }
    );

    sections.forEach((section) => {
        navObserver.observe(section);
    });
});
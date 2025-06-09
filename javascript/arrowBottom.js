(function () {
    const scrollDownButton = document.querySelector(".scroll-down-button");
    const targetSection = document.querySelector(".contact-section"); 

    if (scrollDownButton && targetSection) {
        scrollDownButton.addEventListener("click", () => {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    } else if (scrollDownButton) {
        scrollDownButton.addEventListener("click", () => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth"
            });
        });
        console.warn("Target section for scroll-down-button not found. Defaulting to scroll to bottom.");
    }
})();
(function () {
    let navigationButtons = {
        previous: null,
        next: null,
    };

    const cardContainer = document.querySelector(".products-cards-wrapper");
    const backgroundContainer = document.querySelector(".products-bg");
    const infoContainer = document.querySelector(".products-info-wrapper");
    const buttonsContainer = document.querySelector(".products-buttons-container");
    const productsSection = document.querySelector("#products");
    const infoList = document.querySelector(".products-infoList");
    const productsInfo = document.querySelector(".products-info");

    let isDraggingActive = false;
    let initialXPosition = 0;
    const dragThreshold = 50;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animationFrameId = null;
    let activeButton = buttonsContainer?.querySelector(".text-button.active");
    let lastWindowWidth = window.innerWidth;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    let observer = null;
    function setupButtonObserver() {
        observer = new MutationObserver(() => {
            const prevButton = document.querySelector(".products-btn.products-btn-left");
            const nextButton = document.querySelector(".products-btn.products-btn-right");
            if (prevButton && nextButton && (!navigationButtons.previous || !navigationButtons.next)) {
                navigationButtons.previous = prevButton;
                navigationButtons.next = nextButton;
                initializeButtons();
                setupDragEvents();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    function initializeButtons() {
        if (!navigationButtons.previous) {
            console.error("Tombol kiri (.products-btn.products-btn-left) tidak ditemukan di DOM.");
        }
        if (!navigationButtons.next) {
            console.error("Tombol kanan (.products-btn.products-btn-right) tidak ditemukan di DOM.");
        }

        if (window.innerWidth <= 768) {
            if (navigationButtons.previous) {
                navigationButtons.previous.style.display = "block";
                navigationButtons.previous.style.visibility = "visible";
            }
            if (navigationButtons.next) {
                navigationButtons.next.style.display = "block";
                navigationButtons.next.style.visibility = "visible";
            }
        }

        if (navigationButtons.previous) {
            const oldPrevHandler = navigationButtons.previous.__clickHandler;
            if (oldPrevHandler) {
                navigationButtons.previous.removeEventListener("click", oldPrevHandler);
            }
            const newPrevHandler = () => {
                slideCards("left");
            };
            navigationButtons.previous.addEventListener("click", newPrevHandler);
            navigationButtons.previous.__clickHandler = newPrevHandler;
            navigationButtons.previous.disabled = false;
        }
        if (navigationButtons.next) {
            const oldNextHandler = navigationButtons.next.__clickHandler;
            if (oldNextHandler) {
                navigationButtons.next.removeEventListener("click", oldNextHandler);
            }
            const newNextHandler = () => {
                slideCards("right");
            };
            navigationButtons.next.addEventListener("click", newNextHandler);
            navigationButtons.next.__clickHandler = newNextHandler;
            navigationButtons.next.disabled = false;
        }
    }

    function setupDragEvents() {
        cardContainer.removeEventListener("mousedown", startDrag);
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", endDrag);
        cardContainer.removeEventListener("mouseleave", endDrag);
        cardContainer.removeEventListener("touchstart", startDrag);
        cardContainer.removeEventListener("touchmove", handleDrag);
        cardContainer.removeEventListener("touchend", endDrag);
        cardContainer.removeEventListener("touchcancel", endDrag);

        if (window.innerWidth <= 768) {
            cardContainer.addEventListener("mousedown", startDrag);
            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", endDrag);
            cardContainer.addEventListener("mouseleave", (e) => {
                if (isDraggingActive) endDrag(e);
            });

            cardContainer.addEventListener("touchstart", startDrag, { passive: false });
            cardContainer.addEventListener("touchmove", handleDrag, { passive: false });
            cardContainer.addEventListener("touchend", endDrag);
            cardContainer.addEventListener("touchcancel", endDrag);
        }

        navigationButtons.previous = document.querySelector(".products-btn.products-btn-left");
        navigationButtons.next = document.querySelector(".products-btn.products-btn-right");

        if (!navigationButtons.previous) {
            console.error("Tombol kiri (.products-btn.products-btn-left) tidak ditemukan di DOM.");
        }
        if (!navigationButtons.next) {
            console.error("Tombol kanan (.products-btn.products-btn-right) tidak ditemukan di DOM.");
        }

        if (navigationButtons.previous) {
            navigationButtons.previous.disabled = false;
            if (window.innerWidth <= 768) {
                navigationButtons.previous.style.display = "block";
                navigationButtons.previous.style.visibility = "visible";
            } else {
                 navigationButtons.previous.style.removeProperty("display");
                 navigationButtons.previous.style.removeProperty("visibility");
            }
        }
        if (navigationButtons.next) {
            navigationButtons.next.disabled = false;
            if (window.innerWidth <= 768) {
                navigationButtons.next.style.display = "block";
                navigationButtons.next.style.visibility = "visible";
            } else {
                navigationButtons.next.style.removeProperty("display");
                navigationButtons.next.style.removeProperty("visibility");
            }
        }

        updateButtonState();
    }

    const debouncedSetupDragEvents = debounce(() => {
        setupDragEvents();
        lastWindowWidth = window.innerWidth;
    }, 100);

    setupDragEvents();
    window.addEventListener("resize", debouncedSetupDragEvents);
    window.addEventListener("orientationchange", debouncedSetupDragEvents);

    function startDrag(e) {
        e.preventDefault();
        isDraggingActive = true;
        initialXPosition = e.clientX || e.touches[0].clientX;
        cardContainer.classList.add("dragging");
    }

    function handleDrag(e) {
        if (!isDraggingActive || window.innerWidth > 768) return;
        if (e.type === "touchmove") e.preventDefault();
    }

    function endDrag(e) {
        if (!isDraggingActive || window.innerWidth > 768) return;
        isDraggingActive = false;
        cardContainer.classList.remove("dragging");
        const finalX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : initialXPosition);
        const dragDistance = finalX - initialXPosition;
        if (Math.abs(dragDistance) > dragThreshold) {
            if (dragDistance > 0) {
                slideCards("left");
            } else {
                slideCards("right");
            }
        }
    }

    function slideCards(direction) {
        const currentCard = cardContainer.querySelector(".current-card");
        const previousCard = cardContainer.querySelector(".previous-card");
        const nextCard = cardContainer.querySelector(".next-card");
        const currentBackground = backgroundContainer.querySelector(".current-image");
        const previousBackground = backgroundContainer.querySelector(".previous-image");
        const nextBackground = backgroundContainer.querySelector(".next-image");

        if (!currentCard || !previousCard || !nextCard || !currentBackground || !previousBackground || !nextBackground) {
            console.error("Required elements missing in slideCards (cards/backgrounds)");
            return;
        }

        if (navigationButtons.previous) navigationButtons.previous.disabled = true;
        if (navigationButtons.next) navigationButtons.next.disabled = true;

        updateInfo(direction);
        updateCardClasses(direction);

        // Reset top/left for desktop after slide for fresh animation
        if (window.innerWidth > 768 && activeButton) {
            activeButton.style.removeProperty("left");
            activeButton.style.removeProperty("top");
            currentX = 0; // Reset currentX for next animation cycle
            currentY = 0; // Reset currentY for next animation cycle
        }


        setTimeout(() => {
            updateButtonState();
            if (navigationButtons.previous) navigationButtons.previous.disabled = false;
            if (navigationButtons.next) navigationButtons.next.disabled = false;
        }, 400);
    }

    function updateCardClasses(direction) {
        const currentCard = cardContainer.querySelector(".current-card");
        const previousCard = cardContainer.querySelector(".previous-card");
        const nextCard = cardContainer.querySelector(".next-card");
        const currentBackground = backgroundContainer.querySelector(".current-image");
        const previousBackground = backgroundContainer.querySelector(".previous-image");
        const nextBackground = backgroundContainer.querySelector(".next-image");

        if (!currentCard || !previousCard || !nextCard || !currentBackground || !previousBackground || !nextBackground) {
            console.error("Missing card/background elements in updateCardClasses.");
            return;
        }

        currentCard.classList.remove("current-card");
        previousCard.classList.remove("previous-card");
        nextCard.classList.remove("next-card");
        currentBackground.classList.remove("current-image");
        previousBackground.classList.remove("previous-image");
        nextBackground.classList.remove("next-image");

        if (direction === "right") {
            currentCard.classList.add("previous-card");
            previousCard.classList.add("next-card");
            nextCard.classList.add("current-card");
            currentBackground.classList.add("previous-image");
            previousBackground.classList.add("next-image");
            nextBackground.classList.add("current-image");
        } else if (direction === "left") {
            currentCard.classList.add("next-card");
            nextCard.classList.add("previous-card");
            previousCard.classList.add("current-card");
            currentBackground.classList.add("next-image");
            previousBackground.classList.add("current-image");
            nextBackground.classList.add("previous-image");
        }
    }


    function updateInfo(direction) {
        const currentInfo = infoContainer.querySelector(".current-info");
        const previousInfo = infoContainer.querySelector(".previous-info");
        const nextInfo = infoContainer.querySelector(".next-info");

        if (!currentInfo || !previousInfo || !nextInfo) {
            console.error("Required info elements missing in updateInfo");
            return;
        }

        const currentTexts = currentInfo.querySelectorAll(".text");
        currentTexts.forEach((text, index) => {
            text.style.transition = `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`;
            text.style.opacity = "0";
            text.style.transform = "translateY(-120px) translateZ(2rem)";
        });

        setTimeout(() => {
            updateInfoClasses(direction);
            const newInfo = infoContainer.querySelector(".current-info");
            if (newInfo) {
                const newTexts = newInfo.querySelectorAll(".text");
                newTexts.forEach((text, index) => {
                    text.style.transition = `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`;
                    text.style.opacity = "1";
                    text.style.transform = "translateY(0) translateZ(2rem)";
                });
            } else {
                console.error("New current info not found after updateInfoClasses.");
            }
        }, 400);

        function updateInfoClasses() {
            currentInfo.classList.remove("current-info");
            previousInfo.classList.remove("previous-info");
            nextInfo.classList.remove("next-info");

            if (direction === "right") {
                currentInfo.classList.add("previous-info");
                nextInfo.classList.add("current-info");
                previousInfo.classList.add("next-info");
            } else if (direction === "left") {
                currentInfo.classList.add("next-info");
                nextInfo.classList.add("previous-info");
                previousInfo.classList.add("current-info");
            }
        }
    }

    function updateButtonState() {
        const allButtons = buttonsContainer.querySelectorAll(".text-button");
        allButtons.forEach(button => {
            button.classList.remove("active");
            button.style.opacity = "0";
            button.style.display = "none";
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        });

        const currentInfo = infoContainer.querySelector(".current-info");
        const currentInfoId = currentInfo?.getAttribute("data-info-id");
        if (!currentInfoId) {
            console.error("Tidak ada current-info atau data-info-id di updateButtonState.");
            return;
        }

        let foundActiveButton = false;
        const buttons = buttonsContainer.querySelectorAll(".text-button");
        buttons.forEach(button => {
            const buttonId = button.getAttribute("data-button-id");
            if (buttonId === currentInfoId) {
                button.classList.add("active");
                button.style.opacity = "1";
                if (window.innerWidth <= 768) {
                    button.style.display = "flex";
                    button.style.position = "relative";
                    // Reset top/left for mobile
                    button.style.removeProperty("left");
                    button.style.removeProperty("top");
                } else {
                    button.style.display = "none";
                    button.style.position = "absolute";
                    // Reset top/left for desktop (will be set by animateButton)
                    button.style.removeProperty("left");
                    button.style.removeProperty("top");
                }
                foundActiveButton = true;
                activeButton = button;
            }
        });

        if (!foundActiveButton) {
            console.warn("Tidak ada tombol yang cocok dengan currentInfoId:", currentInfoId);
        }

        if (activeButton && window.innerWidth > 768) {
            // No need to set currentX/Y here if they are reset in slideCards
            // currentX = parseFloat(getComputedStyle(activeButton).left) || 0;
            // currentY = parseFloat(getComputedStyle(activeButton).top) || 0;
        }
    }

    function animateButton() {
        if (activeButton && window.innerWidth > 768) {
            const dx = targetX - currentX;
            const dy = targetY - currentY;
            currentX += dx * 0.15;
            currentY += dy * 0.15;
            activeButton.style.left = `${currentX}px`;
            activeButton.style.top = `${currentY}px`;
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                animationFrameId = requestAnimationFrame(animateButton);
            } else {
                animationFrameId = null;
            }
        }
    }

    function isCursorOverRestrictedArea(e) {
        if (!navigationButtons.previous || !navigationButtons.next || !infoList || !productsInfo) return false;

        const prevRect = navigationButtons.previous.getBoundingClientRect();
        const nextRect = navigationButtons.next.getBoundingClientRect();
        const infoListRect = infoList.getBoundingClientRect();
        const productsInfoRect = productsInfo.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const isOverPrev = mouseX >= prevRect.left && mouseX <= prevRect.right && mouseY >= prevRect.top && mouseY <= prevRect.bottom;
        const isOverNext = mouseX >= nextRect.left && mouseX <= nextRect.right && mouseY >= nextRect.top && mouseY <= nextRect.bottom;
        const isOverInfoList = mouseX >= infoListRect.left && mouseX <= infoListRect.right && mouseY >= infoListRect.top && mouseY <= infoListRect.bottom;
        const isOverProductsInfo = mouseX >= productsInfoRect.left && mouseX <= productsInfoRect.right && mouseY >= productsInfoRect.top && mouseY <= productsInfoRect.bottom;

        return isOverPrev || isOverNext || isOverInfoList || isOverProductsInfo;
    }

    function initialize() {
        if (!cardContainer || !backgroundContainer || !infoContainer || !buttonsContainer || !productsSection || !infoList || !productsInfo) {
            console.error("Required elements not found in DOM at initialize.");
            return;
        }

        const cards = cardContainer.querySelectorAll(".products-card");
        cards.forEach((card, index) => {
            card.style.transition = `transform 500ms ease ${index * 100}ms`;
            card.style.setProperty("--card-translateY-offset", "0%");
        });

        const currentInfo = infoContainer.querySelector(".current-info");
        if (currentInfo) {
            const texts = currentInfo.querySelectorAll(".text");
            texts.forEach((text, index) => {
                text.style.transition = `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`;
                text.style.opacity = "1";
                text.style.transform = "translateY(0) translateZ(2rem)";
            });
        }

        setupButtonObserver();
        initializeButtons();
        updateButtonState();
    }

    document.addEventListener("DOMContentLoaded", () => initialize());

    productsSection.addEventListener("mousemove", (e) => {
        if (window.innerWidth > 768) {
            const rect = productsSection.getBoundingClientRect();
            targetX = e.clientX - rect.left - 50;
            targetY = e.clientY - rect.top - 50;
            const maxX = rect.width - 100;
            const maxY = rect.height - 100;
            targetX = Math.max(0, Math.min(targetX, maxX));
            targetY = Math.max(0, Math.min(targetY, maxY));

            const isOverRestrictedArea = isCursorOverRestrictedArea(e);
            if (activeButton && !isOverRestrictedArea) {
                activeButton.style.display = "flex";
                if (!animationFrameId) animateButton();
            } else if (activeButton && isOverRestrictedArea) {
                activeButton.style.display = "none";
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        }
    });

    productsSection.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768 && activeButton) {
            activeButton.style.display = "none";
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        }
    });

    productsSection.addEventListener("mousemove", (e) => {
        const currentInfo = infoContainer.querySelector(".current-info");
        if (currentInfo && window.innerWidth > 768) {
            const rect = currentInfo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const angle = Math.atan2(e.clientX - centerX, 0) * (20 / Math.PI);
            currentInfo.querySelectorAll(".text").forEach(text => {
                text.style.transform = `rotateY(${angle}deg) translateZ(50px)`;
            });
        }
    });

    productsSection.addEventListener("touchmove", (e) => {
        if (window.innerWidth <= 768) {
            const currentInfo = infoContainer.querySelector(".current-info");
            if (currentInfo && e.touches) {
                const rect = currentInfo.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const angle = Math.atan2(e.touches[0].clientX - centerX, 0) * (20 / Math.PI);
                currentInfo.querySelectorAll(".text").forEach(text => {
                    text.style.transform = `rotateY(${angle}deg) translateZ(50px)`;
                });
            }
        }
    });
})();
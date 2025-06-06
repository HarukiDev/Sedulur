(function () {
  const navigationButtons = {
    previous: document.querySelector(".products-btn-left"),
    next: document.querySelector(".products-btn-right"),
  };

  const cardContainer = document.querySelector(".products-cards-wrapper");
  const backgroundContainer = document.querySelector(".products-bg");
  const infoContainer = document.querySelector(".products-info-wrapper");

  let isDraggingActive = false;
  let initialXPosition = 0;
  const dragThreshold = 50; // Minimum distance (px) to trigger slide

  if (!cardContainer || !backgroundContainer || !infoContainer) {
    console.error("Required elements not found in DOM");
    return;
  }

  navigationButtons.next?.addEventListener("click", () => slideCards("right"));
  navigationButtons.previous?.addEventListener("click", () => slideCards("left"));

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

  function startDrag(e) {
    e.preventDefault();
    isDraggingActive = true;
    initialXPosition = e.clientX || e.touches[0].clientX;
    cardContainer.classList.add("dragging");
  }

  function handleDrag(e) {
    if (!isDraggingActive) return;
    if (e.type === "touchmove") {
      e.preventDefault();
    }
  }

  function endDrag(e) {
    if (!isDraggingActive) return;
    isDraggingActive = false;
    cardContainer.classList.remove("dragging");

    const finalXPosition = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : initialXPosition);
    const dragDistance = finalXPosition - initialXPosition;

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
      return;
    }

    if (navigationButtons.previous) navigationButtons.previous.disabled = true;
    if (navigationButtons.next) navigationButtons.next.disabled = true;

    updateInfo(direction);
    updateCardClasses();

    setTimeout(() => {
      if (navigationButtons.previous) navigationButtons.previous.disabled = false;
      if (navigationButtons.next) navigationButtons.next.disabled = false;
    }, 800);

    function updateCardClasses() {
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
        previousCard.classList.add("current-card");
        nextCard.classList.add("previous-card");
        currentBackground.classList.add("next-image");
        previousBackground.classList.add("current-image");
        nextBackground.classList.add("previous-image");
      }
    }
  }

  function updateInfo(direction) {
    const currentInfo = infoContainer.querySelector(".current-info");
    const previousInfo = infoContainer.querySelector(".previous-info");
    const nextInfo = infoContainer.querySelector(".next-info");

    if (!currentInfo || !previousInfo || !nextInfo) {
      return;
    }

    const currentTexts = currentInfo.querySelectorAll(".text");
    currentTexts.forEach((text, index) => {
      text.style.transition = `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`;
      text.style.opacity = "0";
      text.style.transform = "translateY(-120px)";
    });

    setTimeout(() => {
      updateInfoClasses(direction);
      const newInfo = direction === "right" ? nextInfo : previousInfo;
      const newTexts = newInfo.querySelectorAll(".text");
      newTexts.forEach((text, index) => {
        text.style.transition = `opacity 400ms ease ${index * 100}ms, transform 400ms ease ${index * 100}ms`;
        text.style.opacity = "1";
        text.style.transform = "translateY(0)";
      });
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

  function updateCardRotation(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const angle = Math.atan2((e.clientX || e.touches[0].clientX) - centerX, 0) * (35 / Math.PI);
    card.style.setProperty("--current-card-rotation-offset", `${angle}deg`);
    const currentInfo = infoContainer.querySelector(".current-info");
    currentInfo.style.transform = `rotateY(${angle}deg)`;
  }

  function resetCardRotation(e) {
    const card = e.currentTarget;
    card.style.setProperty("--current-card-rotation-offset", "0deg");
    const currentInfo = infoContainer.querySelector(".current-info");
    currentInfo.style.transform = "rotateY(0deg)";
  }

  function initializeCardEvents() {
    const currentCard = cardContainer.querySelector(".current-card");
    if (!currentCard) return;
    currentCard.addEventListener("pointermove", updateCardRotation);
    currentCard.addEventListener("pointerout", resetCardRotation);
    currentCard.addEventListener("touchmove", updateCardRotation, { passive: false });
    currentCard.addEventListener("touchend", resetCardRotation);
  }

  function removeCardEvents(card) {
    card.removeEventListener("pointermove", updateCardRotation);
    card.removeEventListener("pointerout", updateCardRotation);
    card.removeEventListener("touchmove", updateCardRotation);
    card.removeEventListener("touchend", resetCardRotation);
  }

  function initialize() {
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
        text.style.transform = "translateY(0)";
      });
    }

    if (navigationButtons.previous) navigationButtons.previous.disabled = false;
    if (navigationButtons.next) navigationButtons.next.disabled = false;

    initializeCardEvents();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
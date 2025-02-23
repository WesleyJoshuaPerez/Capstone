let currentIndex = 0;

function moveSlide(step) {
  const slides = document.querySelector(".slider-container");
  const totalSlides = document.querySelectorAll(".slide").length;

  currentIndex += step;

  if (currentIndex < 0) {
    currentIndex = totalSlides - 1;
  } else if (currentIndex >= totalSlides) {
    currentIndex = 0;
  }

  slides.style.transform = `translateX(-${currentIndex * 100}vw)`;
  updateIndicators();
}

function goToSlide(index) {
  currentIndex = index;
  document.querySelector(".slider-container").style.transform = `translateX(-${
    currentIndex * 100
  }vw)`;
  updateIndicators();
}

function updateIndicators() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

// Auto-slide every 3.5 seconds
setInterval(() => moveSlide(1), 3500);

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
}

// Auto-slide every 3.5 seconds
setInterval(() => moveSlide(1), 3500);

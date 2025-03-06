document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const sliderContainer = document.querySelector(".slider-container");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0;
  const intervalTime = 3000; // Time in milliseconds between slides

  // Make the slider container width dynamic
  function adjustSliderWidth() {
    sliderContainer.style.width = `${slides.length * window.innerWidth}px`;
    slides.forEach(slide => {
      slide.style.width = `${window.innerWidth}px`;
    });
  }

  function showSlide(index) {
    sliderContainer.style.transform = `translateX(-${index * window.innerWidth}px)`;

    dots.forEach(dot => dot.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  }

  function nextSlide() {
    currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    showSlide(currentIndex);
  }

  document.querySelector(".prev").addEventListener("click", () => {
    prevSlide();
    resetInterval();
  });

  document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
    resetInterval();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      showSlide(currentIndex);
      resetInterval();
    });
  });

  let slideInterval = setInterval(nextSlide, intervalTime);

  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }

  // Adjust slider when window resizes
  window.addEventListener("resize", adjustSliderWidth);

  // Initial adjustments
  adjustSliderWidth();
  showSlide(currentIndex);
});

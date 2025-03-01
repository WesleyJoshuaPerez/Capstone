document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentIndex = 0;
  const intervalTime = 3000; // Time in milliseconds between slides

  function showSlide(index) {
    const sliderContainer = document.querySelector(".slider-container");
    sliderContainer.style.transform = `translateX(-${index * 70}vw)`;

    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
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

  showSlide(currentIndex);
});

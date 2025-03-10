document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main_content");
  const toggleButton = document.getElementById("hamburgerBtn");

  function toggleSidebar() {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");

      // Show the button only when the sidebar is collapsed
      toggleButton.style.display = sidebar.classList.contains("collapsed")
        ? "block"
        : "none";
    }
  }

  function closeSidebar(event) {
    if (window.innerWidth <= 768) {
      if (
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        sidebar.classList.add("collapsed");
        mainContent.classList.add("expanded");
        toggleButton.style.display = "block";
      }
    }
  }

  function checkScreenSize() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("collapsed");
      mainContent.classList.remove("expanded");
      toggleButton.style.display = "none";
      toggleButton.removeEventListener("click", toggleSidebar);
      document.removeEventListener("click", closeSidebar);
    } else {
      sidebar.classList.add("collapsed"); // Ensure sidebar is collapsed initially
      mainContent.classList.add("expanded");
      toggleButton.style.display = "block";
      toggleButton.addEventListener("click", toggleSidebar);
      document.addEventListener("click", closeSidebar);
    }
  }

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main_content");
  const toggleButton = document.getElementById("hamburgerBtn");

  function toggleSidebar() {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
  }

  function closeSidebar(event) {
    if (window.innerWidth <= 768) {
      if (
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        sidebar.classList.add("collapsed");
        mainContent.classList.add("expanded");
      }
    }
  }

  function checkScreenSize() {
    if (window.innerWidth > 768) {
      // Reset sidebar state for desktop
      sidebar.classList.remove("collapsed");
      mainContent.classList.remove("expanded");
      toggleButton.style.display = "none";

      // Remove mobile event listeners
      document.removeEventListener("click", closeSidebar);
    } else {
      // Set sidebar to collapsed for mobile
      sidebar.classList.add("collapsed");
      mainContent.classList.add("expanded");
      toggleButton.style.display = "block";

      // Add event listener for closing sidebar on click outside
      document.addEventListener("click", closeSidebar);
    }
  }

  // Add event listener for toggle button
  toggleButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent immediate close on click
    toggleSidebar();
  });

  // Initial check for screen size
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

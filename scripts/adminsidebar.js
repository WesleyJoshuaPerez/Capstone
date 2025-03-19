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
//for clicking sidebar to appear the divs
document.addEventListener("DOMContentLoaded", function () {
  const summary_container = document.querySelector("#summary-container");
  const subscriberDiv = document.querySelector("#subscriberDiv");
  const applicationDiv = document.querySelector("#applicationDiv");
  const maintenance_reqDiv = document.querySelector("#maintenance_reqDiv");
  const homeLink = document.querySelector("#homeLink");
  const subscriberLink = document.querySelector("#subscriberLink");
  const applicationLink = document.querySelector("#applicationLink");
  const maintenanceLink = document.querySelector("#maintenanceLink");
  const technicianLink = document.querySelector("#technicianLink");

  //for clicking summary boxes
  const applicantsBox = document.querySelector("#applicantsBox");
  const subscribersBox = document.querySelector("#subscribersBox");
  const techniciansBox = document.querySelector("#techniciansBox");
  const maintenanceBox = document.querySelector("#maintenanceBox");

  // Hide sections initially
  summary_container.style.display = "flex";
  subscriberDiv.style.display = "none";
  applicationDiv.style.display = "none";
  maintenance_reqDiv.style.display = "none";
  technicianDiv.style.display = "none";

  // Show Home and hide other section
  homeLink.addEventListener("click", function (event) {
    event.preventDefault();
    summary_container.style.display = "flex";
    applicationDiv.style.display = "none";
    maintenance_reqDiv.style.display = "none";
    subscriberDiv.style.display = "none";
    technicianDiv.style.display = "none";
  });

  // Show Subscribers and hide other section
  subscriberLink.addEventListener("click", function (event) {
    event.preventDefault();
    subscriberDiv.style.display = "block";
    applicationDiv.style.display = "none";
    maintenance_reqDiv.style.display = "none";
    summary_container.style.display = "none";
    technicianDiv.style.display = "none";
    fetchSubscribers();
  });
  subscribersBox.addEventListener("click", function (event) {
    event.preventDefault();
    subscriberDiv.style.display = "block";
    applicationDiv.style.display = "none";
    maintenance_reqDiv.style.display = "none";
    summary_container.style.display = "none";
    technicianDiv.style.display = "none";
    fetchSubscribers();
  });

  // Show Applications and hide other section
  applicationLink.addEventListener("click", function (event) {
    event.preventDefault();
    applicationDiv.style.display = "block";
    subscriberDiv.style.display = "none";
    maintenance_reqDiv.style.display = "none";
    summary_container.style.display = "none";
    technicianDiv.style.display = "none";
    fetchApplications();
  });
  applicantsBox.addEventListener("click", function (event) {
    event.preventDefault();
    applicationDiv.style.display = "block";
    subscriberDiv.style.display = "none";
    maintenance_reqDiv.style.display = "none";
    summary_container.style.display = "none";
    technicianDiv.style.display = "none";
    fetchApplications();
  });

  // Show maintenance and hide other section
  maintenanceLink.addEventListener("click", function (event) {
    event.preventDefault();
    maintenance_reqDiv.style.display = "block";
    subscriberDiv.style.display = "none";
    applicationDiv.style.display = "none";
    summary_container.style.display = "none";
    technicianDiv.style.display = "none";
  });
  maintenanceBox.addEventListener("click", function (event) {
    event.preventDefault();
    maintenance_reqDiv.style.display = "block";
    subscriberDiv.style.display = "none";
    applicationDiv.style.display = "none";
    summary_container.style.display = "none";
    technicianDiv.style.display = "none";
  });

  //Show technician and hide other section
  technicianLink.addEventListener("click", function (event) {
    event.preventDefault();
    technicianDiv.style.display = "block";
    maintenance_reqDiv.style.display = "none";
    subscriberDiv.style.display = "none";
    applicationDiv.style.display = "none";
    summary_container.style.display = "none";
    fetchTechnicians();
  });
  techniciansBox.addEventListener("click", function (event) {
    event.preventDefault();
    technicianDiv.style.display = "block";
    maintenance_reqDiv.style.display = "none";
    subscriberDiv.style.display = "none";
    applicationDiv.style.display = "none";
    summary_container.style.display = "none";
    fetchTechnicians();
  });
});

// scripts/auth.js
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const userRole = sessionStorage.getItem("userRole");
  const path = window.location.pathname;

  // Redirect if not logged in
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "login.html";
    return;
  }

  // Role-based access control
  if (path.includes("admin.html") && userRole !== "admin") {
    window.location.href = "login.html";
  } else if (path.includes("user_dashboard.html") && userRole !== "user") {
    window.location.href = "login.html";
  } else if (
    path.includes("technician_dashboard.html") &&
    userRole !== "technician"
  ) {
    window.location.href = "login.html";
  }
});
// Function to handle user logout
function logoutUser() {
  // Clear session storage
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("userRole");

  // Redirect to the logout.php page
  window.location.href = "backend/logout.php";
}

// Prevent back navigation after logout
if (window.location.pathname.includes("login.html")) {
  // Push a new history state to prevent back navigation
  history.pushState(null, null, window.location.href);

  // Disable back button by forcing forward navigation
  window.onpopstate = function () {
    history.go(1);
  };
}

// Event listener for logout button
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});

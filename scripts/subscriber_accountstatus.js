document.addEventListener("DOMContentLoaded", function () {
  fetch("backend/get_user_data.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        updateAccountStatusUI(data.account_status);
      } else {
        console.error("Fetch error:", data.message);
      }
    })
    .catch((error) => {
      console.error("Request failed:", error);
    });
});

//use to change the status of the user in the user dashboard
function updateAccountStatusUI(status) {
  const statusElement = document.getElementById("accountStatus");

  if (!statusElement) return;

  if (status === "active") {
    statusElement.textContent = "Active";
    statusElement.style.backgroundColor = "#00c853"; // Bright green
  } else if (status === "disconnected") {
    statusElement.textContent = "Disconnected";
    statusElement.style.backgroundColor = "#ffffff"; // Dark background
    statusElement.style.color = "#700000"; // White text
    statusIcon.style.backgroundColor = "#ffffff";
  } else {
    statusElement.textContent = "Unknown";
    statusElement.style.backgroundColor = "#9e9e9e"; // Gray
    statusElement.style.color = "#ffffff";
  }
}

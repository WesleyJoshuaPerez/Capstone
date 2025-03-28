async function fetchTotals() {
  try {
    const response = await fetch("backend/totalusers.php"); // Adjust the path if needed
    const data = await response.json();

    // Update the dashboard totals
    document.getElementById("totalApplicants").innerText = data.applicants;
    document.getElementById("totalSubscribers").innerText = data.subscribers;
    document.getElementById("totalTechnicians").innerText = data.technicians;
    document.getElementById("totalChangePlan").innerText = data.changeplan;
    document.getElementById("totalMaintenance").innerText =
      data.maintenancerequest;
  } catch (error) {
    console.error("Error fetching totals:", error);
  }
}

// Fetch totals when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchTotals(); // Initial fetch
  setInterval(fetchTotals, 1000); // Update every 1 second
});

async function fetchTotals() {
  try {
    const response = await fetch("backend/totalusers.php");
    const data = await response.json();

    // Check if each element exists before updating its innerText
    const totalApplicantsElem = document.getElementById("totalApplicants");
    if (totalApplicantsElem) {
      totalApplicantsElem.innerText = data.applicants;
    }

    const totalSubscribersElem = document.getElementById("totalSubscribers");
    if (totalSubscribersElem) {
      totalSubscribersElem.innerText = data.subscribers;
    }

    const totalTechniciansElem = document.getElementById("totalTechnicians");
    if (totalTechniciansElem) {
      totalTechniciansElem.innerText = data.technicians;
    }

    const totalChangePlanElem = document.getElementById("totalChangePlan");
    if (totalChangePlanElem) {
      totalChangePlanElem.innerText = data.changeplan;
    }

    const totalMaintenanceElem = document.getElementById("totalMaintenance");
    if (totalMaintenanceElem) {
      totalMaintenanceElem.innerText = data.maintenancerequest;
    }

    const totalTaskElem = document.getElementById("TotalTask");
    if (totalTaskElem && data.assignedtasks !== undefined) {
      totalTaskElem.innerText = data.assignedtasks;
    }
  } catch (error) {
    console.error("Error fetching totals:", error);
  }
}

// Fetch totals when the page loads and update periodically
document.addEventListener("DOMContentLoaded", () => {
  fetchTotals(); // Initial fetch
  setInterval(fetchTotals, 1000); // Update every 1 second
});

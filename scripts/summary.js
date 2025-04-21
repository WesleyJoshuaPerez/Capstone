let totalsChart = null;

async function fetchTotals() {
  try {
    const response = await fetch("backend/totalusers.php");
    const data = await response.json();

    // Safely update DOM elements
    const totalApplicantsElem = document.getElementById("totalApplicants");
    if (totalApplicantsElem) totalApplicantsElem.innerText = data.applicants;

    const totalSubscribersElem = document.getElementById("totalSubscribers");
    if (totalSubscribersElem) totalSubscribersElem.innerText = data.subscribers;

    const totalTechniciansElem = document.getElementById("totalTechnicians");
    if (totalTechniciansElem) totalTechniciansElem.innerText = data.technicians;

    const totalChangePlanElem = document.getElementById("totalChangePlan");
    if (totalChangePlanElem) totalChangePlanElem.innerText = data.changeplan;

    const totalMaintenanceElem = document.getElementById("totalMaintenance");
    if (totalMaintenanceElem)
      totalMaintenanceElem.innerText = data.maintenancerequest;

    const totalTaskElem = document.getElementById("TotalTask");
    if (totalTaskElem && data.assignedtasks !== undefined) {
      totalTaskElem.innerText = data.assignedtasks;
    }

    const totalBoxslotsElem = document.getElementById("totalBoxslots");
    if (totalBoxslotsElem) {
      totalBoxslotsElem.innerText = data.totalBoxslots;
    }

    // Chart Data
    const labels = [
      "Pending Applicants",
      "Approved Subscribers",
      "Technicians",
      "Pending Change Plans",
      "Maintenance Requests",
      "Total Box Slots",
    ];

    const values = [
      data.applicants,
      data.subscribers,
      data.technicians,
      data.changeplan,
      data.maintenancerequest,
      data.totalBoxslots,
    ];

    const ctx = document.getElementById("totalsChart").getContext("2d");

    if (totalsChart) {
      totalsChart.data.datasets[0].data = values;
      totalsChart.update();
    } else {
      totalsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "System Totals",
              data: values,
              backgroundColor: [
                "#007bff",
                "#28a745",
                "#ffc107",
                "#17a2b8",
                "#fd7e14",
                "#6f42c1",
                "#dc3545",
              ],
              borderColor: "#333",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Error fetching totals:", error);
  }
}

// Load and update chart on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchTotals(); // Initial fetch
  setInterval(fetchTotals, 1000); // Repeat every second
});

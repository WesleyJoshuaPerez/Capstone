// Fetch change plan requests from the server
function fetchChangeplanReq() {
  Swal.fire({
    title: "Loading Change Plan Requests...",
    text: "Please wait while we fetch the data.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("GET", "backend/fetch_changeplan.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      Swal.close(); // Close loading Swal when request is complete
      if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        let tableBody = document.querySelector("#changePlanTable tbody");
        tableBody.innerHTML = ""; // Clear previous data

        if (response.success && response.data.length > 0) {
          let hasPending = false;

          response.data.forEach((row) => {
            if (row.status === "pending") {
              hasPending = true;
              let tr = document.createElement("tr");
              tr.innerHTML = `
                <td>${row.change_plan_id}</td> 
                <td>${row.user_id || "N/A"}</td>
                <td>${row.full_name}</td>
                <td>${row.current_plan}</td>
                <td>${row.new_plan}</td>
                <td>${row.price}</td>
              `;
              tr.setAttribute("data-changeplan", JSON.stringify(row));
              tableBody.appendChild(tr);
            }
          });

          if (!hasPending) {
            let tr = document.createElement("tr");
            tr.innerHTML = `
  <td colspan="7" style="text-align: center; padding: 30px;">
    <div style="display: inline-block; color: #3775b9;">
      <i class="fas fa-exchange fa-3x" style="margin-bottom: 10px;"></i>
      <div style="color: #888; font-size: 16px;">No pending change plan requests.</div>
    </div>
  </td>
`;
            tableBody.appendChild(tr);
          }

          attachChangeRowClickEvent(); // Attach event listener to rows
        } else {
          let tr = document.createElement("tr");
          tr.innerHTML = `
  <td colspan="7" style="text-align: center; padding: 30px;">
    <div style="display: inline-block; color: #3775b9;">
      <i class="fas fa-exchange fa-3x" style="margin-bottom: 10px;"></i>
      <div style="color: #888; font-size: 16px;">No pending change plan requests.</div>
    </div>
  </td>
`;
          tableBody.appendChild(tr);
        }
      } else {
        Swal.fire("Error!", "Failed to load data.", "error");
      }
    }
  };
  xhr.send();
}

// Attach click event to each row in the change plan table
function attachChangeRowClickEvent() {
  const rows = document.querySelectorAll("#changePlanTable tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const changeplan = JSON.parse(row.getAttribute("data-changeplan"));

      Swal.fire({
        title: `Change Plan ID: ${changeplan.change_plan_id}`,
        html: `
            <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
                <strong>User ID:</strong> ${changeplan.user_id}<br>
                <strong>Name:</strong> ${changeplan.full_name}<br>
                <strong>Current Plan:</strong> ${changeplan.current_plan}<br>
                <strong>New Plan:</strong> ${changeplan.new_plan}<br>
                <strong>Price:</strong> ${changeplan.price}<br>
                <strong>Request Date:</strong> ${changeplan.changed_at}<br>
            </div>
        `,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Approve",
        denyButtonText: "Deny",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          updateChangePlanStatus(
            changeplan.change_plan_id,
            changeplan.user_id,
            "Approved",
            changeplan.new_plan,
            changeplan.price
          );
        } else if (result.isDenied) {
          updateChangePlanStatus(
            changeplan.change_plan_id,
            changeplan.user_id,
            "Denied"
          );
        }
      });
    });
  });
}

// Update change plan status in the database
function updateChangePlanStatus(
  changePlanId,
  userId,
  status,
  newPlan = null,
  price = null
) {
  if (!changePlanId) {
    console.error("Error: Missing Change Plan ID");
    Swal.fire("Error!", "Change Plan ID is missing.", "error");
    return;
  }

  let planPrice = 0;
  switch (newPlan) {
    case "Bronze":
      planPrice = 1199;
      break;
    case "Silver":
      planPrice = 1499;
      break;
    case "Gold":
      planPrice = 1799;
      break;
    default:
      planPrice = 0;
      break;
  }

  let requestData = {
    change_plan_id: changePlanId,
    user_id: userId,
    status: status,
    new_plan: newPlan,
    price: planPrice, // Send the correct price
  };

  console.log("Sending request data:", requestData); // Debugging

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "backend/update_changeplan_status.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("Response received:", xhr.responseText); // Debugging
      Swal.close();
      if (xhr.status === 200) {
        try {
          let data = JSON.parse(xhr.responseText);
          if (data.success) {
            Swal.fire(
              "Success!",
              `Change Plan ${status.toLowerCase()} successfully.`,
              "success"
            ).then(() => {
              fetchChangeplanReq();
            });
          } else {
            Swal.fire(
              "Error!",
              data.error || "Failed to update change plan status.",
              "error"
            );
          }
        } catch (e) {
          console.error("Parsing error:", e);
          Swal.fire("Error!", "Invalid server response.", "error");
        }
      } else {
        console.error("Server error:", xhr.status);
        Swal.fire("Error!", "Failed to communicate with the server.", "error");
      }
    }
  };

  xhr.send(JSON.stringify(requestData));
}

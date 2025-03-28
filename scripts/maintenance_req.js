function fetchMaintenancereq() {
  Swal.fire({
    title: "Loading Maintenance Requests...",
    text: "Please wait while we fetch the data.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("GET", "backend/fetch_maintenance.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      Swal.close();
      if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        if (response.success) {
          let tableBody = document.querySelector("#maintenance_reqTable tbody");
          tableBody.innerHTML = ""; // Clear previous data

          response.data.forEach((row) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${row.maintenance_id}</td>
              <td>${row.technician_name || "N/A"}</td>
              <td>${row.full_name}</td>
              <td>${row.contact_number}</td>
              <td>${row.issue_type}</td>
              <td>${row.submitted_at}</td>
              <td>${row.status}</td>
            `;
            tr.setAttribute("data-maintenance_request", JSON.stringify(row));
            tableBody.appendChild(tr);
          });

          attachMaintenanceRowClickEvent();
        } else {
          Swal.fire("Error!", response.error, "error");
        }
      } else {
        Swal.fire("Error!", "Failed to load data.", "error");
      }
    }
  };
  xhr.send();
}

function attachMaintenanceRowClickEvent() {
  const rows = document.querySelectorAll("#maintenance_reqTable tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const maintenance_request = JSON.parse(
        row.getAttribute("data-maintenance_request")
      );

      Swal.fire({
        title: `Maintenance ID: ${maintenance_request.maintenance_id}`,
        html: `
          <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
              <strong>User ID:</strong> ${maintenance_request.user_id}<br>
              <strong>Name:</strong> ${maintenance_request.full_name}<br>
              <strong>Contact:</strong> ${maintenance_request.contact_number}<br>
              <strong>Address:</strong> ${maintenance_request.address}<br>
              <strong>Issue Type:</strong> ${maintenance_request.issue_type}<br>
              <strong>Issue Description:</strong> ${maintenance_request.issue_description}<br>
              <strong>Contact Time:</strong> ${maintenance_request.contact_time}<br>
              <strong>Evidence:</strong><br>
              <img src="frontend/assets/images/uploads/issue_evidence/${maintenance_request.evidence_filename}" width="100%" style="cursor: pointer;" 
                  onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_id_photo.jpg';"><br>
              <strong>Request Date:</strong> ${maintenance_request.submitted_at}<br>
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
          approveApplication(maintenance_request.maintenance_id);
        } else if (result.isDenied) {
          denyApplication(maintenance_request.maintenance_id);
        }
      });
    });
  });
}

function viewImage(src) {
  Swal.fire({
    imageUrl: src,
    imageWidth: 400,
    imageAlt: "Preview Image",
    showCloseButton: true,
    showConfirmButton: false,
  });
}

function approveApplication(maintenanceId) {
  updateApplicationStatus(maintenanceId, "ongoing");
}

function denyApplication(maintenanceId) {
  updateApplicationStatus(maintenanceId, "denied");
}

function updateApplicationStatus(maintenanceId, status) {
  Swal.fire({
    title: `Processing ${status}...`,
    text: "Please wait while we update the application status.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "backend/update_maintenance_status.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      Swal.close(); // Close loading Swal after request completion
      if (xhr.status === 200) {
        try {
          let data = JSON.parse(xhr.responseText);
          if (data.success) {
            Swal.fire(
              "Success!",
              `Application ${status.toLowerCase()} successfully.`,
              "success"
            ).then(() => {
              setTimeout(fetchMaintenancereq, 500);
            });
          } else {
            Swal.fire(
              "Error!",
              data.error || "Failed to update application status.",
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

  xhr.send(JSON.stringify({ id: maintenanceId, status: status }));
}

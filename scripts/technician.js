function fetchTechnicians() {
  Swal.fire({
    title: "Loading Technicians...",
    text: "Fetching technician data, please wait...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  fetch("backend/fetch_technicians.php")
    .then((response) => response.json())
    .then((data) => {
      Swal.close();
      if (data.success) {
        const tableBody = document.querySelector("#technicianTable tbody");

        if (!tableBody) {
          console.error("Technician table tbody not found!");
          return;
        }

        tableBody.innerHTML = ""; // Clear existing rows

        data.data.forEach((technician) => {
          let row = document.createElement("tr");
          row.setAttribute("data-technician", JSON.stringify(technician));

          // Conditional status color
          const statusColor =
            technician.status === "Available" ? "green" : "red";

          row.innerHTML = `
                    <td>${technician.id}</td>
                    <td>${technician.name}</td>
                    <td>${technician.contact}</td>
                    <td>${technician.role}</td>
                    <td style="color: ${statusColor}; font-weight: bold;">${technician.status}</td>
                    <td>
                        <button class="assign-btn" data-name="${technician.name}">Assign</button>
                        <button class="delete-btn" data-id="${technician.id}">Disable</button>
                    </td>
                  `;

          tableBody.appendChild(row);
        });

        attachTechnicianRowClickEvent();
        attachDisableButtonEvent();
        attachAssignButtonEvent(); // Attach event for assign buttons
      } else {
        console.error("Failed to fetch technicians:", data.error);
        Swal.fire("Error!", "Failed to load technicians.", "error");
      }
    })
    .catch((error) => {
      Swal.close();
      console.error("Error fetching technicians:", error);
      Swal.fire("Error!", "Error fetching technicians.", "error");
    });
}

// Function to attach event listener to technician row clicks
function attachTechnicianRowClickEvent() {
  const rows = document.querySelectorAll("#technicianTable tbody tr");

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const technician = JSON.parse(row.getAttribute("data-technician"));

      Swal.fire({
        title: `Technician: ${technician.name}`,
        html: `
              <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                  <strong>ID Photo:</strong><br>
                  <img src="frontend/assets/images/technicians/${
                    technician.profile_image
                  }" width="100%" style="cursor: pointer;" 
                      onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_id_photo.jpg';"><br>
                <br><br>
                <strong>Specialization:</strong> ${technician.role}<br>
                <strong>Contact:</strong> ${technician.contact}<br>
                <strong>Status:</strong> <span style="color: ${
                  technician.status === "Available" ? "green" : "red"
                }">${technician.status}</span>
              </div>
            `,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        cancelButtonText: "Close",
        denyButtonText: "Assign Task",
      }).then((result) => {
        if (result.isDenied) {
          fetchOngoingMaintenanceRequests()
            .then((requests) => {
              if (requests.length === 0) {
                Swal.fire(
                  "No Ongoing Requests",
                  "There are no ongoing maintenance requests to assign.",
                  "info"
                );
                return;
              }

              const requestOptions = requests
                .map(
                  (request) => `
                <option value="${request.id}">${request.full_name} - ${request.issue_type}</option>
              `
                )
                .join("");

              Swal.fire({
                title: "Assign Maintenance Request",
                html: `
                  <select id="maintenanceRequestSelect" class="swal2-select">
                    ${requestOptions}
                  </select>
                `,
                showCancelButton: true,
                confirmButtonText: "Assign",
                preConfirm: () => {
                  const requestId = Swal.getPopup().querySelector(
                    "#maintenanceRequestSelect"
                  ).value;
                  return { technicianName: technician.name, requestId };
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  assignMaintenanceRequest(
                    result.value.technicianName,
                    result.value.requestId
                  )
                    .then(() => {
                      Swal.fire(
                        "Success",
                        "Maintenance request assigned successfully.",
                        "success"
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Error assigning maintenance request:",
                        error
                      );
                      Swal.fire(
                        "Error",
                        "Failed to assign maintenance request.",
                        "error"
                      );
                    });
                }
              });
            })
            .catch((error) => {
              console.error(
                "Error fetching ongoing maintenance requests:",
                error
              );
              Swal.fire(
                "Error!",
                "Failed to fetch ongoing maintenance requests.",
                "error"
              );
            });
        }
      });
    });
  });
}

// Function to attach event listener to the assign buttons
function attachAssignButtonEvent() {
  const assignButtons = document.querySelectorAll(".assign-btn");

  assignButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the row click event

      const technicianName = button.getAttribute("data-name");

      fetchOngoingMaintenanceRequests()
        .then((requests) => {
          if (requests.length === 0) {
            Swal.fire(
              "No Ongoing Requests",
              "There are no ongoing maintenance requests to assign.",
              "info"
            );
            return;
          }

          const requestOptions = requests
            .map(
              (request) => `
            <option value="${request.id}">${request.full_name} - ${request.issue_type}</option>
          `
            )
            .join("");

          Swal.fire({
            title: "Assign Maintenance Request",
            html: `
              <select id="maintenanceRequestSelect" class="swal2-select">
                ${requestOptions}
              </select>
            `,
            showCancelButton: true,
            confirmButtonText: "Assign",
            preConfirm: () => {
              const requestId = Swal.getPopup().querySelector(
                "#maintenanceRequestSelect"
              ).value;
              return { technicianName, requestId };
            },
          }).then((result) => {
            if (result.isConfirmed) {
              assignMaintenanceRequest(
                result.value.technicianName,
                result.value.requestId
              )
                .then(() => {
                  Swal.fire(
                    "Success",
                    "Maintenance request assigned successfully.",
                    "success"
                  );
                })
                .catch((error) => {
                  console.error("Error assigning maintenance request:", error);
                  Swal.fire(
                    "Error",
                    "Failed to assign maintenance request.",
                    "error"
                  );
                });
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching ongoing maintenance requests:", error);
          Swal.fire(
            "Error!",
            "Failed to fetch ongoing maintenance requests.",
            "error"
          );
        });
    });
  });
}

function fetchOngoingMaintenanceRequests() {
  return fetch("backend/fetch_ongoing_requests.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error);
      }
    });
}

function assignMaintenanceRequest(technicianName, requestId) {
  return fetch("backend/assign_request.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ technicianName, requestId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        throw new Error(data.error);
      }
    });
}

// Use for disabling technician account
function attachDisableButtonEvent() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the row click event

      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Simulate success message without deleting
          Swal.fire("Deleted!", "Technician has been removed.", "success");

          // for backend
          /*
          fetch("backend/delete_technician.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: technicianId }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                Swal.fire("Deleted!", "Technician has been removed.", "success");
                fetchTechnicians(); // Refresh the list
              } else {
                Swal.fire("Error!", data.error, "error");
              }
            })
            .catch((error) => {
              console.error("Error deleting technician:", error);
              Swal.fire("Error!", "Failed to delete technician.", "error");
            });
          */
        }
      });
    });
  });
}

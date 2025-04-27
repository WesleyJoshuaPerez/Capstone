// Fetch Technicians from Backend using AJAX
function fetchTechnicians() {
  Swal.fire({
    title: "Loading Technicians...",
    text: "Fetching technician data, please wait...",
    allowOutsideClick: false,
    didOpen: function () {
      Swal.showLoading();
    },
  });

  $.ajax({
    url: "backend/fetch_technicians.php",
    dataType: "json",
    success: function (data) {
      Swal.close();
      if (data.success) {
        const tableBody = $("#technicianTable tbody");
        if (!tableBody.length) {
          console.error("Technician table tbody not found!");
          return;
        }
        tableBody.empty(); // Clear existing rows

        // Sort technicians by id (ascending)
        data.data.sort(function (a, b) {
          return a.id - b.id;
        });

        // Array to collect row elements with their id
        let rowsArray = [];
        let promises = [];
        $.each(data.data, function (index, technician) {
          let promise = fetchAssignedClientsCount(technician.id)
            .then(function (clientCount) {
              // Determine computed status:
              let computedStatus = technician.status;
              if (clientCount >= 5) {
                computedStatus = "Not-Available";
                if (technician.status !== "Not-Available") {
                  updateTechnicianStatus(technician.id, "Not-Available")
                    .then(function () {
                      technician.status = "Not-Available";
                    })
                    .fail(function (err) {
                      console.error("Error updating technician status:", err);
                    });
                }
              } else {
                computedStatus = "Available";
                if (technician.status !== "Available") {
                  updateTechnicianStatus(technician.id, "Available")
                    .then(function () {
                      technician.status = "Available";
                    })
                    .fail(function (err) {
                      console.error("Error updating technician status:", err);
                    });
                }
              }
              const statusColor =
                computedStatus === "Available" ? "green" : "red";

              // Create the row for the technician
              let row = $(`
                <tr data-technician-id='${technician.id}'>
                  <td>${technician.id}</td>
                  <td>${technician.name}</td>
                  <td>${technician.contact}</td>
                  <td>${technician.role}</td>
                  <td class="technician-status" style="color: ${statusColor}; font-weight: bold;">${computedStatus}</td>
                  <td class="client-count">${clientCount}</td>
                  <td>
                    <div class="btn-group">
                      <button class="assign-btn" data-name="${
                        technician.name
                      }" data-id="${technician.id}" ${
                clientCount >= 5 ? "disabled" : ""
              }>Assign</button>
                      <button class="delete-btn" data-id="${
                        technician.id
                      }">Disable</button>
                      <button class="view-clients-btn" data-id="${
                        technician.id
                      }">View Clients</button>
                      <button class="view-info-btn" data-id="${
                        technician.id
                      }">View Info</button>
                    </div>
                  </td>
                </tr>
              `);
              // Push an object with id and row to rowsArray
              rowsArray.push({ id: technician.id, row: row });
            })
            .fail(function (error) {
              console.error(
                "Error fetching client count for technician " + technician.id,
                error
              );
            });
          promises.push(promise);
        });

        // When all promises are resolved, sort and append rows in order.
        $.when.apply($, promises).done(function () {
          // Sort rowsArray by technician id (ascending)
          rowsArray.sort(function (a, b) {
            return a.id - b.id;
          });
          // Append each row to the table body in sorted order
          $.each(rowsArray, function (index, obj) {
            tableBody.append(obj.row);
          });
          // Attach delegated events after rows are in place
          attachDelegatedEvents();
        });
      } else {
        console.error("Failed to fetch technicians:", data.error);
        Swal.fire("Error!", "Failed to load technicians.", "error");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.close();
      console.error("Error fetching technicians:", errorThrown);
      Swal.fire("Error!", "Error fetching technicians.", "error");
    },
  });
}
// Add Technician Event Listener
$("#addTechnicianBtn").on("click", function () {
  Swal.fire({
    title: "Add New Technician",
    html: `
      <form id="addTechnicianForm" style="
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 400px;
        margin: auto;
      ">
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <label for="technicianName" style="font-weight: 600; min-width: 100px; text-align: right;">Name:</label>
          <input type="text" id="technicianName" class="swal2-input" style="width: 200px; height: 38px;" required>
        </div>
  
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <label for="technicianUsername" style="font-weight: 600; min-width: 100px; text-align: right;">Username:</label>
          <input type="text" id="technicianUsername" class="swal2-input" style="width: 200px; height: 38px;" required>
        </div>
  
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <label for="technicianPassword" style="font-weight: 600; min-width: 100px; text-align: right;">Password:</label>
          <div class="password_container" style="display: flex; align-items: center; gap: 10px;">
            <input type="password" id="technicianPassword" class="swal2-input" style="width: 200px; height: 38px;" required>
            <button type="button" id="togglePassword" style="background: none; border: none; cursor: pointer;">
              <i class="fa fa-eye" aria-hidden="true"></i>
            </button>
          </div>
        </div>
  
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <label for="technicianRole" style="font-weight: 600; min-width: 100px; text-align: left;  ">Role:</label>
          <select id="technicianRole" class="swal2-input" style="width: 200px; height: 38px; padding: 5px;" required>
            <option value="" disabled selected>Select a Role</option>
            <option value="Installer">Installer</option>
            <option value="Repair Technician">Repair Technician</option>
          </select>
        </div>
  
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <label for="technicianContact" style="font-weight: 600; min-width: 100px; text-align: right;">Contact:</label>
          <input type="text" id="technicianContact" class="swal2-input" style="width: 200px; height: 38px;" required>
        </div>
  
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <label for="technicianProfileImage" style="font-weight: 600; min-width: 100px; text-align: right;">Profile:</label>
          <input type="file" id="technicianProfileImage" class="swal2-file" style="width: 200px; height: 38px;" accept="image/*">
        </div>
      </form>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add Technician",
    preConfirm: function () {
      const name = $("#technicianName").val();
      const username = $("#technicianUsername").val();
      const password = $("#technicianPassword").val();
      const role = $("#technicianRole").val();
      const contact = $("#technicianContact").val();
      const profileImage = $("#technicianProfileImage")[0].files[0];

      if (!name || !username || !password || !role || !contact) {
        Swal.showValidationMessage("Please fill out all required fields.");
        return false;
      }

      return { name, username, password, role, contact, profileImage };
    },
    didOpen: () => {
      const togglePasswordButton = document.getElementById("togglePassword");
      const passwordField = document.getElementById("technicianPassword");

      togglePasswordButton.addEventListener("click", () => {
        // Toggle password visibility
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;

        // Toggle icon
        const icon = togglePasswordButton.querySelector("i");
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      });
    },
  }).then(function (result) {
    if (result.isConfirmed) {
      const formData = result.value;
      addTechnician(formData);
    }
  });
});

// Add Technician AJAX Function
function addTechnician(data) {
  const formData = new FormData();
  formData.append("action", "add");
  formData.append("name", data.name);
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("role", data.role);
  formData.append("contact", data.contact);
  if (data.profileImage) {
    formData.append("profileImage", data.profileImage); // Append the file
  }

  $.ajax({
    url: "backend/fetch_technicians.php", // Use the same PHP script
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    dataType: "json",
    success: function (response) {
      if (response.success) {
        Swal.fire("Success!", "Technician added successfully.", "success");
        fetchTechnicians(); // Refresh the technician list
      } else {
        Swal.fire("Error!", response.error, "error");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error adding technician:", errorThrown);
      Swal.fire("Error!", "Failed to add technician.", "error");
    },
  });
}
// Fetch Ongoing Maintenance Requests using AJAX
function fetchOngoingMaintenanceRequests() {
  return $.ajax({
    url: "backend/fetch_ongoing_requests.php",
    dataType: "json",
  }).then(function (data) {
    if (data.success) {
      return data.data;
    } else {
      return $.Deferred().reject(data.error);
    }
  });
}

// Assign Request to Technician using AJAX
function assignMaintenanceRequest(technicianName, requestId) {
  return $.ajax({
    url: "backend/assign_request.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      technicianName: technicianName,
      requestId: requestId,
    }),
    dataType: "json",
  })
    .then(function (data) {
      if (!data.success) {
        return $.Deferred().reject(data.error);
      }
      Swal.fire(
        "Success",
        "Maintenance request assigned successfully.",
        "success"
      );
      const technicianId = data.technicianId; // Assuming backend returns technicianId
      updateTechnicianClientCount(technicianId, true); // Update immediately
      fetchTechnicians(); // to refresh the status and total client count
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error assigning maintenance request:", errorThrown);
      Swal.fire("Error!", "Failed to assign maintenance request.", "error");
    });
}

// Fetch Assigned Clients Count for a Technician using AJAX
function fetchAssignedClientsCount(technicianId) {
  return $.ajax({
    url: "backend/fetch_assigned_clients.php",
    data: { technician_id: technicianId, count: "true" },
    dataType: "json",
  })
    .then(function (data) {
      return data.success ? data.total_clients : 0;
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching assigned client count:", errorThrown);
      return 0;
    });
}

// Update Technician Status in the Database using AJAX
// Update Technician Status in the Database using AJAX
function updateTechnicianStatus(technicianId, newStatus) {
  return $.ajax({
    url: "backend/update_technician_status.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ technician_id: technicianId, status: newStatus }), // ✅ FIXED HERE
    dataType: "json",
  })
    .done(function (data) {
      if (data.success) {
        console.log("Technician status updated successfully:", data);
      } else {
        console.error("Failed to update technician status:", data.error);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error("Error updating technician status:", errorThrown);
      Swal.fire("Error!", "Failed to update technician status.", "error");
    });
}

// Fetch Assigned Clients for a Technician using AJAX
function fetchAssignedClients(technicianId) {
  Swal.fire({
    title: "Fetching Clients...",
    allowOutsideClick: false,
    didOpen: function () {
      Swal.showLoading();
    },
  });

  $.ajax({
    url: "backend/fetch_assigned_clients.php",
    data: { technician_id: technicianId },
    dataType: "json",
    success: function (data) {
      Swal.close();
      if (data.success) {
        let clientList = data.clients
          .map(function (client) {
            return `
           <div style="padding: 10px; border-bottom: 1px solid #ccc; text-align: left;">
           <strong>Name:</strong> ${client.full_name} <br>
           <strong>Issue:</strong> ${client.issue_type} <br>
           <strong>Status:</strong> ${client.status}
           </div>
             `;
          })
          .join("");

        if (!clientList) {
          clientList = "<p>No clients assigned.</p>";
        }

        Swal.fire({
          title: "Assigned Clients",
          html: `<div style="max-height: 300px; overflow-y: auto;">${clientList}</div>`,
          icon: "info",
        });
      } else {
        Swal.fire("Error!", "No assigned clients found.", "error");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.close();
      console.error("Error fetching assigned clients:", errorThrown);
      Swal.fire("Error!", "Failed to fetch assigned clients.", "error");
    },
  });
}

// Attach delegated events on the table body
function attachDelegatedEvents() {
  $("#technicianTable tbody").on("click", function (e) {
    const target = e.target;
    if ($(target).hasClass("assign-btn")) {
      e.stopPropagation();
      assignTechnicianToRequest($(target).data("name"));
    } else if ($(target).hasClass("delete-btn")) {
      e.stopPropagation();
      const technicianId = $(target).data("id");
      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, disable it!",
        cancelButtonText: "Cancel",
      }).then(function (result) {
        if (result.isConfirmed) {
          disableTechnician(technicianId);
        }
      });
    } else if ($(target).hasClass("view-clients-btn")) {
      e.stopPropagation();
      const technicianId = $(target).data("id");
      fetchAssignedClients(technicianId);
    } else if ($(target).hasClass("view-info-btn")) {
      e.stopPropagation();
      const technicianId = $(target).data("id");
      viewTechnicianInfo(technicianId);
    } else {
      const row = $(target).closest("tr");
      if (row.length) {
        const technician = JSON.parse(row.attr("data-technician"));
        Swal.fire({
          title: `Technician: ${technician.name}`,
          html: `
            <div style="text-align: left; max-height: 400px; overflow-y: auto;">
              <strong>Valid ID::</strong><br>
              <img src="frontend/assets/images/technicians/${
                technician.profile_image
              }" 
                   width="100%" style="cursor: pointer;" 
                   onclick="viewImage(this.src)" 
                   onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_id_photo.jpg';"><br>
              <br>
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
        }).then(function (result) {
          if (result.isDenied) {
          }
        });
      }
    }
  });
}

// View Technician Information using AJAX
function viewTechnicianInfo(technicianId) {
  $.ajax({
    url: "backend/fetch_technicians.php",
    type: "GET",
    dataType: "json",
    success: function (data) {
      Swal.close();
      if (data.success) {
        // Find the specific technician by ID
        const technician = data.data.find((tech) => tech.id == technicianId);

        if (!technician) {
          Swal.fire("Error!", "Technician not found.", "error");
          return;
        }

        console.log("Technician Data:", technician);

        Swal.fire({
          title: "Technician Information",
          html: `
            <div style="text-align: left;">
              <p><strong>Valid ID: </strong></p>
              <img src="frontend/assets/images/technicians/${
                technician.profile_image
              }" 
                   alt="Profile Image" 
                   style="width:100%; height:auto; object-fit:cover; margin-bottom:10px; cursor: pointer;" 
                   onerror="this.onerror=null; this.src='frontend/assets/images/uploads/default_profile.jpg';"
                   onclick="viewImage(this.src)">
              <p><strong>Name:</strong> ${technician.name}</p>
              <p><strong>Contact:</strong> ${technician.contact}</p>
              <p><strong>Role:</strong> ${technician.role}</p>
              <p><strong>Status:</strong> <span style="color:${
                technician.status === "Available" ? "green" : "red"
              };">${technician.status}</span></p>
            </div>
          `,
          icon: "info",
        });
      } else {
        Swal.fire("Error!", "Failed to fetch technician data.", "error");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.close();
      console.error("Error fetching technician data:", errorThrown);
      Swal.fire("Error!", "Error fetching technician data.", "error");
    },
  });
}

function assignTechnicianToRequest(technicianName) {
  fetchOngoingMaintenanceRequests()
    .then(function (requests) {
      if (requests.length === 0) {
        Swal.fire(
          "No Ongoing Requests",
          "There are no ongoing maintenance requests to assign.",
          "info"
        );
        return;
      }
      const requestOptions = requests
        .map(function (request) {
          return `<option value="${request.id}">${request.full_name} - ${request.issue_type}</option>`;
        })
        .join("");
      Swal.fire({
        title: "Assign Maintenance Request",
        html: `
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; width: 100%;">
          <select id="maintenanceRequestSelect" class="swal2-select" style="width: 100%; max-width: 100%; box-sizing: border-box; overflow-y: auto;">
            ${requestOptions}
          </select>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: "Assign",
        preConfirm: function () {
          const requestId = $("#maintenanceRequestSelect").val();
          return { technicianName: technicianName, requestId: requestId };
        },
      }).then(function (result) {
        if (result.isConfirmed) {
          assignMaintenanceRequest(
            result.value.technicianName,
            result.value.requestId
          ).then(function () {
            // Update the assigned technician's row immediately
            updateTechnicianClientCount(result.value.technicianName, true);
          });
        }
      });
    })
    .catch(function (error) {
      console.error("Error fetching ongoing maintenance requests:", error);
      Swal.fire(
        "Error!",
        "Failed to fetch ongoing maintenance requests.",
        "error"
      );
    });
}

// Disable Technician Account using AJAX
function disableTechnician(technicianId) {
  $.ajax({
    url: "backend/delete_technician.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id: technicianId }),
    dataType: "json",
    success: function (data) {
      if (data.success) {
        Swal.fire("Disabled!", "Technician has been removed.", "success");
        fetchTechnicians(); // Refresh list
      } else {
        Swal.fire("Error!", data.error, "error");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error disabling technician:", errorThrown);
      Swal.fire("Error!", "Failed to disable technician.", "error");
    },
  });
}

// Update Technician Client Count
function updateTechnicianClientCount(technicianId, immediate = false) {
  fetchAssignedClientsCount(technicianId)
    .then(function (clientCount) {
      const row = $(
        `#technicianTable tbody tr[data-technician-id='${technicianId}']`
      );
      if (row.length) {
        row.find(".client-count").text(clientCount);
        // Update status if needed
        const statusCell = row.find(".technician-status");
        const statusColor = clientCount >= 5 ? "red" : "green";
        const computedStatus = clientCount >= 5 ? "Not-Available" : "Available";
        statusCell.css("color", statusColor).text(computedStatus);
        if (computedStatus !== JSON.parse(row.attr("data-technician")).status) {
          updateTechnicianStatus(technicianId, computedStatus).then(() => {
            if (immediate) {
              // Update the row data-technician attribute to reflect the new status
              const updatedTechnician = JSON.parse(row.attr("data-technician"));
              updatedTechnician.status = computedStatus;
              row.attr("data-technician", JSON.stringify(updatedTechnician));
            }
          });
        }
      }
    })
    .fail(function (error) {
      console.error(
        "Error updating client count for technician " + technicianId,
        error
      );
    });
}

// View Image in Fullscreen
function viewImage(src) {
  Swal.fire({
    imageUrl: src,
    imageAlt: "Technician Image",
    showCloseButton: true,
    showConfirmButton: false,
  });
}

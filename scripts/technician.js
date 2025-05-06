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

              // Only auto-update status if technician is not "On Leave"
              if (technician.status !== "On Leave") {
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
              } else {
                // If the technician is "On Leave", preserve that status
                computedStatus = "On Leave";
              }

              let statusColor;
              if (computedStatus === "Available") {
                statusColor = "green";
              } else if (computedStatus === "Not-Available") {
                statusColor = "red";
              } else {
                // On Leave status
                statusColor = "orange";
              }

              // Determine if assign button should be disabled
              const disableAssignBtn =
                computedStatus === "Not-Available" ||
                computedStatus === "On Leave" ||
                clientCount >= 5;

              // Determine label and style for the toggle button based on technician status
              const toggleBtnLabel =
                computedStatus === "On Leave" ? "Enable" : "Disable";
              const toggleBtnClass =
                computedStatus === "On Leave" ? "enable-btn" : "disable-btn";
              const toggleBtnStyle =
                computedStatus === "On Leave"
                  ? "background-color: #4CAF50; color: white;" // Green for Enable
                  : "background-color: #f44336; color: white;"; // Red for Disable

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
                      }" data-id="${technician.id}" 
                        ${
                          disableAssignBtn
                            ? "disabled style='background-color: #cccccc; cursor: not-allowed;'"
                            : ""
                        }>
                        Assign
                      </button>
                      <button class="${toggleBtnClass}" data-id="${
                technician.id
              }" data-status="${computedStatus}" style="${toggleBtnStyle}">
                        ${toggleBtnLabel}
                      </button>
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
function updateTechnicianStatus(technicianId, newStatus) {
  return $.ajax({
    url: "backend/update_technician_status.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ technician_id: technicianId, status: newStatus }),
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
    } else if ($(target).hasClass("disable-btn")) {
      e.stopPropagation();
      const technicianId = $(target).data("id");
    
      fetchAssignedClientsCount(technicianId).then((clientCount) => {
        if (clientCount > 0) {
          // Show warning modal first
          Swal.fire({
            title: "Technician has active clients!",
            text: "You must reassign their clients before disabling.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Reassign Clients",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              // Fetch assigned clients
              $.ajax({
                url: "backend/fetch_assigned_clients.php",
                data: { technician_id: technicianId },
                dataType: "json",
                success: function (clientData) {
                  if (!clientData.success || !clientData.clients.length) {
                    Swal.fire("Error!", "No clients found to reassign.", "error");
                    return;
                  }
    
                  const clientCheckboxes = clientData.clients
                    .map(
                      (client) => `
                      <div style="margin-bottom: 8px;">
                        <input type="checkbox" class="client-checkbox" value="${client.maintenance_id}" id="client-${client.id}">
                        <label for="client-${client.id}">${client.full_name} - ${client.issue_type}</label>
                      </div>
                    `
                    )
                    .join("");
    
                  // Fetch available technicians
                  $.ajax({
                    url: "backend/fetch_technicians.php",
                    dataType: "json",
                    success: function (techData) {
                      const availableTechs = techData.data.filter(
                        (tech) =>
                          tech.status === "Available" && tech.id !== technicianId
                      );
    
                      if (availableTechs.length === 0) {
                        Swal.fire(
                          "No Available Technicians",
                          "There are no available technicians to transfer clients to.",
                          "info"
                        );
                        return;
                      }
    
                      const selectOptions = availableTechs
                        .map(
                          (tech) =>
                            `<option value="${tech.id}">${tech.name} (${tech.role})</option>`
                        )
                        .join("");
    
                      // Show checkbox + dropdown modal
                      Swal.fire({
                        title: "Select Clients to Reassign",
                        html: `
                          <div style="max-height: 200px; overflow-y: auto; text-align: left;">
                            ${clientCheckboxes}
                          </div>
                          <hr>
                          <label><strong>Select Technician:</strong></label>
                          <select id="reassignTechSelect" class="swal2-select" style="width: 80%;">
                            ${selectOptions}
                          </select>
                        `,
                        showCancelButton: true,
                        confirmButtonText: "Transfer Selected Clients",
                      }).then((res) => {
                        if (res.isConfirmed) {
                          const selectedClientIds = [];
                          $(".client-checkbox:checked").each(function () {
                            selectedClientIds.push($(this).val());
                          });
    
                          const toTechnicianId = $("#reassignTechSelect").val();
    
                          if (selectedClientIds.length === 0) {
                            Swal.fire("Error!", "Please select at least one client.", "error");
                            return;
                          }
    
                          // Reassign clients
                          $.ajax({
                            url: "backend/reassign_clients.php",
                            method: "POST",
                            contentType: "application/json",
                            data: JSON.stringify({
                              clientIds: selectedClientIds,
                              toTechnicianId: toTechnicianId,
                            }),
                            success: function (res) {
                              if (res.success) {
                                Swal.fire("Success!", "Clients reassigned.", "success");
                                fetchTechnicians(); // Refresh
                              } else {
                                Swal.fire("Error!", res.error || "Reassignment failed.", "error");
                              }
                            },
                            error: function (xhr, status, error) {
                              console.error("AJAX Error:", error);
                              console.error("Status:", status);
                              console.error("Response Text:", xhr.responseText);
                              Swal.fire("Error!", `Failed to reassign clients: ${xhr.responseText}`, "error");
                            }                            
                          });
                        }
                      });
                    },
                  });
                },
              });
            }
          });
        } else {
          // No clients, proceed with normal disable
          Swal.fire({
            title: "Are you sure?",
            text: "Do you want to disable this technician? They will be marked as 'On Leave'.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, disable it!",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              toggleTechnicianStatus(technicianId, "On Leave");
            }
          });
        }
      });         
    } else if ($(target).hasClass("enable-btn")) {
      e.stopPropagation();
      const technicianId = $(target).data("id");
      Swal.fire({
        title: "Enable Technician",
        text: "Do you want to enable this technician? They will be marked as 'Available'.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, enable it!",
        cancelButtonText: "Cancel",
      }).then(function (result) {
        if (result.isConfirmed) {
          toggleTechnicianStatus(technicianId, "Available");
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
              <strong>Valid ID:</strong><br>
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
                technician.status === "Available"
                  ? "green"
                  : technician.status === "On Leave"
                  ? "orange"
                  : "red"
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
            // You may call assignTechnicianToRequest here if desired
          }
        });
      }
    }
  });
}


// Toggle technician status (Enable/Disable)
function toggleTechnicianStatus(technicianId, newStatus) {
  $.ajax({
    url: "backend/update_technician_status.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ technician_id: technicianId, status: newStatus }),
    dataType: "json",
    success: function (data) {
      if (data.success) {
        const actionText = newStatus === "On Leave" ? "disabled" : "enabled";
        Swal.fire("Success!", `Technician has been ${actionText}.`, "success");
        fetchTechnicians(); // Refresh the list to update UI
      } else {
        Swal.fire(
          "Error!",
          data.error || "Failed to update technician status.",
          "error"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error updating technician status:", errorThrown);
      Swal.fire("Error!", "Failed to update technician status.", "error");
    },
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

        // Determine status color
        let statusColor;
        if (technician.status === "Available") {
          statusColor = "green";
        } else if (technician.status === "Not-Available") {
          statusColor = "red";
        } else {
          // On Leave status
          statusColor = "orange";
        }

        Swal.fire({
          title: "Technician Information",
          html: `
            <div style="text-align: left;">
              <p><strong>Valid ID: </strong></p>
              <img src="frontend/assets/images/technicians/${technician.profile_image}" 
                   alt="Profile Image" 
                   style="width:100%; height:auto; object-fit:cover; margin-bottom:10px; cursor: pointer;" 
                   onerror="this.onerror=null; this.src='frontend/assets/images/uploads/default_profile.jpg';"
                   onclick="viewImage(this.src)">
              <p><strong>Name:</strong> ${technician.name}</p>
              <p><strong>Contact:</strong> ${technician.contact}</p>
              <p><strong>Role:</strong> ${technician.role}</p>
              <p><strong>Status:</strong> <span style="color:${statusColor};">${technician.status}</span></p>
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

// Update Technician Client Count
function updateTechnicianClientCount(technicianId, immediate = false) {
  fetchAssignedClientsCount(technicianId)
    .then(function (clientCount) {
      const row = $(
        `#technicianTable tbody tr[data-technician-id='${technicianId}']`
      );
      if (row.length) {
        row.find(".client-count").text(clientCount);

        // Get the current status from the row
        const statusCell = row.find(".technician-status");
        const currentStatus = statusCell.text();

        // Only update status automatically if not on leave
        if (currentStatus !== "On Leave") {
          const statusColor = clientCount >= 5 ? "red" : "green";
          const computedStatus =
            clientCount >= 5 ? "Not-Available" : "Available";
          statusCell.css("color", statusColor).text(computedStatus);

          if (computedStatus !== currentStatus) {
            updateTechnicianStatus(technicianId, computedStatus).then(() => {
              if (immediate) {
                // Update the assign button state based on new status
                const assignBtn = row.find(".assign-btn");
                if (computedStatus === "Not-Available" || clientCount >= 5) {
                  assignBtn.prop("disabled", true).css({
                    "background-color": "#cccccc",
                    cursor: "not-allowed",
                  });
                } else {
                  assignBtn
                    .prop("disabled", false)
                    .css({ "background-color": "", cursor: "" });
                }
              }
            });
          }
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

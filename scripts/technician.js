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
      const tableBody = $("#technicianTable tbody");

      if (!tableBody.length) {
        console.error("Technician table tbody not found!");
        return;
      }
      tableBody.empty(); // Clear existing rows

      if (data.success && data.data.length > 0) {
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
              let computedStatus = technician.status;

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
                computedStatus = "On Leave";
              }

              let statusColor;
              if (computedStatus === "Available") {
                statusColor = "green";
              } else if (computedStatus === "Not-Available") {
                statusColor = "red";
              } else {
                statusColor = "orange";
              }

              const disableAssignBtn =
                computedStatus === "Not-Available" ||
                computedStatus === "On Leave" ||
                clientCount >= 5;

              const toggleBtnLabel =
                computedStatus === "On Leave" ? "Enable" : "Disable";
              const toggleBtnClass =
                computedStatus === "On Leave" ? "enable-btn" : "disable-btn";
              const toggleBtnStyle =
                computedStatus === "On Leave"
                  ? "background-color: #4CAF50; color: white;"
                  : "background-color: #f44336; color: white;";

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
                      <button class="reset-password-btn" data-id="${
                        technician.id
                      }">Reset Password</button> <!-- Added Reset Password Button -->
                    </div>
                  </td>
                </tr>
              `);
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

        $.when.apply($, promises).done(function () {
          rowsArray.sort(function (a, b) {
            return a.id - b.id;
          });
          $.each(rowsArray, function (index, obj) {
            tableBody.append(obj.row);
          });
          attachDelegatedEvents();
        });
      } else {
        // If no technicians, display message in the center of the table
        const noDataMessage = document.createElement("tr");
        noDataMessage.innerHTML = `
       <td colspan="7" style="text-align: center; padding: 30px;">
       <div style="display: inline-block; color: #6c757d;">
      <i class="fas fa-project-diagram fa-3x" style="margin-bottom: 10px;"></i>
      <div style="font-size: 16px;">No technicians available</div>
    </div>
  </td>
`;
        tableBody.appendChild(noDataMessage);
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
  <form id="addTechnicianForm" style="display:flex; flex-direction:column; gap:15px; width:100%;">
    <div class="form-group" style="display:flex; flex-direction:column; gap:5px;">
      <label for="technicianName" style="font-weight:600; text-align:left;">Name:</label>
      <input type="text" id="technicianName" class="swal2-input" required style="width:100%; margin:0;">
    </div>

    <div class="form-group" style="display:flex; flex-direction:column; gap:5px;">
      <label for="technicianUsername" style="font-weight:600; text-align:left;">Username:</label>
      <input type="text" id="technicianUsername" class="swal2-input" required style="width:100%; margin:0;">
    </div>

    <div class="form-group" style="display:flex; flex-direction:column; gap:5px;">
      <label for="technicianPassword" style="font-weight:600; text-align:left;">Password:</label>
      <div class="password_container" style="position:relative; width:100%;">
        <input type="password" id="technicianPassword" class="swal2-input" required style="width:100%; padding-right:45px; margin:0;">
        <button type="button" id="togglePassword" style="position:absolute; right:15px; top:50%; transform:translateY(-50%); border:none; background:none; cursor:pointer; color:#666;">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <div id="passwordFeedback" style="font-size:12px; color:red;">Password must be at least 8 characters and contain at least 1 number.</div>

    <div class="form-group" style="display:flex; flex-direction:column; gap:5px;">
      <label for="technicianRole" style="font-weight:600; text-align:left;">Role:</label>
      <select id="technicianRole" class="swal2-input" required style="width:100%; margin:0;">
        <option value="" disabled selected>Select a Role</option>
        <option value="Installer">Installer</option>
        <option value="Repair Technician">Repair Technician</option>
      </select>
    </div>

    <div class="form-group" style="display:flex; flex-direction:column; gap:5px;">
      <label for="technicianContact" style="font-weight:600; text-align:left;">Contact:</label>
      <input type="text" id="technicianContact" class="swal2-input" required style="width:100%; margin:0;">
    </div>

    <div class="form-group" style="display:flex; flex-direction:column; gap:5px;">
      <label for="technicianProfileImage" style="font-weight:600; text-align:left;">Profile:</label>
      <input type="file" id="technicianProfileImage" class="swal2-file" accept="image/*" style="width:100%; margin:0;">
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

      // Validate fields
      if (
        !name ||
        !username ||
        !password ||
        !role ||
        !contact ||
        !profileImage
      ) {
        Swal.showValidationMessage("Please fill out all required fields.");
        return false;
      }

      // Name validation: No numbers, only letters and spaces allowed
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(name)) {
        Swal.showValidationMessage("Name can only contain letters and spaces.");
        return false;
      }

      // Username validation: No spaces or special characters except '_'
      const usernameRegex = /^[A-Za-z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        Swal.showValidationMessage(
          "Username can only contain letters, numbers, and underscores (_), no spaces allowed."
        );
        return false;
      }

      // Password validation: At least 8 characters and 1 number
      const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        Swal.showValidationMessage(
          "Password must be at least 8 characters and contain at least 1 number."
        );
        return false;
      }

      // Contact validation: Format 09xx-xxx-xxxx
      const contactRegex = /^09\d{2}-\d{3}-\d{4}$/;
      if (!contactRegex.test(contact)) {
        Swal.showValidationMessage(
          "Contact number must be in the format 09xx-xxx-xxxx."
        );
        return false;
      }

      return { name, username, password, role, contact, profileImage };
    },
    didOpen: () => {
      const togglePasswordButton = document.getElementById("togglePassword");
      const passwordField = document.getElementById("technicianPassword");
      const passwordFeedback = document.getElementById("passwordFeedback");

      togglePasswordButton.addEventListener("click", () => {
        // Toggle password visibility
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;

        // Toggle icon
        const icon = togglePasswordButton.querySelector("i");
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      });

      // Real-time password validation
      passwordField.addEventListener("input", function () {
        const value = this.value;
        const passwordValid = /^(?=.*\d)[A-Za-z\d]{8,}$/.test(value);

        if (passwordValid) {
          passwordFeedback.textContent = "Valid password";
          passwordFeedback.style.color = "green";
        } else {
          passwordFeedback.textContent =
            "Password must be at least 8 characters and contain at least 1 number.";
          passwordFeedback.style.color = "red";
        }
      });

      // Real-time name validation (No numbers, only letters and spaces allowed)
      const nameField = document.getElementById("technicianName");
      nameField.addEventListener("input", function () {
        const value = this.value.replace(/[^A-Za-z\s]/g, "");
        this.value = value;
      });

      // Real-time username validation (No spaces or special characters except '_')
      const usernameField = document.getElementById("technicianUsername");
      usernameField.addEventListener("input", function () {
        const value = this.value.replace(/[^A-Za-z0-9_]/g, "");
        this.value = value;
      });

      // Real-time contact validation (Format 09xx-xxx-xxxx)
      const contactField = document.getElementById("technicianContact");
      contactField.addEventListener("input", function () {
        let value = this.value.replace(/\D/g, ""); // Remove non-numeric characters
        if (value.length > 11) value = value.substring(0, 11); // Limit to 11 digits

        // Format as 09xx-xxx-xxxx
        if (value.length > 3 && value.length <= 5) {
          value = value.replace(/(\d{4})(\d{1,3})/, "$1-$2");
        } else if (value.length > 5 && value.length <= 8) {
          value = value.replace(/(\d{4})(\d{3})(\d{1,})/, "$1-$2-$3");
        } else if (value.length > 8) {
          value = value.replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3");
        }

        this.value = value;
      });
    },
  }).then(function (result) {
    if (result.isConfirmed) {
      const { name, username, contact } = result.value;

      // Call validateTechnician function
      validateTechnician(name, username, contact, result.value);
    }
  });
});

// Function to validate technician if they already exist
function validateTechnician(name, username, contact, formData) {
  $.ajax({
    url: "backend/validate_technicianAcc.php",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name, username, contact }),
    success: function (response) {
      console.log("Response from server:", response); // Log response for debugging
      if (response.success) {
        // Proceed with adding technician only if no duplicate exists
        addTechnician(formData);
      } else {
        // Show error message if technician already exists
        Swal.fire("Error!", response.message, "error");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error validating technician:", errorThrown);
      Swal.fire("Error!", "Failed to validate technician.", "error");
    },
  });
}

// Function to handle adding technician (placeholder function)
function addTechnician(formData) {
  // You can implement additional logic to handle form submission after validation
  console.log("Technician data:", formData);
}

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
        Swal.fire("Success!", "Technician added successfully.", "success").then(
          () => {
            fetchTechnicians(); // Refresh the technician list AFTER the alert is closed
          }
        );
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
      ).then(() => {
        const technicianId = data.technicianId; // Assuming backend returns technicianId
        updateTechnicianClientCount(technicianId, true); // Update immediately
        fetchTechnicians(); // to refresh the status and total client count
      });
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
  $("#technicianTable tbody") //use to prevent stacking event on each other
    .off("click")
    .on("click", function (e) {
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
                      Swal.fire(
                        "Error!",
                        "No clients found to reassign.",
                        "error"
                      );
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
                            tech.status === "Available" &&
                            parseInt(tech.id) !== parseInt(technicianId)
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

                            const toTechnicianId = $(
                              "#reassignTechSelect"
                            ).val();

                            if (selectedClientIds.length === 0) {
                              Swal.fire(
                                "Error!",
                                "Please select at least one client.",
                                "error"
                              ).then(() => {
                                // Re-show the modal to let the user try again
                                $(target).click(); // Trigger the same button again to reopen the modal
                              });
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
                                  Swal.fire(
                                    "Success!",
                                    "Clients reassigned.",
                                    "success"
                                  ).then(() => {
                                    fetchTechnicians(); // Refresh the technician list
                                  });
                                } else {
                                  Swal.fire(
                                    "Error!",
                                    res.error || "Reassignment failed.",
                                    "error"
                                  );
                                }
                              },
                              error: function (xhr, status, error) {
                                console.error("AJAX Error:", error);
                                console.error("Status:", status);
                                console.error(
                                  "Response Text:",
                                  xhr.responseText
                                );
                                Swal.fire(
                                  "Error!",
                                  `Failed to reassign clients: ${xhr.responseText}`,
                                  "error"
                                );
                              },
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
        Swal.fire(
          "Success!",
          `Technician has been ${actionText}.`,
          "success"
        ).then(() => {
          fetchTechnicians(); // Refresh the list to update the UI
        });
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

// Function to view Technician Information
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
          statusColor = "orange"; // On Leave status
        }

        // Show technician info in a modal with the Reset Password and Delete buttons inside
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
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "Close",
          showDenyButton: true,
          denyButtonText: "Delete Account", // Added Delete Account Button
          showConfirmButton: true, // Add Delete Button
          confirmButtonText: "Reset Password", // Added Reset Password Button
        }).then(function (result) {
          if (result.isDenied) {
            // Call delete account function
            deleteTechnicianAccount(technician.id);
          } else if (result.isConfirmed) {
            // Call reset password function
            resetTechnicianPassword(technician.id);
          }
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

// Function to delete Technician's Account
function deleteTechnicianAccount(technicianId) {
  // Show confirmation before proceeding with deletion
  Swal.fire({
    title: "Are you sure?",
    text: "This action will permanently delete the technician's account. You cannot undo this action.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it",
    reverseButtons: true, // For placing cancel and confirm buttons in reverse order
  }).then((result) => {
    if (result.isConfirmed) {
      // Log the technicianId to ensure it's correctly passed
      console.log("Technician ID to delete:", technicianId);

      // Make AJAX request to backend for deleting the technician's account
      $.ajax({
        url: "backend/delete_technicianAcc.php", // The PHP file that handles the deletion in your backend
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ technician_id: technicianId }), // Send technician id
        success: function (response) {
          console.log(response); // Log the response for debugging purposes
          if (response.success) {
            Swal.fire(
              "Deleted!",
              "Technician's account has been deleted.",
              "success"
            ).then(() => {
              fetchTechnicians(); // Refresh the technician list after deletion
            });
          } else {
            Swal.fire(
              "Error!",
              "Failed to delete technician's account.",
              "error"
            );
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Error deleting technician account:", errorThrown);
          Swal.fire(
            "Error!",
            "Failed to delete technician's account.",
            "error"
          );
        },
      });
    } else {
      Swal.fire(
        "Cancelled",
        "The technician's account was not deleted.",
        "info"
      );
    }
  });
}

// Function to Reset Technician's Password
function resetTechnicianPassword(technicianId) {
  Swal.fire({
    title: "Are you sure?",
    text: "This will reset the technician's password.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Reset it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // Prompt for the new password after confirmation
      Swal.fire({
        title: "Enter New Password",
        input: "password",
        inputPlaceholder: "Enter new password...",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Reset Password",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,

        didOpen: () => {
          const inputField = Swal.getInput();

          // Add feedback div
          const feedbackDiv = document.createElement("div");
          feedbackDiv.id = "passwordFeedback";
          feedbackDiv.style =
            "font-size: 12px; text-align: center; margin-top: 5px; color: red;";
          inputField.insertAdjacentElement("afterend", feedbackDiv);

          // Add show/hide password toggle button with icon
          const toggleBtn = document.createElement("button");
          toggleBtn.type = "button";
          toggleBtn.style =
            "position: absolute; right: 50px; top: 45%; transform: translateY(-50%); font-size: 18px; background: none; border: none; cursor: pointer;";

          // Add Font Awesome icon for password visibility
          toggleBtn.innerHTML = '<i class="fa fa-eye"></i>'; // Initially show eye icon

          toggleBtn.addEventListener("click", () => {
            // Toggle the password visibility
            inputField.type =
              inputField.type === "password" ? "text" : "password";

            // Toggle the icon classes
            const icon = toggleBtn.querySelector("i");
            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
          });

          // Style parent container for relative positioning
          inputField.parentElement.style.position = "relative";
          inputField.parentElement.appendChild(toggleBtn);

          // Real-time validation
          inputField.addEventListener("input", function () {
            const value = this.value;
            const passwordValid = /^(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
            if (passwordValid) {
              feedbackDiv.textContent = "Valid password";
              feedbackDiv.style.color = "green";
            } else {
              feedbackDiv.textContent =
                "Password must be at least 8 characters and contain at least 1 number.";
              feedbackDiv.style.color = "red";
            }
          });
        },

        preConfirm: function (newPassword) {
          if (!newPassword) {
            Swal.showValidationMessage("Please enter a new password.");
            return false;
          }

          const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;
          if (!passwordRegex.test(newPassword)) {
            Swal.showValidationMessage(
              "Password must be at least 8 characters and contain at least 1 number."
            );
            return false;
          }

          // AJAX request to reset password
          return $.ajax({
            url: "backend/reset_technician_password.php",
            type: "POST",
            data: { technician_id: technicianId, new_password: newPassword },
            success: function (response) {
              if (response.status === "success") {
                Swal.fire(
                  "Success!",
                  "Technician's password has been reset.",
                  "success"
                ).then(() => {
                  // Refresh the technician list after the Swal is closed
                  fetchTechnicians();
                });
              } else {
                Swal.fire("Error!", "Failed to reset password.", "error");
              }
            },
            error: function () {
              Swal.fire("Error!", "Failed to reset password.", "error");
            },
          });
        },
      });
    }
  });
}

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
      const tableBody = $("#technicianTable tbody");

      if (!tableBody.length) {
        console.error("Technician table tbody not found!");
        return;
      }
      tableBody.empty(); // Clear existing rows

      if (data.success && data.data.length > 0) {
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
              let computedStatus = technician.status;

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
                computedStatus = "On Leave";
              }

              let statusColor;
              if (computedStatus === "Available") {
                statusColor = "green";
              } else if (computedStatus === "Not-Available") {
                statusColor = "red";
              } else {
                statusColor = "orange";
              }

              const disableAssignBtn =
                computedStatus === "Not-Available" ||
                computedStatus === "On Leave" ||
                clientCount >= 5;

              const toggleBtnLabel =
                computedStatus === "On Leave" ? "Enable" : "Disable";
              const toggleBtnClass =
                computedStatus === "On Leave" ? "enable-btn" : "disable-btn";
              const toggleBtnStyle =
                computedStatus === "On Leave"
                  ? "background-color: #4CAF50; color: white;"
                  : "background-color: #f44336; color: white;";

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

        $.when.apply($, promises).done(function () {
          rowsArray.sort(function (a, b) {
            return a.id - b.id;
          });
          $.each(rowsArray, function (index, obj) {
            tableBody.append(obj.row);
          });
          attachDelegatedEvents();
        });
      } else {
        // If no technicians, display message in the center of the table
        const noDataMessage = ` 
          <tr>
            <td colspan="7" style="text-align: center; font-size: 18px; color: #666;">No technicians available</td>
          </tr>
        `;
        tableBody.append(noDataMessage);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.close();
      console.error("Error fetching technicians:", errorThrown);
      Swal.fire("Error!", "Error fetching technicians.", "error");
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

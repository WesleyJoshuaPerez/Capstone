document.addEventListener("DOMContentLoaded", function () {
  // ===== Sidebar Toggle Logic =====
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main_content");
  const toggleButton = document.getElementById("hamburgerBtn");
  fetchTotals();
  function toggleSidebar() {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");
  }

  function closeSidebar(event) {
    if (window.innerWidth <= 768) {
      if (
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        sidebar.classList.add("collapsed");
        mainContent.classList.add("expanded");
      }
    }
  }

  function checkScreenSize() {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("collapsed");
      mainContent.classList.remove("expanded");
      toggleButton.style.display = "none";
      document.removeEventListener("click", closeSidebar);
    } else {
      sidebar.classList.add("collapsed");
      mainContent.classList.add("expanded");
      toggleButton.style.display = "block";
      document.addEventListener("click", closeSidebar);
    }
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", function (event) {
      event.stopPropagation();
      toggleSidebar();
    });
  }

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  // ===== Section Toggle Logic =====
  const homeLink = document.querySelector("#homeLink");
  const assignedTaskLink = document.querySelector("#assignedTaskLink");
  const trackTaskLink = document.querySelector("#trackTaskLink");
  const changePassLink = document.querySelector("#changePassLink");

  const summaryContainer = document.getElementById("summary-container");
  const assignedTaskDiv = document.getElementById("assignedTaskDiv");
  const trackTaskDiv = document.getElementById("trackTaskDiv");
  const changePassDiv = document.getElementById("changePassDiv");
  const assignedTaskBox = document.getElementById("assignedTaskBox");

  if (summaryContainer) summaryContainer.style.display = "block";
  if (assignedTaskDiv) assignedTaskDiv.style.display = "none";
  if (trackTaskDiv) trackTaskDiv.style.display = "none";
  if (changePassDiv) changePassDiv.style.display = "none";

  if (homeLink) {
    homeLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (summaryContainer) summaryContainer.style.display = "block";
      if (assignedTaskDiv) assignedTaskDiv.style.display = "none";
      if (trackTaskDiv) trackTaskDiv.style.display = "none";
      if (changePassDiv) changePassDiv.style.display = "none";
    });
  }

  if (assignedTaskLink) {
    assignedTaskLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (summaryContainer) summaryContainer.style.display = "none";
      if (assignedTaskDiv) assignedTaskDiv.style.display = "block";
      if (trackTaskDiv) trackTaskDiv.style.display = "none";
      if (changePassDiv) changePassDiv.style.display = "none";

      // Load the tasks into the assignedTaskTable when clicked
      $("#assignedTaskTable tbody").load("backend/fetch_assigned_tasks.php");
    });
  }

  if (trackTaskLink) {
    trackTaskLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (summaryContainer) summaryContainer.style.display = "none";
      if (assignedTaskDiv) assignedTaskDiv.style.display = "none";
      if (trackTaskDiv) trackTaskDiv.style.display = "block";
      if (changePassDiv) changePassDiv.style.display = "none";
    });
  }

  if (changePassLink) {
    changePassLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (summaryContainer) summaryContainer.style.display = "none";
      if (assignedTaskDiv) assignedTaskDiv.style.display = "none";
      if (trackTaskDiv) trackTaskDiv.style.display = "none";
      if (changePassDiv) changePassDiv.style.display = "block";
    });
  }

  if (assignedTaskBox) {
    assignedTaskBox.addEventListener("click", function (event) {
      event.preventDefault();

      // Hide summaryContainer and show assignedTaskDiv
      if (summaryContainer) summaryContainer.style.display = "none";
      if (assignedTaskDiv) assignedTaskDiv.style.display = "block";

      // Load the tasks into the assignedTaskTable when clicked
      $("#assignedTaskTable tbody").load("backend/fetch_assigned_tasks.php");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Toggle password visibility
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const inputId = btn.getAttribute("data-target");
      const inputField = document.getElementById(inputId);
      if (!inputField) return;

      if (inputField.type === "password") {
        inputField.type = "text";
        btn.innerHTML = '<i class="fa fa-eye-slash" aria-hidden="true"></i>';
      } else {
        inputField.type = "password";
        btn.innerHTML = '<i class="fa fa-eye" aria-hidden="true"></i>';
      }
    });
  });

  // Password fields
  const currentPasswordField = document.getElementById("currentPassword");
  const newPasswordField = document.getElementById("newPassword");
  const confirmPasswordField = document.getElementById("confirmPassword");

  // Validation messages
  const currentPasswordMsg = document.getElementById("currentPasswordMsg");
  const newPasswordMsg = document.getElementById("newPasswordMsg");
  const confirmPasswordMsg = document.getElementById("confirmPasswordMsg");

  // at least 8 chars & 1 digit
  const passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;

  // Live validation for new password
  newPasswordField.addEventListener("input", function () {
    if (!passwordRegex.test(newPasswordField.value)) {
      newPasswordMsg.textContent =
        "Password must have at least 8 characters and contain at least 1 number.";
      newPasswordMsg.style.color = "red";
    } else {
      newPasswordMsg.textContent = "Valid password.";
      newPasswordMsg.style.color = "green";
    }
  });

  // Live validation for confirm password
  confirmPasswordField.addEventListener("input", function () {
    if (confirmPasswordField.value !== newPasswordField.value) {
      confirmPasswordMsg.textContent = "Passwords do not match.";
      confirmPasswordMsg.style.color = "red";
    } else {
      confirmPasswordMsg.textContent = "Passwords match.";
      confirmPasswordMsg.style.color = "green";
    }
  });

  // Submit event
  document
    .querySelector("#changePasswordForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const currentPassword = currentPasswordField.value.trim();
      const newPassword = newPasswordField.value.trim();
      const confirmPassword = confirmPasswordField.value.trim();

      // Check if all fields are filled
      if (!currentPassword || !newPassword || !confirmPassword) {
        Swal.fire("Error!", "All fields are required.", "error");
        return;
      }

      // Check new password strength
      if (!passwordRegex.test(newPassword)) {
        Swal.fire(
          "Weak Password!",
          "Password must be at least 8 characters and contain at least 1 number.",
          "error"
        );
        return;
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        Swal.fire(
          "Mismatch!",
          "New password and confirm password do not match.",
          "error"
        );
        return;
      }

      fetch("backend/changepass_dashboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "error") {
            Swal.fire("Error!", data.message, "error");
          } else {
            Swal.fire(
              "Success!",
              "Password updated successfully.",
              "success"
            ).then(() => {
              // Reset fields and messages
              currentPasswordField.value = "";
              newPasswordField.value = "";
              confirmPasswordField.value = "";
              currentPasswordMsg.textContent = "";
              newPasswordMsg.textContent = "";
              confirmPasswordMsg.textContent = "";
            });
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          Swal.fire(
            "Error!",
            "Something went wrong. Please try again.",
            "error"
          );
        });
    });
});

// for fetching assigned task
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("assignedTaskLink")
    .addEventListener("click", function (event) {
      event.preventDefault();
      $("#assignedTaskTable tbody").load("backend/fetch_assigned_tasks.php");
    });
});

// for fetching reports
document.addEventListener("DOMContentLoaded", function () {
  fetch("backend/fetch_track_tasks.php")
    .then((response) => {
      if (!response.ok) {
        // Handle non-OK responses
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched track tasks data:", data);
      if (data.status === "success") {
        const reports = data.data; // Array of progress/completion rows
        populateTrackTaskTable(reports);
      } else {
        console.error("Failed to fetch track tasks:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error fetching track tasks:", error);
    });

  function populateTrackTaskTable(reports) {
    const tbody = document.querySelector("#trackTaskTable tbody");
    tbody.innerHTML = "";

    reports.forEach((report) => {
      const tr = document.createElement("tr");

      // Assigned Technician
      const tdTechName = document.createElement("td");
      tdTechName.textContent = report.submitted_by; // Display submitted_by as Assigned Technician
      tr.appendChild(tdTechName);

      // Status (Display maintenance_status here)
      const tdStatus = document.createElement("td");
      tdStatus.textContent = report.maintenance_status; // Use maintenance_status from the database
      tr.appendChild(tdStatus);

      // Client Name
      const tdClientName = document.createElement("td");
      tdClientName.textContent = report.client_name;
      tr.appendChild(tdClientName);

      // Issue Type
      const tdIssue = document.createElement("td");
      tdIssue.textContent = report.issue_type;
      tr.appendChild(tdIssue);

      // Submitted Report (button to view report)
      const tdReport = document.createElement("td");
      const btnView = document.createElement("button");
      btnView.textContent = "View Report";
      btnView.classList.add("view-report-btn");

      btnView.style.backgroundColor = "#28a745";
      btnView.style.color = "#fff";
      btnView.style.padding = "8px 16px";
      btnView.style.border = "none";
      btnView.style.borderRadius = "4px";
      btnView.style.cursor = "pointer";
      btnView.dataset.report = JSON.stringify(report);
      tdReport.appendChild(btnView);
      tr.appendChild(tdReport);

      tbody.appendChild(tr);
    });
  }

  document
    .querySelector("#trackTaskTable")
    .addEventListener("click", function (e) {
      if (e.target && e.target.classList.contains("view-report-btn")) {
        const reportStr = e.target.dataset.report;
        const reportObj = JSON.parse(reportStr);
        showReportDetails(reportObj);
      }
    });

  function showReportDetails(report) {
    const submittedAt =
      report.report_submitted_at || report.submitted_at || "N/A";

    const modalTitle =
      report.report_type === "completion"
        ? "Completion Report"
        : "Progress Report";

    let htmlContent = `
      <div style="
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 0;
        font-size: 14px;
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 8px 10px;
        color: #333;
        white-space: pre-wrap;
        word-break: break-word;
      ">
        <div style="font-weight: bold;">Report Type:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.report_type
        }</textarea>
        
        <div style="font-weight: bold;">Technician Name:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.submitted_by || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Task Status</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.maintenance_status || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Client Name:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.client_name || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Issue:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.issue_type || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Submitted By:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.submitted_by || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Submitted At:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${submittedAt}</textarea>
        
        <!-- Divider Row -->
        <div style="grid-column: 1 / -1; height: 1px; background: #ccc; margin: 10px 0;"></div>
    `;

    if (report.report_type === "progress") {
      htmlContent += `
        <div style="font-weight: bold;">Progress Update:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 60px;">${
          report.progress_update || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Work Done:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 60px;">${
          report.work_done || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Time Spent (hrs):</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 40px;">${
          report.time_spent_in_hour || "N/A"
        }</textarea>
      `;
    } else if (report.report_type === "completion") {
      htmlContent += `
        <div style="font-weight: bold;">Work Description:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 60px;">${
          report.work_description || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Parts/Materials:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 60px;">${
          report.parts_used || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Issues Encountered:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 60px;">${
          report.issues_encountered || "N/A"
        }</textarea>
        
        <div style="font-weight: bold;">Tech Comments:</div>
        <textarea readonly style="width:100%; border: none; background: #f5f5f5; resize: none; height: 60px;">${
          report.technician_comments || "N/A"
        }</textarea>
      `;
    }

    htmlContent += `</div>`;

    Swal.fire({
      title: modalTitle,
      html: htmlContent,
      icon: "info",
      confirmButtonText: "Close",
      customClass: {
        confirmButton: "swal-confirm-btn",
      },
      buttonsStyling: false,
      heightAuto: false,
      width: 500,
    });
  }

  // for fetching the name of logged in technician
  fetch("backend/get_technician_data.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        document.getElementById("techName").textContent = data.name;
      } else {
        document.getElementById("techName").textContent = "Technician";
      }
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("techName").textContent = "Technician";
    });

  // For displaying form when Progress or Completion report is clicked
  $(document).ready(function () {
    // Progress Report Modal
    $("#assignedTaskTable").on("click", ".progress-report-btn", function () {
      const userId = $(this).data("userid");

      // Retrieve data from the corresponding table row
      const row = $(this).closest("tr");
      const clientName = row.find("td:eq(1)").text(); // 2nd column
      const contactNumber = row.find("td:eq(2)").text(); // 3rd column
      const issueType = row.find("td:eq(4)").text(); // 5th column
      const issueDescription = row.find("td:eq(5)").text(); // 6th column

      Swal.fire({
        title: "Progress Report",
        html: `
        <div style="
          max-height: 500px;
          max-width: 500px;
          overflow-y: auto;
          overflow-x: hidden;
          margin: 0;
          font-size: 14px;
          display: grid;
          grid-template-columns: 120px 1fr;
          column-gap: 10px;
          row-gap: 10px;
          align-items: center;
        ">
          <!-- Client Name (read-only) -->
          <label for="clientName" style="margin: 0;">Client Name:</label>
          <input id="clientName" class="swal2-input" style="font-size: 15px; width: 90%;" value="${clientName}" readonly>

          <!-- Contact Number (read-only) -->
          <label for="contactNumber" style="margin: 0;">Contact Number:</label>
          <input id="contactNumber" class="swal2-input" style="font-size: 15px; width: 90%;" value="${contactNumber}" readonly>

          <!-- Issue Type (read-only) -->
          <label for="issueType" style="margin: 0;">Issue Type:</label>
          <input id="issueType" class="swal2-input" style="font-size: 15px; width: 90%;" value="${issueType}" readonly>

          <!-- Description (read-only) -->
          <label for="issueDescription" style="margin: 0;">Description:</label>
          <textarea id="issueDescription" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" readonly>${issueDescription}</textarea>
          
          <!-- Divider -->
          <div style="grid-column: 1 / -1; height: 1px; background: #ccc; margin: 10px 0;"></div>
          
          <!-- Progress Update (editable) -->
          <label for="progressUpdate" style="margin: 0;">Progress Update:</label>
          <textarea id="progressUpdate" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" placeholder="Enter progress update"></textarea>

          <!-- Work Done (editable) -->
          <label for="workDone" style="margin: 0;">Work Done:</label>
          <textarea id="workDone" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" placeholder="Enter work details"></textarea>

          <!-- Time Spent (editable) as numeric input -->
          <label for="timeSpent" style="margin: 0;">Time Spent (hrs):</label>
          <input type="number" id="timeSpent" class="swal2-input" style="font-size: 15px; width: 90%; resize: none;" placeholder="e.g. 2" min="0" step="0.5">
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Exit",
        preConfirm: () => {
          const progressUpdate = document
            .getElementById("progressUpdate")
            .value.trim();
          const workDone = document.getElementById("workDone").value.trim();
          const timeSpent = document.getElementById("timeSpent").value.trim();

          if (!progressUpdate || !workDone || !timeSpent) {
            Swal.showValidationMessage(
              "Please fill in all progress report fields."
            );
            return false;
          }
          return {
            userId: userId,
            progressUpdate: progressUpdate,
            workDone: workDone,
            timeSpent: timeSpent,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = result.value;
          console.log("Progress Report Data:", formData);
          $.ajax({
            url: "backend/save_progress_report.php",
            method: "POST",
            data: {
              user_id: formData.userId,
              client_name: clientName,
              contact_number: contactNumber,
              issue_type: issueType,
              issue_description: issueDescription,
              progress_update: formData.progressUpdate,
              work_done: formData.workDone,
              time_spent: formData.timeSpent,
            },
            success: function (response) {
              Swal.fire("Success!", "Progress report saved.", "success");
            },
            error: function (error) {
              Swal.fire("Error!", "Failed to save progress report.", "error");
            },
          });
        }
      });
    });

    // Completion Form Modal
    $("#assignedTaskTable").on("click", ".completion-form-btn", function () {
      // Get the client details from the corresponding table row:
      const row = $(this).closest("tr");
      const clientName = row.find("td:eq(1)").text(); // 2nd column
      const contactNumber = row.find("td:eq(2)").text(); // 3rd column
      const issueType = row.find("td:eq(4)").text(); // 5th column
      const issueDescription = row.find("td:eq(5)").text(); // 6th column

      const userId = $(this).data("userid");

      Swal.fire({
        title: "Completion Report",
        html: `
      <div style="
        max-height: 500px;
        max-width: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 0;
        font-size: 14px;
        display: grid;
        grid-template-columns: 120px 1fr;
        column-gap: 10px;
        row-gap: 10px;
        align-items: center;
      ">
        <!-- Display Client Details (read-only) -->
        <label for="clientName" style="margin: 0;">Client Name:</label>
        <input id="clientName" class="swal2-input" style="font-size: 15px; width: 90%;" value="${clientName}" readonly>

        <label for="contactNumber" style="margin: 0;">Contact Number:</label>
        <input id="contactNumber" class="swal2-input" style="font-size: 15px; width: 90%;" value="${contactNumber}" readonly>

        <label for="issueType" style="margin: 0;">Issue Type:</label>
        <input id="issueType" class="swal2-input" style="font-size: 15px; width: 90%;" value="${issueType}" readonly>

        <label for="issueDescription" style="margin: 0;">Description:</label>
        <textarea id="issueDescription" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" readonly>${issueDescription}</textarea>
        
        <!-- Divider -->
        <div style="grid-column: 1 / -1; height: 1px; background: #ccc; margin: 10px 0;"></div>

        <!-- Completion Form Fields -->
        <!-- Completion Date/Time -->
        <label for="completionDateTime" style="margin: 0;">Completion Date/Time:</label>
        <input type="datetime-local" id="completionDateTime" class="swal2-input" style="font-size: 15px; width: 90%;">

        <!-- Work Description -->
        <label for="workDescription" style="margin: 0;">Work Description:</label>
        <textarea id="workDescription" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" placeholder="Describe the work performed"></textarea>

        <!-- Parts/Materials Used -->
        <label for="partsUsed" style="margin: 0;">Parts/Materials:</label>
        <textarea id="partsUsed" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" placeholder="List parts/materials used"></textarea>

        <!-- Issues Encountered -->
        <label for="issuesEncountered" style="margin: 0;">Issues Encountered:</label>
        <textarea id="issuesEncountered" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" placeholder="Describe any issues encountered"></textarea>

        <!-- Technician Comments -->
        <label for="technicianComments" style="margin: 0;">Tech Comments:</label>
        <textarea id="technicianComments" class="swal2-textarea" style="font-size: 15px; width: 90%; resize: none;" placeholder="Enter any additional comments"></textarea>
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Exit",
        didOpen: () => {
          // Calculate today's date
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
          document.getElementById("completionDateTime").min = minDateTime;
        },
        preConfirm: () => {
          const completionDateTime = document
            .getElementById("completionDateTime")
            .value.trim();
          const workDescription = document
            .getElementById("workDescription")
            .value.trim();
          const partsUsed = document.getElementById("partsUsed").value.trim();
          const issuesEncountered = document
            .getElementById("issuesEncountered")
            .value.trim();
          const technicianComments = document
            .getElementById("technicianComments")
            .value.trim();

          if (!completionDateTime || !workDescription) {
            Swal.showValidationMessage(
              "Please fill in the required fields: Completion Date/Time, Work Description, and Technician In-Charge."
            );
            return false;
          }
          return {
            userId: userId,
            completionDateTime: completionDateTime,
            workDescription: workDescription,
            partsUsed: partsUsed,
            issuesEncountered: issuesEncountered,
            technicianComments: technicianComments,
          };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = result.value;
          console.log("Completion Form Data:", formData);
          $.ajax({
            url: "backend/save_completion_report.php",
            method: "POST",
            data: {
              user_id: formData.userId,
              client_name: clientName,
              contact_number: contactNumber,
              issue_type: issueType,
              issue_description: issueDescription,
              completion_datetime: formData.completionDateTime,
              work_description: formData.workDescription,
              parts_used: formData.partsUsed,
              issues_encountered: formData.issuesEncountered,
              technician_comments: formData.technicianComments,
            },
            success: function (response) {
              Swal.fire("Success!", "Completion form saved.", "success");
            },
            error: function (error) {
              Swal.fire("Error!", "Failed to save completion form.", "error");
            },
          });
        }
      });
    });
  });
});

// for changing of password
document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the password values
    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Error!", "All fields are required.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire(
        "Error!",
        "New password and confirm password do not match.",
        "error"
      );
      return;
    }

    // Optionally, add more password validation (e.g., minimum length, complexity)

    // Send AJAX request to update_password.php
    $.ajax({
      url: "backend/update_technician_pass.php",
      method: "POST",
      data: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        if (response.status === "success") {
          Swal.fire("Success!", response.message, "success");
          // Optionally reset the form
          document.getElementById("changePasswordForm").reset();
        } else {
          Swal.fire("Error!", response.message, "error");
        }
      },
      error: function (xhr, status, error) {
        Swal.fire(
          "Error!",
          "An error occurred while updating the password.",
          "error"
        );
      },
    });
  });

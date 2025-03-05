document
  .getElementById("applicationLink")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var appDiv = document.getElementById("applicationDiv");
    appDiv.style.display =
      appDiv.style.display === "none" || appDiv.style.display === ""
        ? "block"
        : "none";
    fetchApplications();
  });

function fetchApplications() {
  Swal.fire({
    title: "Loading Applications...",
    text: "Please wait while we fetch the applications.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("GET", "backend/fetch_applicants.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      Swal.close(); // Close the loading Swal when data is loaded
      if (xhr.status === 200) {
        document.querySelector("#applicationTable tbody").innerHTML =
          xhr.responseText;
        attachRowClickEvent();
      } else {
        Swal.fire("Error!", "Failed to load applications.", "error");
      }
    }
  };
  xhr.send();
}

function attachRowClickEvent() {
  const rows = document.querySelectorAll("#applicationTable tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const user = JSON.parse(row.getAttribute("data-user"));

      Swal.fire({
        title: `Application ID: ${user.id}`,
        html: `
          <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
              <strong>Subscription Plan:</strong> ${user.subscription_plan}<br>
              <strong>Name:</strong> ${user.first_name} ${user.last_name}<br>
              <strong>Contact:</strong> ${user.contact_number}<br>
              <strong>Email:</strong> ${user.email_address}<br>
              <strong>Birth Date:</strong> ${user.birth_date}<br>
              <strong>ID Type:</strong> ${user.id_type} (${user.id_number})<br>
              <strong>Home Ownership:</strong> ${user.home_ownership_type}<br>
              <strong>Address:</strong> ${user.barangay}, ${user.municipality}, ${user.province}<br>
              <strong>Installation Date:</strong> ${user.installation_date}<br>
              <strong>Registration Date:</strong> ${user.registration_date}<br>

              <strong>ID Photo:</strong><br>
              <img src="frontend/assets/images/uploads/Id_Photo/${user.id_photo}" width="100%" style="cursor: pointer;" 
                  onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_id_photo.jpg';"><br>

              <strong>Proof of Residency:</strong><br>
              <img src="frontend/assets/images/uploads/Proof_of_Residency/${user.proof_of_residency}" width="100%" style="cursor: pointer;" 
                  onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_proof_of_residency.jpg';">
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
          approveApplication(user.id);
        } else if (result.isDenied) {
          denyApplication(user.id);
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

function approveApplication(applicationId) {
  updateApplicationStatus(applicationId, "Approved");
}

function denyApplication(applicationId) {
  updateApplicationStatus(applicationId, "Denied");
}

function updateApplicationStatus(applicationId, status) {
  Swal.fire({
    title: `Processing ${status}...`,
    text: "Please wait while we update the application status.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "backend/update_application_status.php", true);
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
              setTimeout(fetchApplications, 500);
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

  xhr.send(JSON.stringify({ id: applicationId, status: status }));
}

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
  fetch("backend/fetch_applicants.php")
    .then((response) => response.text())
    .then((html) => {
      document.querySelector("#applicationTable tbody").innerHTML = html;
      attachRowClickEvent();
    })
    .catch((error) => console.error("Error fetching data:", error));
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
  fetch("backend/update_application_status.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: applicationId, status: status }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire(
          "Success!",
          `Application ${status.toLowerCase()} successfully.`,
          "success"
        );
        fetchApplications(); // Refresh the table to reflect changes
      } else {
        Swal.fire("Error!", "Failed to update application status.", "error");
      }
    })
    .catch((error) => console.error("Error updating status:", error));
}

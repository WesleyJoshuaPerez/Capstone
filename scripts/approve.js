// Full approve.js with NAP box assignment via Swal

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("applicationLink")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      const appDiv = document.getElementById("applicationDiv");
      appDiv.style.display =
        appDiv.style.display === "none" || appDiv.style.display === ""
          ? "block"
          : "none";
      fetchApplications();
    });

  document
    .getElementById("applicantsBox")
    ?.addEventListener("click", function (event) {
      event.preventDefault();
      const appBox = document.getElementById("applicantsBox");
      appBox.style.display =
        appBox.style.display === "none" || appBox.style.display === ""
          ? "block"
          : "none";
      fetchApplications();
    });

  function fetchApplications() {
    Swal.fire({
      title: "Loading Applications...",
      text: "Please wait while we fetch the applications.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "backend/fetch_applicants.php", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        Swal.close();
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
    document.querySelectorAll("#applicationTable tbody tr").forEach((row) => {
      row.addEventListener("click", () => {
        const dataUser = row.getAttribute("data-user");
        try {
          const user = JSON.parse(dataUser);

          Swal.fire({
  title: `Application ID: ${user.id}`,
  html: `
    <div class="application-details" style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
      <strong>Subscription Plan:</strong> ${user.subscription_plan}<br>
      <strong>Name:</strong> ${user.first_name} ${user.last_name}<br>
      <strong>Contact:</strong> ${user.contact_number}<br>
      <strong>Email:</strong> ${user.email_address}<br>
      <strong>Birth Date:</strong> ${user.birth_date}<br>
      <strong>ID Type:</strong> ${user.id_type}<br>
      <strong>ID Number:</strong> ${user.id_number || "N/A"}<br>
      <strong>Home Ownership:</strong> ${user.home_ownership_type}<br>
      <strong>Address:</strong> ${user.barangay}, ${user.municipality}, ${user.province}<br>
      <strong>Installation Date:</strong> ${user.installation_date}<br>
      <strong>Registration Date:</strong> ${user.registration_date}<br>
      <strong>ID Photo:</strong><br>
      <img src="frontend/assets/images/uploads/Id_Photo/${user.id_photo}" width="100%" style="cursor: pointer;"
           onclick="viewImage(this.src)" 
           onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_id_photo.jpg';"><br>
      <strong>Proof of Residency:</strong><br>
      <img src="frontend/assets/images/uploads/Proof_of_Residency/${user.proof_of_residency}" width="100%" style="cursor: pointer;"
           onclick="viewImage(this.src)" 
           onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_proof_of_residency.jpg';">
    </div>`,
            icon: "info",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "Approve",
            denyButtonText: "Deny",
            cancelButtonText: "Close",
          }).then((result) => {
            if (result.isConfirmed) {
              fetchAvailableNapBoxes(user.id);
            } else if (result.isDenied) {
              denyApplication(user.id);
            }
          });
        } catch (error) {
          console.error("Error parsing data-user:", error);
          Swal.fire("Error", "Invalid data for the selected row.", "error");
        }
      });
    });
  }

  function fetchAvailableNapBoxes(applicationId) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "backend/fetch_napboxes.php", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (!response.success || !Array.isArray(response.data)) {
            return Swal.fire("Error", "Failed to load NAP boxes.", "error");
          }

          const napboxes = response.data.filter(
            (nap) => nap.available_slots > 0 && nap.nap_box_status === "Enabled"
          );

          if (napboxes.length === 0) {
            return Swal.fire(
              "No Available NAP Boxes",
              "There are no available NAP boxes at the moment.",
              "warning"
            );
          }

          const options = napboxes
            .map(
              (nap) =>
                `<option value="${nap.nap_box_id}">${nap.nap_box_brgy} (Slots: ${nap.available_slots})</option>`
            )
            .join("");

          Swal.fire({
            title: "Assign NAP Box",
            html: `
              <label>Select a NAP Box:</label>
              <select id="napBoxSelect" class="swal2-select">${options}</select>
            `,
            showCancelButton: true,
            confirmButtonText: "Assign & Approve",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              const selectedNapBox =
                document.getElementById("napBoxSelect").value;
              approveApplication(applicationId, selectedNapBox);
            }
          });
        } catch (e) {
          console.error("NAP box parsing error:", e);
          Swal.fire("Error", "Failed to parse NAP box list.", "error");
        }
      }
    };
    xhr.send();
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

  function approveApplication(applicationId, napBoxId) {
    updateApplicationStatus(applicationId, "Approved", napBoxId);
  }

  function denyApplication(applicationId) {
    updateApplicationStatus(applicationId, "Denied");
  }

  function updateApplicationStatus(applicationId, status, napBoxId = null) {
    Swal.fire({
      title: `Processing ${status}...`,
      text: "Please wait while we update the application status.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "backend/update_application_status.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        Swal.close();
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
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
            Swal.fire("Error!", "Invalid server response.", "error");
          }
        } else {
          Swal.fire("Error!", "Failed to communicate with server.", "error");
        }
      }
    };

    xhr.send(
      JSON.stringify({
        id: applicationId,
        status: status,
        nap_box_id: napBoxId,
      })
    );
  }
});

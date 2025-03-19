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
                    <td>${technician.role}</td>
                    <td>${technician.contact}</td>
                    <td style="color: ${statusColor}; font-weight: bold;">${technician.status}</td>
                    <td>
                        <button class="assign-btn" data-id="${technician.id}">Assign</button>
                        <button class="delete-btn" data-id="${technician.id}">Delete</button>
                    </td>
                  `;

          tableBody.appendChild(row);
        });

        attachTechnicianRowClickEvent();
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
                  <img src="frontend/assets/images/technicians//${
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
          Swal.fire({
            title: "Assign Task",
            input: "text",
            inputLabel: "Enter the task description:",
            showCancelButton: true,
            confirmButtonText: "Assign",
          }).then((taskResult) => {
            if (taskResult.isConfirmed && taskResult.value) {
              console.log(
                `Task assigned to ${technician.name}: ${taskResult.value}`
              );
              Swal.fire("Success", "Task assigned successfully.", "success");
            }
          });
        }
      });
    });
  });
}

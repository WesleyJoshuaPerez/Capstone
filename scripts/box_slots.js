document.addEventListener("DOMContentLoaded", function () {
  // Fetch existing NapBox data on page load
  loadNapBoxes();

  // Event listener for the Add NapBox button
  document
    .getElementById("addNapboxBtn")
    .addEventListener("click", function () {
      Swal.fire({
        title: "Add Nap Box",
        html:
          `<style>
            .swal2-input {
              max-width: 100% !important;
              width: 90% !important;
              margin: 10px auto !important;
            }
            #barangayFeedback {
              font-size: 13px;
              margin-top: -5px;
              text-align: center;
              color: red;
              display: block;
            }
          </style>
          <div>
            <select id="barangayDropdown" class="swal2-input">
              <option value="" disabled selected>Select Barangay</option>
            </select>
            <input id="postNumber" class="swal2-input" placeholder="Post Number" type="number" min="1" max="15">
            <input id="slots" class="swal2-input" placeholder="Available Slots" type="number">
            <div id="leafletMapContainer" style="height: 300px; margin-top: 10px; border-radius: 10px;"></div>
            <button id="pinLocationBtn" class="swal2-styled" style="margin-top: 10px;">Pin My Current Location</button>
            <p style="margin-top: 10px;">Click on the map to set location.</p>
          </div>`,
        showCancelButton: true,
        confirmButtonText: "Save",
        width: 650,
        didOpen: () => {
          let map, marker;
          let defaultLat = 14.6206;
          let defaultLng = 120.581;

          function initializeMap(lat, lng) {
            map = L.map("leafletMapContainer").setView([lat, lng], 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            }).addTo(map);
            setTimeout(() => map.invalidateSize(), 200);

            map.on("click", function (e) {
              const clickedLat = e.latlng.lat;
              const clickedLng = e.latlng.lng;
              setMarker(clickedLat, clickedLng);
            });
          }

          function setMarker(lat, lng) {
            if (marker) {
              marker.setLatLng([lat, lng]);
            } else {
              marker = L.marker([lat, lng], { draggable: true }).addTo(map);
            }
            Swal.getPopup().dataset.lat = lat;
            Swal.getPopup().dataset.lng = lng;
          }

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => initializeMap(position.coords.latitude, position.coords.longitude),
              () => initializeMap(defaultLat, defaultLng)
            );
          } else {
            initializeMap(defaultLat, defaultLng);
          }

          document.getElementById("pinLocationBtn").addEventListener("click", () => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                map.setView([lat, lng], 15);
                setMarker(lat, lng);
              },
              () => Swal.fire("Error", "Unable to access current location.", "error")
            );
          });

          // barangay options
          const barangayDropdown = document.getElementById("barangayDropdown");
          const barangays = [
            "ARELLANO", "BAGUMBAYAN", "BALAGTAS", 
            "BALUT", "BANTAN", "BILOLO", "CALUNGUSAN", "CAMACHILE", 
            "DAANG BAGO", "DAANG BILOLO", "DAANG PARE", 
            "GENERAL LIM", "KAPUNITAN", "LATI", "LUSUNGAN", 
            "PUTING BUHANGIN", "SABATAN", "SAN VICENTE", 
            "SANTA ELENA", "SANTO DOMINGO", "VILLA ANGELES", 
            "WAKAS", "WAWA"
          ];                  

          barangays.forEach((bgy) => {
            const opt = document.createElement("option");
            opt.value = bgy;
            opt.textContent = bgy;
            barangayDropdown.appendChild(opt);
          });

          // style the dropdown
          const select = document.getElementById("barangayDropdown");
          select.style.backgroundColor = "#f7fafc";
          select.style.border = "1px solid #d1d5db";
          select.style.borderRadius = "8px";
          select.style.padding = "0.5rem 1rem";
          select.style.fontSize = "0.875rem";
          select.style.color = "#4a4a4a";
          select.style.width = "100%";
          select.style.marginBottom = "1rem";
          select.style.transition = "border-color 0.2s ease";

          select.addEventListener("focus", () => {
            select.style.borderColor = "#3b82f6";
            select.style.boxShadow = "0 0 0 1px #3b82f6";
          });

          select.addEventListener("blur", () => {
            select.style.borderColor = "#d1d5db";
            select.style.boxShadow = "none";
          });

          // add event listener to update the combined barangay value when a barangay is selected
          barangayDropdown.addEventListener("change", () => {
            const barangay = document.getElementById("barangayDropdown").value.trim();
            const postNumber = document.getElementById("postNumber").value.trim();
            const barangayField = document.getElementById("barangay");

            if (barangay && postNumber) {
              barangayField.value = `${barangay}-POST${postNumber}`;
            } else {
              barangayField.value = barangay; // only update the barangay if no post number is entered
            }
          });

          // listen for input in the Post Number field to update the combined value
          const postInput = document.getElementById("postNumber");
          postInput.addEventListener("input", () => {
            const barangayDropdown = document.getElementById("barangayDropdown").value.trim();
            const postNumber = postInput.value.trim();
            const barangayField = document.getElementById("barangay");

            if (barangayDropdown && postNumber) {
              barangayField.value = `${barangayDropdown}-POST${postNumber}`;
            }
          });

          // Real-time Slot Limitation (Max 15)
          const slotsInput = document.getElementById("slots");
          slotsInput.addEventListener("input", () => {
            const value = parseInt(slotsInput.value, 10);
            if (value > 15) {
              slotsInput.value = 15;
              Swal.showValidationMessage("Available slots cannot exceed 15.");
            } else if (value < 1) {
              slotsInput.value = 1;
              Swal.showValidationMessage("Available slots must be at least 1.");
            } else {
              Swal.resetValidationMessage();
            }
          });

          // Real-time Post Number Limitation (Max 15)
          postInput.addEventListener("input", () => {
            const value = parseInt(postInput.value, 10);
            if (value > 15) {
              postInput.value = 15;
              Swal.showValidationMessage("Post number cannot exceed 15.");
            } else if (value < 1) {
              postInput.value = 1;
              Swal.showValidationMessage("Post number must be at least 1.");
            } else {
              Swal.resetValidationMessage();
            }
          });
        },

        preConfirm: () => {
          const barangayDropdown = document.getElementById("barangayDropdown").value.trim();
          const postNumber = document.getElementById("postNumber").value.trim();
          const barangay = `${barangayDropdown}-POST${postNumber}`;

          const slots = document.getElementById("slots").value.trim();
          const lat = Swal.getPopup().dataset.lat;
          const lng = Swal.getPopup().dataset.lng;

          const formatRegex = /^[A-Za-z.\s]+-POST\d+$/; // Must match BARANGAY-POST[NUMBER]

          if (!barangay || !slots || !lat || !lng) {
            const slotNumber = parseInt(slots, 10);
            if (isNaN(slotNumber) || slotNumber < 1 || slotNumber > 15) {
              Swal.showValidationMessage("Available slots must be between 1 and 15.");
              return false;
            }
            Swal.showValidationMessage(
              "Please fill all fields and select a location on the map."
            );
            return false;
          }

          if (!formatRegex.test(barangay)) {
            Swal.showValidationMessage(
              "Barangay name must be in the format BARANGAY-POST[NUMBER] (e.g. BILOLO-POST1)."
            );
            return false;
          }

          return { barangay, slots, lat, lng };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { barangay, slots, lat, lng } = result.value;

          // Step 1: Check if barangay already exists in DB
          fetch("backend/check_napbox_exists.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ barangay })
          })
          .then((res) => res.json())
          .then((check) => {
            if (check.exists) {
              Swal.fire("Duplicate Entry", "Nap Box for this barangay already exists.", "warning");
              return;
            }

            // Step 2: Proceed with saving if no duplicate found
            fetch("backend/save_napbox.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nap_box_brgy: barangay,
                available_slots: slots,
                nap_box_longitude: lng,
                nap_box_latitude: lat,
              }),
            })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                Swal.fire("Saved!", "Nap Box has been saved.", "success");
                loadNapBoxes(); // Reload the table data
              } else {
                Swal.fire("Error", "Could not save Nap Box.", "error");
              }
            });
          });
        }
      });
    });
});

// Function to load all NapBox entries from the database
function loadNapBoxes() {
  fetch("backend/fetch_napboxes.php")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#boxslotTable tbody");
      tableBody.innerHTML = ""; // Clear the existing rows

      if (data.success && data.data.length > 0) {
        data.data.forEach((napBox) => {
          const row = document.createElement("tr");
          row.innerHTML =
            `<td>${napBox.nap_box_id}</td>
             <td>${napBox.nap_box_brgy}</td>
             <td>${napBox.available_slots}</td>
             <td>
               <button id="toggleStatusBtn_${napBox.nap_box_id}" class="toggle-status-btn" 
               data-status="${napBox.nap_box_status}">
               ${napBox.nap_box_status === "Enabled" ? "Disable" : "Enable"}
               </button>
             </td>`;
          tableBody.appendChild(row);
        });
      } else {
        const row = document.createElement("tr");
        row.innerHTML =
          `<td colspan="4" style="text-align: center;">
             No Nap Boxes found.
           </td>`;
        tableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error loading NapBox data:", error);
      const tableBody = document.querySelector("#boxslotTable tbody");
      tableBody.innerHTML =
        `<tr>
           <td colspan="4" style="text-align: center; color: red;">
             Failed to load data.
           </td>
         </tr>`;
    });
}

// Delegate the event for the "Enable/Disable" button
document.querySelector("#boxslotTable tbody").addEventListener("click", function (e) {
  const target = e.target;

  // Only handle the button click
  if (target && target.classList.contains("toggle-status-btn")) {
    const napBoxId = target.id.split("_")[1];  // Extract nap_box_id from the button ID
    toggleNapBoxStatus(napBoxId);
  }
});

// Function to toggle the status of a NapBox (enable/disable) with confirmation
function toggleNapBoxStatus(napBoxId) {
  const button = document.querySelector(`#toggleStatusBtn_${napBoxId}`);
  const currentStatus = button.getAttribute("data-status");

  const action = currentStatus === "Enabled" ? "disable" : "enable";
  const actionText = action === "enable" ? "Enable" : "Disable";
  const confirmationText =
    action === "enable"
      ? "Are you sure you want to enable this NapBox?"
      : "Are you sure you want to disable this NapBox?";

  // Show confirmation dialog
  Swal.fire({
    title: confirmationText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: actionText,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with updating the NapBox status
      fetch(`backend/toggle_napbox_status.php?nap_box_id=${napBoxId}&action=${action}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Success", `NapBox has been ${action}d.`, "success");

            // Update the button's status after success
            button.setAttribute("data-status", action === "enable" ? "Enabled" : "Disabled");

            // Update button text
            button.textContent = action === "enable" ? "Disable" : "Enable";

            // Reload the NapBox data to reflect the change
            loadNapBoxes();
          } else {
            Swal.fire("Error", "Could not update NapBox status.", "error");
          }
        })
        .catch((error) => {
          console.error("Error updating NapBox status:", error);
          Swal.fire("Error", "An error occurred while updating NapBox status.", "error");
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch existing NapBox data on page load
  loadNapBoxes();

  // Event listener for the Add NapBox button
  document
    .getElementById("addNapboxBtn")
    .addEventListener("click", function () {
      Swal.fire({
        title: "Add Nap Box",
        html: `
            <input id="barangay" class="swal2-input" placeholder="Barangay">
            <input id="slots" class="swal2-input" placeholder="Available Slots" type="number">
            <div id="leafletMapContainer" style="height: 300px; margin-top: 10px; border-radius: 10px;"></div>
            <button id="pinLocationBtn" class="swal2-styled" style="margin-top: 10px;">📍 Pin My Current Location</button>
            <p style="margin-top: 10px;">Click on the map to set location.</p>
          `,
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
              (position) => {
                initializeMap(
                  position.coords.latitude,
                  position.coords.longitude
                );
              },
              () => {
                initializeMap(defaultLat, defaultLng);
              }
            );
          } else {
            initializeMap(defaultLat, defaultLng);
          }

          document
            .getElementById("pinLocationBtn")
            .addEventListener("click", () => {
              if (!navigator.geolocation) return;

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  map.setView([lat, lng], 15);
                  setMarker(lat, lng);
                },
                (error) => {
                  Swal.fire(
                    "Error",
                    "Unable to access current location.",
                    "error"
                  );
                }
              );
            });
        },
        preConfirm: () => {
          const barangay = document.getElementById("barangay").value;
          const slots = document.getElementById("slots").value;
          const lat = Swal.getPopup().dataset.lat;
          const lng = Swal.getPopup().dataset.lng;

          if (!barangay || !slots || !lat || !lng) {
            Swal.showValidationMessage(
              "Please fill all fields and select a location on the map."
            );
            return false;
          }

          return { barangay, slots, lat, lng };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const { barangay, slots, lat, lng } = result.value;

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

      if (data.success) {
        data.data.forEach((napBox) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${napBox.nap_box_id}</td>
              <td>${napBox.nap_box_brgy}</td>
              <td>${napBox.available_slots}</td>
              <td>
                <button id="toggleStatusBtn_${
                  napBox.nap_box_id
                }" class="toggle-status-btn" 
                  data-status="${napBox.nap_box_status}"
                  onclick="toggleNapBoxStatus(${napBox.nap_box_id})">
                  ${napBox.nap_box_status === "Enabled" ? "Disable" : "Enable"}
                </button>
              </td>
            `;
          tableBody.appendChild(row);
        });
      } else {
        console.log("No NapBox records found.");
      }
    })
    .catch((error) => console.error("Error loading NapBox data:", error));
}

// Function to toggle the status of a NapBox (enable/disable)
function toggleNapBoxStatus(napBoxId) {
  fetch(`backend/toggle_napbox_status.php?nap_box_id=${napBoxId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire("Success", "Nap Box status updated.", "success");
        loadNapBoxes(); // Reload the table data after status change
      } else {
        Swal.fire("Error", "Could not update Nap Box status.", "error");
      }
    });
}

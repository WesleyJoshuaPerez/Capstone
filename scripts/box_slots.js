// Modified full code with optimizations and improved responsiveness

let existingNapBoxes = []; // Will hold fetched NapBoxes

// Define icons once
const enabledIcon = L.icon({
  iconUrl: "frontend/assets/images/icons/napbox_enabled.png",
  iconSize: [64, 40],
  iconAnchor: [32, 40],
  popupAnchor: [0, -40],
});

const disabledIcon = L.icon({
  iconUrl: "frontend/assets/images/icons/napbox_disabled.png",
  iconSize: [64, 40],
  iconAnchor: [32, 40],
  popupAnchor: [0, -40],
});

async function refreshExistingNapBoxes() {
  const res = await fetch("backend/fetch_napboxes.php");
  const data = await res.json();
  existingNapBoxes = data.success && data.data.length > 0 ? data.data : [];
}

document.addEventListener("DOMContentLoaded", async function () {
  await refreshExistingNapBoxes();
  loadNapBoxes();

  document
    .getElementById("addNapboxBtn")
    .addEventListener("click", async function () {
      Swal.fire({
  title: "Add Nap Box",
  html: `<style>
        .swal2-input {
      max-width: 100% !important;
      width: 90% !important;
      margin: 5px auto !important;
      display: block;
    }
    .swal2-label {
      text-align: left;
      display: block;
      width: 90%;
      margin: 5px auto 0 auto;
      font-weight: bold;
    }

    /* Apply only on mobile (screens <= 768px) */
    @media (max-width: 768px) {
      .swal2-input,
      .swal2-label,
      #leafletMapContainer,
      #pinLocationBtn,
      .swal2-title {
        font-size: 14px !important; /* adjust to your liking */
      }

      #leafletMapContainer {
        height: 200px !important; /* make map smaller on mobile */
      }

      #pinLocationBtn {
        padding: 6px 10px !important;
        font-size: 13px !important;
      }
    }
  </style>
      <div>
        <label for="barangayDropdown" class="swal2-label">Barangay</label>
        <select id="barangayDropdown" class="swal2-input">
          <option value="" disabled selected>Select Barangay</option>
        </select>

        <label for="postNumber" class="swal2-label">Post Number</label>
        <input id="postNumber" class="swal2-input" placeholder="Post Number" type="number" readonly>

        <label for="slots" class="swal2-label">Slots</label>
        <input id="slots" class="swal2-input" type="number" value="15" readonly>

        <label class="swal2-label">Location</label>
        <div id="leafletMapContainer" style="height: 300px; margin-top: 5px; border-radius: 10px;"></div>

        <button id="pinLocationBtn" class="swal2-styled" style="margin-top: 10px;">Pin My Current Location</button>
        <p style="margin-top: 10px;">Click on the map to set location.</p>
      </div>`,
        showCancelButton: true,
        confirmButtonText: "Save",
        width: 650,
        didOpen: async () => {
          let map, marker;
          const defaultLat = 14.6206;
          const defaultLng = 120.581;

          function initializeMap(lat, lng) {
            map = L.map("leafletMapContainer").setView([lat, lng], 14);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: "© OpenStreetMap contributors",
            }).addTo(map);
            setTimeout(() => map.invalidateSize(), 200);

            map.on("click", function (e) {
              setMarker(e.latlng.lat, e.latlng.lng);
            });

            existingNapBoxes.forEach((box) => {
              if (box.nap_box_latitude && box.nap_box_longitude) {
                const iconToUse =
                  box.nap_box_status === "Enabled" ? enabledIcon : disabledIcon;
                L.marker(
                  [
                    parseFloat(box.nap_box_latitude),
                    parseFloat(box.nap_box_longitude),
                  ],
                  { icon: iconToUse }
                )
                  .addTo(map)
                  .bindPopup(`${box.nap_box_brgy} (${box.nap_box_status})`);
              }
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
              (position) =>
                initializeMap(
                  position.coords.latitude,
                  position.coords.longitude
                ),
              () => initializeMap(defaultLat, defaultLng)
            );
          } else {
            initializeMap(defaultLat, defaultLng);
          }

          document
            .getElementById("pinLocationBtn")
            .addEventListener("click", () => {
              const btn = document.getElementById("pinLocationBtn");
              btn.innerText = "Locating...";
              if (!navigator.geolocation) return;
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  map.setView([lat, lng], 15);
                  setMarker(lat, lng);
                  btn.innerText = "Pin My Current Location";
                },
                () => {
                  Swal.fire(
                    "Error",
                    "Unable to access current location.",
                    "error"
                  );
                  btn.innerText = "Pin My Current Location";
                }
              );
            });

          // Populate dropdown
          const dropdown = document.getElementById("barangayDropdown");
          const barangays = [
            "ARELLANO",
            "BAGUMBAYAN",
            "BALAGTAS",
            "BALUT",
            "BANTAN",
            "BILOLO",
            "CALUNGUSAN",
            "CAMACHILE",
            "DAANG BAGO",
            "DAANG BILOLO",
            "DAANG PARE",
            "GENERAL LIM",
            "KAPUNITAN",
            "LATI",
            "LUSUNGAN",
            "PUTING BUHANGIN",
            "SABATAN",
            "SAN VICENTE",
            "SANTA ELENA",
            "SANTO DOMINGO",
            "VILLA ANGELES",
            "WAKAS",
            "WAWA",
          ];

          barangays.forEach((bgy) => {
            const option = document.createElement("option");
            option.value = bgy;
            option.textContent = bgy;
            dropdown.appendChild(option);
          });

          dropdown.addEventListener("change", () => {
            const selectedBarangay = dropdown.value;
            const related = existingNapBoxes.filter((n) =>
              n.nap_box_brgy.startsWith(`${selectedBarangay}-POST`)
            );
            const nextPost = related.length + 1;
            document.getElementById("postNumber").value = nextPost;
          });
        },
        preConfirm: () => {
          const barangay = document
            .getElementById("barangayDropdown")
            .value.trim();
          const post = document.getElementById("postNumber").value.trim();
          const slots = document.getElementById("slots").value.trim();
          const lat = Swal.getPopup().dataset.lat;
          const lng = Swal.getPopup().dataset.lng;

          if (!barangay || !post || !lat || !lng) {
            Swal.showValidationMessage(
              "Please complete all fields and pin the location."
            );
            return false;
          }

          const fullName = `${barangay}-POST${post}`;
          return { barangay: fullName, slots, lat, lng };
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
              nap_box_latitude: lat,
              nap_box_longitude: lng,
            }),
          })
            .then((res) => res.json())
            .then(async (data) => {
              if (data.success) {
                Swal.fire("Saved!", "Nap Box has been saved.", "success");
                await refreshExistingNapBoxes();
                loadNapBoxes();
              } else {
                Swal.fire("Error", "Could not save Nap Box.", "error");
              }
            });
        }
      });
    });
});

function loadNapBoxes() {
  fetch("backend/fetch_napboxes.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#boxslotTable tbody");
      tbody.innerHTML = "";

      if (data.success && data.data.length > 0) {
        data.data.forEach((napBox) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${napBox.nap_box_id}</td>
            <td>${napBox.nap_box_brgy}</td>
            <td>${napBox.available_slots}</td>
            <td>
              <button id="toggleStatusBtn_${
                napBox.nap_box_id
              }" class="toggle-status-btn" data-status="${
            napBox.nap_box_status
          }">
                ${napBox.nap_box_status === "Enabled" ? "Disable" : "Enable"}
              </button>
            </td>`;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; padding: 30px;">
              <div style="display: inline-block;">
                <i class="fa-solid fa-box fa-3x" style="margin-bottom: 10px; color: #3775b9;"></i>
                <div style="font-size: 16px; color: #888;">No Nap Boxes found.</div>
              </div>
            </td>
          </tr>`;
      }
    });
}

document
  .querySelector("#boxslotTable tbody")
  .addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList.contains("toggle-status-btn")) {
      const id = target.id.split("_")[1];
      toggleNapBoxStatus(id);
    }
  });

function toggleNapBoxStatus(napBoxId) {
  const btn = document.querySelector(`#toggleStatusBtn_${napBoxId}`);
  const status = btn.getAttribute("data-status");
  const action = status === "Enabled" ? "disable" : "enable";
  const confirmMsg =
    action === "enable"
      ? "Are you sure you want to enable this Nap Box?"
      : "Are you sure you want to disable this Nap Box?";

  Swal.fire({
    title: confirmMsg,
    icon: "warning",
    showCancelButton: true,
    showDenyButton: action === "disable", // show only if disabling
    confirmButtonText: action === "enable" ? "Enable Now" : "Disable Now",
    denyButtonText: "Schedule Interruption",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // Existing disable/enable logic
      fetch(
        `backend/toggle_napbox_status.php?nap_box_id=${napBoxId}&action=${action}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire("Success", `NapBox has been ${action}d.`, "success");
            loadNapBoxes();
          } else {
            Swal.fire("Error", "Could not update status.", "error");
          }
        });
    } else if (result.isDenied) {
      // (send SMS immediately)
      Swal.fire({
  title: "Confirm Internet Interruption",
  html: `
    <label for="scheduleTime">Select Time:</label>
    <input type="datetime-local" id="scheduleTime" class="swal2-input">
  `,
  confirmButtonText: "Send Now",
  showCancelButton: true,
  didOpen: () => {
    const now = new Date();

    // Add 10 minutes for minimum selectable time
    now.setMinutes(now.getMinutes() + 10);

    // Pad numbers to two digits
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Set min attribute to current time + 10 minutes
    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById("scheduleTime").setAttribute("min", minDateTime);
  },
  preConfirm: () => {
    const time = document.getElementById("scheduleTime").value;
    if (!time) {
      Swal.showValidationMessage("Please select a time.");
      return false;
    }

    const selectedTime = new Date(time);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // 10-minute minimum

    if (selectedTime < now) {
      Swal.showValidationMessage("Please select a time at least 10 minutes from now.");
      return false;
    }

    return time;
  },
}).then((scheduleResult) => {
        if (scheduleResult.isConfirmed) {
    const scheduledTime = scheduleResult.value; 
    const dateObj = new Date(scheduledTime);

    // Format date and time in words
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    };
    const formattedDateTime = dateObj.toLocaleString('en-PH', options);

    fetch("backend/schedule_interruption.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            nap_box_id: napBoxId,
            scheduled_message: formattedDateTime // send just date & time
        }),
    })
            .then((res) => res.text())
            .then((data) => {
              Swal.fire(
                "Sent!",
                "Subscribers have been notified of the interruption.",
                "success"
              );
            })
            .catch(() => {
              Swal.fire("Error", "Could not send interruption SMS.", "error");
            });
        }
      });
    }
  });
}


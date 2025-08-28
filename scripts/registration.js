// Function for birth_date
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();

  // Calculate the minimum allowed date (18 years ago from today)
  const minAllowedDate = new Date();
  minAllowedDate.setFullYear(today.getFullYear() - 18);

  // Initialize Flatpickr
  flatpickr("#birth-date", {
    minDate: "1900-01-01", // Optional: Set a reasonable minimum date
    maxDate: minAllowedDate, // Disable dates that would make the user below 18
    dateFormat: "Y-m-d", // Format the date as YYYY-MM-DD
    disableMobile: true, // Ensure the native date picker is not used on mobile
    allowInput: false, // Prevent manual input
    onReady: function (selectedDates, dateStr, instance) {
      // Disable navigation to invalid months
      instance.changeMonth(minAllowedDate.getMonth());
      instance.changeYear(minAllowedDate.getFullYear());
    },
  });
});

// function for subscription plans
document.addEventListener("DOMContentLoaded", function () {
  // Subscription plan data
  const planData = {
    Bronze: {
      title: "BRONZE",
      price: "PHP 1199<br /><strong>per month</strong>",
      details: "Up to 50 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right, #ec202a, #ff7676)", // use to apply red gradient
    },
    Silver: {
      title: "SILVER",
      price: "PHP 1499<br /><strong>per month</strong>",
      details: "Up to 100 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right, #36a13a, #7ed957)", // use to apply green gradient
    },
    Gold: {
      title: "GOLD",
      price: "PHP 1799<br /><strong>per month</strong>",
      details: "Up to 150 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right, #fcbf06, #ff9900)", // use to apply yellow-orange gradient
    },
  };

  // Get elements
  const subscriptionSelect = document.getElementById("subscription-plan");
  const pricingBox = document.getElementById("pricing-box");
  const planTitle = document.getElementById("plan-title");
  const planPrice = document.getElementById("plan-price");
  const planDetails = document.getElementById("plan-details");
  // Get the map button element to update its style as well
  const mapLink = document.getElementById("mapLink");

  // Ensure elements exist before proceeding
  if (
    !subscriptionSelect ||
    !pricingBox ||
    !planTitle ||
    !planPrice ||
    !planDetails ||
    !mapLink
  ) {
    console.error("One or more required elements not found.");
    return;
  }

  // Function to update the pricing box and map button styling based on the selected plan
  function updatePlanUI() {
    const selectedPlan = subscriptionSelect.value;
    console.log(`🔄 Updating UI for: ${selectedPlan}`);

    if (planData[selectedPlan]) {
      planTitle.innerHTML = `<strong>${planData[selectedPlan].title}</strong>`;
      planPrice.innerHTML = planData[selectedPlan].price;
      planDetails.innerHTML = planData[selectedPlan].details;

      // Update border gradient
      pricingBox.style.borderImageSource = planData[selectedPlan].color;

      // Update price background gradient
      planPrice.style.background = planData[selectedPlan].color;

      // Update circle background
      document.querySelectorAll(".circle").forEach((circle) => {
        circle.style.background = planData[selectedPlan].color;
      });

      // Update buttons (next, next2, submit)
      document
        .querySelectorAll(".next-btn, .next-btn2, .submit")
        .forEach((button) => {
          button.style.background = planData[selectedPlan].color;
          button.style.borderColor = planData[selectedPlan].color;
        });

      // *** NEW: Update the mapLink button's background based on the selected plan ***
      mapLink.style.background = planData[selectedPlan].color;
    } else {
      console.warn("Selected plan not found in planData.");
    }
  }

  // Event listener for the subscription plan dropdown
  subscriptionSelect.addEventListener("change", updatePlanUI);

  // Initialize the UI with the default selected plan
  updatePlanUI();
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("registration.js loaded");

  // Barangay options for each municipality
  const barangayData = {
    orion: [
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
    ],
  };

  // Get elements
  const municipalitySelect = document.getElementById("municipality");
  const barangaySelect = document.getElementById("barangay");

  // Ensure elements exist before proceeding
  if (!municipalitySelect || !barangaySelect) {
    console.error();
    return;
  }

  // Function to update barangay dropdown based on municipality selection
  function updateBarangays() {
    const selectedMunicipality = municipalitySelect.value.toLowerCase(); // Convert to lowercase
    console.log(`Municipality selected: ${selectedMunicipality}`);

    // Clear previous options
    barangaySelect.innerHTML =
      '<option value="" disabled selected>Select a barangay</option>';

    // Check if selected municipality exists in barangayData
    if (barangayData[selectedMunicipality]) {
      barangayData[selectedMunicipality].forEach((barangay) => {
        let option = document.createElement("option");
        option.value = barangay.toLowerCase().replace(/\s+/g, "-");
        option.textContent = barangay;
        barangaySelect.appendChild(option);
      });
    } else {
      console.warn("No barangay data found for selected municipality.");
    }
  }

  // Add event listener to update barangay dropdown when municipality is changed
  municipalitySelect.addEventListener("change", updateBarangays);
});

// Function for installation date
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();

  // Minimum allowed date (5 days after today)
  const minInstallDate = new Date(today);
  minInstallDate.setDate(today.getDate() + 5);

  // Maximum allowed date: 3 months from today
  const maxInstallDate = new Date(today);
  maxInstallDate.setMonth(today.getMonth() + 3);

  flatpickr("#installation-date", {
    minDate: minInstallDate, // Disable past dates + set min 5 days ahead
    maxDate: maxInstallDate, // Set max date to 3 months from today
    dateFormat: "m/d/Y", // Format: MM/DD/YYYY
    disableMobile: true, // Prevent native date picker on mobile
  });
});

// 2d map
document.addEventListener("DOMContentLoaded", function () {
  const mapLink = document.getElementById("mapLink");
  mapLink.addEventListener("click", function (event) {
    event.preventDefault();
    Swal.fire({
      title: "Pin My Location",
      html: `
        <div id="mapInSwal" style="width: 100%; height: 400px;"></div>
        <button
          id="pinLocationBtn"
          type="button"
          class="swal2-styled"
          style="display: block; margin: 10px auto;"
        >
          Pin Current Location
        </button>
      `,
      showCancelButton: true,
      confirmButtonText: "Save Location",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const mapInSwal = document.getElementById("mapInSwal");

        // RED marker icon
        const redIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Initialize map
        const map = L.map(mapInSwal).setView([14.66667, 120.41667], 10); //orion bataan coordinates
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Fix size
        setTimeout(() => map.invalidateSize(), 100);

        let marker;

        // Grab our inline “Pin Current Location” button
        const pinBtn = document.getElementById("pinLocationBtn");
        pinBtn.addEventListener("click", () => {
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              map.setView([lat, lng], 14);

              if (marker) {
                marker.setLatLng([lat, lng]);
              } else {
                marker = L.marker([lat, lng], {
                  draggable: true,
                  icon: redIcon,
                })
                  .addTo(map)
                  .bindPopup("Your selected location")
                  .openPopup();

                marker.on("dragend", (ev) => {
                  const newPos = ev.target.getLatLng();
                  document.getElementById("latitude").value = newPos.lat;
                  document.getElementById("longitude").value = newPos.lng;
                  document.getElementById(
                    "dynamicCoords"
                  ).textContent = `Coordinates: ${newPos.lat.toFixed(
                    5
                  )}, ${newPos.lng.toFixed(5)}`;
                });
              }

              // Update hidden fields & display
              document.getElementById("latitude").value = lat;
              document.getElementById("longitude").value = lng;
              document.getElementById(
                "dynamicCoords"
              ).textContent = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(
                5
              )}`;
            },
            (error) => {
              console.error("Geolocation error:", error.message);
            }
          );
        });

        // Also allow manual-click placement
        map.on("click", (e) => {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          if (marker) {
            marker.setLatLng(e.latlng);
          } else {
            marker = L.marker(e.latlng, { draggable: true, icon: redIcon })
              .addTo(map)
              .bindPopup("Your selected location")
              .openPopup();

            marker.on("dragend", (ev) => {
              const newPos = ev.target.getLatLng();
              document.getElementById("latitude").value = newPos.lat;
              document.getElementById("longitude").value = newPos.lng;
              document.getElementById(
                "dynamicCoords"
              ).textContent = `Coordinates: ${newPos.lat.toFixed(
                5
              )}, ${newPos.lng.toFixed(5)}`;
            });
          }

          document.getElementById("latitude").value = lat;
          document.getElementById("longitude").value = lng;
          document.getElementById(
            "dynamicCoords"
          ).textContent = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        });
      },
      preConfirm: () => {
        const lat = document.getElementById("latitude").value;
        const lng = document.getElementById("longitude").value;
        if (!lat || !lng) {
          Swal.showValidationMessage("Please select a location on the map.");
          return false;
        }
        return { latitude: lat, longitude: lng };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Location Saved!",
          "Your coordinates have been saved.",
          "success"
        );
      }
    });
  });
});

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
      color: "linear-gradient(to right, #ec202a, #ff7676)", //use to apply red gradient
    },
    Silver: {
      title: "SILVER",
      price: "PHP 1499<br /><strong>per month</strong>",
      details: "Up to 100 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right, #36a13a, #7ed957)", //use to apply green gradient
    },
    Gold: {
      title: "GOLD",
      price: "PHP 1799<br /><strong>per month</strong>",
      details: "Up to 150 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right,#fcbf06,#ff9900)", //use to apply yellow-orange gradient
    },
  };

  // Get elements
  const subscriptionSelect = document.getElementById("subscription-plan");
  const pricingBox = document.getElementById("pricing-box");
  const planTitle = document.getElementById("plan-title");
  const planPrice = document.getElementById("plan-price");
  const planDetails = document.getElementById("plan-details");

  // Ensure elements exist before proceeding
  if (
    !subscriptionSelect ||
    !pricingBox ||
    !planTitle ||
    !planPrice ||
    !planDetails
  ) {
    console.error(
    );
    return;
  }

  // Function to update the pricing box
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
    } else {
      console.warn("⚠ Selected plan not found in planData.");
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
    orion: ["Bilolo", "Sto. Domingo", "Balagtas", "Lati", "General Lim"],
    limay: ["Alangan", "Duale", "Kitang", "Townsite", "Wawa"],
  };

  // Get elements
  const municipalitySelect = document.getElementById("municipality");
  const barangaySelect = document.getElementById("barangay");

  // Ensure elements exist before proceeding
  if (!municipalitySelect || !barangaySelect) {
    console.error(
    );
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
      console.warn("⚠ No barangay data found for selected municipality.");
    }
  }

// Add event listener to update barangay dropdown when municipality is changed
  municipalitySelect.addEventListener("change", updateBarangays);
});

// Function for installation date
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();

  // Minimum allowed date (5 days after today)
  const minInstallDate = new Date();
  minInstallDate.setDate(today.getDate() + 5);

  // Maximum allowed date (End of the current month)
  let maxInstallDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // If minDate is greater than maxDate, extend maxDate to next month
  if (minInstallDate > maxInstallDate) {
    maxInstallDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  }

  flatpickr("#installation-date", {
    minDate: minInstallDate, // Disable past dates + set min 5 days ahead
    maxDate: maxInstallDate, // Ensure maxDate is always valid
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
      title: "Pin Location", // Changed title as requested
      html: '<div id="mapInSwal" style="width: 100%; height: 400px;"></div>',
      showCancelButton: true,
      confirmButtonText: "Save Location",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const mapInSwal = document.getElementById("mapInSwal");

        // Create a custom RED marker icon
        const redIcon = new L.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // Initialize the map inside the SweetAlert popup
        const map = L.map(mapInSwal).setView([14.6717, 120.5487], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Force the map to recalculate its size after the modal opens
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        // Attempt to use geolocation if available
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;
              map.setView([userLat, userLng], 14);
              L.marker([userLat, userLng], { icon: redIcon })
                .addTo(map)
                .bindPopup("You are here!")
                .openPopup();
            },
            function (error) {
              console.error("Geolocation error:", error.message);
            }
          );
        }

        let marker;
        // On map click, create or move the red marker and update coordinates dynamically
        map.on("click", function (e) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;

          if (marker) {
            marker.setLatLng(e.latlng);
          } else {
            marker = L.marker(e.latlng, { draggable: true, icon: redIcon })
              .addTo(map)
              .bindPopup("Your selected location")
              .openPopup();

            // When dragging finishes, update hidden fields and coordinate display
            marker.on("dragend", function (ev) {
              const newPos = ev.target.getLatLng();
              document.getElementById("latitude").value = newPos.lat;
              document.getElementById("longitude").value = newPos.lng;
              document.getElementById("dynamicCoords").textContent =
                `Coordinates: ${newPos.lat.toFixed(5)}, ${newPos.lng.toFixed(5)}`;
            });
          }
          // Update hidden fields and dynamic coordinate display
          document.getElementById("latitude").value = lat;
          document.getElementById("longitude").value = lng;
          document.getElementById("dynamicCoords").textContent =
            `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        });
      },
      preConfirm: () => {
        // Get the coordinate values from the hidden fields
        const lat = document.getElementById("latitude").value;
        const lng = document.getElementById("longitude").value;
        // If coordinates are not set, display a validation message and prevent closing the modal
        if (!lat || !lng) {
          Swal.showValidationMessage("Please select a location on the map.");
          return false;
        }
        return { latitude: lat, longitude: lng };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Location Saved!", "Your coordinates have been saved.", "success");
      }
    });
  });
});


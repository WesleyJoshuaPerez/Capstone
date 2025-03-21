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
    bronze: {
      title: "BRONZE",
      price: "PHP 1199<br /><strong>per month</strong>",
      details: "Up to 50 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right, #ec202a, #ff7676)", //use to apply red gradient
    },
    silver: {
      title: "SILVER",
      price: "PHP 1499<br /><strong>per month</strong>",
      details: "Up to 100 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "linear-gradient(to right, #36a13a, #7ed957)", //use to apply green gradient
    },
    gold: {
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
      "🚨 One or more required elements not found. Check your IDs."
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
      "🚨 Municipality or Barangay dropdown not found. Check HTML IDs."
    );
    return;
  }

  // Function to update barangay dropdown based on municipality selection
  function updateBarangays() {
    const selectedMunicipality = municipalitySelect.value;
    console.log(`🏠 Municipality selected: ${selectedMunicipality}`);

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

  // Set the minimum allowed date (5 days after today)
  const minInstallDate = new Date();
  minInstallDate.setDate(today.getDate() + 5);

  // Set the maximum date (End of the current month)
  const maxInstallDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Initialize Flatpickr
  flatpickr("#installation-date", {
    minDate: minInstallDate,
    maxDate: maxInstallDate,
    dateFormat: "m/d/Y", // Format the date as MM/DD/YYYY
    disableMobile: true, // Ensure the native date picker is not used on mobile
    allowInput: false, // Prevent manual input
    onReady: function (selectedDates, dateStr, instance) {
      // Disable navigation to invalid months
      instance.changeMonth(minInstallDate.getMonth());
      instance.changeYear(minInstallDate.getFullYear());
    },
  });
});

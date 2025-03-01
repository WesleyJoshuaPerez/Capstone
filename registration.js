// Barangay options for each municipality
const barangayData = {
    orion: ["Bilolo", "Sto. Domingo", "Balagtas", "Lati", "General Lim"],
    limay: ["Alangan", "Duale", "Kitang", "Townsite", "Wawa"]
  };

  // Subscription plan data
  const planData = {
    bronze: {
      title: "BRONZE",
      price: "PHP 1199<br /><strong>per month</strong>",
      details: "Up to 50 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "#6f6f6f",
    },
    silver: {
      title: "SILVER",
      price: "PHP 1499<br /><strong>per month</strong>",
      details: "Up to 100 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "#6f6f6f",
    },
    gold: {
      title: "GOLD",
      price: "PHP 1799<br /><strong>per month</strong>",
      details: "Up to 150 Mbps<br />Unlimited Bandwidth<br />24/7 Support",
      color: "#6f6f6f",
    }
  };

  // Get elements
  const subscriptionSelect = document.getElementById("subscription-plan");
  const pricingBox = document.getElementById("pricing-box");
  const planTitle = document.getElementById("plan-title");
  const planPrice = document.getElementById("plan-price");
  const planDetails = document.getElementById("plan-details");
  const additionalOptionsSelect = document.getElementById("additional-options");

  const municipalitySelect = document.getElementById("municipality");
  const barangaySelect = document.getElementById("barangay");

  // Function to update the pricing box based on selected plan
  function updatePlanUI() {
    const selectedPlan = subscriptionSelect.value;

    // Update text content
    planTitle.innerHTML = `<strong>${planData[selectedPlan].title}</strong>`;
    planPrice.innerHTML = planData[selectedPlan].price;
    planDetails.innerHTML = planData[selectedPlan].details;

    // Change pricing box border color
    pricingBox.style.borderColor = planData[selectedPlan].color;

    // Update additional options dropdown
    additionalOptionsSelect.innerHTML = '<option value="" disabled selected>Select an option</option>';
    planData[selectedPlan].options.forEach(option => {
      let opt = document.createElement("option");
      opt.value = option.toLowerCase().replace(/\s+/g, "-");
      opt.textContent = option;
      additionalOptionsSelect.appendChild(opt);
    });
  }

  // Function to update barangay dropdown based on municipality
  function updateBarangays() {
    const selectedMunicipality = municipalitySelect.value;
    barangaySelect.innerHTML = '<option value="" disabled selected>Select a barangay</option>';
    barangayData[selectedMunicipality].forEach(barangay => {
      let option = document.createElement("option");
      option.value = barangay.toLowerCase().replace(/\s+/g, "-");
      option.textContent = barangay;
      barangaySelect.appendChild(option);
    });
  }

  // Event listeners
  subscriptionSelect.addEventListener("change", updatePlanUI);
  municipalitySelect.addEventListener("change", updateBarangays);

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

  

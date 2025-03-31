document.addEventListener("DOMContentLoaded", function () {
  // Check if we are on the index page (where the Apply buttons exist)
  const applyButtons = document.querySelectorAll(".apply-btn");

  if (applyButtons.length > 0) {
    applyButtons.forEach((button, index) => {
      button.addEventListener("click", function () {
        // Get the subscription plan based on the button's index
        const plans = ["bronze", "silver", "gold"];
        const selectedPlan = plans[index];

        // Redirect to registration.html with the selected plan as a URL parameter
        window.location.href = `registration.html?subscription_plan=${selectedPlan}`;
      });
    });
  }

  // Check if we are on the registration page (where the dropdown exists)
  const subscriptionSelect = document.getElementById("subscription-plan");

  if (subscriptionSelect) {
    const urlParams = new URLSearchParams(window.location.search);
    let selectedPlan = urlParams.get("subscription_plan");
  
    if (selectedPlan) {
      // Convert first letter to uppercase and rest to lowercase
      selectedPlan = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1).toLowerCase();
      // Now "bronze" becomes "Bronze", "silver" becomes "Silver", etc.
      subscriptionSelect.value = selectedPlan;
  
      // Trigger change event to update the UI
      subscriptionSelect.dispatchEvent(new Event("change"));
    }
  }  
});

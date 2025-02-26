document.addEventListener("DOMContentLoaded", function () {
  // Function to toggle password visibility
  function togglePasswordVisibility(passwordInput) {
    if (passwordInput) {
      const icon = passwordInput.nextElementSibling.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    }
  }

  // Toggle for login page
  const loginToggleButton = document.getElementById("togglePassword");
  if (loginToggleButton) {
    loginToggleButton.addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      togglePasswordVisibility(passwordInput);
    });
  }

  // Toggle for change password page
  document.querySelectorAll(".toggle-password").forEach((toggleButton) => {
    toggleButton.addEventListener("click", function () {
      const passwordInput =
        this.closest(".password-wrapper").querySelector("input");
      togglePasswordVisibility(passwordInput);
    });
  });

  // Change Password Page: Toggle Both Passwords
  function togglePasswords() {
    const newPassword = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");
    const icons = document.querySelectorAll(".toggle-password i");

    if (newPassword && confirmPassword) {
      const isPassword = newPassword.type === "password";

      newPassword.type = isPassword ? "text" : "password";
      confirmPassword.type = isPassword ? "text" : "password";

      // Update all icons
      icons.forEach((icon) => {
        if (isPassword) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      });
    }
  }

  // Attach event listeners for change password page buttons
  document.querySelectorAll(".toggle-password").forEach((toggleButton) => {
    toggleButton.addEventListener("click", togglePasswords);
  });
});

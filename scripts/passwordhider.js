document.addEventListener("DOMContentLoaded", function () {
  // Function to toggle password visibility for multiple inputs
  function togglePasswords() {
    const newPassword = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");
    const icons = document.querySelectorAll(".toggle-password i");

    if (newPassword && confirmPassword) {
      const isPassword = newPassword.type === "password";

      // Toggle both fields
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

  // Toggle for login page (only affects the login password field)
  const loginToggleButton = document.getElementById("togglePassword");
  if (loginToggleButton) {
    loginToggleButton.addEventListener("click", function () {
      const passwordInput = document.getElementById("password");
      const icon = this.querySelector("i");
      if (passwordInput) {
        passwordInput.type =
          passwordInput.type === "password" ? "text" : "password";
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      }
    });
  }

  // Attach event listener to both password fields' toggle buttons
  document.querySelectorAll(".toggle-password").forEach((toggleButton) => {
    toggleButton.addEventListener("click", togglePasswords);
  });
});

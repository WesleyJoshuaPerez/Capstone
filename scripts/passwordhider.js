// Function to toggle password visibility
function togglePasswordVisibility(inputId, toggleIcon) {
  const passwordInput = document.getElementById(inputId);
  const icon = toggleIcon.querySelector("i");

  // Toggle password visibility
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

// Add event listeners for password toggles
function togglePasswords() {
  const newPassword = document.getElementById("new-password");
  const confirmPassword = document.getElementById("confirm-password");
  const icons = document.querySelectorAll(".toggle-password i");

  // Check current type and toggle
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

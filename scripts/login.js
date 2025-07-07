document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("loginbutton");
  const passwordError = document.getElementById("passwordError");

  function isValidPassword(password) {
    return password.length >= 8 && /\d/.test(password); // At least 8 chars & 1 number
  }

  function toggleButtonState() {
    const passwordValue = password.value.trim();
    const isPasswordValid = isValidPassword(passwordValue);
    const isUsernameValid = username.value.trim().length > 0; // Username should not be empty

    if (passwordValue === "") {
      passwordError.style.display = "none"; // Hide the error if password field is empty
    } else if (isPasswordValid) {
      passwordError.style.display = "none"; // Hide error if valid
    } else {
      passwordError.style.display = "block"; // Show error if invalid
      passwordError.textContent =
        "Password must be at least 8 characters and contain at least 1 number.";
    }

    // Disable button if username or password is invalid
    loginButton.disabled = !(isPasswordValid && isUsernameValid);
  }

  // Initial check when page loads
  toggleButtonState();

  // Listen for input events to validate fields
  username.addEventListener("input", toggleButtonState);
  password.addEventListener("input", toggleButtonState);

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (loginButton.disabled) return; // Prevent submission if button is disabled

    let formData = new FormData(loginForm);

    fetch("backend/login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server Response:", data);

        if (data.status === "success") {
          // Save login state and role in localStorage
          sessionStorage.setItem("isLoggedIn", "true");

          // Determine user role based on the redirect path
          let role = "";
          if (data.redirect.includes("admin.html")) {
            role = "admin";
          } else if (data.redirect.includes("technician_dashboard.html")) {
            role = "technician";
          } else if (data.redirect.includes("user_dashboard.html")) {
            role = "user";
          }
          sessionStorage.setItem("userRole", role);

          // Show billing reminder if overdue
          if (data.isOverdue) {
            Swal.fire({
              icon: "warning",
              title: "Billing Reminder",
              text: "You have an overdue bill. Please settle it as soon as possible.",
              confirmButtonText: "Got it",
            }).then(() => {
              // Proceed with login success and redirect after the user clicks OK
              Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "You have successfully logged in.",
                showConfirmButton: true,  
              }).then(() => {
                window.location.href = data.redirect;
              });
            });
          } else {
            // Normal login redirect when not overdue
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "You have successfully logged in.",
              showConfirmButton: true,
            }).then(() => {
              window.location.href = data.redirect;
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: data.message,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong. Please try again.",
        });
      });
  });
});

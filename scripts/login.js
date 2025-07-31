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
          // Save login state and role in sessionStorage
          sessionStorage.setItem("isLoggedIn", "true");

          // Determine user role based on redirect path
          let role = "";
          if (data.redirect.includes("admin.html")) {
            role = "admin";
          } else if (data.redirect.includes("technician_dashboard.html")) {
            role = "technician";
          } else if (data.redirect.includes("user_dashboard.html")) {
            role = "user";
          }
          sessionStorage.setItem("userRole", role);

          // Show appropriate alert based on status
          if (role === "user") {
            if (data.isDisconnected === true) {
              Swal.fire({
                icon: "warning",
                title: "Internet Connectivity Suspended",
                html: "Your internet connectivity has been <b>suspended due to the unpaid balance.</b>.To fix this issue, please settle your payment immediately.",
                confirmButtonText: "Continue to Dashboard",
              }).then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Login Successful",
                  text: "You have successfully logged in.",
                  showConfirmButton: true,
                }).then(() => {
                  window.location.href = data.redirect;
                });
              });
            } else if (data.isOverdue === true) {
              Swal.fire({
                icon: "warning",
                title: "Billing Reminder",
                text: "You have an overdue bill. Please settle it within (5) days after your supposed due date or contact our office to avoid termination of your account.",
                confirmButtonText: "Got it",
              }).then(() => {
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
            // Admins/Technicians login success
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

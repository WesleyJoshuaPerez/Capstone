document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("loginbutton");

  // Function to toggle login button state
  function toggleButtonState() {
    loginButton.disabled = !(username.value.trim() && password.value.trim());
  }

  // Disable login button by default
  toggleButtonState();

  // Listen for input changes
  username.addEventListener("input", toggleButtonState);
  password.addEventListener("input", toggleButtonState);

  // Handle form submission
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Ensure button is enabled before submitting
    if (loginButton.disabled) return;

    let formData = new FormData(loginForm);

    fetch("backend/login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server Response:", data); // Debugging

        if (data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Login Successful",
            text: data.message,
            timer: 1500,
            showConfirmButton: true,
          }).then(() => {
            window.location.href = "login.html"; // Redirect on success
          });
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

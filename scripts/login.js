document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

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

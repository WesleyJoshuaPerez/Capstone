$(document).ready(function () {
  // Get URL parameters and set the code value
  const urlParams = new URLSearchParams(window.location.search);
  const resetCode = urlParams.get("code");
  $("#code").val(resetCode);

  const newPassword = $("#new-password");
  const confirmPassword = $("#confirm-password");

  // Error messages
  const passwordError = $(
    "<span id='passwordError' style='color: red; font-size: 12px; display: none;'>Password must be at least 8 characters and contain at least 1 special character.</span>"
  );
  const matchError = $(
    "<span id='matchError' style='color: red; font-size: 12px; display: none;'>Passwords do not match.</span>"
  );

  // Append error messages below the respective input fields
  newPassword.after(passwordError);
  confirmPassword.after(matchError);

  function isValidPassword(password) {
    return password.length >= 8 && /[\d_]/.test(password); // At least 8 chars & 1 number
  }

  function validatePassword() {
    const passwordValue = newPassword.val().trim();

    if (passwordValue === "") {
      passwordError.hide(); // Hide error when empty
    } else if (isValidPassword(passwordValue)) {
      passwordError.hide(); // Hide error when valid
    } else {
      passwordError.show(); // Show error when invalid
    }
    validateMatch(); // Also check if passwords match
  }

  function validateMatch() {
    if (confirmPassword.val().trim() === "") {
      matchError.hide(); // Hide if confirm password is empty
    } else if (newPassword.val() !== confirmPassword.val()) {
      matchError.show(); // Show error if passwords don't match
    } else {
      matchError.hide(); // Hide error if they match
    }
  }

  // Attach event listeners for validation
  newPassword.on("input", validatePassword);
  confirmPassword.on("input", validateMatch);

  $("#changePasswordForm").submit(function (e) {
    e.preventDefault();

    var formData = {
      code: $("#code").val(),
      email: $("#email").val(),
      new_password: newPassword.val(),
      confirm_password: confirmPassword.val(),
    };

    // Prevent form submission if password is invalid or does not match
    if (!isValidPassword(formData.new_password)) {
      passwordError.show();
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      matchError.show();
      return;
    }

    $.ajax({
      type: "POST",
      url: "backend/changepass.php",
      data: formData,
      dataType: "json",
      success: function (response) {
        Swal.fire({
          title: response.title,
          text: response.message,
          icon: response.status,
        }).then(() => {
          if (response.redirect) {
            window.location.href = response.redirect;
          }
        });
      },
      error: function () {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
        });
      },
    });
  });
});

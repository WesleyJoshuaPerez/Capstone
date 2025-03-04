$(document).ready(function () {
  // Get URL parameters and set the code value
  const urlParams = new URLSearchParams(window.location.search);
  const resetCode = urlParams.get("code");
  $("#code").val(resetCode);

  $("#changePasswordForm").submit(function (e) {
    e.preventDefault();

    var formData = {
      code: $("#code").val(),
      email: $("#email").val(),
      new_password: $("#new-password").val(),
      confirm_password: $("#confirm-password").val(),
    };

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

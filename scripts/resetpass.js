$(document).ready(function () {
  $("#resetForm").submit(function (e) {
    e.preventDefault();
    var email = $("#email").val();

    $.ajax({
      type: "POST",
      url: "backend/resetpass.php",
      data: { email: email },
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

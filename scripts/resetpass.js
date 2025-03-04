$(document).ready(function () {
  $("#resetForm").submit(function (e) {
    e.preventDefault();
    var email = $("#email").val();

    // Show loading SweetAlert
    Swal.fire({
      title: "Processing...",
      text: "Please wait while we send your request.",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    $.ajax({
      type: "POST",
      url: "backend/resetpass.php",
      data: { email: email },
      dataType: "json",
      success: function (response) {
        Swal.close(); // Close loading alert
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
        Swal.close();
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
        });
      },
    });
  });
});

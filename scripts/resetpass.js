$(document).ready(function () {
  $("#resetForm").submit(function (e) {
    e.preventDefault();
    var email = $("#email").val().trim();

    if (!email) {
      Swal.fire({
        title: "Missing Email",
        text: "Please enter your email address.",
        icon: "warning",
      });
      return;
    }

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
        console.log("Server response:", response); //  DEBUG LINE

        Swal.close(); // Close loading alert
        Swal.fire({
          title: response.title || "Message",
          text: response.message || "No details provided.",
          icon: response.status || "info",
        }).then(() => {
          if (response.redirect) {
            window.location.href = response.redirect;
          }
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        Swal.close();
        console.error("AJAX Error:", textStatus, errorThrown); //  DEBUG
        console.error("Server returned:", jqXHR.responseText); //  DEBUG

        Swal.fire({
          title: "Server Error!",
          text: "Something went wrong. Please try again later.",
          icon: "error",
        });
      },
    });
  });
});

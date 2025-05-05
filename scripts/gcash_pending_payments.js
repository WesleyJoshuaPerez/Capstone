function fetchGcashPayments() {
  Swal.fire({
    title: "Loading GCash Payments...",
    text: "Please wait while we fetch the pending payments.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("GET", "backend/fetch_gcash_pending_payments.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      Swal.close(); // Close the loading Swal when data is loaded
      if (xhr.status === 200) {
        try {
          let data = JSON.parse(xhr.responseText);
          if (data.status === "success") {
            populatePaymentTable(data.data);
          } else {
            Swal.fire(
              "Error!",
              data.message || "Failed to load payments.",
              "error"
            );
          }
        } catch (e) {
          console.error("Parsing error:", e);
          Swal.fire("Error!", "Invalid server response.", "error");
        }
      } else {
        Swal.fire("Error!", "Failed to communicate with the server.", "error");
      }
    }
  };
  xhr.send();
}

function populatePaymentTable(payments) {
  const tableBody = document.querySelector("#gcashPaymentApprovalTable tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  payments.forEach((payment) => {
    const row = document.createElement("tr");
    row.setAttribute("data-payment", JSON.stringify(payment));
    row.innerHTML = `
          <td>${payment.payment_id}</td>
          <td>${payment.user_id}</td>
          <td>${payment.fullname}</td>
          <td>${payment.subscription_plan}</td>
          <td>${payment.paid_amount}</td>
          <td>${payment.payment_date}</td>
          <td>${payment.reference_number}</td>
        `;
    tableBody.appendChild(row);
  });

  attachRowClickEvent();
}

function attachRowClickEvent() {
  const rows = document.querySelectorAll("#gcashPaymentApprovalTable tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const payment = JSON.parse(row.getAttribute("data-payment"));

      Swal.fire({
        title: `Payment ID: ${payment.payment_id}`,
        html: `
              <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
                  <strong>Fullname:</strong> ${payment.fullname}<br>
                  <strong>Subscription Plan:</strong> ${payment.subscription_plan}<br>
                  <strong>Paid Amount:</strong> ${payment.paid_amount}<br>
                  <strong>Payment Date:</strong> ${payment.payment_date}<br>
                  <strong>Status:</strong> ${payment.status}<br>
                  <strong>Proof of Payment:</strong><br>
                  <img src="backend/uploads/gcash_proofs/${payment.proof_of_payment}" width="100%" style="cursor: pointer;" 
                      onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='uploads/default_proof_of_payment.jpg';">
              </div>
              `,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Approve",
        denyButtonText: "Deny",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          approvePayment(payment.payment_id);
        } else if (result.isDenied) {
          denyPayment(payment.payment_id);
        }
      });
    });
  });
}

function viewImage(src) {
  Swal.fire({
    imageUrl: src,
    imageWidth: 400,
    imageAlt: "Preview Image",
    showCloseButton: true,
    showConfirmButton: false,
  });
}

function approvePayment(paymentId) {
  updatePaymentStatus(paymentId, "Approved");
}

function denyPayment(paymentId) {
  Swal.fire({
    title: "Reason for Denial",
    input: "textarea",
    inputLabel: "Please provide a reason for denying this payment:",
    inputPlaceholder: "Type your reason here...",
    inputAttributes: {
      "aria-label": "Type your reason here",
    },
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const reason = result.value.trim(); // Get the admin's input
      if (reason) {
        updatePaymentStatus(paymentId, "Denied", reason);
      } else {
        Swal.fire(
          "Error",
          "You must provide a reason to deny the payment.",
          "error"
        );
      }
    }
  });
}

function updatePaymentStatus(paymentId, status, reason = null) {
  Swal.fire({
    title: `Processing ${status}...`,
    text: "Please wait while we update the payment status.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "backend/update_payment_status.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      Swal.close(); // Close loading Swal after request completion
      if (xhr.status === 200) {
        try {
          let data = JSON.parse(xhr.responseText);
          if (data.status === "success") {
            Swal.fire(
              "Success!",
              `Payment ${status.toLowerCase()} successfully.`,
              "success"
            ).then(() => {
              setTimeout(fetchGcashPayments, 500);
            });
          } else {
            Swal.fire(
              "Error!",
              data.message || "Failed to update payment status.",
              "error"
            );
          }
        } catch (e) {
          console.error("Parsing error:", e);
          Swal.fire("Error!", "Invalid server response.", "error");
        }
      } else {
        console.error("Server error:", xhr.status);
        Swal.fire("Error!", "Failed to communicate with the server.", "error");
      }
    }
  };

  // Construct the payload with consistent naming
  const payload = { payment_id: paymentId, status: status };
  if (reason) {
    payload.reason = reason; // Add the reason to the payload if provided
  }

  xhr.send(JSON.stringify(payload));
}

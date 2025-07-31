function fetchSubscribers() {
  Swal.fire({
    title: "Loading Subscribers...",
    text: "Please wait while we fetch the subscribers.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  fetch("backend/fetch_subscribers.php")
    .then((response) => response.json())
    .then((data) => {
      Swal.close();
      if (data.success) {
        const tableBody = document.querySelector("#subscriberTable tbody");

        if (!tableBody) {
          console.error("Subscriber table not found!");
          return;
        }

        tableBody.innerHTML = "";

        data.data.forEach((subscriber) => {
          let row = document.createElement("tr");
          row.setAttribute("data-subscriber", JSON.stringify(subscriber));
          row.innerHTML = `
            <td>${subscriber.id}</td>
            <td>${subscriber.subscription_plan}</td>
            <td>${subscriber.currentBill}</td>
            <td style="color: ${
              subscriber.status.toLowerCase() === "disconnected"
                ? "red"
                : subscriber.status.toLowerCase() === "active"
                ? "green"
                : "black"
            }; font-weight: bold;">
           ${subscriber.status}
           </td>

            <td>${subscriber.next_due_date}</td>
            <td>${subscriber.first_name}</td>
            <td>${subscriber.last_name}</td>
            <td>${subscriber.contact_number}</td>
            <td>${subscriber.address}</td>
          `;
          tableBody.appendChild(row);
        });

        attachSubscriberRowClickEvent();
      } else {
        console.error("Failed to fetch subscribers:", data.error);
        Swal.fire("Error!", "Failed to load subscribers.", "error");
      }
    })
    .catch((error) => {
      Swal.close();
      console.error("Error fetching subscribers:", error);
      Swal.fire("Error!", "Error fetching subscribers.", "error");
    });
}

function attachSubscriberRowClickEvent() {
  const rows = document.querySelectorAll("#subscriberTable tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const subscriber = JSON.parse(row.getAttribute("data-subscriber"));
      const isOverdue = new Date(subscriber.next_due_date) < new Date();

      Swal.fire({
        title: `Subscriber ID: ${subscriber.id}`,
        html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
          <strong>Username:</strong> ${subscriber.username}<br>
          <strong>Subscription Plan:</strong> ${
            subscriber.subscription_plan
          }<br>
          <strong>Status:</strong> ${subscriber.status}<br>

          <strong>Name:</strong> ${subscriber.first_name} ${
          subscriber.last_name
        }<br>
          <strong>Birth Date:</strong> ${subscriber.birth_date}<br>
          <strong>Address:</strong> ${subscriber.address}<br>
          <strong>Contact:</strong> ${subscriber.contact_number}<br>
          <strong>Email:</strong> ${subscriber.email_address}<br>
          <strong>ID Type:</strong> ${subscriber.id_type} <br>
          <strong>ID Number:</strong> ${subscriber.id_number || "N/A"}<br>
          <strong>Home Ownership:</strong> ${subscriber.home_ownership_type}<br>
          <strong>Installation Date:</strong> ${
            subscriber.installation_date
          }<br>
          <strong>Registration Date:</strong> ${
            subscriber.registration_date
          }<br>
          <strong>ID Photo:</strong><br>
          <img src="frontend/assets/images/uploads/Id_Photo/${
            subscriber.id_photo
          }" width="100%" style="cursor: pointer;"
              onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_id_photo.jpg';"><br>
          <strong>Proof of Residency:</strong><br>
          <img src="frontend/assets/images/uploads/Proof_of_Residency/${
            subscriber.proof_of_residency
          }" width="100%" style="cursor: pointer;"
              onclick="viewImage(this.src)" onerror="this.onerror=null;this.src='frontend/assets/images/uploads/default_proof_of_residency.jpg';">
        </div>
        `,
        icon: "info",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Pay Current Bill",
        denyButtonText: "Add Misc Fee",
        cancelButtonText: "Close",
        footer:
          isOverdue && subscriber.status !== "disconnected"
            ? `<button id="disconnectBtn" class="swal2-cancel swal2-styled swal2-danger">Disconnect Internet Access</button>`
            : "",

        didRender: () => {
          const disconnectBtn = document.getElementById("disconnectBtn");

          if (disconnectBtn) {
            disconnectBtn.addEventListener("click", () => {
              Swal.fire({
                title: "Disconnect Internet Access",
                text: "Do you really want to disconnect this subscriber?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Disconnect",
                cancelButtonText: "Cancel",
              }).then((result) => {
                if (result.isConfirmed) {
                  fetch("backend/disconnect_subscriber.php", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ subscriberId: subscriber.id }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        Swal.fire(
                          "Disconnected",
                          "Account successfully disconnected.",
                          "success"
                        ).then(() => fetchSubscribers());
                      } else {
                        Swal.fire(
                          "Error",
                          data.message || "Disconnection Failed",
                          "error"
                        );
                      }
                    })
                    .catch((error) => {
                      console.error("Disconnection error:", error);
                      Swal.fire(
                        "Error",
                        "An error occurred while terminating.",
                        "error"
                      );
                    });
                }
              });
            });
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          payCurrentBill(subscriber.id, subscriber.currentBill);
        } else if (result.isDenied) {
          Swal.fire({
            title: "Add Miscellaneous Fee",
            input: "number",
            inputLabel: "Enter the fee amount (₱10 - ₱1000):",
            inputAttributes: {
              min: 10,
              max: 1000,
              step: 0.01,
            },
            showCancelButton: true,
            confirmButtonText: "Submit",
          }).then((feeResult) => {
            if (feeResult.isConfirmed && feeResult.value) {
              const fee = parseFloat(feeResult.value);

              if (isNaN(fee) || fee < 10 || fee > 1000) {
                Swal.fire(
                  "Invalid Input",
                  "Fee must be between ₱10 and ₱1,000.",
                  "error"
                );
                return;
              }

              fetch("backend/add_miscfee.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ subscriberId: subscriber.id, fee }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    Swal.fire(
                      "Success",
                      "Miscellaneous fee added successfully.",
                      "success"
                    ).then(() => {
                      fetchSubscribers();
                    });
                  } else {
                    Swal.fire(
                      "Error",
                      data.message || "Failed to add fee.",
                      "error"
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error adding misc fee:", error);
                  Swal.fire("Error", "Error adding fee.", "error");
                });
            }
          });
        }
      });
    });
  });
}

function payCurrentBill(subscriberId, currentBill) {
  if (currentBill <= 0) {
    Swal.fire("Info", "This subscriber has no current bill to pay.", "info");
    return;
  }

  Swal.fire({
    title: "Confirm Payment",
    text: `Are you sure you want to pay the current bill of PHP ${currentBill}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Pay Now",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("backend/pay_onsite.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriberId, currentBill }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // generate PDF receipt and download it
            if (data.pdf_url) {
              const link = document.createElement("a");
              link.href = data.pdf_url;
              link.download = ""; // Optional: let browser choose filename
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }

            Swal.fire(
              "Success",
              "Current bill paid successfully. Receipt is downloading.",
              "success"
            ).then(() => {
              fetchSubscribers(); // reload your table or UI
            });
          } else {
            Swal.fire("Error", data.message || "Payment failed.", "error");
          }
        })
        .catch((error) => {
          console.error("Error processing payment:", error);
          Swal.fire("Error", "Error processing payment.", "error");
        });
    }
  });
}

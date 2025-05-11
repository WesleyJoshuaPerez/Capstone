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
      Swal.close(); // Close the loading Swal when data is loaded
      if (data.success) {
        const tableBody = document.querySelector("#subscriberTable tbody");

        if (!tableBody) {
          console.error("Subscriber table not found!");
          return;
        }

        tableBody.innerHTML = ""; // Clear existing rows

        data.data.forEach((subscriber) => {
          let row = document.createElement("tr");
          row.setAttribute("data-subscriber", JSON.stringify(subscriber));
          row.innerHTML = `
                <td>${subscriber.id}</td>
                <td>${subscriber.subscription_plan}</td>
                <td>${subscriber.currentBill}</td>
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

      Swal.fire({
        title: `Subscriber ID: ${subscriber.id}`,
        html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto; padding-right: 10px;">
               <strong>Username:</strong> ${subscriber.username}<br>
                  <strong>Subscription Plan:</strong> ${
                    subscriber.subscription_plan
                  }<br>
                  <strong>Name:</strong> ${subscriber.first_name} ${
          subscriber.last_name
        }<br>
                  <strong>Birth Date:</strong> ${subscriber.birth_date}<br>
                  <strong>Address:</strong> ${subscriber.address}<br>
                  <strong>Contact:</strong> ${subscriber.contact_number}<br>
                  <strong>Email:</strong> ${subscriber.email_address}<br>
                  <strong>ID Type:</strong> ${subscriber.id_type} <br>
                  <strong>ID Number: </strong> ${
                    subscriber.id_number || "N/A"
                  }<br>
                  <strong>Home Ownership:</strong> ${
                    subscriber.home_ownership_type
                  }<br>
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
                      fetchSubscribers(); // Refresh table after Swal closes
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
            Swal.fire(
              "Success",
              "Current bill paid successfully.",
              "success"
            ).then(() => {
              fetchSubscribers(); // Refresh the list after Swal closes
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

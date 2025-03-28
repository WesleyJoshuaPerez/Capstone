document.addEventListener("DOMContentLoaded", function () {
    // Get elements for Subscription Plan section
    var applicationLink = document.getElementById("applicationLink");
    var appDiv = document.getElementById("applicationDiv");

    // Get elements for Home section (default section)
    var homeLink = document.getElementById("homeLink");
    var homeSection = document.getElementById("homeSection");

    // Get elements for Billing History section
    var billingHistoryLink = document.getElementById("billingHistoryLink");
    var historyDiv = document.getElementById("historyDiv");

    // Get elements for Maintenance Request section
    var maintenanceLink = document.getElementById("maintenanceLink");
    var maintenanceDiv = document.getElementById("maintenanceDiv");

    // Get elements for notification section
    var notificationLink = document.getElementById("notificationLink");
    var notificationDiv = document.getElementById("notificationDiv");

    // Get elements for View Profile section
    var viewProfileLink = document.getElementById("viewProfileLink");
    var profileDiv = document.getElementById("profileDiv");

    // Get elements for Change Password section
    var changePasswordLink = document.getElementById("changePasswordLink");
    var changePasswordDiv = document.getElementById("changePasswordDiv");

    // Function to hide all sections
    function hideAllSections() {
        if (appDiv) appDiv.style.display = "none";
        if (homeSection) homeSection.style.display = "none"; // Hide Home section initially
        if (historyDiv) historyDiv.style.display = "none";
        if (maintenanceDiv) maintenanceDiv.style.display = "none";
        if (notificationDiv) notificationDiv.style.display = "none";
        if (profileDiv) profileDiv.style.display = "none";
        if (changePasswordDiv) changePasswordDiv.style.display = "none";
    }

    // Hide all sections and show Home Section by default when the page loads
    hideAllSections();
    if (homeSection) homeSection.style.display = "block"; // Show Home Section by default

    // Toggle Subscription Plan section
    if (applicationLink) {
        applicationLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            appDiv.style.display = "block";
        });
    }

    // Toggle Home section
    if (homeLink) {
        homeLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            homeSection.style.display = "block"; // Show Home section
        });
    }

    // Toggle Billing History section
    if (billingHistoryLink) {
        billingHistoryLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            historyDiv.style.display = "block";
        });
    }

    // Toggle Maintenance Request section
    if (maintenanceLink) {
        maintenanceLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            maintenanceDiv.style.display = "block";
        });
    }

    // Toggle Notification section
    if (notificationLink) {
        notificationLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            notificationDiv.style.display = "block";
            loadNotifications();
        });
    }

    // Toggle View Profile section
    if (viewProfileLink) {
        viewProfileLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            profileDiv.style.display = "block"; // Show Profile section
        });
    }

    // Toggle Change Password section
    if (changePasswordLink) {
        changePasswordLink.addEventListener("click", function (event) {
            event.preventDefault();
            hideAllSections();
            changePasswordDiv.style.display = "block"; // Show Change Password section
        });
    }
});

// edit contact number and email address function

function makeEditable(fieldId) {
    setTimeout(() => {
        let field = document.getElementById(fieldId);

        if (!field) {
            console.error(`Element with ID '${fieldId}' not found.`);
            return;
        }

        let fieldLabel = fieldId.includes("contact") ? "Contact Number" : "Email Address";

        Swal.fire({
            title: `Edit ${fieldLabel}`,
            input: "text",
            inputValue: field.value,
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
                if (!value) return "This field cannot be empty!";
                if (fieldId.includes("contact") && !/^\+639\d{9}$/.test(value)) {
                    return "Enter a valid Philippine contact number (+639XXXXXXXXX)";
                }
                if (fieldId.includes("email") && !/^\S+@\S+\.\S+$/.test(value)) {
                    return "Enter a valid email address!";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                field.value = result.value; // Updates the field
                field.setAttribute("value", result.value);
                field.dispatchEvent(new Event("change")); // Triggers update event
                
                Swal.fire("Updated!", `${fieldLabel} has been updated successfully.`, "success");
            }
        });

    }, 500);
}

// Ensure the field remains readonly at all times
document.addEventListener("DOMContentLoaded", () => {
    let contactField = document.getElementById("contactNumber_view");
    let emailField = document.getElementById("emailAddress_view");

    if (contactField) contactField.setAttribute("readonly", true);
    if (emailField) emailField.setAttribute("readonly", true);
});


// update profile button function

document.addEventListener("DOMContentLoaded", function () {
    let updateProfileBtn = document.querySelector(".update-btn");

    if (updateProfileBtn) {
        updateProfileBtn.addEventListener("click", function (event) {
            event.preventDefault();

            let contactNumberField = document.getElementById("contact_number_view");
            let emailAddressField = document.getElementById("emailAddress_view");

            let contactNumber = contactNumberField ? contactNumberField.value.trim() : null;
            let emailAddress = emailAddressField ? emailAddressField.value.trim() : null;

            // Validate fields before sending request
            if (!contactNumber && !emailAddress) {
                Swal.fire("Error", "No changes detected.", "error");
                return;
            }

            let updateData = {};
            if (contactNumber) updateData.contact_number = contactNumber;
            if (emailAddress) updateData.email_address = emailAddress;

            // Send the data via Fetch API
            fetch("backend/update_user_data.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    Swal.fire("Updated!", data.message, "success");
                } else {
                    Swal.fire("Error", data.message, "error");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                Swal.fire("Error", "An unexpected error occurred.", "error");
            });
        });
    }
});

function makeEditable(fieldId) {
    setTimeout(() => {
        let field = document.getElementById(fieldId);

        if (!field) {
            console.error(`Element with ID '${fieldId}' not found.`);
            return;
        }

        // Determine if this is an email or contact number for the prompt title
        let fieldLabel = fieldId.includes("contact") ? "Contact Number" : "Email Address";

        Swal.fire({
            title: `Edit ${fieldLabel}`,
            input: "text",
            inputValue: field.value,
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
                // Check for empty value
                if (!value) {
                    return "This field cannot be empty!";
                }

                //contact validation
                if (fieldId.includes("contact")) {
                    if (!/^\d{11}$/.test(value)) {
                        return "Enter a valid 11-digit contact number (e.g., 09123456789).";
                    }
                }

                // If it's the email field, require @gmail.com or @yahoo.com
                // If it's the email field, require only certain characters before '@'
                // and force the domain to be @gmail.com or @yahoo.com
                if (fieldId.includes("email")) {
                    // Optional: Check length to avoid overly long addresses
                    if (value.length > 254) {
                        return "Email address must be 254 characters or less!";
                    }

                    // Regex Explanation:
                    // ^[A-Za-z0-9._-]+  => One or more letters, digits, underscores, dots, or hyphens
                    // @                 => Exactly one '@'
                    // (gmail|yahoo)     => Domain must be 'gmail' or 'yahoo'
                    // \.com             => Followed by '.com'
                    // $                 => End of string
                    // 'i' flag          => Case-insensitive (so 'GMAIL.com' is also valid)
                    const pattern = /^[A-Za-z0-9._-]+@(gmail|yahoo)\.com$/i;
                    if (!pattern.test(value)) {
                        return "Invalid email! Only letters/digits/._- are allowed before '@', and it must end with @gmail.com or @yahoo.com.";
                    }
                }
                // If all checks pass, no error message
                return null;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Update the field with the validated input
                field.value = result.value;
                field.setAttribute("value", result.value);
                field.dispatchEvent(new Event("change"));

                Swal.fire("Updated!", `${fieldLabel} has been updated successfully.`, "success");
            }
        });
    }, 500);
}

// change password function

document.addEventListener("DOMContentLoaded", function () {
    const currentPasswordField = document.getElementById("currentPassword");
    const newPasswordField = document.getElementById("newPassword");
    const confirmPasswordField = document.getElementById("confirmPassword");

    // Create validation messages
    const newPasswordMessage = document.createElement("p");
    newPasswordMessage.style.color = "red";
    newPasswordMessage.style.fontSize = "13px";
    newPasswordMessage.style.display = "none"; // Hide initially
    newPasswordField.parentNode.appendChild(newPasswordMessage);

    const confirmPasswordMessage = document.createElement("p");
    confirmPasswordMessage.style.color = "red";
    confirmPasswordMessage.style.fontSize = "13px";
    confirmPasswordMessage.style.display = "none"; // Hide initially
    confirmPasswordField.parentNode.appendChild(confirmPasswordMessage);

    // Password validation regex: At least 8 characters & 1 number
    let passwordRegex = /^(?=.*\d)[A-Za-z\d]{8,}$/;

    // Live validation for New Password field
    newPasswordField.addEventListener("input", function () {
        if (!passwordRegex.test(newPasswordField.value)) {
            newPasswordMessage.textContent = "Password must have at least 8 characters and 1 number.";
            newPasswordMessage.style.display = "block";
            newPasswordMessage.style.color = "red";
        } else {
            newPasswordMessage.textContent = "Valid password.";
            newPasswordMessage.style.color = "green";
        }
    });

    // Live validation for Confirm Password field
    confirmPasswordField.addEventListener("input", function () {
        if (confirmPasswordField.value !== newPasswordField.value) {
            confirmPasswordMessage.textContent = "Passwords do not match.";
            confirmPasswordMessage.style.display = "block";
            confirmPasswordMessage.style.color = "red";
        } else {
            confirmPasswordMessage.textContent = "Passwords match.";
            confirmPasswordMessage.style.color = "green";
        }
    });

    // Handle Change Password button click
    document.querySelector(".change-password-btn").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default form submission

        let currentPassword = currentPasswordField.value.trim();
        let newPassword = newPasswordField.value.trim();
        let confirmPassword = confirmPasswordField.value.trim();

        // Check if all fields are filled
        if (!currentPassword || !newPassword || !confirmPassword) {
            Swal.fire("Error!", "All fields are required.", "error");
            return;
        }

        // Check if new password meets security standards
        if (!passwordRegex.test(newPassword)) {
            Swal.fire("Weak Password!", "Password must be at least 8 characters and contain at least 1 number.", "error");
            return;
        }

        // Check if new password matches confirm password
        if (newPassword !== confirmPassword) {
            Swal.fire("Mismatch!", "New password and confirm password do not match.", "error");
            return;
        }

        // Send request to check current password and update new password
        fetch("backend/changepass_dashboard.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "error") {
                Swal.fire("Error!", data.message, "error");
            } else {
                Swal.fire("Success!", "Password updated successfully.", "success").then(() => {
                    // Clear input fields
                    currentPasswordField.value = "";
                    newPasswordField.value = "";
                    confirmPasswordField.value = "";
                    newPasswordMessage.style.display = "none"; // Hide messages after success
                    confirmPasswordMessage.style.display = "none";
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire("Error!", "Something went wrong. Please try again.", "error");
        });
    });
});

// toggle button to view password
document.addEventListener("DOMContentLoaded", function () {
    // Select all toggle buttons
    document.querySelectorAll(".password-form-group button").forEach(button => {
        button.addEventListener("click", function () {
            let inputField = this.previousElementSibling; // Get the input field before the button
            let icon = this.querySelector("i"); // Get the eye icon inside the button

            if (inputField.type === "password") {
                inputField.type = "text"; // Show password
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash"); // Change icon
            } else {
                inputField.type = "password"; // Hide password
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    });
});

// fetch subscription plan, current bill, and billing cycle
document.addEventListener("DOMContentLoaded", async () => {
    const planNameEl = document.getElementById("plan-name");
    const planPriceEl = document.getElementById("plan-price");
    const billingAmountEl = document.getElementById("billing-amount");
    const dueDateEl = document.getElementById("due-date");
    const subscriptionField = document.getElementById("currentSubscription");
    const selectDropdown = document.getElementById("selectSubscription");
    const changeBtn = document.querySelector(".newSub_btn");
    const warningLabel = document.getElementById("changePlanWarning"); 

    try {
        const response = await fetch("backend/get_user_data.php");
        const data = await response.json();

        if (data.status === "success") {
            const plan = data.subscription_plan || "none";
            const bill = parseFloat(data.currentBill) || 0;

            if (planNameEl) planNameEl.textContent = `${plan.toUpperCase()} PLAN`;
            if (planPriceEl) planPriceEl.textContent = bill.toFixed(2);
            if (billingAmountEl) billingAmountEl.textContent = bill.toFixed(2);

            if (data.installation_date && dueDateEl) {
                const installDate = new Date(data.installation_date);
                const dueDate = new Date(installDate);
                dueDate.setMonth(dueDate.getMonth() + 1);

                const options = { year: 'numeric', month: 'short', day: '2-digit' };
                dueDateEl.textContent = dueDate.toLocaleDateString('en-US', options);
            } else {
                if (dueDateEl) dueDateEl.textContent = "Unavailable";
            }

            // Set current subscription input (hidden field if you have it)
            subscriptionField.value = data.subscription_plan;
            const currentPlan = data.subscription_plan.toLowerCase();

            // Hide the user’s current plan from the dropdown
            Array.from(selectDropdown.options).forEach(option => {
            if (option.value === currentPlan) {
                option.style.display = "none";
            }
            });

            // Force the dropdown to select the placeholder
            selectDropdown.value = "";

        } else {
            const fallback = "0.00";
            if (planPriceEl) planPriceEl.textContent = fallback;
            if (billingAmountEl) billingAmountEl.textContent = fallback;
            if (dueDateEl) dueDateEl.textContent = "Unavailable";
        }

        // Check plan change restriction
        const restrictionRes = await fetch("backend/check_plan_change_limit.php");
        const restrictionData = await restrictionRes.json();

        if (restrictionData.status === "locked") {
            if (changeBtn) {
                changeBtn.disabled = true;
                changeBtn.classList.add("disabled");
            }
            if (warningLabel) {
                warningLabel.style.display = "block";
                warningLabel.style.textAlign = "center";
                warningLabel.textContent = `You cannot change your subscription plan until ${restrictionData.next_allowed_date}.`;
            }
        }
    } catch (error) {
        console.error("Error fetching user data or restriction status:", error);
    }
});

// Handle Plan Change Form Submission
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("changeSubscriptionForm");
    const changeBtn = document.querySelector(".newSub_btn");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        Swal.fire({
            title: "Submit Plan Change?",
            text: "Please wait for admin approval after submission.",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData(form);

                fetch("backend/change_subscription.php", {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        if (changeBtn) {
                            changeBtn.disabled = true;
                            changeBtn.classList.add("disabled");
                            changeBtn.textContent = "Submitted";
                        }

                        Swal.fire({
                            icon: "success",
                            title: "Submitted!",
                            text: "Plan change submitted for approval.\nNote: You can only change your subscription plan every 5 months.",
                        });
                    } else {
                        Swal.fire("Error", data.message, "error");
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    Swal.fire("Error", "Something went wrong while submitting.", "error");
                });
            }
        });
    });
});

// sweetalert for maintenance request
document.addEventListener("DOMContentLoaded", function () {
    const maintenanceForm = document.getElementById("maintenanceRequestForm");
    if (maintenanceForm) {
        maintenanceForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // List all required field IDs
            const requiredFields = [
                "userId_request",
                "fullName_request",
                "contactNumber",
                "homeAddress",
                "issueType",
                "issueDescription",
                "contactTime"
            ];

            // Validate each required field
            let allFilled = true;
            requiredFields.forEach(function(fieldId) {
                const field = document.getElementById(fieldId);
                if (!field || field.value.trim() === "") {
                    allFilled = false;
                }
            });

            if (!allFilled) {
                Swal.fire("Error!", "Please fill in all required fields.", "error");
                return; 
            }

            // Proceed with form submission if validation passed
            const formData = new FormData(maintenanceForm);

            fetch("backend/submit_maintenance.php", {
                method: "POST",
                body: formData,
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    Swal.fire("Success!", data.message, "success");

                    // Reset only the specific fields 
                    document.getElementById("issueType").selectedIndex = 0;
                    document.getElementById("issueDescription").value = "";
                    document.getElementById("contactTime").selectedIndex = 0;
                    document.getElementById("uploadEvidence").value = "";
                } else if (data.status === "exists") {
                    Swal.fire("Request Already Submitted", data.message, "info");
                } else {
                    Swal.fire("Error!", data.message, "error");
                }
            })
            .catch(error => {
                console.error("Request error:", error);
                Swal.fire("Error!", "An unexpected error occurred.", "error");
            });
        });
    }
});

// handles notification displaying
function loadNotifications() {
    const notificationTableBody = document.querySelector("#notificationTable tbody");
    const userId = document.getElementById("userId")?.value || 0;
  
    // Fetch notifications from your backend
    fetch(`backend/get_notifications.php?user_id=${userId}`)
      .then(res => res.json())
      .then(result => {
        if (result.status !== "success") {
          Swal.fire("Error", result.message, "error");
          return;
        }
  
        const notifications = result.data || [];
        // Clear any existing rows
        notificationTableBody.innerHTML = "";
  
        if (notifications.length === 0) {
          // If no data, insert a single row with a placeholder message
          const row = document.createElement("tr");
          const cell = document.createElement("td");
          cell.colSpan = 3; // Match the number of <th> columns
          cell.textContent = "No notifications available.";
          row.appendChild(cell);
          notificationTableBody.appendChild(row);
          return;
        }
  
        // Otherwise, build rows for each notification
        notifications.forEach(notif => {
          const row = document.createElement("tr");
  
          // 1) user_id cell
          const userIdCell = document.createElement("td");
          userIdCell.textContent = notif.user_id;
          row.appendChild(userIdCell);
  
          // 2) full_name cell
          const fullNameCell = document.createElement("td");
          fullNameCell.textContent = notif.full_name;
          row.appendChild(fullNameCell);
  
          // 3) requests cell (Maintenance or Change Plan)
          const requestsCell = document.createElement("td");
          requestsCell.textContent = (notif.type === "maintenance")
            ? "Maintenance Request"
            : "Change Plan Request";
          row.appendChild(requestsCell);
  
          // Store full notification object in a data attribute
          row.dataset.notif = JSON.stringify(notif);
  
          // On row click, show a SweetAlert with full details
          row.addEventListener("click", function() {
            const data = JSON.parse(this.dataset.notif);
  
            // Build an HTML string for the details
            let detailHtml = "";
            if (data.type === "maintenance") {
              detailHtml = `
                <p><strong>Request ID:</strong> ${data.request_id}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Issue Type:</strong> ${data.issue_type}</p>
                <p><strong>Description:</strong> ${data.issue_description}</p>
                <p><strong>Preferred Contact Time:</strong> ${data.contact_time}</p>
                <p><strong>Technician:</strong> ${data.technician_name || "N/A"}</p>
                <p><strong>Submitted At:</strong> ${data.submitted_at}</p>
                <p style="margin-top:10px;color:red;"><em>Important note: Please wait for the assigned technician to contact you after the approval of this request.</em></p>
              `;
            } else {
              detailHtml = `
                <p><strong>Request ID:</strong> ${data.request_id}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Current Plan:</strong> ${data.current_plan}</p>
                <p><strong>New Plan:</strong> ${data.new_plan}</p>
                <p><strong>Price:</strong> ${data.price}</p>
                <p><strong>Changed At:</strong> ${data.changed_at}</p>
                <p style="margin-top:10px; color:red;"><em>Important note: Approval date serves as the new billing date, but not settling your payment to the last billing will hinder the start of new plan and billing date.</em></p>
              `;
            }
  
            Swal.fire({
              title: "Request Details",
              html: detailHtml,
              icon: "info",
              confirmButtonText: "Close"
            });
          });
  
          notificationTableBody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Error fetching notifications:", err);
        Swal.fire("Error", "Unable to fetch notifications.", "error");
      });
  }
  
  










  
  











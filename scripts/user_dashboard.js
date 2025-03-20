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
                if (fieldId.includes("contact") && !/^\d{11}$/.test(value)) {
                    return "Enter a valid 11-digit contact number (e.g., 09123456789)";
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













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

        let fieldLabel = fieldId === "contactNumber" ? "Contact Number" : "Email Address";

        Swal.fire({
            title: `Edit ${fieldLabel}`,
            input: "text",
            inputValue: field.value,
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
                if (!value) return "This field cannot be empty!";
                if (fieldId === "contactNumber" && !/^\+639\d{9}$/.test(value)) {
                    return "Enter a valid Philippine contact number (+639XXXXXXXXX)";
                }
                if (fieldId === "emailAddress" && !/^\S+@\S+\.\S+$/.test(value)) {
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
    document.getElementById("contactNumber").setAttribute("readonly", true);
    document.getElementById("emailAddress").setAttribute("readonly", true);
});











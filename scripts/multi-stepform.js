document.addEventListener("DOMContentLoaded", function () {
    console.log("Multi-step form with validation script loaded");

    const steps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".step");
    const nextBtns = document.querySelectorAll(".next-btn, .next-btn2");
    const prevBtns = document.querySelectorAll(".prev-btn");
    const submitBtn = document.querySelector(".submit");

    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const contactNumber = document.getElementById("contact-number");
    const idNumber = document.getElementById("id-number");
    const idPhoto = document.getElementById("id-photo");
    const residencyPhoto = document.getElementById("residency-photo");
    const installationDate = document.getElementById("installation-date");
    const houseNumber_street = document.getElementById("address_details");
    const emailField = document.getElementById("email");

    let currentStep = 0;

    function updateSteps() {
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === currentStep);
        });
        progressSteps.forEach((step, index) => {
            step.classList.toggle("active", index <= currentStep);
        });
    }

    // Function to convert text input to uppercase, limit to 30 characters, and prevent numbers
    function enforceUppercaseNoNumbers(inputField) {
        inputField.addEventListener("input", function () {
            this.value = this.value.toUpperCase().replace(/\d/g, "").slice(0, 30);
        });
    }
    // Apply uppercase restriction & prevent numbers for name fields
    enforceUppercaseNoNumbers(firstName);
    enforceUppercaseNoNumbers(lastName);

    // Function to force uppercase (used for address details)
    function enforceUppercase(inputField) {
        inputField.addEventListener("input", function () {
            this.value = this.value.toUpperCase().slice(0, 30);
        });
    }
    enforceUppercase(houseNumber_street);

    if (contactNumber) {
        // On input, allow only digits and then add hyphens at defined positions
        contactNumber.addEventListener("input", function () {
            // Remove all non-digit characters.
            let digits = this.value.replace(/\D/g, "");
            // Limit to a maximum of 11 digits total.
            digits = digits.slice(0, 11);
            // Format the digits into 0000-000-0000.
            if (digits.length > 7) {
                // 4 digits, hyphen, 3 digits, hyphen, up to 4 digits.
                this.value = digits.slice(0, 4) + "-" + digits.slice(4, 7) + "-" + digits.slice(7);
            } else if (digits.length > 4) {
                // 4 digits, hyphen, remaining digits.
                this.value = digits.slice(0, 4) + "-" + digits.slice(4);
            } else {
                this.value = digits;
            }
        });
    }

    // Function to restrict input to numbers only (for other numeric fields)
    function restrictToNumbers(inputField, maxLength) {
        inputField.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, maxLength);
        });
    }
    // Apply number-only restriction to idNumber
    restrictToNumbers(idNumber, 15); // ID number (15 digits max)

    // Function to validate file upload for images (JPG/PNG only)
    function validateFileUpload(inputField) {
        inputField.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const fileType = file.type;
                const validTypes = ["image/jpeg", "image/png"];
                if (!validTypes.includes(fileType)) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops! Invalid file type.",
                        text: "Please upload a JPG or PNG file.",
                    });
                    this.value = ""; // Clear file input
                }
            }
        });
    }
    // Apply file validation to ID photo and proof of residency
    validateFileUpload(idPhoto);
    validateFileUpload(residencyPhoto);

    // Async function to check if contact number or email already exist in the database
    async function checkUserExistence(contactVal, emailVal) {
        try {
            const response = await fetch("backend/check_user_existence.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contact_number: contactVal,
                    email_address: emailVal,
                }),
            });
            const data = await response.json();
            // Expecting a response with a status of "exists" if data is found.
            return data.status === "exists";
        } catch (error) {
            console.error("Error checking user existence:", error);
            // In case of error, to be safe, prevent proceeding.
            return true;
        }
    }

    function validateEmail(emailInput) {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/;

        // Split email into username and domain parts
        const [username, domain] = emailValue.split('@');
        
        // Check if the username part is at least 5 characters
        if (username.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email Format",
                text: "The username part of the email must be at least 5 characters long.",
            });
            return false;
        }

        // Must match the regex
        if (!emailRegex.test(emailValue)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email Format",
                text: "Please enter a valid email address (e.g., user@gmail.com).",
            });
            return false;
        }

        // Check for restricted domains or additional text after domain
        if (/\.(com|org|ph)$/.test(domain) === false) {
            Swal.fire({
                icon: "error",
                title: "Invalid Email Domain",
                text: "Only .com, .org, or .ph domains are allowed.",
            });
            return false;
        }

        return true;
    }

    // Validate form fields (Steps 1 & 2)
    function validateStep(stepIndex) {
        const currentInputs = steps[stepIndex].querySelectorAll("input, select");

        for (let input of currentInputs) {
            // Check required fields
            if (input.hasAttribute("required") && !input.value.trim()) {
                Swal.fire({
                    icon: "error",
                    title: "Almost there!",
                    text: "Please fill in all required fields before proceeding.",
                });
                return false;
            }
            // Validate SELECT elements
            if (input.tagName === "SELECT" && input.hasAttribute("required") && input.value === "") {
                Swal.fire({
                    icon: "error",
                    title: "Selection Required",
                    text: "Please select a Government ID before proceeding.",
                });
                return false;
            }
            // First & Last Name: No numbers allowed
            if (input.id === "first-name" || input.id === "last-name") {
                if (/\d/.test(input.value)) {
                    Swal.fire({
                        icon: "error",
                        title: "Invalid Name",
                        text: "Names cannot contain numbers.",
                    });
                    return false;
                }
            }
            // Contact Number must match format 0000-000-0000
            if (input.id === "contact-number") {
                if (!/^\d{4}-\d{3}-\d{4}$/.test(input.value.trim())) {
                    Swal.fire({
                        icon: "error",
                        title: "Invalid Contact Number",
                        text: "Contact number must be in the format 0000-000-0000.",
                    });
                    return false;
                }
            }
            // ** Validate Email Format **
            if (input.id === "email") {
                if (!validateEmail(input)) {
                    return false;  // Exit early if email is invalid
                }
            }
            // ID Number: If filled, must be between 10 and 15 digits.
            if (input.id === "id-number" && input.value.trim() !== "") {
                if (!/^\d{10,15}$/.test(input.value)) {
                    Swal.fire({
                        icon: "error",
                        title: "Invalid ID Number",
                        text: "ID number must be between 10 to 15 digits if entered.",
                    });
                    return false;
                }
            }
        }
        return true;
    }

    // Function to validate installation date and pinned location before submission
    function validateFinalStep(event) {
        if (installationDate && installationDate.value.trim() === "") {
            event.preventDefault();
            Swal.fire({
                icon: "error",
                title: "Installation Date Required",
                text: "Please select an installation date before submitting.",
            });
            return false;
        }
        const latField = document.getElementById("latitude");
        const lonField = document.getElementById("longitude");
        if (!latField.value.trim() || !lonField.value.trim()) {
            event.preventDefault();
            Swal.fire({
                icon: "error",
                title: "Location Not Set",
                text: "Please pin your location on the map before submitting.",
            });
            return false;
        }
        return true;
    }

    // Validate installation date and pinned location when clicking the Submit button
    submitBtn.addEventListener("click", (event) => {
        validateFinalStep(event);
    });

    // Validate inputs on next button click (Steps 1 & 2)
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", async () => {
            if (currentStep < steps.length - 1) {
                if (validateStep(currentStep)) {
                    // When moving from Step 0 to Step 1, check for existing user
                    if (currentStep === 0) {
                        const contactVal = contactNumber.value.trim();
                        const emailVal = emailField.value.trim();
                        const userExists = await checkUserExistence(contactVal, emailVal);
                        if (userExists) {
                            Swal.fire({
                                icon: "error",
                                title: "User Already Exists",
                                text: "This contact number or email address is already registered. Please use different credentials.",
                            });
                            return;
                        }
                    }
                    currentStep++;
                    updateSteps();
                }
            }
        });
    });

    prevBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateSteps();
            }
        });
    });

    updateSteps();
});

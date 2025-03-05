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

    // Function to restrict input to numbers only
    function restrictToNumbers(inputField, maxLength) {
        inputField.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, maxLength);
        });
    }

    // Apply number-only restriction
    restrictToNumbers(contactNumber, 11); // Contact number (11 digits max)
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

    // Apply file validation to ID and proof of residency
    validateFileUpload(idPhoto);
    validateFileUpload(residencyPhoto);

    // Function to validate form fields before proceeding (Steps 1 & 2)
    // Function to validate form fields before proceeding (Steps 1 & 2)
function validateStep(stepIndex) {
    const currentInputs = steps[stepIndex].querySelectorAll("input, select");

    for (let input of currentInputs) {
        if (input.hasAttribute("required") && !input.value.trim()) {
            Swal.fire({
                icon: "error",
                title: "Almost there!",
                text: "Please fill in all required fields before proceeding.",
            });
            return false;
        }

        // Ensure dropdowns are properly validated
        if (input.tagName === "SELECT" && input.hasAttribute("required") && input.value === "") {
            Swal.fire({
                icon: "error",
                title: "Selection Required",
                text: "Please select a Government ID before proceeding.",
            });
            return false;
        }

        // First & Last Name Validation (No Numbers)
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

        // Contact Number Validation (Only Numbers, Must be 11 digits)
        if (input.id === "contact-number") {
            if (!/^\d{11}$/.test(input.value)) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Contact Number",
                    text: "Contact number must be exactly 11 digits.",
                });
                return false;
            }
        }

        // ID Number Validation (Optional, But If Filled, Must Be 10-15 Digits)
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


    // Function to validate installation date ONLY on Submit button
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
        return true;
    }

    // Validate installation date when clicking Submit button
    submitBtn.addEventListener("click", (event) => {
        validateFinalStep(event);
    });

    // Validate inputs on next button click (Steps 1 & 2)
    nextBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep < steps.length - 1) {
                if (validateStep(currentStep)) {
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

// orig code w/o duplication validation
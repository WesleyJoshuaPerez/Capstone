document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".step");
    const nextBtns = document.querySelectorAll(".next-btn, .next-btn2"); 
    const prevBtns = document.querySelectorAll(".prev-btn");

    let currentStep = 0;

    function updateSteps() {
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === currentStep);
        });

        progressSteps.forEach((step, index) => {
            step.classList.toggle("active", index <= currentStep);
        });
    }

    function validateStep(stepIndex) {
        const currentInputs = steps[stepIndex].querySelectorAll("input, select");
        for (let input of currentInputs) {
            if (input.hasAttribute("required") && !input.value) {
                alert("Please fill in all required fields before proceeding.");
                return false;
            }
        }
        return true;
    }

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

document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll("input");
  const labels = document.querySelectorAll("label");

  function toggleLabels() {
    const allEmpty = [...inputs].every((input) => input.value.trim() === "");
    labels.forEach((label) => {
      label.style.display = allEmpty ? "none" : "block";
    });
  }

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      labels.forEach((label) => (label.style.display = "block"));
    });

    input.addEventListener("input", toggleLabels);
    input.addEventListener("blur", toggleLabels);
  });
});

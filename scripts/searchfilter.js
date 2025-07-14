document.querySelectorAll(".table-search").forEach((input) => {
  input.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const tableId = this.getAttribute("data-target");
    const table = document.getElementById(tableId);
    if (!table) return;

    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    const allRows = Array.from(tbody.querySelectorAll("tr"));
    const existingNoResult = tbody.querySelector(".no-results");
    if (existingNoResult) existingNoResult.remove();

    const dataRows = allRows.filter(
      (row) => !row.classList.contains("no-results")
    );

    let visibleCount = 0;

    dataRows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();
      const match = rowText.includes(searchValue);
      row.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    if (dataRows.length > 0 && visibleCount === 0) {
      const colCount = table.querySelectorAll("thead th").length;
      const noResultRow = document.createElement("tr");
      noResultRow.classList.add("no-results");
      noResultRow.innerHTML = `
        <td colspan="${colCount}" style="text-align: center; padding: 30px;">
          <div style="display: inline-block; text-align: center; color: #888;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="margin-bottom: 10px; color: #3775b9">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <div style="font-size: 16px;">No results found</div>
          </div>
        </td>
      `;
      tbody.appendChild(noResultRow);
    }
  });
});

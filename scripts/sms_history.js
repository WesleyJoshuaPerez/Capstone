document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("viewHistoryBtn");

  if (btn) {
    btn.addEventListener("click", function () {
      fetch("backend/sms_history_fetch.php")
        .then((response) => response.text())
        .then((data) => {
          // Create the HTML with search input
          const searchableContent = `
            <div class="sms-history-container">
              <div class="search-container" style="margin-bottom: 15px;">
                <label for="smsSearch" style="display:none;">Search SMS history</label>
                <input 
                  type="text" 
                  id="smsSearch" 
                  placeholder="Search SMS history..." 
                  aria-label="Search SMS history"
                  style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;"
                />
              </div>
              <div id="smsHistoryContent" style="max-height: 400px; overflow-y: auto;">
                ${data}
              </div>
            </div>
          `;

          Swal.fire({
            title: "SMS History",
            html: searchableContent,
            width: "80%",
            confirmButtonText: "Close",
            confirmButtonColor: "#007bff",
            customClass: { popup: "swal2-rounded" },
            didOpen: () => {
              const searchInput = document.getElementById("smsSearch");
              const contentDiv = document.getElementById("smsHistoryContent");

              if (searchInput && contentDiv) {
                const table = contentDiv.querySelector("table");
                const tbody = table ? table.querySelector("tbody") : null;
                const originalTbodyHTML = tbody ? tbody.innerHTML : "";

                // Debounce user input for performance
                searchInput.addEventListener(
                  "input",
                  debounce(function () {
                    const searchTerm = this.value.toLowerCase().trim();

                    if (!tbody) return;
                    if (searchTerm === "") {
                      tbody.innerHTML = originalTbodyHTML;
                    } else {
                      filterSMSHistory(tbody, originalTbodyHTML, searchTerm);
                    }
                  }, 200)
                );

                searchInput.focus();
              }
            },
          });
        })
        .catch((error) => {
          Swal.fire("Error", "Failed to load SMS history.", "error");
          console.error(error);
        });
    });
  }
});

// Debounce utility for input
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Function to filter SMS history based on search term, only updates tbody
function filterSMSHistory(tbody, originalTbodyHTML, searchTerm) {
  // Parse original tbody rows
  const tempDiv = document.createElement("tbody");
  tempDiv.innerHTML = originalTbodyHTML;

  const smsItems = tempDiv.querySelectorAll("tr");
  let filteredHTML = "";
  let hasResults = false;

  smsItems.forEach((item) => {
    const itemText = item.textContent.toLowerCase();
    if (itemText.includes(searchTerm)) {
      filteredHTML += highlightSearchTerm(item.outerHTML, searchTerm);
      hasResults = true;
    }
  });

  if (hasResults) {
    tbody.innerHTML = filteredHTML;
  } else {
    tbody.innerHTML = `<tr><td colspan="5" class="no-data">No results found for "${searchTerm}"</td></tr>`;
  }
}

// Highlight search terms using CSS class
function highlightSearchTerm(html, searchTerm) {
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
  return html.replace(regex, '<mark class="sms-highlight">$1</mark>');
}

// Escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

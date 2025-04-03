document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("mapContainer");
  const mapLink = document.getElementById("mapLink"); // Select the map link
  let mapInitialized = false;
  let map;

  mapLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Hide all sections except the map
    document
      .querySelectorAll(".summary-container, .info > div")
      .forEach((div) => {
        div.style.display = "none";
      });

    // Show the map container
    mapContainer.style.display = "block";

    // Initialize the map only once
    if (!mapInitialized) {
      // Set initial view to Orion, Bataan's coordinates with zoom level 14 (or adjust as needed)
      map = L.map("map").setView([14.6717, 120.5487], 14);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Optional: Get the user's current position and update map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Update map view to user's location
            map.setView([userLat, userLng], 12);

            // Add a marker at the user's location
            L.marker([userLat, userLng])
              .addTo(map)
              .bindPopup("You are here!")
              .openPopup();
          },
          function (error) {
            console.error("Error fetching geolocation:", error.message);
            alert("Unable to retrieve your location.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }

      mapInitialized = true; // Mark map as initialized
    }
  });
});

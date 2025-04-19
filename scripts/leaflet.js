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

      // Define a custom icon for markers
      const userIcon = L.icon({
        iconUrl: "frontend/assets/images/icons/user_icon_marker.png", // Replace with your custom icon path
        iconSize: [64, 64], // Size of the icon (make it bigger)
        iconAnchor: [32, 64], // Adjust anchor point (centered for larger icon)
        popupAnchor: [0, -64], // Adjust the popup position relative to the larger icon
      });

      // Fetch coordinates from PHP backend and plot them on the map
      fetch("backend/fetch_map_coordinates.php")
        .then((response) => response.json())
        .then((users) => {
          users.forEach((user) => {
            const lat = parseFloat(user.address_latitude);
            const lng = parseFloat(user.address_longitude);
            const name = user.fullname;
            const username = user.username;
            const subscriptionPlan = user.subscription_plan;

            if (!isNaN(lat) && !isNaN(lng)) {
              // Use the custom icon for each marker
              L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup(`
                 <b>${username}</b><br>
                 <b>${name}</b><br>
                  Subscription Plan: ${subscriptionPlan}
                `);
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching user coordinates:", error);
        });

      // Optional: Get the user's current position and update map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Update map view to user's location
            map.setView([userLat, userLng], 12);
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

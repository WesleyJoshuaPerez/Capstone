document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("mapContainer");
  const mapLink = document.getElementById("mapLink");
  let mapInitialized = false;
  let map;
  let markerLayer = L.layerGroup();

  // Define custom icons globally
  const userIcon = L.icon({
    iconUrl: "frontend/assets/images/icons/user_icon_marker.png",
    iconSize: [64, 64],
    iconAnchor: [32, 64],
    popupAnchor: [0, -64],
  });

  const enabledIcon = L.icon({
    iconUrl: "frontend/assets/images/icons/napbox_enabled.png",
    iconSize: [64, 40],
    iconAnchor: [32, 40],
    popupAnchor: [0, -40],
  });

  const disabledIcon = L.icon({
    iconUrl: "frontend/assets/images/icons/napbox_disabled.png",
    iconSize: [64, 40],
    iconAnchor: [32, 40],
    popupAnchor: [0, -40],
  });

  // Function to fetch and update map markers
  function updateMarkers(map) {
    markerLayer.clearLayers(); // Clear old markers

    fetch("backend/fetch_map_coordinates.php")
      .then((response) => response.json())
      .then((locations) => {
        locations.forEach((location) => {
          const lat = parseFloat(location.latitude);
          const lng = parseFloat(location.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            let icon;
            let popupContent = "";

            if (location.type === "user") {
              icon = userIcon;
              popupContent = `
               <b> Username: </b>${location.username} <br>
               <b> Fullname: </b>${location.fullname} <br>
               <b> Subscription Plan:</b> ${location.subscription_plan} <br>
                 <b>Nap Box: </b>${location.barangay}<br>
              `;
            } else if (location.type === "napbox") {
              icon = location.status === "Enabled" ? enabledIcon : disabledIcon;
              popupContent = `
               <b>Barangay: </b>${location.barangay}<br>
                <b>Status: </b>${location.status}<br>
                <b>Available Slots: </b>${location.available_slots}
              `;
            }

            const marker = L.marker([lat, lng], { icon: icon }).bindPopup(
              popupContent
            );
            markerLayer.addLayer(marker);
          }
        });

        markerLayer.addTo(map); // Add all markers to map at once
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
      });
  }

  mapLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Hide other sections
    document
      .querySelectorAll(".summary-container, .info > div")
      .forEach((div) => {
        div.style.display = "none";
      });

    // Show the map container
    mapContainer.style.display = "block";

    if (!mapInitialized) {
      // Create the map
      map = L.map("map");
      mapInitialized = true;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // Try to use geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 14);

            // // Add user marker
            // L.marker([lat, lng], { icon: userIcon })
            //   .addTo(map)
            //   .bindPopup("You are here");

            // Load markers
            updateMarkers(map);
          },
          (error) => {
            console.error("Geolocation error:", error);
            map.setView([14.6717, 120.5487], 14);
            updateMarkers(map);
          }
        );
      } else {
        console.error("Geolocation not supported.");
        map.setView([14.6717, 120.5487], 14);
        updateMarkers(map);
      }
    } else {
      // Just refresh markers if map is already initialized
      updateMarkers(map);
    }
  });
});

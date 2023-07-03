// Store the API endpoint as queryUrl
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the earthquake URL
d3.json(earthquakeUrl).then(function(data) {
    // Send data.features object to the createMarkers function.
    console.log(data);
    createMarkers(data.features);
});

// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function createMarkers(earthquakeData) {
    // Define function to run for each feature in the earthquakeData array.
    // Give each feature a popup that describes the time and place of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    // Create a GeoJSON layer that contains the earthquakeData array.
    // Run the onEachFeature function for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Send the earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create the base layers
    let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    // Create the map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetMap, earthquakes]
    });

    // Create a control
    // Pass in baseMaps and overlayMaps
    // Add the control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
    
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 90],
            labels = [],
            legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getMarkerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);
}

// Increase marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5;
}

// Change marker color based on depth
function getMarkerColor(depth) {
    return depth > 90 ? '#d73027' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#91cf60' :
                         '#1a9850' ;          
}

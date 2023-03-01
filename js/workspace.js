//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2019";

    //create marker options
    var options = {
        fillColor: "##3396FF",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //Step 5: For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Step 6: Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent);

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};




//Step 3: Add circle markers for point features to the map
function createPropSymbols(data) {

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2019";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#3396FF",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};
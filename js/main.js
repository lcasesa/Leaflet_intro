//declare map variable globally so all functions have access
var map;
var minValue;

//Create the Leaflet map--already done in createMap()
function createMap() {
    //create the map
    map = L.map('map', {
        center: [39.74, -104.99],
        zoom: 8
    });

    //add OSM base tilelayer
    var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
    }).addTo(map);

    //call getData function
    getData(map);
};

function calculateMinValue(data) {
    //create empty array to store all data values
    var allValues = [];
    //loop through each city
    for (var city of data.features) {
        //loop through each year
        for (var year = 2013; year <= 2019; year += 1) {
            //get population for current year
            var value = city.properties["Pop_" + String(year)];
            //add value to array
            allValues.push(parseInt(value));
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues);

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;

    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    console.log(attribute);
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Pop_2019";

    //create marker options
    var options = {
        fillColor: "#FFFF00",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string starting with city...Example 2.1 line 24
    var popupContent = "<p><b>City:</b> " + feature.properties.city_name + "</p>";

    //add formatted attribute to popup content string
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " </p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -options.radius)
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};


//Step 3: build an attributes array from the data
function processData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties) {
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1) {
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};


//Step 1: Create new sequence controls
function createSequenceControls() {
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);
};

//set slider attributes
document.querySelectorAll(".range-slider").max = 6;
document.querySelectorAll(".range-slider").min = 0;
document.querySelectorAll(".range-slider").value = 0;
document.querySelectorAll(".range-slider").step = 1;

//add step buttons
document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="reverse">Reverse</button>');
document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="forward">Forward</button>');


//Import GeoJSON data
function getData(map){
    //load the data
    fetch("data/colorado_cities2.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var attributes = processData(json);
            minValue = calcMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
            createSequenceControls();
        })
};


document.addEventListener('DOMContentLoaded', createMap)


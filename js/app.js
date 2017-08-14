var map, infowindow;
// to push the marker on it
var markers = [];
  

// my locations and coordinates from course
var locations = [{
        title: "Park Ave Penthouse",
        location: {
            lat: 40.7713024,
            lng: -73.9632393
        }
    },
    {
        title: "Chelsa",
        location: {
            lat: 40.7444883,
            lng: -73.9949465
        }
    },
    {
        title: "Union Square Open Floor Plan",
        location: {
            lat: 40.7347062,
            lng: -73.9895759
        }
    },
    {
        title: "TriBeCa Artsy Bachelor Pad",
        location: {
            lat: 40.7195264,
            lng: -74.0089934
        }
    },
    {
        title: "Chinatown Homey Space",
        location: {
            lat: 40.7180628,
            lng: -73.9961237
        }
    }
];

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        // inital position of map
        center: {
            lat: 40.7413549,
            lng: -73.99802439999996
        },
        zoom: 13
    });

    var infoWindow = new google.maps.InfoWindow({
        content: ""
    });
    var bounds = new google.maps.LatLngBounds();

    //markers loop through the locations
    //for (var i = 0; i < locations.length; i++) {
    locations.forEach(function(location){
          //get pos. from array locations
        var position = location.location;
        var title = location.title;

        //create a marker per location, put into markers array
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            //id: i
        });
        //push it to the markers array
        markers.push(marker);
        // console.log(markers);

        marker.setMap(map);
        //extend the boundaries of the map to each marker
        bounds.extend(marker.position);

        //creat on click event to open infowindow
        marker.addListener('click', function(){
      populateInfowWindow(this, infoWindow);
      });
      });
}
function mapError() {
    console.log("error");
  alert("there is an error");
};


function populateInfowWindow(marker, infowindow) {
    // console.log('eeeeeeeee');
    var $wikiElem = document.getElementById('error');

    var title1 = marker.title;
    var Articalurl;
    // console.log(title1);

    //get info from third party app as cameron has done it
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + title1 + '&format=json&callback=wikiCallback';


    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.innerText = ("failed to get resources");
    }, 8000);

    //i have updated this part with the help of forums and webcasts and ourlive help
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response) {

            var article = response[0];
            var Articalurl = 'http://en.wikipedia.org/wiki/' + article;
            //check that the window isn't already opened
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.setContent("<div>" + title1 + '<br>' + "Wikibedia Artical about The Place :" + '<a target="_blank" href=" ' + Articalurl + '">' + Articalurl + '</a>' + "</div>");
                infowindow.open(map, marker);
                //make sure the marker property is cleared 
                infowindow.addListener("closeclick", function() {
                    infowindow.marker = null;
                });
            }

            clearTimeout(wikiRequestTimeout);
        }
    });


infowindow.open(map,marker);
    // to make Bounce Animation 
    marker.setAnimation(google.maps.Animation.BOUNCE);
    //to animate the markeri have learned this fromhttps://developers.google.com/maps/documentation/javascript/examples/marker-animations
    
}
var appViewModel = function() {
    var self = this;
    self.markers = ko.observableArray([]);
    self.map = map;
    self.locations = ko.observableArray(locations);
    self.query = ko.observable("");
    //with the help of life help
    self.filteredArray = ko.observableArray([]);

    self.filteredArray = ko.computed(function() {
        //clarify the functions to filter the text 
        return ko.utils.arrayFilter(self.locations(), function(elem) {
            //is there text or not
            if (elem.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1) {
                //if itis true > if found 
                //learned through searching the forums
                if (elem.marker)
                    elem.marker.setVisible(true);
            } else {
                if(elem.marker)
                elem.marker.setVisible(false);
            }
            return elem.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
        });
    }, self);

    
    self.clickHandler = function(locations) {
        google.maps.event.trigger(locations.marker, "click");
    };



};

var appViewModel = new appViewModel();
ko.applyBindings(appViewModel);



//i had inspiration from this duscussion forum https://discussions.udacity.com/t/neighborhood-map-help/317829/17
//i alse used the code in the course an tried to keep following it
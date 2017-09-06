var googleSuccess = function() {
    var map;
    var initialMarkers = [
        {
            address: '233 S Wacker Dr, Chicago, IL 60606'
        },
        {
            address: '201 E Randolph St, Chicago, IL 60602'
        },
        {
            address: '600 E Grand Ave, Chicago, IL 60611'
        },
        {
            address: '1200 S Lake Shore Dr, Chicago, IL 60605'
        },
        {
            address: '1300 S Lake Shore Dr, Chicago, IL 60605'
        },
        {
            address: '2045 N Lincoln Park W, Chicago, IL 60614'
        }
    ]

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {lat: 41.8781, lng: -87.6298}
        });
    }

    function createMarker(location) {
        var marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            title: location.formatted_address
        });
    }

    function geocodeAddress(address) {
        var geocoder = new google.maps.Geocoder();

        if (address === '') {
            //something
            alert('Empty address');
        }
        else {
            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    createMarker(results[0]);
                }
                else {
                    //something
                    alert('Invalid location');
                }
            });
        }
    }

    var ViewModel = function() {
        var self = this;

        initMap();

        initialMarkers.forEach(function(location) {
            geocodeAddress(location.address);
        });
    }

    ko.applyBindings(new ViewModel());
}
var mapFunctions = (function() {
    var map;
    var markers = [];
    var infoWindows = {};

    function createMarker(location) {
        var marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.formatted_address,
            icon: "http://www.googlemapsmarkers.com/v1/FF0000/"
        });

        marker.addListener('click', function() {
            markerSelected(this);
        });
        markers.push(marker);
    }

    function fillInfowindow(markerNum) {
        var latlng = String(markers[markerNum].position).slice(1, -1);
        var foursquare = "https://api.foursquare.com/v2/venues/search?ll=" + latlng + "&client_id=ZGEXJZBCBXNOGTVOPHW0EJW1FU0DEV411FC5OAU1L3BVJUPD&client_secret=T1RYQM5AK5Y2A0MT4Z3OIROZEKFL045ALNHII4L2WCF4FRCM&v=20161016";

        $.getJSON(foursquare)
            .done(function(data) {
                var latlng2 = String(data.response.venues[0].location.lat).substring(0, 5) +
                    "," + String(data.response.venues[0].location.lng).substring(0, 6);
                infoWindows[latlng2] = "<h1>" + data.response.venues[0].name + "</h1>" +
                    "<div>Address: " + data.response.venues[0].location.address + "</div>" +
                    "<div>Phone: " + data.response.venues[0].contact.formattedPhone + "</div>" +
                    "<div>URL: " + data.response.venues[0].url + "</div>" +
                    "<div>Checkins: " + data.response.venues[0].stats.checkinsCount + "</div>" +
                    "<div>Information provided by Foursquare.</div>";
            })
            .fail(function(data) {
                infoWindows.push("<h1>Data could not be retrieved. Please try again later.</h1>");
            });
    }

    //Toggle infowindow open/close
    function markerSelected(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
            marker.infowindow.close();
        }
        else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            determineInfowindow(marker);
            marker.infowindow.open(map, marker);
        }
    }

    //Determine what infowindow to attach to this marker based on shortened lat longs.
    function determineInfowindow(marker) {
        var markerPosition = String(marker.position).slice(1, -1);
        var lat = markerPosition.split(",")[0].substring(0, 5);
        var lng = markerPosition.split(",")[1].substring(1, 7);
        var markerLatlng = lat + "," + lng;
        for (var i = 0; i < Object.keys(infoWindows).length; i++) {
            if (Object.keys(infoWindows)[i] === markerLatlng) {
                marker.infowindow = new google.maps.InfoWindow({
                    content: infoWindows[Object.keys(infoWindows)[i]]
                });
            }
        }
    }

    return {
        initMap: function(viewmodal) {
            var styles = [
            {
                "featureType": "landscape.natural",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#e0efef"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "hue": "#1900ff"
                    },
                    {
                        "color": "#c0e8e8"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 700
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#7dcdcd"
                    }
                ]
            }]

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                styles: styles,
                center: {lat: 41.8781, lng: -87.6298}
            });
        },
        geocodeAddress: function(address) {
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    createMarker(results[0]);
                    fillInfowindow(markers.length - 1);
                }
            });
        },
        getMarkers: function() {
            return markers;
        },
        openInfoWindow: function(address) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].title === address) {
                    markerSelected(markers[i]);
                    //markers[i].setIcon("http://www.googlemapsmarkers.com/v1/0000FF/");
                }
            }
        },
        hideMarker: function(id) {
            markers[id].setMap(null);
        },
        showMarkers: function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        },
        favoriteMarker: function(address) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].title === address) {
                    markers[i].setIcon("http://www.googlemapsmarkers.com/v1/0000FF/");
                }
            }
        },
        unFavoriteMarker: function(address) {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].title === address) {
                    markers[i].setIcon("http://www.googlemapsmarkers.com/v1/FF0000/");
                }
            }
        }
    }

}());

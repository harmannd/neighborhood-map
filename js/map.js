var mapFunctions = (function() {
    var map;
    var markers = [];
    var infoWindows = {};

    function createMarker(location) {
        var marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.formatted_address
        });

        marker.addListener('click', markerSelected);
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

    function markerSelected() {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
            this.infowindow.close();
        }
        else {
            this.setAnimation(google.maps.Animation.BOUNCE);

            //Determine what infowindow to attach to this marker based on shortened lat longs.
            var markerPosition = String(this.position).slice(1, -1);
            var lat = markerPosition.split(",")[0].substring(0, 5);
            var lng = markerPosition.split(",")[1].substring(1, 7);
            var markerLatlng = lat + "," + lng;
            for (var i = 0; i < Object.keys(infoWindows).length; i++) {
                if (Object.keys(infoWindows)[i] === markerLatlng) {
                    this.infowindow = new google.maps.InfoWindow({
                        content: infoWindows[Object.keys(infoWindows)[i]]
                    });
                }
            }

            this.infowindow.open(map, this);
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
                    markers[i].infowindow.open(map, markers[i]);
                    markers[i].setAnimation(google.maps.Animation.BOUNCE);
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
        }
    }

}());

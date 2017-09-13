var mapFunctions = (function() {
    var map;
    var markers = [];
    //private
    function createMarker(location) {
        var marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.formatted_address
        });

        var contentString = '<div id="content">'+
                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
                '<div id="bodyContent">'+
                '<p><b>Uluru</b></p>'+
                '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                '(last visited June 22, 2009).</p>'+
                '</div>'+
                '</div>';
        marker.infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener('click', markerSelected);
        markers.push(marker);
    }

    function markerSelected() {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
            this.infowindow.close();
            //close infowindow on marker stop
        }
        else {
            this.setAnimation(google.maps.Animation.BOUNCE);
            //open infowindow
            this.infowindow.open(map, this);
        }
    }

    return {
        //public
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
        //public
        geocodeAddress: function(address) {
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

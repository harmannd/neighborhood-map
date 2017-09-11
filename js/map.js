var mapFunctions = (function() {
    //private
    function createMarker(location) {
        var marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            title: location.formatted_address
        });

        marker.addListener('click', markerSelected);
    }

    function markerSelected() {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
            //infowindow.close(map, this);
            //close infowindow on marker stop
        }
        else {
            this.setAnimation(google.maps.Animation.BOUNCE);
            //open infowindow
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
                '<div id="bodyContent">'+
                '<p><b>Uluru</b></p>'+
                '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                '(last visited June 22, 2009).</p>'+
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            infowindow.open(map, this);
        }
    }

    return {
        //public
        initMap: function() {
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
        }
    }

}());

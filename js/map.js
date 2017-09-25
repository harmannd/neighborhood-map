/**
* @description Container for minipulating the google map.
*/
const mapFunctions = (function() {
    let markers = [];
    let infoWindows = [];

    /**
    * @description Creates a google map marker at given location.
    * @param {JSON} location - Google geocode JSON return for an address
    */
    function createMarker(location) {
        let marker = new google.maps.Marker({
            position: location.geometry.location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.formatted_address,
            icon: 'http://www.googlemapsmarkers.com/v1/FF0000/'
        });

        marker.addListener('click', function() {
            markerSelected(this);
        });
        markers.push(marker);
    }

    /**
    * @description Preloads the marker infowindows with infomation from
    *              a Foursquare api JSON call.
    * @param {number} markerNum - The marker index in marker array
    */
    function fillInfowindow(markerNum) {
        const latlng = String(markers[markerNum].position).slice(1, -1);
        const foursquare = 'https://api.foursquare.com/v2/venues/search?ll=' + latlng + '&client_id=ZGEXJZBCBXNOGTVOPHW0EJW1FU0DEV411FC5OAU1L3BVJUPD&client_secret=T1RYQM5AK5Y2A0MT4Z3OIROZEKFL045ALNHII4L2WCF4FRCM&v=20161016';

        $.getJSON(foursquare)
            .done(function(data) {
                const latlng2 = String(data.response.venues[0].location.lat).substring(0, 5) +
                    ',' + String(data.response.venues[0].location.lng).substring(0, 6);
                const title = data.response.venues[0].name || 'No title provided.';
                const address = data.response.venues[0].location.address || 'No address provided';
                const phone = data.response.venues[0].contact.formattedPhone || 'No phone provided';
                const url = data.response.venues[0].url || 'No URL provided';
                const checkins = data.response.venues[0].stats.checkinsCount || 'No checkin count provided';
                infoWindows[latlng2] =
                    '<section style="width: 350px">' +
                    '<h1>' + title + '</h1>' +
                    '<div>Address: ' + address + '</div>' +
                    '<div>Phone: ' + phone + '</div>' +
                    '<div>URL: ' + url + '</div>' +
                    '<div>Checkins: ' + checkins + '</div>' +
                    '<div style="float: right">Powered by Foursquare</div></section>';
            })
    }

    /**
    * @description Creates and opens the infowindow for the marker.
    * @param {object} marker - The google map marker
    */
    function createInfowindow(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        window.setTimeout(function() {
            marker.setAnimation(null);
        }, 700);
        determineInfowindow(marker);
        marker.infowindow.open(map, marker);
        marker.infowindow.opened = true;
    }

    /**
    * @description Toggles marker's infowindow.
    * @param {object} marker - The google map marker
    */
    function markerSelected(marker) {
        if (typeof marker.infowindow === "undefined") {
            createInfowindow(marker);
        } else {
            if (marker.infowindow.opened) {
                marker.infowindow.close();
                marker.infowindow.opened = false;
            }
            else {
                createInfowindow(marker);
            }
        }
    }

    /**
    * @description Determine what infowindow to attach to this marker
    *              based on shortened lat longs.
    * @param {object} marker - The google map marker
    */
    function determineInfowindow(marker) {
        google.maps.InfoWindow.prototype.opened = false;
        const markerPosition = String(marker.position).slice(1, -1);
        const lat = markerPosition.split(',')[0].substring(0, 5);
        const lng = markerPosition.split(',')[1].substring(1, 7);
        const markerLatlng = lat + ',' + lng;
        for (let i = 0; i < Object.keys(infoWindows).length; i++) {
            if (Object.keys(infoWindows)[i] === markerLatlng) {
                marker.infowindow = new google.maps.InfoWindow({
                    content: infoWindows[Object.keys(infoWindows)[i]]
                });
            }
        }
        if (!marker.infowindow) {
            marker.infowindow = new google.maps.InfoWindow({
                content: 'There was a problem getting the information.'
            });
        }
    }

    return {
        /**
        * @description Makes an api call to google geocode and creates
        *              markers and infowindows if a valid address.
        * @param {string} address - The location address to geocode
        */
        geocodeAddress: function(address) {
            const geocoder = new google.maps.Geocoder();

            geocoder.geocode({
                address: address
            }, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    createMarker(results[0]);
                    fillInfowindow(markers.length - 1);
                }
            });
        },

        /**
        * @description Returns the markers array.
        * @returns {array} markers - Array containing marker objects
        */
        getMarkers: function() {
            return markers;
        },

        /**
        * @description Compares address to marker title addresses to
        *              determine which marker to select.
        * @param {string} address - Address location
        */
        openInfoWindow: function(address) {
            for (let i = 0; i < markers.length; i++) {
                if (markers[i].title === address) {
                    markerSelected(markers[i]);
                }
            }
        },

        /**
        * @description Removes the marker from display on map.
        * @param {number} id - Index of marker in markers array
        */
        hideMarker: function(id) {
            markers[id].setMap(null);
        },

        /**
        * @description Resets the markers to be displayed on map.
        */
        showMarkers: function() {
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        },

        /**
        * @description Compares address to marker title addresses to
        *              determine which marker to favorite(change icon color).
        * @param {string} address - Address location
        */
        favoriteMarker: function(address) {
            for (let i = 0; i < markers.length; i++) {
                if (markers[i].title === address) {
                    markers[i].setIcon('http://www.googlemapsmarkers.com/v1/0000FF/');
                }
            }
        },

        /**
        * @description Compares address to marker title addresses to
        *              determine which marker to unfavorite(change icon color).
        * @param {string} address - Address location
        */
        unFavoriteMarker: function(address) {
            for (let i = 0; i < markers.length; i++) {
                if (markers[i].title === address) {
                    markers[i].setIcon('http://www.googlemapsmarkers.com/v1/FF0000/');
                }
            }
        }
    };
}());

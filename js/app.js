/**
* @description Attempts to make an api call to google maps, launching the view
*              model if successful.
* @param {string} googleMaps - Url to access google maps api
*/
const googleMaps = 'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCwPkt_vGxPOpWyBE4w0zFLtxr2H287qSM&callback=googleSuccess';
$.getScript(googleMaps)
    .fail(function() {
        alert("Sorry, the page couldn't be loaded. Please try again later");
    });

/**
* @description Container for view model that is initialized on successful
*              api call.
*/
function googleSuccess() {
    const initialAddresses = [
        {
            address: '233 S Wacker Dr'
        },
        {
            address: '201 E Randolph St'
        },
        {
            address: '600 E Grand Ave'
        },
        {
            address: '1300 S Lake Shore Dr'
        },
        {
            address: '1400 S Lake Shore Dr'
        },
        {
            address: '1901 W Madison St'
        }
    ];

    /**
    * @description View of a location.
    * @param {object} data - Address key
    */
    var Location = function(data) {
        this.address = ko.observable(data.address);
        this.searchVisible = ko.observable(true);
        this.favorited = ko.observable(false);
    }

    /**
    * @description View model for the app.
    */
    var ViewModel = function() {
        const self = this;
        let addressesSet = false;
        self.locationList = ko.observableArray([]);
        self.open = ko.observable(false);
        self.searchValue = ko.observable('');
        self.searchOptions = ko.observableArray(['Search', 'Favorites', 'Reset']);
        self.chosenSearch = ko.observable('Search');

        initialAddresses.forEach(function(location) {
            mapFunctions.geocodeAddress(location.address);
            self.locationList.push(new Location(location));
        });

        /**
        * @description Determines what filter option is selected.
        */
        self.filter = function() {
            if (self.chosenSearch() === self.searchOptions()[0]) {
                self.search();
            } else if (self.chosenSearch() === self.searchOptions()[1]) {
                self.favorites();
            } else {
                self.reset();
            }
        };

        /**
        * @description Filters the list for the value in the search bar.
        *              If the search bar is empty, reset the displayed list
        *              to show the intial list.
        *              Else show the list items that adhere to the search
        *              parameter.
        */
        self.search = function() {
            if (self.searchValue() === '') {
                self.reset();
            } else {
                for (let i = 0; i < self.locationList().length; i++) {
                    if (!self.locationList()[i].address().toUpperCase().includes(self.searchValue().toUpperCase())) {
                        self.locationList()[i].searchVisible(false);
                        mapFunctions.hideMarker(i);
                    }
                }
            }
        };

        /**
        * @description Filters the list to show only the favorite items.
        */
        self.favorites = function() {
            for (let i = 0; i < self.locationList().length; i++) {
                if (!self.locationList()[i].favorited()) {
                    self.locationList()[i].searchVisible(false);
                    mapFunctions.hideMarker(i);
                }
            }
        };

        /**
        * @description Resets the list items to show initial values.
        */
        self.reset = function() {
            for (let i = 0; i < self.locationList().length; i++) {
                self.locationList()[i].searchVisible(true);
            }
            mapFunctions.showMarkers();
        };

        /**
        * @description Sets the list items to the formatted title of
        *              the markers.
        */
        self.setAddresses = function() {
            const markers = mapFunctions.getMarkers();
            for (let i = 0; i < self.locationList().length; i++) {
                self.locationList()[i].address(markers[i].title);
            }
        };

        /**
        * @description Opens and closes the list panel.
        */
        self.openNav = function() {
            if (self.open()) {
                document.getElementById('mySidenav').style.width = '0';
                $('#hamburger').css('left', '10px');
                self.open(false);
            } else {
                document.getElementById('mySidenav').style.width = '305px';
                $('#hamburger').css('left', '315px');
                self.open(true);
                if (!addressesSet) {
                    self.setAddresses();
                    addressesSet = true;
                }
            }
        };

        /**
        * @description Opens and closes the info window on list item click.
        */
        self.infowindow = function() {
            mapFunctions.openInfoWindow(this.address());
        };

        /**
        * @description Toggles favoriting a list item.
        */
        self.favoriteLink = function() {
            if (this.favorited()) {
                this.favorited(false);
                mapFunctions.unFavoriteMarker(this.address());
            } else {
                this.favorited(true);
                mapFunctions.favoriteMarker(this.address());
            }
        };

        mapFunctions.initMap(self);
    }
    ko.applyBindings(new ViewModel());
}

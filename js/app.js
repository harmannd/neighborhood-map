var googleMaps = 'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCwPkt_vGxPOpWyBE4w0zFLtxr2H287qSM&callback=googleSuccess';

$.getScript(googleMaps)
    .fail(function() {
        alert("Sorry, the page couldn't be loaded. Please try again later");
    });

var googleSuccess = function() {
    var initialAddresses = [
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
    ]

    var Location = function(data) {
        this.address = ko.observable(data.address);
        this.searchVisible = ko.observable(true);
        this.favorite = ko.observable(false);
    }

    var ViewModel = function() {
        var self = this;
        var addressesSet = false;

        self.locationList = ko.observableArray([]);
        this.search = ko.observable("");
        this.open = ko.observable(false);

        initialAddresses.forEach(function(location) {
            mapFunctions.geocodeAddress(location.address);
            self.locationList.push(new Location(location));
        });

        self.filter = function() {
            if (self.search() === "") {
                self.reset();
            }
            else {
                for (var i = 0; i < self.locationList().length; i++) {
                    if (!self.locationList()[i].address().toUpperCase().includes(self.search().toUpperCase())) {
                        self.locationList()[i].searchVisible(false);
                        mapFunctions.hideMarker(i);
                    }
                }
            }
        };

        self.reset = function() {
            for (var i = 0; i < self.locationList().length; i++) {
                self.locationList()[i].searchVisible(true);
            }
            mapFunctions.showMarkers();
        };

        self.setAddresses = function() {
            markers = mapFunctions.getMarkers();
            for (var i = 0; i < self.locationList().length; i++) {
                self.locationList()[i].address(markers[i].title);
            }
        };

        self.openNav = function() {
            if (self.open()) {
                document.getElementById("mySidenav").style.width = "0";
                $("#hamburger").css("left", "10px");
                self.open(false);
            }
            else {
                document.getElementById("mySidenav").style.width = "300px";
                $("#hamburger").css("left", "310px");
                self.open(true);
                if (!addressesSet) {
                    self.setAddresses();
                    addressesSet = true;
                }
            }
        }

        self.infowindow = function() {
            mapFunctions.openInfoWindow(this.address());
        }

        self.favorite = function() {
            if (this.favorite()) {
                this.favorite(false);
                mapFunctions.unFavoriteMarker(this.address());
            }
            else {
                this.favorite(true);
                mapFunctions.favoriteMarker(this.address());
            }
        }

        mapFunctions.initMap(self);
    }

    ko.applyBindings(new ViewModel());
}

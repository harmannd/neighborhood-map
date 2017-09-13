var url = 'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCwPkt_vGxPOpWyBE4w0zFLtxr2H287qSM&callback=googleSuccess';

$.getScript(url)
    .fail(function() {
        //fail somehow
        alert('Failed');
    })

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
            address: '1200 S Lake Shore Dr'
        },
        {
            address: '1300 S Lake Shore Dr'
        },
        {
            address: '2045 N Lincoln Park W'
        }
    ]

    var Location = function(data) {
        this.address = ko.observable(data.address);
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
            //filter locations
            //self.search()
            markers = mapFunctions.getMarkers();

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
                document.getElementById("mySidenav").style.width = "250px";
                $("#hamburger").css("left", "260px");
                self.open(true);
                if (!addressesSet) {
                    self.setAddresses();
                    addressesSet = true;
                }
            }

        }

        //list item click to open infowindow
        self.infowindow = function() {
            mapFunctions.openInfoWindow(this.address());
        }

        mapFunctions.initMap(self);
    }

    ko.applyBindings(new ViewModel());
}

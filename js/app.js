var url = 'https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCwPkt_vGxPOpWyBE4w0zFLtxr2H287qSM&callback=googleSuccess';

$.getScript(url)
    .fail(function() {
        //fail somehow
        alert('Failed');
    })

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

    var ViewModel = function() {
        var self = this;

        mapFunctions.initMap();

        initialMarkers.forEach(function(location) {
            mapFunctions.geocodeAddress(location.address);
        });
    }

    ko.applyBindings(new ViewModel());
}
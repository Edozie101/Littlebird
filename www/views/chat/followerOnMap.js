'Use Strict';
angular.module('starter')
.controller('FollowOnMapCtrl', function ($scope, $state, Utils, Popup, $localStorage, $cordovaGeolocation, $compile, $ionicPopup,Firebase, $stateParams) {

    
    var locations2 = [
        [
            "New Mermaid",
            36.9079,
            -76.199,
            1,
            "Georgia Mason",
            "",
            "Norfolk Botanical Gardens, 6700 Azalea Garden Rd.",
            "coming soon"
        ],
        [
            "1950 Fish Dish",
            36.87224,
            -76.29518,
            2,
            "Terry Cox-Joseph",
            "Rowena's",
            "758 W. 22nd Street in front of Rowena's",
            "found"
        ],
        [
            "A Rising Community",
            36.95298,
            -76.25158,
            3,
            "Steven F. Morris",
            "Judy Boone Realty",
            "Norfolk City Library - Pretlow Branch, 9640 Granby St.",
            "found"
        ],
        [
            "A School Of Fish",
            36.88909,
            -76.26055,
            4,
            "Steven F. Morris",
            "Sandfiddler Pawn Shop",
            "5429 Tidewater Dr.",
            "found"
        ],
        [
            "Aubrica the Mermaid (nee: Aubry Alexis)",
            36.8618,
            -76.203,
            5,
            "Myke Irving/ Georgia Mason",
            "USAVE Auto Rental",
            "Virginia Auto Rental on Virginia Beach Blvd",
            "found"
        ]
    ]
    var lat = '';
    var long = '';
    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          lat = position.coords.latitude
          long = position.coords.longitude
      }, function (err) {
          // error
      });
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        // center: new google.maps.LatLng(-33.92, 151.25),
        center: new google.maps.LatLng(lat, long),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    $scope.location=[];
    var followOnMap = Firebase.get('Follow', 'displayName', $stateParams.chatId);
    followOnMap.$loaded().then(function () {
        var locations = followOnMap;
   for (i = 0; i < locations.length; i++)
   {
       $scope.location.push({
          0: locations[i].name,2: locations[i].long,
          1: locations[i].lat,
          3: locations[i].mobile
          
       });
   }
   for (i = 0; i < $scope.location.length; i++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng($scope.location[i][1], $scope.location[i][2]),
            map: map
        });
       //////////////
        var contentString = "<div><button class='button button-clear button-positive' ng-click='clickTest("+$scope.location[i][0]+")'>" + $scope.location[i][0] + "</button></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });
        var title = $scope.location[i][0];
        var template = $scope.location[i][3];

        $scope.clickTest = function () {
   
            var alertPopup = $ionicPopup.alert({
                title:title ,
                template: template
            });

            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

       /////////////
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
               // infowindow.setContent($scope.location[i][0], $scope.location[i][3],content:compiled[0]));
                infowindow.open(map, marker);
            }
           
        })(marker, i));
        $scope.test = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Don\'t eat that!',
                template: 'It might taste good'
            });

            alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };
    
        
    }
    });
});
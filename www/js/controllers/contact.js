// mainController.js
// This is the controller that handles the retriving of password for Firebase accounts.
// The user is asked for their email address, where the password reset form will be emailed to
'Use Strict';

angular.module('starter')
    
    .controller('contactController', function ($scope, Utils, Popup, $cordovaContacts, Firebase, $localStorage, $firebase, $firebaseObject,$cordovaGeolocation) {
       
        $scope.search = {};

        $scope.loadform={};
        $scope.follows = {};
     $scope.getfollowsearch=function(){
         var account = Firebase.get('accounts', 'mobile', $scope.search.value);
        
         account.$loaded().then(function () {
             if (account.length > 0)
             {
                
                 var Follow = Firebase.get('Follow', 'mobile', $scope.search.value);
                 Follow.$loaded().then(function ()
                 {
                     if (Follow.length > 0)
                     {
                         $scope.follows = Follow;
                         angular.forEach($scope.follows, function (value, key) {
                             if (value.mobile == $scope.search.value && value.userId == $localStorage.accountId) {
                                 $scope.follows.mobile = value.mobile;
                                 $scope.follows.conacname = value.displayName;
                                 $scope.follows.follow = "Unfollow";
                                 $scope.loadform.mobile = value.mobile;
                             }
                             else {
                                 $scope.follows.mobile = value.mobile;
                                 $scope.follows.conacname = value.displayName;
                                 $scope.follows.follow = "Follow";
                                 $scope.loadform.mobile = value.mobile;
                             }


                         });
                     }
                     else {
                         $scope.contacts = account;
                         angular.forEach($scope.contacts, function (value, key) {
                            
                                 
                                 $scope.follows.conacname = value.name;
                                 $scope.follows.follow = "follow";
                                 $scope.follows.mobile = value.mobile;
                                 $scope.loadform.mobile = value.mobile;


                         });

                       
                     }
                 });
            }
            else
            {
                 alert("Contact not available..");
                 $scope.loadform.mobile = '';
            }
    });
   }
       
     $scope.followsdetail = function () {
         followdetail($localStorage.accountId);
     };

   
   

     $scope.follow = {};

     followdetail = function (accountId) {
         angular.forEach($scope.contacts, function (value, key) {
             if (value.mobile == $scope.search.value)
             {
                 $scope.follow.mobile = value.mobile;
                 $scope.follow.conacname = value.name;
             }
          

         });
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

         var no = $scope.follows.mobile;
        
         var Follow = Firebase.all('Follow');
         if ($scope.follows.follow == "Unfollow")
         {
             var Followaccount = Firebase.get('Follow', 'userId', $localStorage.accountId);
             Followaccount.$loaded().then(function() {
                 //Set the variables to be shown on home.html
                 $scope.nodeID = Followaccount[0].$id;                 
             });
            
         }
         else {
        $scope.follow.name = 'Follow';
         Follow.$add({
             displayName: $scope.follows.conacname,
                     mobile: no,
                     userId: $localStorage.accountId,
                     dateCreated: Date(),
                     follow: $scope.follow.name,
                     provider: 'Firebase',
                     lat: lat,
                     long: long
         })
             .then(function (ref) {
                     Utils.message(Popup.successIcon, Popup.accountfollowSuccess)
                       .then(function () {
                           $scope.success = ref;
                           $localStorage.email = $localStorage.email;


                       })
                       .catch(function (ref) {
                           $scope.fauiler = ref;
                           //  //User closed the prompt, proceed immediately to login.
                           $localStorage.email = $localStorage.email

                       });
                 });
            }
     }
    
   

})

.controller('esCtrl', function ($scope, $firebaseObject) {

    deleteFollowAccount = function (nodeID) {
        var profileRef = new Firebase("https://lilbird01-c7797.firebaseio.com/Follow/"+nodeID);
        profileRef.remove(function (error) {
            if (error) {
                console.log("Error:", error);
            } else {
                console.log("Profile removed successfully!");
            }
        });
    };
});


// home.js
// This is the controller that handles the main view when the user is successfully logged in.
// The account currently logged in can be accessed through localStorage.account.
// The authenticated user can be accessed through firebase.auth().currentUser.
'Use Strict';
angular.module('starter')
    .controller('homeController', function ($scope, $state, $localStorage,contactService, Popup, $firebaseAuth, $cordovaContacts, $firebase,$cordovaGeolocation, Firebase, Utils,$cordovaSQLite) {
        $scope._list = [];
            //Retrieve Account details using AngularFire.
    var account = Firebase.getById('accounts', $localStorage.accountId);
    account.$loaded().then(function() {
      //Set the variables to be shown on home.html
        $scope.email = account.email;
        //$localStorage.account5 = account.$id;
        $scope.provider = account.provider;
        $localStorage.username = account.name;
        $localStorage.mmobile = account.mobile;
      //$localStorage.accountId = account.userId;

    });
       // var query = "SELECT oc.name ,oc.mobile FROM onlineContact oc JOIN mobileContact mc ON oc.mobile=mc.mobile ORDER BY oc.name ,oc.mobile ";
        //////
    var query = "SELECT * FROM  mobileContact mobcon WHERE mobcon.mobile !=" + $localStorage.mobile;
        $cordovaSQLite.execute(db, query).then(function(res) {
            if(res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++)
                {
                    $scope._list.push({
                        displayName: res.rows.item(i).name,
                        phoneNumbers: res.rows.item(i).mobile
                    });
                   // $scope._list.push(res.rows.item(i));
                }
                console.log("SELECTED -> " + res.rows.item(0).name + " " + res.rows.item(0).phone);
            } else {
                console.log("No results found");
            }
            });
        //$scope._list=contactService.GetAllContact();
        $scope.$on('$ionicView.enter', function () {

    //Authentication details.
    //console.log("Firebase Auth: " + JSON.stringify(firebase.auth().currentUser));
    //console.log($localStorage.accountId);

  })
  var accountli = Firebase.all('accounts');
  $scope.allcontacts = {};
    $scope.getContactList = function () {
        //$scope._list = [];
        //var query = "SELECT oc.name ,oc.mobile FROM onlineContact oc JOIN mobileContact mc ON oc.mobile=mc.mobile ORDER BY oc.name ,oc.mobile ";
        //$cordovaSQLite.execute(db, query).then(function (res) {
        //    if (res.rows.length > 0) {
        //        for (var i = 0; i < res.rows.length; i++) {
        //            $scope._list.push({
        //                displayName: res.rows.item(i).name,
        //                phoneNumbers: res.rows.item(i).mobile
        //            });
        //            // $scope._list.push(res.rows.item(i));
        //        }
        //        console.log("SELECTED -> " + res.rows.item(0).name + " " + res.rows.item(0).phone);
        //    } else {
        //        console.log("No results found");
        //    }
        //});
      //$cordovaContacts.find({ filter: '' }).then(function (result) {
      //    $scope.contacts = result;

      //    $scope.accountlist = accountli;


      //}, function (error) {
      //    console.log("ERROR: " + error);
      //});
    }
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
    $scope.FollowContact = function ($index) {
        var accountsFollow = Firebase.all('Follow');
        $scope.accountdetail = {};
        var accountgetbymobile = Firebase.get('accounts', 'mobile', $index);
        accountgetbymobile.$loaded().then(function () {
            if (accountgetbymobile.length > 0) {
                var Follow = Firebase.all('Follow');
                Follow.$add({
                    displayName: accountgetbymobile[0].name,
                    mobile: $index,
                    userId: $localStorage.accountId,
                    dateCreated: Date(),
                    lat:lat,
                    long: long,
                    name:$localStorage.name,
                    follow: 'Follow',
                    provider: 'Firebase',
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
            else {
                alert("Contact not is not registered on this app..");
            }
        });
    }

})
.controller('ChatsCtrl', function ($scope) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        $scope.$on('$ionicView.enter', function(e) {
        });

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
})


.controller('ChatDetailCtrl', function ($scope, $stateParams, $cordovaContacts, Firebase, $localStorage, Utils, Popup, $timeout, $anchorScroll, $ionicScrollDelegate) {
    $scope.chat = {};
    var grouptitle = $stateParams.chatId;
    $scope.chat.grouptitle = grouptitle;
    var messagegroupby = Firebase.get('groupChat', 'groupname', $stateParams.chatId);
    messagegroupby.$loaded().then(function () {
        $ionicScrollDelegate.scrollBottom(true);
        $scope.messages = messagegroupby;
        //   $scope.messagesLength = messagegroupby.length;

        $timeout(function () {
            window.scrollTo(0, document.body.scrollHeight);
        }, 0, false);
    });
    var userId = $localStorage.accountId;
    var user = $localStorage.name;
    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 250;
    $scope.chat.name = user;
    if ($stateParams.username) {
        $scope.data.message = "@" + $stateParams.username;
        document.getElementById("msg-input").focus();
    }
    var sendUpdateTyping = function () {
        if (!typing) {
            typing = true;
            Socket.emit('typing');
        }
        lastTypingTime = (new Date()).getTime();
        $timeout(function () {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                Socket.emit('stop typing');
                typing = false;
            }
        }, TYPING_TIMER_LENGTH);
    };

    $scope.updateTyping = function () {
        sendUpdateTyping();
       $ionicScrollDelegate.scrollBottom(true);

    };

    $scope.sendMessage = function () {
        Message(grouptitle);
       $ionicScrollDelegate.scrollBottom(true);
    };
    $scope.messageIsMine = function (user) {
        return $scope.chat.name === user;
    };
    $scope.getBubbleClass = function (user) {

        var classname = 'from-them';
        if ($scope.messageIsMine(user)) {
            classname = 'from-me';
        }
        return classname;
    };

    //$scope.sendMessage = function (msg) {
    //    Chat.sendMessage(msg);
    //    $scope.data.message = "";
    //};
    Message = function (groubtitle) {


        var groupChat = Firebase.all('groupChat');
        groupChat.$add({
           // gc_id=,
            groupname:groubtitle,
            time:Date(),
            dateCreated: Date(),
            userId: userId,
            username: user,
            message: $scope.chat.message
        }).then(function (ref)
               {
                  $scope.success = ref;
                  $localStorage.email = $localStorage.email;
                  $scope.chat.message = "";

              })
              .catch(function (exec) {
                  $scope.fauiler = exec;
                  //  //User closed the prompt, proceed immediately to login.
                  $localStorage.email = $localStorage.email

              });

    };
})


.controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, Firebase) {
    var options = { timeout: 10000, enableHighAccuracy: true };
    $scope.search = {};
    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            marker: latLng
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    }, function (error) {
        console.log("Could not get location");
    });
    $scope.getfollowShowOnMap = function () {
        var account = Firebase.get('Follow', 'mobile', $scope.search.value);
        account.$loaded().then(function () {
            if (account.length > 0) {


            }
            else {
                alert("Contact not available..");
                $scope.loadform.mobile = '';
            }
        });
    }
});

// mainController.js
// This is the controller that handles the retriving of password for Firebase accounts.
// The user is asked for their email address, where the password reset form will be emailed to.
'Use Strict';
angular.module('starter')
.controller('friendController', function ($scope, $state, Utils, Popup, $localStorage, Firebase) {
              $scope.Message = {};
           var followac = Firebase.get('Follow', 'userId', $localStorage.accountId);
            followac.$loaded().then(function () {
                if (followac.length > 0) {
                    $scope.followaccount = followac;
                }
                else {
                    $scope.Message.title = "you are not following anyone yet.";
                }
            });
            var relationshipmobile = Firebase.get('accounts', 'mobile', $localStorage.relationshipmobile);
            relationshipmobile.$loaded().then(function () {
                if (relationshipmobile.length > 0) {
                    $scope.Message = true;
                    $scope.relationshipmobile = relationshipmobile[0].mobile;
                    $scope.relationshipname = relationshipmobile[0].name;
                }
                else {
                    $scope.Message = false;

                }

            });


    })
.controller('RelationshipController', function ($scope, $state, Utils, Popup, $localStorage, Firebase,$rootScope) {
    $scope.Message = {};
    var followac = Firebase.get('accounts', 'userId', $localStorage.accountId);
    followac.$loaded().then(function () {
        if (followac.length > 0) {
            $scope.followno = followac[0];
            var nmber = followac[0].relationshipmobile;
            var relationshipmobile = Firebase.get('accounts', 'mobile', nmber);
            relationshipmobile.$loaded().then(function () {
                if (relationshipmobile.length > 0) {
                    $scope.relationship = relationshipmobile;
                }
                else {
                    $scope.Message.title = "This person is  not using this app.";
                }

            });
        }
        else {
            $scope.Message.title = "you are not following anyone yet.";
        }
    })
})

.controller('RelationshipDetailController', function ($scope, $stateParams, $cordovaContacts, Firebase, $localStorage,$firebaseObject, Utils, Popup,$rootScope,$ionicScrollDelegate) {
    $scope.chat = {};
    var grouptitle = $stateParams.chatId;
    $scope.chat.grouptitle = grouptitle;
    $scope.messages = [];
    $scope.username = ($localStorage.name);
    $scope.ChatID = ($localStorage.mobile + $scope.chat.grouptitle);
    var user1 = $localStorage.mobile;
    var user2 = $scope.chat.grouptitle;
    var roomName = 'chat_' + (user1 < user2 ? user1 + '_' + user2 : user2 + '_' + user1);
    var messageby = Firebase.get('Chats', 'ChatID', roomName);
    messageby.$loaded().then(function () {
        $scope.messages = messageby;
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
    };

    $scope.sendMessage = function () {
        Message(grouptitle);
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
    var user1 = $localStorage.mobile;
    var user2 = $scope.chat.grouptitle;
    var roomName = 'chat_' + (user1 < user2 ? user1 + '_' + user2 : user2 + '_' + user1);
    console.log(user1 + ', ' + user2 + ' => ' + roomName);
    Message=function(groubtitle){
        var groupChat = Firebase.all('Chats');
        groupChat.$add({
            Id: firebase.auth().currentUser.uid,
            ChatID: roomName,
            username: $localStorage.name,
            senderNumber: $localStorage.mobile,
           // receiverNumber:groubtitle,
            dateCreated: Date(),
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
.controller('followingProfileController', function ($scope, $state, Utils, Popup, $localStorage, Firebase) {
    $scope.followingprofile = function(id)
    {
        $state.go("followingProfile");
        };


})

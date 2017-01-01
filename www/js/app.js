'Use Strict';
var db = null;
angular.module('starter', ['ionic', 'ngStorage', 'ngCordovaOauth', 'firebase', 'ngCordova', 'mcwebb.twilio'])
    // AngularFire Modules:
  // all('table_name') -> get all data where table_name is the name of the table in Firebase Database. Returns $firebaseArray.
  // getById('table_name', 'id') -> get an object from table_name given the id. Returns $firebaseObject.
  // get('table_name', 'field', 'value') -> get an object from table_name where field is equal to value. Returns $firebaseObject.
  // Feel free to expand these functionality based your app's requirements.
    .run(function($ionicPlatform, $cordovaSQLite,$cordovaContacts,Firebase) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }



          
            if (window.cordova) {
                db = $cordovaSQLite.openDB({ name: "littlebird.db", location: 2, createFromLocation: 1 }); //device
            }else{
                db = window.openDatabase("littlebird.db", '1', 'littlebird', 1024 * 1024 * 100); // browser
            }
            var _onlineList=[]
           
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mobileContact (id integer primary key, name text, mobile text,exit integer)");
            $cordovaSQLite.execute(db, "SELECT * FROM mobileContact").then(function (res) {
                if (res.rows.length == 0) {
                    var query = "INSERT INTO mobileContact (name, mobile,exit) VALUES (?,?,?)";

                    $cordovaContacts.find({ filter: '' }).then(function (result) {
                        var contacts = result;
                        for (var i = 1; i < contacts.length; i++) {
                            if (contacts[i].phoneNumbers != null) {
                                var mobile = contacts[i].phoneNumbers[0].value;
                                $cordovaSQLite.execute(db, query, [contacts[i].displayName, contacts[i].phoneNumbers[0].value, 0]).then(function (res) {
                              //      console.log("INSERT mobileContactID -> " + res.insertId);
                                }, function (err) {
                                    console.error(err);
                                });
                                // return _list;
                            }

                        }

                    }, function (error) {
                        console.log("ERROR: " + error);
                    })
                }
                else {
                    console.log("ERROR: ");

                }
                //console.log("INSERT onlineContactmobile -> " + _onlineList[i].mobile);
            }, function (err) {
                console.error(err);
            });
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS onlineContact (id integer primary key, name text, mobile text,exit integer)");
            $cordovaSQLite.execute(db, "SELECT * FROM onlineContact").then(function (res) {
                if (res.rows.length == 0){
                     var query2 = "INSERT INTO onlineContact (name, mobile,exit) VALUES (?,?,?)";
             var accountgetbymobile = Firebase.all('accounts');
            accountgetbymobile.$loaded().then(function () {
                _onlineList = accountgetbymobile;
                for (var i = 1; i < _onlineList.length; i++) {
                    if (_onlineList[i].name != null && _onlineList[i].mobile) {
                        
                        $cordovaSQLite.execute(db, query2, [_onlineList[i].name, _onlineList[i].mobile, 0]).then(function (res) {
                            if (res.rows.length > 0) {
                                alert(res.rows.length);
                            }
                           // console.log("INSERT onlineContactmobile -> " + _onlineList[i].mobile);
                        }, function (err) {
                            console.error(err);
                        });
                        // return _list;
                    }

                }

            });
                }
            }, function (err) {
                console.error(err);
            });
        });
    })
  .factory('Firebase', function ($firebaseArray, $firebaseObject) {
      var ref = firebase.database().ref()

        return {
            all: function (section) {
                var data = $firebaseArray(ref.child(section));
                return data;
            },
            getById: function (section, id) {
                var data = $firebaseObject(ref.child(section).child(id));
                return data;
           },
            get: function (section, field, value) {
                var data = $firebaseArray(ref.child(section).orderByChild(field).equalTo(value));
                return data;
            },
            delById: function (section, id) {
                var data = $firebaseArray(ref.child(section).child(id));
                return data.$remove(id);
            },
      };
  })
  // For Facebook:
  // Make sure you have enabled Facebook as a Sign-In Method at your app's Firebase Console, insert your App ID and App Secret found from your Facebook app at https://developers.facebook.com.
  // Add http://localhost/callback as Valid OAuth redirect URIs at your Facebook Login Settings of your Facebook app.

  // For Google:
  // Make sure you have enabled Google as a Sign-In Method at your app's Firebase Console.
  // GoogleWebClientId can be found from your Firebase Console, under GoogleSignIn.
  // Add http://localhost/callback at your API Credentials for the app at https://console.developers.google.com/apis. Note that this is different from the Firebase OAuth Redirect Console.

  // For Twitter:
  // Make sure you have enabled Twitter as a Sign-In Method at your app's Firebase Console, insert your App ID and App Secret found from your Twitter app at https://apps.twitter.com.
  // Make sure you have added http://127.0.0.1:8080/callback as a Callback URL on your app at https://apps.twitter.com
  // Note that Twitter Login DOES NOT WORK when you have livereload (-ls) enabled on your ionic app.
  .constant('Social', {
      facebookAppId: "1025234637591184",
      googleWebClientId: "86899339460-kqrko1uuhu9a532l9f0jdhf9tgnp8b00.apps.googleusercontent.com",
      twitterKey: "aJWByCgPhUgYZJMojyFeH2h8F",
      twitterSecret: "XxqKHi6Bq3MHWESBLm0an5ndLxPYQ2uzLtIDy6f9vgKKc9kemI"
  })
  //Constants for the Popup messages
  //For the icons, refer to http://ionicons.com for all icons.
  //Here you can edit the success and error messages on the popups.
  .constant('Popup', {
    delay: 3000, //How long the popup message should show before disappearing (in milliseconds -> 3000 = 3 seconds).
    successIcon: "ion-happy-outline",
    errorIcon: "ion-sad-outline",
    accountCreateSuccess: "Congratulations! Your account has been created. Logging you in.",
    accountfollowSuccess: "Congratulations! Your account has been Followed. ",
    mobileAlreadyExists: "Sorry, but an account with that mobile number already exists. Please register with a different mobile and try again.",
    emailAlreadyExists: "Sorry, but an account with that mobile number already exists. Please register with a different email and try again.",
    accountAlreadyExists: "Sorry, but an account with the same credential already exists. Please check your account and try again.",
    emailNotFound: "Sorry, but we couldn\'t find an account with that mobile number. Please check your email and try again.",
    mobileNotFound: "Sorry, but we couldn\'t find an account with that mobile number. Please check your email and try again.",
    userNotFound: "Sorry, but we couldn\'t find a user with that account. Please check your account and try again.",
    invalidEmail: "Sorry, but you entered an invalid mobile number. Please check your mobile number and try again.",
    notAllowed: "Sorry, but registration is currently disabled. Please contact support and try again.",
    serviceDisabled: "Sorry, but logging in with this service is current disabled. Please contact support and try again.",
    wrongPassword: "Sorry, but the password you entered is incorrect. Please check your password and try again.",
    accountDisabled: "Sorry, but your account has been disabled. Please contact support and try again.",
    weakPassword: "Sorry, but you entered a weak password. Please enter a stronger password and try again.",
    errorRegister: "Sorry, but we encountered an error registering your account. Please try again later.",
    passwordReset: "A password reset link has been sent to: ",
    errorPasswordReset: "Sorry, but we encountered an error sending your password reset email. Please try again later.",
    errorLogout: "Sorry, but we encountered an error logging you out. Please try again later.",
    sessionExpired: "Sorry, but the login session has expired. Please try logging in again.",
    errorLogin: "Sorry, but we encountered an error logging you in. Please try again later.",
    welcomeBack: "Welcome back! It seems like you should still be logged in. Logging you in now.",
    manyRequests: "Sorry, but we\'re still proccessing your previous login. Please try again later."
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
      $stateProvider
             .state('main', {
                 url: '/main',
                 templateUrl: 'views/main/main.html',
                 controller: 'mainController'

             })
              .state('esCtrl', {
                  url: '/esCtrl',
              templateUrl: 'views/contacts/searchContactDetail.html',
                  controller: 'esCtrl'
               
              })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login/login.html',
                controller: 'loginController'
            })
          .state('register', {
              url: '/register',
              templateUrl: 'views/register/register.html',
              controller: 'registerController'
          })
          .state('relationship', {
              url: '/relationship',
              templateUrl: 'views/register/relationship.html',
              controller: 'relationController'
          })
            .state('genderdetail', {
                url: '/genderdetail',
                templateUrl: 'views/register/genterdetail.html',
                controller: 'genderdetailController'
            })
            .state('verify', {
                url: '/verify',
                templateUrl: 'views/register/verify.html',
                controller: 'varifyController'
            })
            //.state('friend', {
            //    url: '/friend',
            //    templateUrl: 'views/friends/friend.html',
            //   // controller: 'varifyController'
            //})
            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'views/register/change-profile.html',
                        controller: 'ProfiledetailController'
                    }
                }
            })
               .state('app.home', {
                   url: '/home',
                   views: {
                       'menuContent': {
                             templateUrl: 'views/home/home.html',
                              controller: 'homeController'
                       }
                   }
               })
          .state('app.import', {
              url: '/import',
              views: {
                  'menuContent': {
                      templateUrl: 'views/contacts/importcontact.html',
                      controller:'ImportCtrl'
                  }
              }
          })
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: 'views/menu/menu.html',
              controller: 'MenuCtrl'
//              onEnter:function($state, Auth){
//                  if (!Auth.IsLoggedIn()) {
//                      $state.go('main')
//                  }
//}

          })
          .state('forgotPassword', {
              url: '/forgotPassword',
              templateUrl: 'views/forgotPassword/forgotPassword.html',
              controller: 'forgotPasswordController'
          })
            .state('completeAccount', {
            url: '/completeAccount',
            templateUrl: 'views/completeAccount/completeAccount.html',
            controller: 'completeAccountController'
            })
      
         .state('app.tabs', {
             url: '/tabs',
             views: {
                 'menuContent': {
                     templateUrl: 'views/tabs/tabs.html'
                 }
             }
         })
          .state('app.menu-only', {
              url: '/menu-only',
              views: {
                  'menuContent': {
                      templateUrl: 'views/menu-only.html'
                  }
              }
          })
           .state('app.search', {
               url: '/search',
               views: {
                   'menuContent': {
                       templateUrl: 'views/menu/search.html',
                       controller: 'contactController'
                   }
               }
           })
          .state('app.chat-detail', {
              url: '/chats/:chatId',
              views: {
                  'menuContent': {
                      templateUrl: 'views/chat/groupchat.html',
                      controller: 'ChatDetailCtrl',
                  }
              }
          })
        .state('app.search-contact-detail', {
            url: '/search-contact-detail/:chatId',
            views: {
                'menuContent': {
                    templateUrl: 'views/contacts/searchContactDetail.html',
                    controller: 'searchcontactDetailCtrl',
                }
            }
        })
           .state('app.friend', {
               url: '/friend',
               views: {
                   'menuContent': {
                       templateUrl: 'views/friends/friend.html',
                       controller: 'friendController'
                   }
               }

           })
        .state('app.RelationshipChat', {
            url: '/RelationshipChat',
            views: {
                'menuContent': {
                    templateUrl: 'views/chat/RelationshipChat.html',
                    controller: 'RelationshipController',
                }
            }
        })
           .state('app.RelationshipChat-detail', {
               url: '/RelationshipChat-detail/:chatId',
            views: {
                'menuContent': {
                    templateUrl: 'views/chat/RelationshipChat-De.html',
                    controller: 'RelationshipDetailController',
                }
            }
        })
                     .state('app.followingProfile', {
               url: '/followingProfile',
               views: {
                   'menuContent': {
                       templateUrl: 'views/chat/FollowingProfile.html',
                       controller: 'followingProfileController'// freind.js

                   }
               }
          })
            .state('app.FollowOnMap', {
                url: '/FollowOnMap/:chatId',
                views: {
                    'menuContent': {
                        templateUrl: 'views/chat/followerOnMap.html',
                        controller: 'FollowOnMapCtrl'

                    }
                }
            })


           .state('app.map', {
               url: '/map',
               views: {
                   'menuContent': {
                       templateUrl: 'views/mylocation.html',
                       controller: 'MyLocationCtrl'

                   }
               }
          })

      if (localStorage["ngStorage-Auth"]=="true")
      {
      
            $urlRouterProvider.otherwise("/login");
          
      } else {
          $urlRouterProvider.otherwise("/main");
      }
      $ionicConfigProvider.tabs.position('bottom');
  });

// login.js
// This is the controller that handles the logging in of the user either through Firebase or Social Logins.
// If the user is logged in through Social accounts, the user is then transfered to screen asking for their email address.
// The user is asked for their email address, because in some cases Social Login is not able to retrieve an email address or is not required by the service (such as Twitter).
// Afterwhich, an account will be saved on the Firebase Database which is independent from the Firebase Auth and Social Auth accounts.
// If the user is previously logged in and the app is closed, the user is automatically logged back in whenever the app is reopened.
'Use Strict';
angular.module('starter')
    .controller('loginController', function ($scope, $state, $localStorage, Social, Utils, $cordovaOauth, Popup, Firebase) {
    if ($localStorage.Auth == true) {
      $state.go('app.profile');
    } else {
    $scope.$on('$ionicView.enter', function () {
        //Clear the Login Form.
        $scope.user = {
            email: $localStorage.email,
            password: $localStorage.password,
            mobile: $localStorage.mobile
        };
      
            //Check if user is already authenticated on Firebase and authenticate using the saved credentials.
            if (!firebase.auth().currentUser) {
                if ($localStorage.loginProvider) {
                    Utils.message(Popup.successIcon, Popup.welcomeBack);
                    //The user is previously logged in, and there is a saved login credential.
                    if ($localStorage.loginProvider == "Firebase") {
                        //Log the user in using Firebase.
                     
                        loginWithFirebase($localStorage.email, $localStorage.password);
                        
                  
                    } else {
                        //Log the user in using Social Login.
                        var provider = $localStorage.loginProvider;
                        var credential;
                        switch (provider) {
                            case 'Facebook':
                                credential = firebase.auth.FacebookAuthProvider.credential($localStorage.access_token);
                                break;
                            case 'Google':
                                credential = firebase.auth.GoogleAuthProvider.credential($localStorage.id_token, $localStorage.access_token);
                                break;
                            case 'Twitter':
                                credential = firebase.auth.TwitterAuthProvider.credential($localStorage.oauth_token, $localStorage.oauth_token_secret);
                                break;
                        }
                        loginWithCredential(credential, $localStorage.loginProvider);
                    }
                }
            }
        })
   }

  $scope.login = function(user) {
    if (angular.isDefined(user)) {
        Utils.show();
        user.email = user.mobile + "@gmail.com";
      loginWithFirebase(user.email, user.password);
    }
  };

    //Function to login to Firebase using email and password.
  loginWithFirebase = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(response) {
        //Retrieve the account from the Firebase Database
        var userId = firebase.auth().currentUser.uid;
        var account = Firebase.get('accounts', 'userId', userId);
        account.$loaded().then(function() {
          if (account.length > 0) {
              Utils.hide();
            $localStorage.Auth=true;
            $localStorage.loginProvider = "Firebase";
            $localStorage.email = email;
            $localStorage.password = password;
              //Get the first account because Firebase.get() returns a list.
            $localStorage.name=account[0].name;
            $localStorage.gender = account[0].gender;
            $localStorage.relationshipmobile=account[0].relationshipmobile;
            $localStorage.relation=account[0].relation;   
            $localStorage.mobile = account[0].mobile;
            $localStorage.accountnodeId = account[0].$id;
            $localStorage.accountId = account[0].userId;
            $state.go('app.profile');
          }
        });
      })
      .catch(function(error) {
        var errorCode = error.code;
        showFirebaseLoginError(errorCode);
      });
  }

  //Function to login to Firebase using a credential and provider.
  loginWithCredential = function(credential, provider) {
    firebase.auth().signInWithCredential(credential)
      .then(function(response) {
        //Check if account already exists on the database.
        checkAndLoginAccount(response, provider, credential);
        //Save social login credentials.
        $localStorage.loginProvider = provider;
        $localStorage.credential = credential;
      })
      .catch(function(error) {
        //Show error message.
        var errorCode = error.code;
        showSocialLoginError(errorCode);
      });
  };

  //Check if the Social Login used already has an account on the Firebase Database. If not, the user is asked to complete a form.
  checkAndLoginAccount = function(response, provider, credential) {
    var userId = firebase.auth().currentUser.uid;
    var account = Firebase.get('accounts', 'userId', userId);
    account.$loaded().then(function() {
      if (account.length > 0) {
        // Account already exists, proceed to home.
        Utils.hide();
        //Get the first account because Firebase.get() returns a list.
       // $localStorage.accountId = account[0].$id;
        $state.go('home');
      } else {
        //No account yet, proceed to completeAccount.
        Utils.hide();
        $localStorage.provider = provider;
        $state.go('app.tabs.home');
      }
    });
  };

  //Shows the error popup message when using the Login with Firebase.
  showFirebaseLoginError = function(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        Utils.message(Popup.errorIcon, Popup.emailNotFound);
        break;
      case 'auth/wrong-password':
        Utils.message(Popup.errorIcon, Popup.wrongPassword);
        break;
      case 'auth/user-disabled':
        Utils.message(Popup.errorIcon, Popup.accountDisabled);
        break;
      case 'auth/too-many-requests':
        Utils.message(Popup.errorIcon, Popup.manyRequests);
        break;
      default:
        Utils.message(Popup.errorIcon, Popup.errorLogin);
        break;
    }
  };

  //Shows the error popup message when using the Social Login with Firebase.
  showSocialLoginError = function(errorCode) {
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        Utils.message(Popup.errorIcon, Popup.accountAlreadyExists);
        break;
      case 'auth/invalid-credential':
        Utils.message(Popup.errorIcon, Popup.sessionExpired);
        break;
      case 'auth/operation-not-allowed':
        Utils.message(Popup.errorIcon, Popup.serviceDisabled);
        break;
      case 'auth/user-disabled':
        Utils.message(Popup.errorIcon, Popup.accountDisabled);
        break;
      case 'auth/user-not-found':
        Utils.message(Popup.errorIcon, Popup.userNotFound);
        break;
      case 'auth/wrong-password':
        Utils.message(Popup.errorIcon, Popup.wrongPassword);
        break;
      default:
        Utils.message(Popup.errorIcon, Popup.errorLogin);
        break;
    }
  };

});

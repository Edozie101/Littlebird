// completeAccount.js
// This is the controller that handles the final steps when creating an account at Firebase when Social Login is used.
// The user is asked for their email address, because in some cases Social Login is not able to retrieve an email address or is not required by the service (such as Twitter).
// If the email is provided by the provider it is automatically filled in for them when the form loads.
'Use Strict';
angular.module('starter'  ).controller('completeAccountController', function($scope, $state, $localStorage, Utils, Popup, Firebase) {
  $scope.$on('$ionicView.enter', function() {
    //Checks if the Social Login has a photo, and show it on the Registration Form.
    if (firebase.auth().currentUser.photoURL) {
      $scope.profilePic = firebase.auth().currentUser.photoURL;
    } else {
      $scope.profilePic = "https://i0.wp.com/market.ionic.io/img/user-default.png";
    }
    //Checks if the Social Login has a displayName, and show it on the Registration Form.
    if (firebase.auth().currentUser.displayName) {
      $scope.displayName = firebase.auth().currentUser.displayName;
    } else {
      $scope.displayName = "";
    }
    //Checks if the Social Login has an email, and set it on the Registration Form.
    var email = '';
    if (firebase.auth().currentUser.email) {
      email = firebase.auth().currentUser.email;
    }
    $scope.user = {
      email: email
    };
  })

  $scope.completeAccount = function(user) {
    //Check if form is filled up.
    if (angular.isDefined(user)) {
      Utils.show();
      //Check if an account with the same email already exists.
      var account = Firebase.get('accounts', 'email', user.email);
      account.$loaded().then(function() {
        //Account with same email already exists.
        if (account.length > 0) {
          Utils.message(Popup.errorIcon, Popup.emailAlreadyExists);
        } else {
          //Account doesn't exist yet, proceed to insert account data to database.
          //Get Firebase reference to add accounts database.
          var accounts = Firebase.all('accounts');
          accounts.$add({
            email: user.email,
            userId: firebase.auth().currentUser.uid,
            dateCreated: Date(),
            provider: $localStorage.provider
          }).then(function(ref) {
            //Account created successfully, logging user in automatically after a short delay.
            Utils.message(Popup.successIcon, Popup.accountCreateSuccess)
              .then(function() {
                $localStorage.email = user.email;
                $localStorage.password = user.password;
                setAccountAndLogin(ref.key);
              })
              .catch(function() {
                //User closed the prompt, proceed immediately to login.
                $localStorage.email = user.email;
                $localStorage.password = user.password;
                setAccountAndLogin(ref.key);
              });
          });
        }
      });
    }
  };

  //Function to set the accountId from the Firebase database and store it on $localStorage.accountId.
  setAccountAndLogin = function(key) {
    //$localStorage.accountId = key;
    $localStorage.loginProvider = "Firebase";
    $state.go('home');
  };

});

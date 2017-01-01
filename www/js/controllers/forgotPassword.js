// forgotPassword.js
// This is the controller that handles the retriving of password for Firebase accounts.
// The user is asked for their email address, where the password reset form will be emailed to.
'Use Strict';
angular.module('starter'  ).controller('forgotPasswordController', function($scope, $state, $http,Utils,$localStorage, Firebase,Popup) {
  $scope.$on('$ionicView.enter', function() {
    //Clears the Forgot Password Form.
    $scope.user = {
      email: ''
    };
  })

  $scope.resetPassword = function (user) {
      var account = Firebase.get('accounts', 'mobile', $scope.user.email);
      account.$loaded().then(function () {
          //Account with same email already exists.
          if (account.length > 0) {
              var password = account[0].password;
              var mobile = account[0].mobile;
              $http({

                  url: "http://lb.nopcarts.com/HOME/ReSendPassword?cellNo=" + mobile + "&pass=" + password,
                  method: "GET"
              }).then(function (resp) {
                  if (resp.data === "404") {
                      // $state.go('genderdetail');
                      alert("Permission to send an SMS has not been enabled for the region indicated by the 'To' number:" + user.mobile);

                  }
                  else {
                      $state.go('login');
                  }

              });

        
          }
          else {
              Utils.message(Popup.errorIcon, Popup.mobileNotFound);
          }
      });

    
  };
});

angular.module('starter'  )
  .controller('MenuCtrl', MenuCtrl);

function MenuCtrl($ionicPopover, $scope, $state, Firebase, $localStorage) {
    $ionicPopover.fromTemplateUrl('views/menu/more-options-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.moreOptionsPopover = popover;
    });
    $scope.changeState = function (toState) {
        $scope.moreOptionsPopover.hide();
        $state.go(toState);
    };
    $scope.loginData = {};
    var account = Firebase.getById('accounts', $localStorage.accountId);
    account.$loaded().then(function() {
        //Set the variables to be shown on home.html
        $scope.email = account.email;
        $scope.provider = account.provider;
        $scope.loginData.username = $localStorage.name;
    });
    $scope.openMoreOptionsPopover = function ($event) {
        $scope.moreOptionsPopover.show($event);
    };
    $scope.logout = function () {
        if (firebase.auth()) {
            firebase.auth().signOut().then(function () {
                //Clear the saved credentials.
                $localStorage.$reset();
                //Proceed to login screen.
                $state.go('login');
            }, function (error) {
                //Show error message.
                Utils.message(Popup.errorIcon, Popup.errorLogout);
            });
        }
    };
}


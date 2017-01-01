angular.module('starter'  )
  .controller('SettingsCtrl', SettingsCtrl);

function SettingsCtrl($scope, $state) {

  $scope.settings = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    mobile: '9090909009'
  };

  $scope.changeState = function (state) {
    $state.go(state);
  };

}

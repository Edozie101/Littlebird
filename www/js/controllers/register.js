// register.js
// This is the controller that handles the registration of the user through Firebase.
// When the user is done registering, the user is automatically logged in.
'Use Strict';
angular.module('starter')
    .controller('registerController', function ($scope, $state, $localStorage, Utils, Popup, Firebase, $http, Twilio) {
        $scope.$on('$ionicView.enter', function () {
            //Clear the Registration Form.
            $scope.user = {
                email: '',
                mobile: '',
                password: '',
                relationshipmobile: '',
                gender: '',
                relation: '',
            };
        })
        var num = Math.floor(Math.random() * 90000) + 10000;
        var name = (0 | Math.random() * 9e6).toString(36);
        $scope.register = function (user) {
            //Check if form is filled up.
            if (angular.isDefined(user)) {
                //  Utils.show();
                // What up niggaz
                //Check if an account with the same email (number) already exists.
                user.mobile = user.email;
                var account = Firebase.get('accounts', 'mobile', user.mobile);
                account.$loaded().then(function () {
                    //Account with same email already exists.
                    if (account.length > 0) {
                        Utils.message(Popup.errorIcon, Popup.mobileAlreadyExists);
                    } else {
                        $http({

                            url: "http://lb.nopcarts.com/HOME/SendMessages?cellNo=" + user.mobile + "&tokenNo=" + num,
                            method: "GET"
                        }).then(function (resp) {
                            if (resp.data === "404") {
                               // $state.go('genderdetail');
                                alert("Permission to send an SMS has not been enabled for the region indicated by the 'To' number:" + user.mobile);

                            }
                            j

                        });
                        //$state.go('genderdetail');
                        //// $state.go('relationship');
                        //$localStorage.email = user.email;
                        //$localStorage.password = user.password;
                        //$localStorage.mobile = user.mobile;
                        //$localStorage.name = name;
                        //$localStorage.authnum = num;
                    }
                });
            }
        };

        //Function to set the accountId from the Firebase database and store it on $localStorage.accountId.
        setAccountAndLogin = function (key) {
            $localStorage.accountId = key;
            $localStorage.loginProvider = "Firebase";
            $state.go('app.profile');
        };
    })
.controller('varifyController', function ($scope, $state, $localStorage, Popup, Firebase, Utils) {
    $scope.user = {
        email: $localStorage.email,
        mobile: $localStorage.mobile,
        password: $localStorage.password,
        relationshipmobile: $localStorage.relationshipmobile,
        varify: $localStorage.authnum,
        gender: '',
        relation: '',
    };
    $scope.varifynumber = function () {
        varifynumberdated($localStorage.accountId);
    };
    $scope.varifynum = {};
    varifynumberdated = function (accountId) {
        if ($localStorage.authnum = $scope.varifynum.number) {
            alert("Verified PIN Number");
            $state.go('genderdetail');


        }
        else {
            alert("Wrong PIN Number");

        }
    }

})
    .controller('relationController', function ($scope, $state, $localStorage, Popup, Firebase, Utils) {
        $scope.user = {
            email: $localStorage.email,
            mobile: $localStorage.mobile,
            password: $localStorage.password,
            relationshipmobile: '0',
            gender: '',
            relation: '',
        };
        $scope.relationship = function () {
            relationshipupdated($localStorage.accountId);
        };
        $scope.relationshipData = {};
        relationshipupdated = function (accountId) {
            if ($scope.relationshipData.relationshipmobile == undefined) {

                $localStorage.relationshipmobile = 0;

                genderdetaildated($localStorage.accountId);



            }
            else {


                $localStorage.relationshipmobile = $scope.relationshipData.relationshipmobile;
                genderdetaildated($localStorage.accountId);
            }


        }

    })
.controller('genderdetailController', function ($scope, $state, $localStorage, Popup, Firebase, Utils, $cordovaGeolocation) {
    //$scope.genderdetailData = {};
    $scope.genderdetailData = {
        email: $localStorage.email,
        mobile: $localStorage.mobile,
        password: $localStorage.password,
        name: $localStorage.name,
        relationshipmobile: $localStorage.relationshipmobile,
        gender: 'not set',
        Relation: 'not set',

    };
    var lati = '';
    var logi = '';
    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
          lati = position.coords.latitude
          logi = position.coords.longitude
      }, function (err) {
          // error
      });
    var watchOptions = {
        timeout: 3000,
        enableHighAccuracy: false // may cause errors if true
    };
    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function (err) {
          // error
      },
      function (position) {
          var lat = position.coords.latitude
          var long = position.coords.longitude
      });


    watch.clearWatch();
    // OR



    $scope.genderdetail = function () {
        if ($scope.genderdetailData.Relation == "No") {
            $localStorage.relationshipmobile = 0;
            genderdetaildated($localStorage.accountId);
        }
        else {
            $state.go('relationship');
        }
    };
    genderdetaildated = function (accountId) {
        $scope.user = {
            email: $localStorage.email,
            mobile: $localStorage.mobile,
            password: $localStorage.password,
            name: $localStorage.name,
            relationshipmobile: $localStorage.relationshipmobile,
            gender: $scope.genderdetailData.gender,
            relation: $scope.genderdetailData.Relation

        };

        var account = Firebase.get('accounts', 'mobile', $localStorage.mobile);
        account.$loaded().then(function () {
            //Account with same email already exists.
            if (account.length > 0) {
                Utils.message(Popup.errorIcon, Popup.mobileAlreadyExists);
            }
            else {

                $scope.lat = lati;
                $scope.long = logi;
                var email = $localStorage.mobile + "@gmail.com";
                //Account doesn't exist yet, proceed to insert account data to database.
                //

                firebase.auth().createUserWithEmailAndPassword(email, $localStorage.password)
                    .then(function () {
                        //Get Firebase reference to add accounts database.

                        var accounts = Firebase.all('accounts');
                        accounts.$add({
                            email: $localStorage.email + "@gmail.com",
                            mobile: $localStorage.mobile,
                            userId: firebase.auth().currentUser.uid,
                            dateCreated: Date(),
                            name: "LB" + $localStorage.name,
                            relationshipmobile: $localStorage.relationshipmobile,
                            gender: $scope.genderdetailData.gender,
                            relation: $scope.genderdetailData.Relation,
                            lat: lati,
                            long: logi,
                            password:$localStorage.password,
                            //long :position.coords.longitude,

                            provider: 'Firebase'
                        }).then(function (ref) {
                            //Account created successfully, logging user in automatically after a short delay.
                            Utils.message(Popup.successIcon, Popup.accountCreateSuccess)
                              .then(function () {
                                  $localStorage.email = $localStorage.email;
                                  $localStorage.password = $localStorage.password;
                                  $localStorage.mobile = $localStorage.mobile;
                                  $localStorage.name = "LB" + $localStorage.name;
                                  $localStorage.relationshipmobile = $localStorage.relationshipmobile;
                                  $localStorage.gender = $scope.genderdetailData.gender;
                                  $localStorage.relation = $scope.genderdetailData.Relation;

                                  setAccountAndLogin(ref.key);
                              })
                              .catch(function () {
                                  //User closed the prompt, proceed immediately to login.
                                  $localStorage.email = $localStorage.email,
                                $localStorage.password = $localStorage.password,
                                  $localStorage.mobile = $localStorage.mobile,
                                  $localStorage.name = $localStorage.name,
                                   $localStorage.name = "LB" + $localStorage.name,
                                  $localStorage.relationshipmobile = $localStorage.relationshipmobile,
                                    $localStorage.gender = $scope.genderdetailData.gender;
                                  $localStorage.relation = $scope.genderdetailData.Relation;
                                  $localStorage.accountId = $localStorage.accountId;
                                  setAccountAndLogin(ref.key);
                              });
                        });
                    })
                    .catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        //Show error message.
                        console.log(errorCode);
                        switch (errorCode) {
                            case 'auth/email-already-in-use':
                                Utils.message(Popup.errorIcon, Popup.emailAlreadyExists);
                                break;
                            case 'auth/invalid-email':
                                Utils.message(Popup.errorIcon, Popup.invalidEmail);
                                break;
                            case 'auth/operation-not-allowed':
                                Utils.message(Popup.errorIcon, Popup.notAllowed);
                                break;
                            case 'auth/weak-password':
                                Utils.message(Popup.errorIcon, Popup.weakPassword);
                                break;
                            default:
                                Utils.message(Popup.errorIcon, Popup.errorRegister);
                                break;
                        }
                    });


            };
        });
    }

})
.controller('ProfiledetailController', function ($scope, $state, $ionicModal, $localStorage, Popup, $firebaseObject, Utils) {
    $ionicModal.fromTemplateUrl('views/register/EidtProfile.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.closeEdit = function () {
        $scope.modal.hide();
    };
    $scope.editprofile = function () {
        $scope.modal.show();
    };

    $scope.user = {
        email: $localStorage.email,
        name: $localStorage.name,
        mobile: $localStorage.mobile,
        password: $localStorage.password,
        relationshipmobile: $localStorage.relationshipmobile,
        gender: $localStorage.gender,
        relation: $localStorage.relation,

    };


    $scope.UpdateProfile = function () {

        var profileRef = new Firebase("https://lilbird01-c7797.firebaseio.com/accounts/" + $localStorage.accountnodeId);
        profileRef.update(
            { relationshipmobile: $scope.user.relationshipmobile, gender: $scope.user.gender, relation: $scope.user.relation, });
        $scope.closeEdit();
        $localStorage.relationshipmobile = $scope.user.relationshipmobile;
    }
    ;
})
.controller('contactController', function ($scope, Utils, Popup, $cordovaContacts) {
    $scope.getContacts = function () {
        $scope.phoneContacts = [];
        function onSuccess(contacts) {
            for (var i = 0; i < contacts.length; i++) {
                var contact = contacts[i];
                $scope.phoneContacts.push(contact);
            }
        };
        function onError(contactError) {
            alert(contactError);
        };
        var options = {};
        options.multiple = true;
        $cordovaContacts.find(options).then(onSuccess, onError);
    };


    //    $cordovaContacts.find(opts).then(function (contacts) {
    //        console.log(contacts);
    //    });
    //     $scope.getContactList = function () {
    //         $cordovaContacts.find({ filter: '' }).then(function (result) {
    //             $scope.contacts = result;
    //         }, function (error) {
    //             console.log("ERROR: " + error);
    //         });
    //     }


    //     $scope.createContact = function () {
    //         $cordovaContacts.save({ "displayName": "Steve Jobs" }).then(function (result) {
    //             console.log(JSON.stringify(result));
    //         }, function (error) {
    //             console.log(error);
    //         });
    //     }
    //     $scope.removeContact = function () {
    //         $cordovaContacts.remove({ "displayName": "Steve Jobs" }).then(function (result) {
    //             console.log(JSON.stringify(result));
    //         }, function (error) {
    //             console.log(error);
    //         });
    //     }
});

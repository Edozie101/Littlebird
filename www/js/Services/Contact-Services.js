'Use Strict';
angular.module('starter').service('contactService', function ($cordovaContacts,Firebase) {
    var _list = [];
    var UserList = [];
    
   
    var GetAllContact = function () {
        if (_list.length > 0) {
            for (i = 1; i < _list.length; i++) {
                var accountgetbymobile = Firebase.get('accounts', 'mobile', _list[i].phoneNumbers);
                accountgetbymobile.$loaded().then(function () {
                    UserList.push({
                        displayName: _list[i].displayName,
                        phoneNumbers: _list[i].phoneNumbers,
                    })
                })

            }
        }
        else {
            $cordovaContacts.find({ filter: '' }).then(function (result) {
                var contacts = result;
                for (var i = 1; i < contacts.length; i++) {
                    if (contacts[i].phoneNumbers != null) {
                        var mobile = contacts[i].phoneNumbers[0].value;
                        _list.push({
                            displayName: contacts[i].displayName,
                            phoneNumbers: mobile,
                        });
                        // return _list;
                    }
                    else {
                        //console.log("E");
                    }
                }
                for (i = 1; i < _list.length; i++) {
                    var accountgetbymobile = Firebase.get('accounts', 'mobile', _list[i].phoneNumbers);
                    accountgetbymobile.$loaded().then(function () {
                        UserList.push({
                            displayName: accountgetbymobile[0].name,
                            phoneNumbers: accountgetbymobile[0].mobile,
                        })
                    })

                }
            }, function (error) {
                console.log("ERROR: " + error);
            });
            
        }
        


     
        
        return UserList;
    }
        var productList = [];

        var addProduct = function (newObj) {
            productList.push(newObj);
        };

        var getProducts = function () {
            return productList;
        };

        return {
            GetAllContact: GetAllContact
        };

   
});

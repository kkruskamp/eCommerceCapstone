angular.module('starter.controllers', [])

// =========================================APP START======================================================

.controller('AppCtrl', function($scope, WC, $localStorage, $rootScope, $ionicModal){

    $localStorage.cart = [];
    
    if ($localStorage.cart){
      $rootScope.cartNumber = $localStorage.cart.length;
    }

    else {
      $rootScope.cartNumber = 0;
    }
    
    var Woocommerce = WC.WC();
    
    Woocommerce.get('products/categories', function(err, data, res){
      //console.log(res);

      $scope.categories = (JSON.parse(res));
      $scope.mainCategories = [];
      $scope.categories.forEach(function(element, index) {
        
        if (element.parent == 0){
          $scope.mainCategories.push(element);
        }
      })
    })

// =========================================SHOW CART======================================================

    $scope.showCartModal = function() {
      $scope.cartItems = $localStorage.cart;

      if (!$scope.cartItems || $scope.cartItems.length == 0) {
        return;
      }
      
      $scope.costSum = 0;
      
      $scope.cartItems.forEach(function(element, index) {
        $scope.costSum += Number(element.price);
      });
      
      $scope.costSum = $scope.costSum.toFixed(2);
      $scope.modal = {};
      
      $ionicModal.fromTemplateUrl('templates/cartModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

})

// =========================================HOME-USELESS======================================================

.controller('HomeCtrl', function(){

})

// =========================================BROWSE START======================================================

.controller('BrowseCtrl', function($scope, WC, $localStorage, $rootScope){

$scope.offset = 0;

  $scope.getProducts = function(){
    var Woocommerce = WC.WC();
    Woocommerce.get('products', function(err, data,res){
        
        JSON.parse(res).forEach(function(element, index){
          element.count = 0;
        })

        $scope.products = JSON.parse(res);
        $scope.offset = $scope.offset + 10;
        $scope.canLoadMore = true;
    })
  }

  $scope.getProducts();

// =========================================REFRESH BROWSE======================================================

  $scope.doRefresh = function(){
    $scope.getProducts();
    $scope.$broadcast('scroll.refreshComplete')
  }

// =========================================SCROLL BROWSE=======================================================

  $scope.loadMore = function(){
    var Woocommerce = WC.WC();
    Woocommerce.get('products?filter[offset]=' + $scope.offset, function(err, data, res){

      JSON.parse(res).forEach(function(element, index){
        element.count = 0;
        $scope.products.push(element);
      })

      $scope.$broadcast('scroll.infiniteScrollComplete');

      if (JSON.parse(res).length < 10){
        $scope.canLoadMore = false;
        return;
      }

      else {
        $scope.offset = $scope.offset + 10;
      }

    })

  }
  var countIncrease = false;

// =========================================BROWSE ADD TO CART======================================================

  $scope.addToCart = function(product){
    $localStorage.cart.forEach(function(item, index){
      if(item.id == product.id && !countIncrease){
        item.count = item.count + 1;
        countIncrease = true;
      }
    });

    if (!countIncrease) {
      product.count = 1;
      $localStorage.cart.push(product);
    }

    $rootScope.cartNumber = $localStorage.cart.length;

  }
})

// =========================================CATEGORY START======================================================

.controller('CategoriesCtrl', function($scope, WC) {
  var Woocommerce = WC.WC();

  Woocommerce.get('products/categories', function(err, data, res) {
    $scope.categories = (JSON.parse(res))
  })
})

// =========================================PRODUCT VIEW START======================================================

    .controller('ProductCtrl', function($scope, WC, $stateParams, $rootScope, $localStorage) {
      var Woocommerce = WC.WC();
      Woocommerce.get('products/' + $stateParams.productID, function(err, data, res) {

        $scope.product = JSON.parse(res);
        $scope.images = JSON.parse(res);

        Woocommerce.get('products/' + $stateParams.productID + '/reviews', function(error, dat, response) {
          $scope.reviews = JSON.parse(response);
        })
      })

// =========================================PRODUCT ADD CART======================================================

      $scope.addToCart = function(product){
      var countIncrease = false;
      $localStorage.cart.forEach(function(item, index){
        if ((item.id == product.id) && !countIncrease){
          item.count = item.count + 1;
          countIncrease = true;
      }
    });

    if (!countIncrease) {
      product.count = 1;
      $localStorage.cart.push(product);
    }

    $rootScope.cartNumber = $localStorage.cart.length;

  }
})


.controller('SignupCtrl', function($scope, $ionicPopup, $state, WC){
  
  $scope.newUser = {};
  $scope.newUser.isValid = true;
  
  $scope.checkUserEmail = function(email){
    
    var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(!regex.test(email)){
      $scope.newUser.isValid = false;
      
      $ionicPopup.show({
        template: "<center> Invalid Email! </center>",
        buttons: [{
          text: 'OK'
        }]
      });
      
      return;
      
    }
  
    var Woocommerce = WC.WC();
    
    Woocommerce.get('customers/email/' + email, function(err, data, res){

      if(JSON.parse(res).customer){
        $scope.newUser.isValid = false;
        
        $ionicPopup.show({
          template: "<center> Email is already registered. </center>",
          buttons: [{
            text: "Login",
            onTap: function(e) { 
              $state.go("app.login"); }
          },{
            text: "OK"
          }]
        }) 
      }
      
      else {
        $scope.newUser.isValid = true;
      }
    })
  }
  
  $scope.switchBillingToShipping = function(){
    $scope.newUser.shipping = $scope.newUser.billing;
  }
  
  $scope.signUp = function(newUser){
    
    var customerData = {};
    
    customerData = {
        "email": newUser.email,
        "first_name": newUser.first_name,
        "last_name": newUser.last_name,
        "username": newUser.email.split("@")[0],
        "password": newUser.password,
        "billing": {
          "first_name": newUser.first_name,
          "last_name": newUser.last_name,
          "address_1": newUser.billing.address_1,
          "address_2": newUser.billing.address_2,
          "city": newUser.billing.city,
          "state": newUser.billing.state,
          "postcode": newUser.billing.postcode,
          "country": newUser.billing.country,
          "email": newUser.email,
          "phone": newUser.billing.phone
        },
        "shipping": {
          "first_name": newUser.first_name,
          "last_name": newUser.last_name,
          "address_1": newUser.shipping.address_1,
          "address_2": newUser.shipping.address_2,
          "city": newUser.shipping.city,
          "state": newUser.shipping.state,
          "postcode": newUser.shipping.postcode,
          "email": newUser.email,
          "phone": newUser.billing.phone,
          "country": newUser.shipping.country
        }
      }
    
    var Woocommerce = WC.WC();
    
    Woocommerce.post('customers', customerData, function(err, data, res){

      if(JSON.parse(res)){
        $ionicPopup.show({
          title: "Welcome!",
          template: "Account creation successful. Please login.",
          buttons: [{
            text: "Login",
            type: "button-assertive",
            onTap: function(e){
              $state.go('app.login');
            }
          }]
        })
      }
      
      else {
        $ionicPopup.show({
          title: "OOPS",
          template: JSON.parse(res),
          buttons: [{
            text: "OK",
            type: "button-assertive"
          }]
        })
      }
    }); 
  }
})

.controller('CategoryCtrl', function($scope, WC, $stateParams, $localStorage, $rootScope) {
  console.log($stateParams.categoryID);
  var Woocommerce = WC.WC();

  Woocommerce.get('products?filter[category]=' +$stateParams.categoryID, function(err, data, res) {
  $scope.products = JSON.parse(res);
  $scope.products.forEach(function(element, index) {
    element.count = 0;
  });
    
    $scope.addToCart = function(product) {
      var countIncrease = false;
      
      $localStorage.cart.forEach(function(item, index) {
        if (item.id == product.id && countIncrease) {
          item.count = item.count + 1;
          countIncrease = true;
        }
      
      });
      
        if (!countIncrease) {
          product.count = 1;
          $localStorage.cart.push(product);
        }
      
      $rootScope.cartNumber = $localStorage.cart.length;
      $scope.$apply();
    }
  }) 
})

.controller('LoginCtrl', function($scope, $http, $localStorage, $ionicPopup, $state, WC, $ionicHistory){
  
  $scope.login = function(userData){
    
    $http.get('http://samarth.southeastasia.cloudapp.azure.com/api/auth/generate_auth_cookie/?insecure=cool&username='+userData.username+'&password='+userData.password)
    .then(function(response){
      console.log(response);
      
      if(response.data.user){
        $localStorage.userData = response;
        $ionicPopup.show({
          title: 'Welcome ' + response.data.user.displayname,
          template: '<center>You have logged in successfully.</center>',
          buttons: [{
            text: 'OK',
            onTap: function(e){
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
              });
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache();
              $state.go('app.home');
            }
          }]
        })
      }
      else {
        $ionicPopup.show({
          title: 'Something is wrong. Please Check.',
          template: '<center>Please check your username and password.</center>',
          buttons: [{
            text: 'Retry'
          }]
        })
      }
    });
    
  }
  
  
})
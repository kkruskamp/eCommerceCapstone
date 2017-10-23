angular.module('starter.controllers', [])

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

    $scope.showCartModal = function() {
      $scope.cartItems = $localStorage.cart;

      if (!$scope.cartItems || $scope.cartItems.length == 0) {
        console.log("No items in cart.");
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

.controller('HomeCtrl', function(){

})

.controller('BrowseCtrl', function($scope, WC, $localStorage, $rootScope){

$scope.offset = 0;

  $scope.getProducts = function(){
    var Woocommerce = WC.WC();
    Woocommerce.get('products', function(err, data,res){
      if(err){
        console.log(err);
      }

        console.log(JSON.parse(res));
        
        JSON.parse(res).forEach(function(element, index){
          element.count = 0;
        })

        $scope.products = JSON.parse(res);
        $scope.offset = $scope.offset + 10;
        $scope.canLoadMore = true;
    })
  }

  $scope.getProducts();

  $scope.doRefresh = function(){
    $scope.getProducts();
    $scope.$broadcast('scroll.refreshComplete')
  }

  $scope.loadMore = function(){
    var Woocommerce = WC.WC();
    Woocommerce.get('products?filter[offset]=' + $scope.offset, function(err, data, res){
      
      if (err){
        console.log(err);
      }

      JSON.parse(res).forEach(function(element, index){
        element.count = 0;
        $scope.products.push(element);
      })

      $scope.$broadcast('scroll.infiniteScrollComplete');

      if (JSON.parse(res).products.length < 10){
        $scope.canLoadMore = false;
        console.log("No more products!");
        return;
      }

      else {
        $scope.offset = $scope.offset + 10;
      }

    })

  }
  var countIncrease = false;

  $scope.addToCart = function(product){
    $localStorage.cart.forEach(function(item, index){
      if(item.id == product.id && !countIncrease){
        console.log(item.id + " = " + product.id);
        item.count = item.count + 1;
        console.log("count increased");
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

.controller('CategoriesCtrl', function($scope, WC) {
  var Woocommerce = WC.WC();

  Woocommerce.get('products/categories', function(err, data, res) {
    if (err) {
      console.log(err);
    }

    $scope.categories = (JSON.parse(res))
  })
})

    .controller('ProductCtrl', function($scope, WC, $stateParams, $rootScope, $localStorage) {
      var Woocommerce = WC.WC();
      Woocommerce.get('products/' + $stateParams.productID, function(err, data, res) {
        if (err) {
          console.log(err);
        }

        $scope.product = JSON.parse(res);
        $scope.images = JSON.parse(res);

        console.log($scope.product);

        Woocommerce.get('products/' + $stateParams.productID + '/reviews', function(error, dat, resonse) {
          if (err) {
            console.log(err);
          }

          $scope.reviews = JSON.parse(response);
        })
      })

      $scope.addToCart = function(product){
      var countIncrease = false;
      $localStorage.cart.forEach(function(item, index){
        if(item.id == product.id && !countIncrease){
          console.log(item.id + " = " + product.id);
          item.count = item.count + 1;
          console.log("count increased");
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

.controller('SignupCtrl', function($scope, WC, $state, $ionicPopup) {
  $scope.newUser = {};
  $scope.newUser.isValid = true;
})

// .controller('CategoryCtrl', function($scope, WC, $stateParams, $localStorage, $rootScope) {
//   console.log($stateParams.categoryID);
//   var Woocommerce = WC.WC();

//   Woocommerce.get('products?filter[category]=' +$stateParams.categoryID, function(err, data, res) {
//   $scope.products = JSON.parse(res);
//   $scope.products.forEach(function(element, index) {
//     element.count = 0;
//   });
    
//     $scope.addToCart = function(product) {
//       var countIncrease = false;
      
//       $localStorage.cart.forEach(function(item, index) {
//         if (item.id == product.id && countIncrease) {
//           console.log(item.id + "==" + product.id);
//           item.count = item.count + 1;
//           countIncrease = true;
//         }
      
//       });
      
//         if (!countIncrease) {
//           product.count = 1;
//           $localStorage.cart.push(product);
//         }
      
//       $rootScope.cartNumber = $localStorage.cart.length;
//       $scope.$apply();
//     }
//   }) 
// })
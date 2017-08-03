/**
 * Created by dev10 on 1/7/2016.
 */
//interacion de jquery y angular practicoo en las directivas
//Andres AutoCompletar
var app_angular = angular.module('PedidosOnline');
app_angular.directive("myAutocomplete",function () {
    // body...
    function link(scope,element,attrs){
        $(element).autocomplete({

            source:scope[attrs.myAutocomplete],
            select: function(ev,ui){
                ev.preventDefault();
                scope.optionSelected(ui.item.value);
                if (ui.item) {
                    
                }
            },
            focus:function(ev,ui){
                ev.preventDefault();
                $(this).val(ui.item.label);
            }
             
        });
    };
    return{
        link:link
    };
})
app_angular.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) { 
          console.log('value=',value);
          //$timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
          //});
        }
      });
    }
  };
})

app_angular.directive('setFocusIf', function($timeout) {
  return {
    link: function($scope, $element, $attr) {
      $scope.$watch($attr.setFocusIf, function(value) {
        if ( value ) {
          $timeout(function() {
            // We must reevaluate the value in case it was changed by a subsequent
            // watch handler in the digest.
            if ( $scope.$eval($attr.setFocusIf) ) {
              $element[0].focus();
            }
          }, 0, false);
        }
      });
    }
  }
});

app_angular.run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
});


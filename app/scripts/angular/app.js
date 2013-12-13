'use strict';
var app = angular.module('shn', ['google-maps']);
app.run(function($rootScope, $location, $routeParams) {
  console.log('running');
  $rootScope.showSidebar = 'none';
  $rootScope.baseUrl = 'APIURL';
  var path = function() { return $location.path();};
  $rootScope.$watch(path, function(newVal, oldVal){
    $rootScope.currentLocation = newVal;
    if ($rootScope.currentLocation === '/') {
      $rootScope.header = 'My events';
    }
  });
});
app.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.
  when('/', {templateUrl: 'scripts/angular/home/templates/home.html', controller: 'MapCtrl', bodyId:'front',}).
  when('/home', {templateUrl: 'scripts/angular/home/templates/home.html', bodyId:'body-home',}).
  when('/objects', {templateUrl: 'scripts/angular/objects/templates/objects.html', bodyId:'body-objects',}).
  when('/samhallsnyttan-i-framtiden', {templateUrl: 'scripts/angular/samhallsnyttaniframtiden/templates/samhallsnyttan.html',}).
  when('/press', {templateUrl: 'scripts/angular/press/templates/press.html',}).
  when('/contact', {templateUrl: 'scripts/angular/contact/templates/contact.html',}).
  when('/headings', {templateUrl: 'scripts/angular/headings/templates/headings.html',}).
   

   otherwise({redirectTo: '/'});

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.controller('MainCtrl', function($scope){
  $scope.title = 'Samhällsnyttan';
});


var mainModule = angular.module('MainModule', []);

mainModule.service('mainService',
['$http',
'$location',
'$rootScope',
function($http, $location, $rootScope) {


}]);



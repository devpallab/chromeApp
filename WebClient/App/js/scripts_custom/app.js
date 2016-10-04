// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', ['ngRoute','underscore','createDraggable','createGraph']);
//var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/snapshot', {
    templateUrl: 'js/scripts_custom/views/snapshot.html',
    controller: 'SnapshotCtrl'
  });
  

  $routeProvider.otherwise({redirectTo: '/snapshot'});

}]); 
'use strict';

angular.module('wlsApp', [
	'btford.socket-io',
	'services',
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.tpls'
])
.config(['$stateProvider', '$urlRouterProvider', 
		  	function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
	.otherwise('/index');

	$stateProvider
		.state('/index', {
			url: "/index",
			views: {
				"state" : { templateUrl: "partials/main_state.html",}
			}
		})
		.state('console', {
			url: "/console",
			views: {
				"state" : { templateUrl: "partials/display.html",}
			}
		})
}])
.controller('consoleCtrl', ['$scope', 'socketService',
			function($scope, socketService) {

	//$scope.getCashPosition = function() {
		socketService.on('client_request', function (msg){
			$scope.cash = msg;
		});
	//}
}])
.directive('wlsTradeconsole', function() {
	return {
		restrict: 'E',
		scope: {
			cash:'=',
		},
		templateUrl: 'templates/wls-tradeconsole.html',
	}
}); 
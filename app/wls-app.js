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
				"state" : { templateUrl: "partials/main_state.html"}
			}
		})
		.state('console', {
			url: "/console",
			views: {
				"state" : { templateUrl: "partials/wls-tradeconsole.html"},
							controller: 'consoleCtrl'
			}
		})
}])
.controller('consoleCtrl', ['$scope', 'socketService',
			function($scope, socketService) {

	$scope.getCash = function(amount) {
		socketService.emit('get_cash', amount);
		socketService.on('get_cash', function (msg){
			$scope.cash = msg;
		});
	}
	$scope.getCash(2000000);
}])
.directive('wlsTradeconsole', function() {
	return {
		restrict: 'E',
		scope: false,
		template: 'CASH: ' + '{{cash}}'
	}
}); 
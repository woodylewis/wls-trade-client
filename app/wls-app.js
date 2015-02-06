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
		restrict: 'EA',
		scope: {
			cash:'=',
			getCash:'&'
		},
		template:'<p><br>&nbsp;&nbsp;CASH: ' + '{{cash}}'
	}
}); 
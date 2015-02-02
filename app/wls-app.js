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
		.state('index', {
			url: "/index",
			views: {
				"state" : { templateUrl: "partials/main_state.html",}
			}
		})
		.state('display', {
			url: "/display",
			views: {
				"state" : { templateUrl: "partials/display.html",}
			}
		})
}])
.controller('MainCtrl', ['$scope', '$state', 'tradeService', 'socketService',
			function($scope, $state, tradeService, socketService) {
	console.log('Init MainCtrl');
	$scope.message = "client_outbound";

	socketService.emit('client_request', $scope.message);
	socketService.on('client_request', function (msg){
		$scope.display = msg;
	});
}]); 
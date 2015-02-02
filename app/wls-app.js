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
}])
.controller('MainCtrl', ['$scope', '$state', 'tradeService', 'socketService',
			function($scope, $state, tradeService, socketService) {
	$scope.name = "Stock";
	socketService.emit('chat message', $scope.name);
}]); 
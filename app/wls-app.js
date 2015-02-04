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
.controller('MainCtrl', ['$scope', '$state', 'socketService',
			function($scope, $state, socketService) {
	$scope.messages = [];

	//socketService.emit('client_request', $scope.message);
	socketService.on('client_request', function (msg){
		$scope.messages.push(msg);
		
		if($scope.messages.length == 5) {
			$scope.messages = [];
		}
	});
}]); 
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
.factory('mySocket', function (socketFactory) {
	var myIoSocket = io.connect('http://dev1:3500');

	var mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
})
.controller('MainCtrl', ['$scope', '$state', 'tradeService', 'mySocket',
			function($scope, $state, tradeService, mySocket) {
	$scope.name = "Stock";
	mySocket.emit('chat message', $scope.name);
}]); 
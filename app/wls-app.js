'use strict';

angular.module('wlsApp', [
	'btford.socket-io',
	'services',
	'ui.bootstrap',
	'ui.bootstrap.tpls'
])
.controller('consoleCtrl', ['$scope', 'socketService',
			function($scope, socketService) {
	$scope.stock1 = 0;
	$scope.stock2 = 0;
	$scope.stock3 = 0;

	$scope.initPosition = function() {
		socketService.on('init', function (msg) {
			$scope.cash = msg;
			console.log('msg', msg);
		});
	}

	$scope.buy1 = function() {
		socketService.emit('buy', 'stock1');
		socketService.on('buy1', function (msg){
			$scope.stock1 = msg;
			$scope.cash -= $scope.stock1; 
		});
	}

	$scope.buy2 = function() {
		socketService.emit('buy', 'stock2');
		socketService.on('buy2', function (msg){
			$scope.stock2 = msg;
			$scope.cash -= $scope.stock2; 
		});
	}

	$scope.buy3 = function() {
		socketService.emit('buy', 'stock3');
		socketService.on('buy3', function (msg){
			$scope.stock3 = msg;
			$scope.cash -= $scope.stock3; 
		});
	}

	$scope.getCash = function(amount) {
		socketService.emit('get_portfolio', amount);
		socketService.on('portfolio', function (msg){
			$scope.cash = msg;
		});
	}

	$scope.initPosition();
}])
.directive('wlsTradeconsole', function() {
	return {
		restrict: 'E',
		scope: false,
		templateUrl: "templates/wls-tradeconsole.html"
	}
}); 
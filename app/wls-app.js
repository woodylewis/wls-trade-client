'use strict';

angular.module('wlsApp', [
	'btford.socket-io',
	'services',
	'ui.bootstrap',
	'ui.bootstrap.tpls'
])
.controller('consoleCtrl', ['$scope', 'socketService',
			function($scope, socketService) {

	$scope.cashPosition = 0;
	$scope.stock1 = 0;
	$scope.stock2 = 0;
	$scope.stock3 = 0;
	$scope.tranche = 100000;

	$scope.init = function() {
		socketService.emit('init', 'init');
		socketService.on('init', function (msg) {
			$scope.cashPosition = msg;
			console.log('init', msg);
		});
	}

	$scope.cash = function() {
		socketService.on('cash', function (msg) {
			$scope.cashPosition = msg;
			console.log('cash', msg);
		});
	}

	$scope.buy = function(stock) {
		if($scope.cashPosition > 0) {
			switch (stock) {
				case '1' :
					socketService.emit('buy', 'stock1');
					$scope.stock1 += $scope.tranche;
				break;
				case '2' :
					socketService.emit('buy', 'stock2');
					$scope.stock2 += $scope.tranche;
				break;
				case '3' :
					socketService.emit('buy', 'stock3');
					$scope.stock3 += $scope.tranche;
				break;
			}
			$scope.cash();
		}
		else if($scope.cashPosition <= 0){
			alert('Out of cash');
		}
	}

	$scope.cash();
}]);
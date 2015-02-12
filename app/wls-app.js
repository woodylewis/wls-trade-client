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
				"state" : { templateUrl: "partials/main_state.html" }
			}
		})
		.state('chart', {
			url: "/chart",
			views: {
				"state" : { templateUrl: "partials/wls-tradeconsole.html" }
			}
		})
}])
.directive('wlsPiechart', ['d3Service', function(d3Service){
  return {
    restrict: 'E',
    scope: false,
	templateUrl: 'templates/piechart.html',

   link: function($scope) {

		d3Service.d3().then(function(d3) {
			//var dataset = [5, 10, 20, 45];
/*
console.log('stock1 ', $scope.$parent.stock1);
console.log('stock2 ', $scope.$parent.stock2); 
console.log('stock3 ', $scope.$parent.stock3);	
*/		   
$scope.$watch('cashPosition', function(newValue, oldValue) {
	if(newValue !== oldValue) {
		console.log('cashPosition ', $scope.$parent.cashPosition); 
		
		    var dataset = [
		    		$scope.$parent.cashPosition, 
		    		$scope.$parent.stock1, 
		    		$scope.$parent.stock2, 
		    		$scope.$parent.stock3];
		    
		    var color = d3.scale.category10();
		    var data = dataset;
		    var width = 100;
		    var height = 100;
		    var min = Math.min(width, height);
		    var svg = d3.select('#chart').append('svg');
		    //var svg = d3.select(el[0]).append('svg');
		    var pie = d3.layout.pie().sort(null);
		    var arc = d3.svg.arc()
		      .outerRadius(min / 2 * 0.9);

		    svg.attr({width: width, height: height});
		    var g = svg.append('g')
		      // center the donut chart
		      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
		    
		    // add the <path>s for each arc slice
		    g.selectAll('path').data(pie(data))
		      .enter().append('path')
		        .style('stroke', 'white')
		        .attr('d', arc)
		        .attr('fill', function(d, i){ return color(i) });
	}//-- if(newValue !== oldValue) --
});//-- $scope.$watch ---
		});//-- d3Service ---
 	
	}//-- link ---
  };
}])
.controller('consoleCtrl', ['$scope', '$state', 'socketService',
			function($scope, $state, socketService) {

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
			//console.log('cash', msg);
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
		$state.go('chart');
	}
}]);
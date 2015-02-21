'use strict';

angular.module('wlsApp', [
	'btford.socket-io',
	'services',
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
	'd3'
])
.config(['$stateProvider', '$urlRouterProvider', 
		  	function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
	.otherwise('index');

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
    transclude: true,
	templateUrl: 'templates/piechart.html',

   link: function($scope) {

		d3Service.d3().then(function(d3) {
			function pieChart(data, svgRegion, width, height) {		    
				//-- REMOVE ANY PREVIOUS SVG ELEMENT ---
				//-- PRESERVE ORIGINAL COORDINATES -----
				d3.select(svgRegion).select('svg').remove();
				//--- START WITH GREEN FOR CASH -----
				var color = ['#2ca02c', '#1f77b4','#ff7f0e','#d62728'];
			    var data = data;
			    var min = Math.min(width, height);
			    var svg = d3.select(svgRegion).append('svg');
			    var pie = d3.layout.pie().sort(null);
			    var arc = d3.svg.arc()
			      .outerRadius(min / 2 * 0.9);

			    svg.attr({width: width, height: height});
			    var g = svg.append('g')
			      // center the chart
			      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
			    // add the <path>s for each arc slice
			    g.selectAll('path').data(pie(data))
			      .enter().append('path')
			        .attr('d', arc)
			        .attr('fill', function(d, i){ return color[i] });
			}//--- pieChart ----
				//--- THIS COPY USED ONCE ---
				var original = [
		    		$scope.$parent.cashPosition, 
		    		$scope.$parent.stock1, 
		    		$scope.$parent.stock2, 
		    		$scope.$parent.stock3];

			pieChart(original, "#chart", 120, 120);

			$scope.$watch('cashPosition', function(newValue, oldValue) {
				if(newValue !== oldValue) {
					//--- THIS COPY CHANGES ---
					var dataset = [
			    		$scope.$parent.cashPosition, 
			    		$scope.$parent.stock1, 
			    		$scope.$parent.stock2, 
			    		$scope.$parent.stock3];

					pieChart(dataset, "#chart", 120, 120);
				}//-- if(newValue !== oldValue) --
			});//-- $scope.$watch ---
		});//-- d3Service ---
	}//-- link ---
  };
}])
.controller('consoleCtrl', ['$scope', '$state', 'socketService',
			function($scope, $state, socketService) {

	$scope.cashPosition = '';
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
		$state.go('chart');
	}

	$scope.reset = function() {
		if($scope.cashPosition == 1000000) {
			alert('Already at starting cash position');
		}
		$scope.stock1 = 0;
		$scope.stock2 = 0;
		$scope.stock3 = 0;
		socketService.emit('reset', 'reset');
		socketService.on('reset', function (msg) {
			$scope.cashPosition = msg;
			console.log('reset', msg);
		});
		$state.go('chart');
	}

	$scope.cash = function() {
		socketService.on('cash', function (msg) {
			$scope.cashPosition = msg;
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

	$scope.sell = function(stock) {
			switch (stock) {
				case '1' :
					if($scope.stock1 > 0){
						socketService.emit('sell', 'stock1');
						$scope.stock1 -= $scope.tranche;
					}
					else {
						alert('No stock1 position');
					}
				break;
				case '2' :
					if($scope.stock2 > 0){
						socketService.emit('sell', 'stock2');
						$scope.stock2 -= $scope.tranche;
					}
					else {
						alert('No stock2 position');
					}
				break;
				case '3' :
					if($scope.stock3 > 0){
						socketService.emit('sell', 'stock3');
						$scope.stock3 -= $scope.tranche;
					}
					else {
						alert('No stock3 position');
					}
				break;
			}
			$state.go('chart');
	}
	
}]);
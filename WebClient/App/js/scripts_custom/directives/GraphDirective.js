// Directive for charts
var graph = angular.module('createGraph',[]);
graph.directive('panelBody', ['$timeout',function ($timeout,$window) { 
                return {
                    restrict: 'C',
					 /* replace: true, */
					template: '<div></div>',
                    scope: true ,
                    link: function (scope, element,attrs, rootScope) {
						
						scope.$on('updatedata', function(evt,ind,data) {
							var options = {};
							switch (data) {
								case "Lexile Level" :
									options = scope.LexileChartOptions ;

								break;
								
								case "Oral Fluency" :
									options = scope.OralFluencyChartOptions;
								break;
								
								case "Reading Comp." :
									options = scope.ReadingCompChartOptions ;
								break;
								
								case "Books Read" :
									options = scope.BookReadChartOptions;
								break;
								
								case "Time Spent Reading" :
									options = scope.TimeSpendChartOptions;
								break;
								
								case "Gle" :
									options = scope.GleChartOptions;
								break;
								
								default :
									options = scope.GleChartOptions;
								break;
	
							}
							
							if(ind == 0) {
								if($(element[0]).attr('id') == 'graphchart_1'){ 
									$(element[0]).highcharts(options);
								}
							}else{
								if($(element[0]).attr('id') == 'graphchart_2'){ 
									$(element[0]).highcharts(options);
								}
							}
							
						});
						 var drawGraph = function () {
							 if($(element[0]).attr('id') == 'graphchart_1'){ 
								$(element[0]).highcharts(scope.GleChartOptions);
							}else{
								$(element[0]).highcharts(scope.ReadingCompChartOptions);
							}
						}
						/* $timeout(drawGraph,7000); */
						 scope.$on('displayGraph', function () { drawGraph() });
                    } 
                };
}]);




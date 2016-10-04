
var draggable = angular.module("createDraggable",[]);
draggable.directive('draggable', function ($rootScope) {
    return {
        restrict: 'A',
        controller: function ($scope, $element) {
            
            $element.find(".dragElem").draggable({revert: "invalid", helper: "clone",
            start:function(event, ui){$(this).css({"visibility":"hidden"});},
            stop:function(event, ui){
               $(this).css("visibility","visible");
            }
            });
            $element.siblings().find($scope.CONSTANTS.c_s_DROPPABLE_CONTAINER).droppable({
                accept: $element.find(".dragElem"), drop: function (event, ui) {
                    var html = ui.draggable.find($scope.CONSTANTS.c_s_DRAGGABLE_TEXT_CONTAINER).text();
                    //ui.draggable.css("visibility","visible");
                     ui.draggable.find($scope.CONSTANTS.c_s_DRAGGABLE_TEXT_CONTAINER).text($(this).find(".panel-heading").text());
                     $(this).find(".panel-heading").text(html);
                     $scope.graphIndex[$(this).index()]= html;
                     $rootScope.$broadcast('updatedata', $(this).index(), html);
                    }});
        }
    };
});
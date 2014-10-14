(function(angular, Sortable, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular, Sortable);
        });
    } else {
        return factory(angular, Sortable);
    }
}(angular || null, Sortable || null, function(angular, Sortable) {
    var app = angular.module('de.ng-sortable', []);

    app.directive('ngSortable', ['$parse', '$timeout', function($parse, $timeout) {
        return {
            scope: {
                'itemArray': '=ngSortable',
                'listItemSelector': '@ngSortableItemSelector',
                'dragHandleSelector': '@ngDragHandleSelector',
                'orderChanged': '&ngSortableOnChange'
            },
            link: function(scope, element, attrs) {
                var container = element,
                    originalContainerContent,
                    sort,
                    slice = Array.prototype.slice,
                    ghostClass = 'dragging';

                // Create rubaxa sortable list
                sort = new Sortable(element[0], {
                    draggable: scope.listItemSelector,
                    onUpdate: onUpdate, 
                    ghostClass: ghostClass,
                    handle: scope.dragHandleSelector
                });

                // When the list order is updated
                function onUpdate(event) {
                    // Get the item that was clicked on
                    var clickedItem = angular.element(event.item);

                    // Get the Angular scope attached to the clicked element
                    var itemScope = clickedItem.scope();

                    // Get the original position of the dragged element
                    var originalPosition = itemScope.$index;

                    // Get the current order of dom nodes
                    var elementList = slice.call(container.children());

                    // Get the new position of the dragged element
                    var newPosition = elementList.indexOf(clickedItem[0]);

                    scope.$apply(function() {
                        // Adjust ng-repeat's array to match the drag changes
                        var movedItem = scope.itemArray.splice(originalPosition, 1)[0];
                        scope.itemArray.splice(newPosition, 0, movedItem);
                    });

                    // Call the user provided on change method
                    scope.orderChanged();
                }
            }
        };
    }]);

    return app;
}));
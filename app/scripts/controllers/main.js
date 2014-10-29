'use strict';

/**
 * @ngdoc function
 * @name todolistApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the todolistApp
 */
angular.module('todolistApp')
    .controller('MainCtrl', function ($scope, $http, appSettings) {

        $scope.items = [];

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.processForm = function () {
            var item = {
                name: $scope.name,
                price: $scope.price
            };

            postItem(item);
        };

        function getItems () {
            $http.get(appSettings.db + '/_design/expenses/_view/byName')
                .success(function (data) {
                $scope.items = data.rows;

            });
        }

        function postItem (item) {
            // optimistic ui update
            $scope.items.push({key: $scope.name, value: $scope.price});
            // send post request
            $http.post(appSettings.db, item)
            .success(function () {
                $scope.status = '';
            }).error(function (res) {
                $scope.status = 'Error: ' + res.reason;
                // refetch items from server
                getItems();
            });
        }

        getItems();
});

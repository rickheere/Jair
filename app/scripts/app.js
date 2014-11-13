/*global Pouch*/
'use strict';

/**
 * @ngdoc overview
 * @name todolistApp
 * @description
 * # todolistApp
 *
 * Main module of the application.
 */
var Jair = angular
    .module('todolistApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }).constant('appSettings', {
        db: [
            process.env.COUCHDB_PROTOCOL || 'http',
            '://',
            process.env.COUCHDB_HOST || 'localhost',
            ':',
            process.env.COUCHDB_PORT || '5984',
            '/',
            process.env.COUCHDB_DB || 'expenses'
        ].join('')
    });



Jair.factory('myPouch', [function() {

    var mydb = new Pouch('ng-pouch');
    Pouch.replicate('ng-pouch', 'http://127.0.0.1:5984/ng-db', {
        continuous: true
    });
    Pouch.replicate('http://127.0.0.1:5984/ng-db', 'ng-pouch', {
        continuous: true
    });
    return mydb;

}]);

Jair.factory('pouchWrapper', ['$q', '$rootScope', 'myPouch', function($q,
    $rootScope, myPouch) {
    return {
        add: function(text) {
            var deferred = $q.defer();
            var doc = {
                type: 'todo',
                text: text
            };

            myPouch.post(doc, function(err, res) {
                $rootScope.$apply(function() {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(res);
                    }
                });
            });

            return deferred.promise;
        },
        remove: function(id) {
            var deferred = $q.defer();

            myPouch.get(id, function(err, doc) {
                $rootScope.$apply(function() {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        myPouch.remove(doc,
                            function(err,
                                res) {
                                $rootScope.$apply(
                                    function() {
                                        if (
                                            err
                                        ) {
                                            deferred
                                                .reject(
                                                    err
                                                );
                                        } else {
                                            deferred
                                                .resolve(
                                                    res
                                                );
                                        }
                                    });
                            });
                    }
                });
            });

            return deferred.promise;
        }
    };
}]);

Jair.factory('listener', ['$rootScope', 'myPouch', function($rootScope, myPouch) {
    myPouch.changes({
        continuous: true,
        onChange: function(change) {
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    myPouch.get(change.id,
                        function(err, doc) {
                            $rootScope.$apply(
                                function() {
                                    if (
                                        err
                                    ) {
                                        console
                                            .log(
                                                err
                                            );
                                    }

                                    $rootScope
                                        .$broadcast(
                                            'newTodo',
                                            doc
                                        );
                                });
                        });
                });
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast(
                        'delTodo', change.id
                    );
                });
            }
        }
    });
}]);

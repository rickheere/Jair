'use strict';

/**
 * @ngdoc overview
 * @name todolistApp
 * @description
 * # todolistApp
 *
 * Main module of the application.
 */
angular
.module('todolistApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function ($routeProvider) {
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
        db: 'http://127.0.0.1:5984/expenses'
    });

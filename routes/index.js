'use strict';

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('pages/index');
    });

    app.get('/buttons', function(req, res) {
        res.render('pages/buttons');
    });

    app.get('/tables', function(req, res) {
        res.render('pages/tables');
    });

    app.get('/charts', function(req, res) {
        res.render('pages/charts');
    });


    app.get('/about', function(req, res) {
        res.render('pages/about');
    });
};
const express = require('express');
const route = express.Router();
var bodyParser = require('body-parser');
var html2json = require('html2json').html2json;

var result = { errores: null, copia: null, ast: null, python: null, json_x: null, html_x: null, ast_json: null };

var parser = require('../gram');
var py_phar = require('../gram_py');
var jsx = require('../gram_json');

var pt="";

route.get('/', function (req, res) {
    res.render('index.ejs');
});

route.post('/', function (req, res) {
    parser.clear_vars();
    var n = parser.parse(req.body.file_x);
    var ast = "";


    for (let i = 0; i < n[0].length; i++) {
        ast += n[0][i];
    }

    for (let i = 0; i < ast.length; i++) {
        ast = ast.replace(">,<", "><");
    }
    var mx = "s";
    //console.log();
    let r = [];
    r = req.body.file_x.split("\n");
    let err = n[1];
    for (let i = 0; i < err.length; i++) {
        err[i][4] = r[err[i][2] - 1];
    }

    pt=jsx.parse(req.body.file_x);
    result = {
        errores: err,
        vars: n[2],
        ast: ast,
        python: py_phar.parse(req.body.file_x),
        json_x: JSON.stringify(mx, null, "\t"),
        html_x: n[3],
        ast_json : JSON.stringify(jsx.parse(req.body.file_x), null, "\t")
    };
    res.redirect('/cmp');
});

route.get('/cmp', function (req, res) {
    res.render('compiled.ejs', result);
});

route.get('/json_comp', function (req, res) {
    res.send(pt);
});






module.exports = route;
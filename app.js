require("dotenv").config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var profilsRouter = require('./routes/profils');
var settingsRouter = require('./routes/settings');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/profils', profilsRouter);
app.use('/settings', settingsRouter);

module.exports = app;

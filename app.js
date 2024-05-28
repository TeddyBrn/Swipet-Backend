require("dotenv").config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var profilsRouter = require('./routes/profils');
var settingsRouter = require('./routes/settings');
var matchsRouter = require('./routes/matchs');
var animalsRouter = require('./routes/animals');
var messagesRouter = require('./routes/messages');
var proposalsRouter = require('./routes/proposals');
var avisRouter = require('./routes/avis');
// var historiquesRouter = require('./routes/historiques');

var app = express();

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/profils', profilsRouter);
app.use('/settings', settingsRouter);
app.use('/matchs', matchsRouter);
app.use('/animals', animalsRouter);
app.use('/messages', messagesRouter);
app.use('/proposals', proposalsRouter);
app.use('/avis', avisRouter);
// app.use('/historiques', historiquesRouter);

module.exports = app;

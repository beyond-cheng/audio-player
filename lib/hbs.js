var exphbs     = require('express3-handlebars'),
    Handlebars = require('handlebars'),

    config  = require('../config'),
    helpers = require('./helpers');

module.exports = exphbs.create({
    defaultLayout: 'main',
    handlebars   : Handlebars,
    helpers      : helpers,
    extname		 : config.extname,
    layoutsDir   : config.dirs.layouts,
    partialsDir  : config.dirs.partials
});
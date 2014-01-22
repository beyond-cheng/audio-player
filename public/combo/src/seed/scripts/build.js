#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    config = require('../../../../../config'),
    
    jsonIn = path.join(__dirname, '..', 'js', 'modules.json'),
    jsIn = path.join(__dirname, '..', 'template', 'config.js'),
    jsOut = path.join(__dirname, '..', 'js', 'config.js'),

    jsTemplate = fs.readFileSync(jsIn, 'utf8'),
    jsonStr = fs.readFileSync(jsonIn, 'utf8'),

    jsStr = jsTemplate.replace('{ /* METAGEN */ }', jsonStr)
       .replace(/@YUI_VERSION@/g, config.yui.version)
       .replace(/@PROJECT_NAME@/g, config.name)
       .replace(/@PROJECT_VERSION@/g, config.version)
       .replace(/@yui_filter@/, config.isDevelopment ? 'debug' : 'min')
       .replace(/@gloup_filter@/, config.isDevelopment ? 'debug' : 'min');

console.log('Writing Dev JS file', jsOut);

fs.writeFileSync(jsOut, jsStr, 'utf8');

console.log('Done writing Dev JS file');

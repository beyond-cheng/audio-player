#!/usr/bin/env node

var fs = require('fs'),
	path = require('path'),
	config = require('../../../../../config'),

	jsIn = path.join(__dirname, '../../../../../lib/yui', config.yui.version, 'yui', 'yui.js'),
    jsOut = path.join(__dirname, '..', 'js', 'yui.js'),

    jsStr = fs.readFileSync(jsIn, 'utf8');

console.log('Writing YUI file', jsOut);

fs.writeFileSync(jsOut, jsStr, 'utf8');

console.log('Done writing YUI file');

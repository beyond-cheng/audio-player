#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
    base = path.join(__dirname, '../../'),
    jsonOut = path.join(__dirname, '../', 'js', 'modules.json');

var dirs = fs.readdirSync(base);

var metaFiles = [];

dirs.forEach(function(d) {
    var p = path.join(base, d, 'meta');
    if (exists(p)) {
        var files = fs.readdirSync(p);
        files.forEach(function(f) {
            f = path.join(p, f);
            var ext = path.extname(f);
            if (ext === '.json') {
                metaFiles.push(f);
            }
        });
    }
});

console.log('Found', metaFiles.length, '.json files to parse. Parsing now..');


//This is only to make the data look exactly the same as the old python script.
var sortObject = function(data) {
    var keys = Object.keys(data).sort();
    var d = {};
    keys.forEach(function(k) {
        d[k] = data[k];
    });
    return d;
};

var json = {};

var conds = {};

var parseData = function(name, data, file) {
    var i, o;
    for (i in data) {
        if (i === 'submodules' || i === 'plugins') {
            for (o in data[i]) {
                parseData(o, data[i][o], file);
            }
            delete data[i];
        }
        if (i === 'condition') {
            if (data[i].test && data[i].test.indexOf('.js') > 0) {
                conds[name] = path.join(path.dirname(file), data[i].test);
            }
            data[i].name = name;
            data[i] = sortObject(data[i]);
        }
    }
    json[name] = sortObject(data);
};

metaFiles.forEach(function(file) {
    var data = fs.readFileSync(file, 'utf8'), i, o;

    try {
        data = JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse: ', file);
        console.error(e);
        process.exit(1);
    }
    for (i in data) {
        parseData(i, data[i], file);
    }
});

var out = sortObject(json);

console.log('Writing JSON', jsonOut);

var jsonStr = JSON.stringify(out, null, 4);

fs.writeFileSync(jsonOut, jsonStr, 'utf8');

console.log('Done Writing JSON');

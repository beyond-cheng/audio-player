YUI.add('template-micro', function (Y, NAME) {

/*jshint expr:true */

/**
Adds the `Y.Template.Micro` template engine, which provides fast, simple
string-based micro-templating similar to ERB or Underscore templates.

@module template
@submodule template-micro
@since 3.8.0
**/

/**
Fast, simple string-based micro-templating engine similar to ERB or Underscore
templates.

@class Template.Micro
@static
@since 3.8.0
**/

// This code was heavily inspired by Underscore.js's _.template() method
// (written by Jeremy Ashkenas), which was in turn inspired by John Resig's
// micro-templating implementation.

var Micro = Y.namespace('Template.Micro');

/**
Default options for `Y.Template.Micro`.

@property {Object} options

    @param {RegExp} [options.code] Regex that matches code blocks like
        `<% ... %>`.
    @param {RegExp} [options.escapedOutput] Regex that matches escaped output
        tags like `<%= ... %>`.
    @param {RegExp} [options.rawOutput] Regex that matches raw output tags like
        `<%== ... %>`.
    @param {RegExp} [options.stringEscape] Regex that matches characters that
        need to be escaped inside single-quoted JavaScript string literals.
    @param {Object} [options.stringReplace] Hash that maps characters matched by
        `stringEscape` to the strings they should be replaced with. If you add
        a character to the `stringEscape` regex, you need to add it here too or
        it will be replaced with an empty string.

@static
@since 3.8.0
**/
Micro.options = {
    code         : /<%([\s\S]+?)%>/g,
    escapedOutput: /<%=([\s\S]+?)%>/g,
    rawOutput    : /<%==([\s\S]+?)%>/g,
    stringEscape : /\\|'|\r|\n|\t|\u2028|\u2029/g,

    stringReplace: {
        '\\'    : '\\\\',
        "'"     : "\\'",
        '\r'    : '\\r',
        '\n'    : '\\n',
        '\t'    : '\\t',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
    }
};

/**
Compiles a template string into a JavaScript function. Pass a data object to the
function to render the template using the given data and get back a rendered
string.

Within a template, use `<%= ... %>` to output the value of an expression (where
`...` is the JavaScript expression or data variable to evaluate). The output
will be HTML-escaped by default. To output a raw value without escaping, use
`<%== ... %>`, but be careful not to do this with untrusted user input.

To execute arbitrary JavaScript code within the template without rendering its
output, use `<% ... %>`, where `...` is the code to be executed. This allows the
use of if/else blocks, loops, function calls, etc., although it's recommended
that you avoid embedding anything beyond basic flow control logic in your
templates.

Properties of the data object passed to a template function are made available
on a `data` variable within the scope of the template. So, if you pass in
the object `{message: 'hello!'}`, you can print the value of the `message`
property using `<%= data.message %>`.

@example

    YUI().use('template-micro', function (Y) {
        var template = '<ul class="<%= data.classNames.list %>">' +
                           '<% Y.Array.each(data.items, function (item) { %>' +
                               '<li><%= item %></li>' +
                           '<% }); %>' +
                       '</ul>';

        // Compile the template into a function.
        var compiled = Y.Template.Micro.compile(template);

        // Render the template to HTML, passing in the data to use.
        var html = compiled({
            classNames: {list: 'demo'},
            items     : ['one', 'two', 'three', 'four']
        });
    });

@method compile
@param {String} text Template text to compile.
@param {Object} [options] Options. If specified, these options will override the
    default options defined in `Y.Template.Micro.options`. See the documentation
    for that property for details on which options are available.
@return {Function} Compiled template function. Execute this function and pass in
    a data object to render the template with the given data.
@static
@since 3.8.0
**/
Micro.compile = function (text, options) {
    /*jshint evil:true */

    var blocks     = [],
        tokenClose = "\uffff",
        tokenOpen  = "\ufffe",
        source;

    options = Y.merge(Micro.options, options);

    // Parse the input text into a string of JavaScript code, with placeholders
    // for code blocks. Text outside of code blocks will be escaped for safe
    // usage within a double-quoted string literal.
    //
    // $b is a blank string, used to avoid creating lots of string objects.
    //
    // $v is a function that returns the supplied value if the value is truthy
    // or the number 0, or returns an empty string if the value is falsy and not
    // 0.
    //
    // $t is the template string.
    source = "var $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='" +

        // U+FFFE and U+FFFF are guaranteed to represent non-characters, so no
        // valid UTF-8 string should ever contain them. That means we can freely
        // strip them out of the input text (just to be safe) and then use them
        // for our own nefarious purposes as token placeholders!
        //
        // See http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Noncharacters
        text.replace(/\ufffe|\uffff/g, '')

        .replace(options.rawOutput, function (match, code) {
            return tokenOpen + (blocks.push("'+\n$v(" + code + ")+\n'") - 1) + tokenClose;
        })

        .replace(options.escapedOutput, function (match, code) {
            return tokenOpen + (blocks.push("'+\n$e($v(" + code + "))+\n'") - 1) + tokenClose;
        })

        .replace(options.code, function (match, code) {
            return tokenOpen + (blocks.push("';\n" + code + "\n$t+='") - 1) + tokenClose;
        })

        .replace(options.stringEscape, function (match) {
            return options.stringReplace[match] || '';
        })

        // Replace the token placeholders with code.
        .replace(/\ufffe(\d+)\uffff/g, function (match, index) {
            return blocks[parseInt(index, 10)];
        })

        // Remove noop string concatenations that have been left behind.
        .replace(/\n\$t\+='';\n/g, '\n') +

        "';\nreturn $t;";

    // If compile() was called from precompile(), return precompiled source.
    if (options.precompile) {
        return "function (Y, $e, data) {\n" + source + "\n}";
    }

    // Otherwise, return an executable function.
    return this.revive(new Function('Y', '$e', 'data', source));
};

/**
Precompiles the given template text into a string of JavaScript source code that
can be evaluated later in another context (or on another machine) to render the
template.

A common use case is to precompile templates at build time or on the server,
then evaluate the code on the client to render a template. The client only needs
to revive and render the template, avoiding the work of the compilation step.

@method precompile
@param {String} text Template text to precompile.
@param {Object} [options] Options. If specified, these options will override the
    default options defined in `Y.Template.Micro.options`. See the documentation
    for that property for details on which options are available.
@return {String} Source code for the precompiled template.
@static
@since 3.8.0
**/
Micro.precompile = function (text, options) {
    options || (options = {});
    options.precompile = true;

    return this.compile(text, options);
};

/**
Compiles and renders the given template text in a single step.

This can be useful for single-use templates, but if you plan to render the same
template multiple times, it's much better to use `compile()` to compile it once,
then simply call the compiled function multiple times to avoid recompiling.

@method render
@param {String} text Template text to render.
@param {Object} data Data to pass to the template.
@param {Object} [options] Options. If specified, these options will override the
    default options defined in `Y.Template.Micro.options`. See the documentation
    for that property for details on which options are available.
@return {String} Rendered result.
@static
@since 3.8.0
**/
Micro.render = function (text, data, options) {
    return this.compile(text, options)(data);
};

/**
Revives a precompiled template function into a normal compiled template function
that can be called to render the template. The precompiled function must already
have been evaluated to a function -- you can't pass raw JavaScript code to
`revive()`.

@method revive
@param {Function} precompiled Precompiled template function.
@return {Function} Revived template function, ready to be rendered.
@static
@since 3.8.0
**/
Micro.revive = function (precompiled) {
    return function (data) {
        data || (data = {});
        return precompiled.call(data, Y, Y.Escape.html, data);
    };
};


}, '3.14.0', {"requires": ["escape"]});

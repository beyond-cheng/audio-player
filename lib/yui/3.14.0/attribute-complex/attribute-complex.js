YUI.add('attribute-complex', function (Y, NAME) {

    /**
     * Adds support for attribute providers to handle complex attributes in the constructor
     *
     * @module attribute
     * @submodule attribute-complex
     * @for Attribute
     * @deprecated AttributeComplex's overrides are now part of AttributeCore.
     */

    var Attribute = Y.Attribute;

    Attribute.Complex = function() {};
    Attribute.Complex.prototype = {

        /**
         * Utility method to split out simple attribute name/value pairs ("x")
         * from complex attribute name/value pairs ("x.y.z"), so that complex
         * attributes can be keyed by the top level attribute name.
         *
         * @method _normAttrVals
         * @param {Object} valueHash An object with attribute name/value pairs
         *
         * @return {Object} An object literal with 2 properties - "simple" and "complex",
         * containing simple and complex attribute values respectively keyed
         * by the top level attribute name, or null, if valueHash is falsey.
         *
         * @private
         */
        _normAttrVals : Attribute.prototype._normAttrVals,

        /**
         * Returns the initial value of the given attribute from
         * either the default configuration provided, or the
         * over-ridden value if it exists in the set of initValues
         * provided and the attribute is not read-only.
         *
         * @param {String} attr The name of the attribute
         * @param {Object} cfg The attribute configuration object
         * @param {Object} initValues The object with simple and complex attribute name/value pairs returned from _normAttrVals
         *
         * @return {Any} The initial value of the attribute.
         *
         * @method _getAttrInitVal
         * @private
         */
        _getAttrInitVal : Attribute.prototype._getAttrInitVal

    };

    // Consistency with the rest of the Attribute addons for now.
    Y.AttributeComplex = Attribute.Complex;


}, '3.14.0', {"requires": ["attribute-base"]});

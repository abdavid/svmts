/**
* Created by davidatborresen on 29.09.13.
*/
///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/IKernel.ts' />
define(["require", "exports", "underscore"], function(require, exports, _____) {
    var _ = _____;

    var PropertyType = (function () {
        function PropertyType() {
        }
        PropertyType.NUMBER = 'number';
        PropertyType.BOOLEAN = 'boolean';
        PropertyType.UNDEFINED = 'undefined';
        return PropertyType;
    })();
    exports.PropertyType = PropertyType;

    var Base = (function () {
        function Base() {
        }
        /**
        * @returns {string[]}
        */
        Base.prototype.getAttributes = function () {
            return Object.keys(this.getAttributeBy('name'));
        };

        /**
        * @param name
        * @returns {*}
        */
        Base.prototype.getAttribute = function (name) {
            var attribute = this.getAttributeBy('name');
            if (name in attribute) {
                return attribute[name];
            }

            return null;
        };

        /**
        * @param name
        * @returns {any}
        */
        Base.prototype.getAttributeType = function (name) {
            return this.getAttribute(name).type || void (name);
        };

        /**
        * @param prop
        * @returns {Dictionary<T>}
        */
        Base.prototype.getAttributeBy = function (prop) {
            return _.indexBy(this.attributes, prop);
        };
        return Base;
    })();
    exports.Base = Base;
});
//# sourceMappingURL=Base.js.map

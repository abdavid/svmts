/**
* Created by davidatborresen on 03.12.13.
*/
///<reference path='../interfaces/ICollection.ts' />
///<reference path='../../definitions/underscore.d.ts' />
define(["require", "exports"], function(require, exports) {
    var List = (function () {
        function List(elements) {
            if (typeof elements === "undefined") { elements = []; }
            var _this = this;
            this._elements = [];
            _.map(elements, function (value) {
                _this.add(value);
            });
        }
        /**
        * @param value
        * @returns {boolean}
        */
        List.prototype.contains = function (value) {
            return _.contains(this._elements, value);
        };

        /**
        * @param key
        * @param value
        */
        List.prototype.add = function (value) {
            this._elements.push(value);
        };

        /**
        * @param key
        */
        List.prototype.remove = function (value) {
            this._elements = _.without(this._elements, value);
        };

        /**
        * @returns {number}
        */
        List.prototype.count = function () {
            return _.size(this._elements);
        };

        List.prototype.clear = function () {
            this._elements = [];
        };

        /**
        * @returns {string}
        */
        List.prototype.toString = function () {
            return '[object List]';
        };
        return List;
    })();
    exports.List = List;
});
//# sourceMappingURL=List.js.map

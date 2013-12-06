/**
* Created by davidatborresen on 03.12.13.
*/
define(["require", "exports"], function(require, exports) {
    ///<reference path='../interfaces/ICollection.ts' />
    ///<reference path='../../definitions/underscore.d.ts' />
    var HashSet = (function () {
        /**
        * @param elements
        */
        function HashSet(elements) {
            if (typeof elements === "undefined") { elements = []; }
            this._elements = elements;
        }
        /**
        * @param value
        * @returns {boolean}
        */
        HashSet.prototype.contains = function (value) {
            return [].indexOf.call(this._elements, value) > -1;
        };

        /**
        * @param value
        */
        HashSet.prototype.add = function (value) {
            if (!this.contains(value)) {
                this._elements.push(value);
            }
        };

        /**
        * @param value
        * @returns {*}
        */
        HashSet.prototype.get = function (value) {
            var index;
            if ((index = [].indexOf.call(this._elements, value)) !== -1) {
                return this._elements[index];
            }

            return void (1);
        };

        HashSet.prototype.forEach = function (callback) {
            this._elements.forEach(callback);
            return this;
        };

        /**
        * @param value
        */
        HashSet.prototype.remove = function (value) {
            var index;
            if ((index = [].indexOf.call(this._elements, value)) !== -1) {
                this._elements.splice(index, 1);
            }
        };

        /**
        * @returns {*[]}
        */
        HashSet.prototype.values = function () {
            return this._elements;
        };

        /**
        * @returns {string}
        */
        HashSet.prototype.toString = function () {
            return '[object HashSet]';
        };
        return HashSet;
    })();
    exports.HashSet = HashSet;
});
//# sourceMappingURL=HashSet.js.map

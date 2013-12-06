/**
* Created by davidatborresen on 03.12.13.
*/
///<reference path='../interfaces/ICollection.ts' />
///<reference path='../../definitions/underscore.d.ts' />
define(["require", "exports"], function(require, exports) {
    var Dictionary = (function () {
        function Dictionary() {
            this._elements = {};
            this._length = 0;
        }
        /**
        * @returns {*[]}
        */
        Dictionary.prototype.values = function () {
            return _.values(this._elements);
        };

        /**
        * @returns {string[]}
        */
        Dictionary.prototype.keys = function () {
            return _.keys(this._elements);
        };

        /**
        * @param collection
        * @returns {boolean}
        */
        Dictionary.prototype.equals = function (collection) {
            return _.isEqual(this, collection);
        };

        /**
        * @returns {SVM.Generic.Dictionary}
        */
        Dictionary.prototype.clone = function () {
            return _.clone(this);
        };

        /**
        * @returns {string}
        */
        Dictionary.prototype.toString = function () {
            return '[object Dictionary]';
        };

        /**
        * @param list IList
        */
        Dictionary.prototype.add = function (list) {
            this._elements[this._length] = list;
            this._length++;
        };

        /**
        * @param value
        * @returns {T[]}
        */
        Dictionary.prototype.get = function (value) {
            return this._filterGet(value).first().value();
        };

        /**
        * @param value
        * @returns {boolean}
        */
        Dictionary.prototype.contains = function (value) {
            return this._filterGet(value).size().value() > 0;
        };

        /**
        * @param value
        * @returns {_Chain}
        * @private
        */
        Dictionary.prototype._filterGet = function (value) {
            return _.chain(this._elements).reject(function (list) {
                return list.contains(value);
            });
        };
        return Dictionary;
    })();
    exports.Dictionary = Dictionary;
});
//# sourceMappingURL=Dictionary.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    /** * Created by davidatborresen on 18.09.13. */
    ///<reference path='../interfaces/ICollection.ts' />
    ///<reference path='../../definitions/underscore.d.ts' />
    ///<reference path='../utils/helpers.ts' />
    (function (Generic) {
        var List = (function () {
            function List(elements) {
                if (typeof elements === "undefined") { elements = []; }
                var _this = this;
                this._elements = [];
                _.map(elements, function (value) {
                    _this.add(value);
                });
            }
            /**         * @param value         * @returns {boolean}         */
            List.prototype.contains = function (value) {
                return _.contains(this._elements, value);
            };

            /**         * @param key         * @param value         */
            List.prototype.add = function (value) {
                this._elements.push(value);
            };

            /**         * @param key         */
            List.prototype.remove = function (value) {
                this._elements = _.without(this._elements, value);
            };

            /**         * @returns {number}         */
            List.prototype.count = function () {
                return _.size(this._elements);
            };

            List.prototype.clear = function () {
                this._elements = [];
            };

            /**         * @returns {string}         */
            List.prototype.toString = function () {
                return '[object List]';
            };
            return List;
        })();
        Generic.List = List;

        var Dictionary = (function () {
            function Dictionary() {
                this._elements = {};
                this._length = 0;
            }
            /**         * @returns {*[]}         */
            Dictionary.prototype.values = function () {
                return _.values(this._elements);
            };

            /**         * @returns {string[]}         */
            Dictionary.prototype.keys = function () {
                return _.keys(this._elements);
            };

            /**         * @param collection         * @returns {boolean}         */
            Dictionary.prototype.equals = function (collection) {
                return _.isEqual(this, collection);
            };

            /**         * @returns {SVM.Generic.Dictionary}         */
            Dictionary.prototype.clone = function () {
                return _.clone(this);
            };

            /**         * @returns {string}         */
            Dictionary.prototype.toString = function () {
                return '[object Dictionary]';
            };

            /**         * @param list IList         */
            Dictionary.prototype.add = function (list) {
                this._elements[this._length] = list;
                this._length++;
            };

            /**         * @param value         * @returns {T[]}         */
            Dictionary.prototype.get = function (value) {
                return this._filterGet(value).first().value();
            };

            /**         * @param value         * @returns {boolean}         */
            Dictionary.prototype.contains = function (value) {
                return this._filterGet(value).size().value() > 0;
            };

            /**         * @param value         * @returns {_Chain}         * @private         */
            Dictionary.prototype._filterGet = function (value) {
                return _.chain(this._elements).reject(function (list) {
                    return list.contains(value);
                });
            };
            return Dictionary;
        })();
        Generic.Dictionary = Dictionary;

        var HashSet = (function () {
            /**         * @param elements         */
            function HashSet(elements) {
                if (typeof elements === "undefined") { elements = []; }
                this._elements = elements;
            }
            /**         * @param value         * @returns {boolean}         */
            HashSet.prototype.contains = function (value) {
                return [].indexOf.call(this._elements, value) > -1;
            };

            /**         * @param value         */
            HashSet.prototype.add = function (value) {
                if (!this.contains(value)) {
                    this._elements.push(value);
                }
            };

            /**         * @param value         * @returns {*}         */
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

            /**         * @param value         */
            HashSet.prototype.remove = function (value) {
                var index;
                if ((index = [].indexOf.call(this._elements, value)) !== -1) {
                    this._elements.splice(index, 1);
                }
            };

            /**         * @returns {*[]}         */
            HashSet.prototype.values = function () {
                return this._elements;
            };

            /**         * @returns {string}         */
            HashSet.prototype.toString = function () {
                return '[object HashSet]';
            };
            return HashSet;
        })();
        Generic.HashSet = HashSet;

        var CachedHashSet = (function (_super) {
            __extends(CachedHashSet, _super);
            function CachedHashSet() {
                _super.apply(this, arguments);
            }
            /**         * @returns {string}         */
            CachedHashSet.prototype.toString = function () {
                return '[object CachedHashSet]';
            };
            return CachedHashSet;
        })(HashSet);
        Generic.CachedHashSet = CachedHashSet;

        var Tuple = (function () {
            /**         * @param components         */
            function Tuple(components) {
                this._components = components;
            }
            Tuple.create = /**         * @param args         * @returns {SVM.Generic.Tuple}         */
            function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return SVM.Util.arrayPopulate(args.length, function () {
                    return args.splice(0, 1);
                });
            };

            /**         * @returns {*[]}         */
            Tuple.prototype.get = function () {
                return this._components;
            };

            /**         * @returns {number}         */
            Tuple.prototype.count = function () {
                return this._components.length;
            };
            return Tuple;
        })();
        Generic.Tuple = Tuple;
    })(SVM.Generic || (SVM.Generic = {}));
    var Generic = SVM.Generic;
})(SVM || (SVM = {}));
//# sourceMappingURL=Generic.js.map

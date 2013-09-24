var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
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
            List.prototype.contains = function (value) {
                return _.contains(this._elements, value);
            };

            List.prototype.add = function (value) {
                this._elements.push(value);
            };

            List.prototype.remove = function (value) {
                this._elements = _.without(this._elements, value);
            };

            List.prototype.count = function () {
                return _.size(this._elements);
            };

            List.prototype.clear = function () {
                this._elements = [];
            };

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
            Dictionary.prototype.values = function () {
                return _.values(this._elements);
            };

            Dictionary.prototype.keys = function () {
                return _.keys(this._elements);
            };

            Dictionary.prototype.equals = function (collection) {
                return _.isEqual(this, collection);
            };

            Dictionary.prototype.clone = function () {
                return _.clone(this);
            };

            Dictionary.prototype.toString = function () {
                return '[object Dictionary]';
            };

            Dictionary.prototype.add = function (list) {
                this._elements[this._length] = list;
                this._length++;
            };

            Dictionary.prototype.get = function (value) {
                return this._filterGet(value).first().value();
            };

            Dictionary.prototype.contains = function (value) {
                return this._filterGet(value).size().value() > 0;
            };

            Dictionary.prototype._filterGet = function (value) {
                return _.chain(this._elements).reject(function (list) {
                    return list.contains(value);
                });
            };
            return Dictionary;
        })();
        Generic.Dictionary = Dictionary;

        var HashSet = (function () {
            function HashSet(elements) {
                if (typeof elements === "undefined") { elements = []; }
                this._elements = elements;
            }
            HashSet.prototype.contains = function (value) {
                return [].indexOf.call(this._elements, value) > -1;
            };

            HashSet.prototype.add = function (value) {
                this._elements.push(value);
            };

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

            HashSet.prototype.remove = function (value) {
                var index;
                if ((index = [].indexOf.call(this._elements, value)) !== -1) {
                    this._elements.splice(index, 1);
                }
            };

            HashSet.prototype.values = function () {
                return this._elements;
            };

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
            CachedHashSet.prototype.toString = function () {
                return '[object CachedHashSet]';
            };
            return CachedHashSet;
        })(HashSet);
        Generic.CachedHashSet = CachedHashSet;

        var Tuple = (function () {
            function Tuple(components) {
                this._components = components;
            }
            Tuple.create = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return SVM.Util.arrayPopulate(args.length, function () {
                    return;
                });
            };

            Tuple.prototype.get = function () {
                return this._components;
            };

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

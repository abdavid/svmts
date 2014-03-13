/**
///<reference path='../interfaces/ICollection.ts' />
///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../utils/Helpers.ts' />
define(["require", "exports", '../utils/Helpers'], function(require, exports, __Util__) {
    var Util = __Util__;

    var Tuple = (function () {
        /**
        function Tuple(components) {
            this._components = components;
        }
        Tuple.create = /**
        function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return Util.arrayPopulate(args.length, function () {
                return args.splice(0, 1);
            });
        };

        /**
        Tuple.prototype.get = function () {
            return this._components;
        };

        /**
        Tuple.prototype.count = function () {
            return this._components.length;
        };
        return Tuple;
    })();
    exports.Tuple = Tuple;
});
//# sourceMappingURL=Tuple.js.map
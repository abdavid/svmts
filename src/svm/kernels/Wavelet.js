///<reference path='../interfaces/IKernel.ts' />
///<reference path='./Base.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, __Kernel__) {
    var Kernel = __Kernel__;

    var Wavelet = (function (_super) {
        __extends(Wavelet, _super);
        /**
        * @param dialation
        * @param translation
        * @param invariant
        */
        function Wavelet(dialation, translation, invariant) {
            if (typeof dialation === "undefined") { dialation = 1.0; }
            if (typeof translation === "undefined") { translation = 1.0; }
            if (typeof invariant === "undefined") { invariant = false; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'dialation',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'translation',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'invariant',
                    type: Kernel.PropertyType.BOOLEAN,
                    writable: true
                }
            ];

            this.dialation = dialation;
            this.translation = translation;
            this.invariant = invariant;
        }
        Object.defineProperty(Wavelet.prototype, "dialation", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._dialation;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._dialation = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Wavelet.prototype, "translation", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._translation;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._translation = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Wavelet.prototype, "invariant", {
            get: /**
            * @returns {boolean}
            */
            function () {
                return this._invariant;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._invariant = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * @param x
        * @param y
        * @returns {number}
        */
        Wavelet.prototype.run = function (x, y) {
            var prod = 1.0;

            if (this.invariant) {
                for (var i = 0; i < x.length; i++) {
                    prod *= (this.mother((x[i] - this.translation) / this.dialation)) * (this.mother((y[i] - this.translation) / this.dialation));
                }
            } else {
                for (var i = 0; i < x.length; i++) {
                    prod *= this.mother((x[i] - y[i] / this.dialation));
                }
            }

            return prod;
        };

        /**
        * @param x
        * @returns {number}
        */
        Wavelet.prototype.mother = function (x) {
            return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
        };
        return Wavelet;
    })(Kernel.Base);
    exports.Wavelet = Wavelet;
});
//# sourceMappingURL=Wavelet.js.map

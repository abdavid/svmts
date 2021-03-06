/**
* Created by davidatborresen on 9/3/13.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Base'], function(require, exports, __Kernel__) {
    ///<reference path='./Base.ts' />
    var Kernel = __Kernel__;

    /**
    * @class Bessel
    * @link http://en.wikipedia.org/wiki/Bessel_function
    *
    * @summary
    * Bessel's equation arises when finding separable solutions to Laplace's equation and the Helmholtz equation in cylindrical or spherical coordinates.
    * Bessel functions are therefore especially important for many problems of wave propagation and static potentials.
    * In solving problems in cylindrical coordinate systems, one obtains Bessel functions of integer order (α = n); in spherical problems,
    * one obtains half-integer orders (α = n+1/2).
    *
    * @problems
    * Electromagnetic waves in a cylindrical waveguide
    * Pressure amplitudes of inviscid rotational flows
    * Heat conduction in a cylindrical object
    * Modes of vibration of a thin circular (or annular) artificial membrane (such as a drum or other membranophone)
    * Diffusion problems on a lattice
    * Solutions to the radial Schrödinger equation (in spherical and cylindrical coordinates) for a free particle
    * Solving for patterns of acoustical radiation
    * Frequency-dependent friction in circular pipelines
    * Bessel functions also appear in other problems, such as signal processing (e.g., see FM synthesis, Kaiser window, or Bessel filter).
    */
    var Bessel = (function (_super) {
        __extends(Bessel, _super);
        /**
        * @param sigma {number}
        * @param order {number}
        */
        function Bessel(sigma, order) {
            if (typeof sigma === "undefined") { sigma = 1; }
            if (typeof order === "undefined") { order = 1; }
            _super.call(this);
            this.attributes = [
                {
                    name: 'order',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                },
                {
                    name: 'sigma',
                    type: Kernel.PropertyType.NUMBER,
                    writable: true
                }
            ];

            this.sigma = sigma;
            this.order = order;

            this.baseBessel = new BesselHelper();
        }
        Object.defineProperty(Bessel.prototype, "sigma", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._sigma;
            },
            set: /**
            * @param value
            */
            function (value) {
                this._sigma = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Bessel.prototype, "order", {
            get: /**
            * @returns {number}
            */
            function () {
                return this._order;
            },
            set: /**
            * @param value {number}
            */
            function (value) {
                this._order = value;
            },
            enumerable: true,
            configurable: true
        });


        /**
        * @param x {number[]}
        * @param y {number[]}
        * @returns {number}
        */
        Bessel.prototype.run = function (x, y) {
            var norm = 0.0;
            for (var i = 0; i < x.length; i++) {
                var d = x[i] - y[i];
                norm += d * d;
            }

            norm = Math.sqrt(norm);

            return this.baseBessel.J(this.order, this.sigma * norm) / Math.pow(norm, -norm * this.order);
        };
        return Bessel;
    })(Kernel.Base);
    exports.Bessel = Bessel;

    var BesselHelper = (function () {
        function BesselHelper() {
        }
        /**
        * Bessel function of order 0.
        * @param x
        * @returns {number}
        * @constructor
        */
        BesselHelper.prototype.J0 = function (x) {
            var ax = Math.abs(x);

            if (ax < 8.0) {
                var y = x * x;
                var ans1 = 57568490574.0 + y * (-13362590354.0 + y * (651619640.7 + y * (-11214424.18 + y * (77392.33017 + y * (-184.9052456)))));
                var ans2 = 57568490411.0 + y * (1029532985.0 + y * (9494680.718 + y * (59272.64853 + y * (267.8532712 + y * 1.0))));

                return ans1 / ans2;
            } else {
                var z = 8.0 / ax;
                var y = z * z;
                var xx = ax - 0.785398164;
                var ans1 = 1.0 + y * (-0.1098628627e-2 + y * (0.2734510407e-4 + y * (-0.2073370639e-5 + y * 0.2093887211e-6)));
                var ans2 = -0.1562499995e-1 + y * (0.1430488765e-3 + y * (-0.6911147651e-5 + y * (0.7621095161e-6 - y * 0.934935152e-7)));

                return Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
            }
        };

        /**
        * Bessel function of order 1.
        * @param x
        * @constructor
        */
        BesselHelper.prototype.J1 = function (x) {
            var ax = Math.abs(x), y, ans1, ans2;

            if (ax < 8.0) {
                y = x * x;
                ans1 = x * (72362614232.0 + y * (-7895059235.0 + y * (242396853.1 + y * (-2972611.439 + y * (15704.48260 + y * (-30.16036606))))));
                ans2 = 144725228442.0 + y * (2300535178.0 + y * (18583304.74 + y * (99447.43394 + y * (376.9991397 + y * 1.0))));
                return ans1 / ans2;
            } else {
                var z = 8.0 / ax;
                var xx = ax - 2.356194491;
                y = z * z;

                ans1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 + y * (0.2457520174e-5 + y * (-0.240337019e-6))));
                ans2 = 0.04687499995 + y * (-0.2002690873e-3 + y * (0.8449199096e-5 + y * (-0.88228987e-6 + y * 0.105787412e-6)));
                var ans = Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
                if (x < 0.0) {
                    ans = -ans;
                }
                return ans;
            }
        };

        BesselHelper.prototype.J = function (n, x) {
            var j, m;
            var ax, bj, bjm, bjp, sum, tox, ans;
            var jsum;

            var ACC = 40.0;
            var BIGNO = 1.0e+10;
            var BIGNI = 1.0e-10;

            if (n == 0) {
                return this.J0(x);
            }
            if (n == 1) {
                return this.J1(x);
            }

            ax = Math.abs(x);
            if (ax == 0.0) {
                return 0.0;
            } else if (ax > n) {
                tox = 2.0 / ax;
                bjm = this.J0(ax);
                bj = this.J1(ax);
                for (j = 1; j < n; j++) {
                    bjp = j * tox * bj - bjm;
                    bjm = bj;
                    bj = bjp;
                }
                ans = bj;
            } else {
                tox = 2.0 / ax;
                m = 2 * ((n + Math.sqrt(ACC * n)) / 2);
                jsum = false;
                bjp = ans = sum = 0.0;
                bj = 1.0;
                for (j = m; j > 0; j--) {
                    bjm = j * tox * bj - bjp;
                    bjp = bj;
                    bj = bjm;
                    if (Math.abs(bj) > BIGNO) {
                        bj *= BIGNI;
                        bjp *= BIGNI;
                        ans *= BIGNI;
                        sum *= BIGNI;
                    }
                    if (jsum) {
                        sum += bj;
                    }
                    jsum = !jsum;
                    if (j == n) {
                        ans = bjp;
                    }
                }
                sum = 2.0 * sum - bj;
                ans /= sum;
            }

            return x < 0.0 && n % 2 == 1 ? -ans : ans;
        };
        return BesselHelper;
    })();
});
//# sourceMappingURL=Bessel.js.map

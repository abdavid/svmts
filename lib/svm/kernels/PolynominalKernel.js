/**
* Created by davidatborresen on 9/3/13.
*/
///<reference path='./IKernel.ts' />
var PolynominalKernel = (function () {
    function PolynominalKernel(degree, constant) {
        if (typeof constant === "undefined") { constant = 1.0; }
        this.degree = degree;
        this.constant = constant;
    }
    /**
    * Polynomial kernel function.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Dot product in feature (kernel) space
    */
    PolynominalKernel.prototype.kernel = function (x, y) {
        var sum = this.constant;
        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return Math.pow(sum, this.degree);
    };

    /**
    * Computes the distance in input space
    * between two points given in feature space.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Distance between x and y in input space.
    */
    PolynominalKernel.prototype.distance = function (x, y) {
        var q = 1.0 / this.degree;

        return Math.pow(this.kernel(x, x), q) + Math.pow(this.kernel(y, y), q) - 2.0 * Math.pow(this.kernel(x, y), q);
    };
    return PolynominalKernel;
})();
//# sourceMappingURL=PolynominalKernel.js.map

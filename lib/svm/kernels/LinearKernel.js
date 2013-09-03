/**
* Created by davidatborresen on 9/3/13.
*/
///<reference path='./IKernel.ts' />
var LinearKernel = (function () {
    function LinearKernel(constant) {
        if (typeof constant === "undefined") { constant = 1; }
        this.constant = constant;
    }
    /**
    * Linear kernel function.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Dot product in feature (kernel) space
    */
    LinearKernel.prototype.kernel = function (x, y) {
        var sum = this.constant;

        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }

        return sum;
    };

    /**
    * Computes the distance in input space
    * between two points given in feature space.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Distance between x and y in input space.
    */
    LinearKernel.prototype.distance = function (x, y) {
        return this.kernel(x, x) + this.kernel(y, y) - 2.0 * this.kernel(x, y);
    };
    return LinearKernel;
})();
//# sourceMappingURL=LinearKernel.js.map

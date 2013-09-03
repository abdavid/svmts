/**
* Created by davidatborresen on 9/3/13.
*/
///<reference path='./IKernel.ts' />
/**
* @class SigmoidKernel
* Sigmoid kernel of the form k(x,z) = tanh(a * x'z + c).
* Sigmoid kernels are only conditionally positive definite for some values of a and c,
* and therefore may not induce a reproducing kernel Hilbert space. However, they have been successfully
* used in practice (Scholkopf and Smola, 2002).
*
* @TODO add estimation function for initialization of kernel correctly.
*/
var SigmoidKernel = (function () {
    function SigmoidKernel(alpha, constant) {
        if (typeof alpha === "undefined") { alpha = 0.01; }
        if (typeof constant === "undefined") { constant = -Math.E; }
        this.alpha = alpha;
        this.constant = constant;
    }
    /**
    * Sigmoid kernel function.
    *
    * @param x Vector X in input space
    * @param y Vector Y in input space
    * @returns {number} Dot product in feature (kernel) space
    */
    SigmoidKernel.prototype.kernel = function (x, y) {
        var sum = 0.0;

        for (var i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }

        return this.tanh(this.alpha * sum + this.constant);
    };

    /**
    * TanH function.
    *
    * @todo review this. FF14 apparently handles this poorly,
    * while chrome handles it just fine.
    *
    * @param arg
    * @returns {number}
    */
    SigmoidKernel.prototype.tanh = function (arg) {
        var pos = Math.exp(arg), neg = Math.exp(-arg);

        return (pos - neg) / (pos + neg);
    };
    return SigmoidKernel;
})();
//# sourceMappingURL=SigmoidKernel.js.map

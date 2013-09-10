var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KernelSupportVectorMachine = (function (_super) {
    __extends(KernelSupportVectorMachine, _super);
    function KernelSupportVectorMachine(kernel, inputs) {
        if (typeof kernel === "undefined") { kernel = null; }
        if (typeof inputs === "undefined") { inputs = null; }
        _super.call(this, inputs);

        if (kernel === null) {
            throw new Error('No kernel specified. Please select a kernel to use.');
        }

        this.setKernel(kernel);
    }
    KernelSupportVectorMachine.prototype.setKernel = function (kernel) {
        this.kernel = kernel;
    };

    KernelSupportVectorMachine.prototype.getKernel = function () {
        return this.kernel;
    };

    KernelSupportVectorMachine.prototype.compute = function (inputs) {
        var output = this.getThreshold();

        var weights = this.getWeights();
        if (this.isCompact()) {
            for (var i = 0; i < weights.length; i++) {
                output += weights[i] * inputs[i];
            }
        } else {
            var supportVectors = this.getSupportVectors();
            for (var i = 0; i < supportVectors.length; i++) {
                output += weights[i] * this.kernel.run(supportVectors[i], inputs);
            }
        }

        return output >= 0 ? 1 : -1;
    };
    return KernelSupportVectorMachine;
})(SupportVectorMachine);
//# sourceMappingURL=KernelSupportVectorMachine.js.map

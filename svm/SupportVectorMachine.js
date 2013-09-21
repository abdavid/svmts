var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Engine) {
        var SupportVectorMachine = (function () {
            function SupportVectorMachine(inputs) {
                this.inputCount = inputs;
            }
            SupportVectorMachine.prototype.getInputCount = function () {
                return this.inputCount;
            };

            SupportVectorMachine.prototype.isProbabilistic = function () {
                return false;
            };

            SupportVectorMachine.prototype.isCompact = function () {
                return this.supportVectors === null;
            };

            SupportVectorMachine.prototype.getSupportVectors = function () {
                return this.supportVectors;
            };

            SupportVectorMachine.prototype.getSupportVector = function (index) {
                return this.supportVectors[index];
            };

            SupportVectorMachine.prototype.setSupportVectors = function (value) {
                this.supportVectors = value;
            };

            SupportVectorMachine.prototype.setSupportVector = function (index, value) {
                this.supportVectors[index] = value;
            };

            SupportVectorMachine.prototype.setWeight = function (index, value) {
                this.weights[index] = value;
            };

            SupportVectorMachine.prototype.getWeight = function (index) {
                return this.weights[index];
            };

            SupportVectorMachine.prototype.setWeights = function (value) {
                this.weights = value;
            };

            SupportVectorMachine.prototype.getWeights = function () {
                return this.weights;
            };

            SupportVectorMachine.prototype.setThreshold = function (value) {
                this.threshold = value;
            };

            SupportVectorMachine.prototype.getThreshold = function () {
                return this.threshold;
            };

            SupportVectorMachine.prototype.compute = function (inputs, output) {
                if (typeof output === "undefined") { output = 0; }
                output = this.threshold;

                if (this.supportVectors === null) {
                    for (var i = 0; i < this.weights.length; i++) {
                        output += this.weights[i] * inputs[i];
                    }
                } else {
                    for (var i = 0; i < this.supportVectors.length; i++) {
                        var sum = 0;
                        for (var j = 0; j < inputs.length; j++) {
                            sum += this.supportVectors[i][j] * inputs[j];
                        }

                        output += this.weights[i] * sum;
                    }
                }

                return !isNaN(output) && output >= 0 ? 1 : -1;
            };

            SupportVectorMachine.prototype.getKernel = function () {
                return new SVM.Kernels.LinearKernel();
            };

            SupportVectorMachine.prototype.toJSON = function () {
                return JSON.stringify({
                    supportVectors: this.getSupportVectors(),
                    weights: this.getWeights(),
                    inputCount: this.getInputCount(),
                    threshold: this.getThreshold()
                });
            };
            return SupportVectorMachine;
        })();
        Engine.SupportVectorMachine = SupportVectorMachine;

        var KernelSupportVectorMachine = (function (_super) {
            __extends(KernelSupportVectorMachine, _super);
            function KernelSupportVectorMachine(kernel, inputs) {
                if (typeof kernel === "undefined") { kernel = null; }
                if (typeof inputs === "undefined") { inputs = 0; }
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

                return !isNaN(output) && output >= 0 ? 1 : -1;
            };
            return KernelSupportVectorMachine;
        })(SupportVectorMachine);
        Engine.KernelSupportVectorMachine = KernelSupportVectorMachine;
    })(SVM.Engine || (SVM.Engine = {}));
    var Engine = SVM.Engine;
})(SVM || (SVM = {}));
//# sourceMappingURL=SupportVectorMachine.js.map

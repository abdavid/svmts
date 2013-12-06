/**
* Created by davidatborresen on 03.12.13.
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './SupportVectorMachine'], function(require, exports, __Engine__) {
    ///<reference path='../interfaces/IKernel.ts' />
    var Engine = __Engine__;

    var KernelSupportVectorMachine = (function (_super) {
        __extends(KernelSupportVectorMachine, _super);
        /**
        * Creates a new Kernel Support Vector Machine.
        * @param kernel The chosen kernel for the machine.
        * @param inputs The number of inputs for the machine
        *
        * @remark If the number of inputs is zero, this means the machine
        * accepts a indefinite number of inputs. This is often the
        * case for kernel vector machines using a sequence kernel.
        */
        function KernelSupportVectorMachine(kernel, inputs) {
            if (typeof kernel === "undefined") { kernel = null; }
            if (typeof inputs === "undefined") { inputs = 0; }
            _super.call(this, inputs);

            if (kernel === null) {
                throw new Error('No kernel specified. Please select a kernel to use.');
            }

            this.setKernel(kernel);
        }
        /**
        *  Sets the kernel used by this machine.
        * @param kernel
        */
        KernelSupportVectorMachine.prototype.setKernel = function (kernel) {
            this.kernel = kernel;
        };

        /**
        *  Gets the kernel used by this machine.
        * @returns {IKernel}
        */
        KernelSupportVectorMachine.prototype.getKernel = function () {
            return this.kernel;
        };

        /**
        * @param inputs
        * @returns {number}
        */
        KernelSupportVectorMachine.prototype.compute = function (inputs) {
            var output = this.getThreshold();

            if (this.isCompact()) {
                for (var i = 0; i < this.weights.length; i++) {
                    output += this.getWeight(i) * inputs[i];
                }
            } else {
                for (var i = 0; i < this.supportVectors.length; i++) {
                    output += this.getWeight(i) * this.kernel.run(this.getSupportVector(i), inputs);
                }
            }

            return !isNaN(output) && output >= 0 ? 1 : -1;
        };
        return KernelSupportVectorMachine;
    })(Engine.SupportVectorMachine);
    exports.KernelSupportVectorMachine = KernelSupportVectorMachine;
});
//# sourceMappingURL=KernelSupportVectorMachine.js.map

var SVM;
(function (SVM) {
    (function (Learning) {
        var MulticlassSupportVectorLearning = (function () {
            function MulticlassSupportVectorLearning(machine, inputs, outputs) {
                if (!machine) {
                    throw new Error('Missing machine argument');
                }

                if (!inputs || !outputs) {
                    throw new Error('Missing arguments');
                }

                if (inputs.length != outputs.length) {
                    throw new Error("The number of input vectors and output labels does not match.");
                }

                if (machine.getInputs() > 0) {
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs.length !== machine.getInputs()) {
                            throw new Error("The size of the input vector at index " + i + " does not match the expected number of inputs of the machine." + " All input vectors for this machine must have length " + machine.getInputs());
                        }
                    }
                }

                for (var i = 0; i < outputs.length; i++) {
                    if (outputs[i] < 0 || outputs[i] >= machine.getClasses()) {
                        throw new Error("The output value at index " + i + " is outside the expected class range" + " All output values must be higher than or equal to 0 and less than " + machine.getClasses());
                    }
                }

                this.machine = machine;
                this.inputs = inputs;
                this.outputs = outputs;
            }
            return MulticlassSupportVectorLearning;
        })();
        Learning.MulticlassSupportVectorLearning = MulticlassSupportVectorLearning;
    })(SVM.Learning || (SVM.Learning = {}));
    var Learning = SVM.Learning;
})(SVM || (SVM = {}));
//# sourceMappingURL=MulticlassSupportVectorLearning.js.map

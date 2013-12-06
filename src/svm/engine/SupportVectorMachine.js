/**
* Created by davidatborresen on 03.12.13.
*/
define(["require", "exports"], function(require, exports) {
    /**
    * @summary
    * Sparse Linear Support Vector Machine (SVM)
    *
    * @remark
    * Support vector machines (SVMs) are a set of related supervised learning methods
    * used for classification and regression. In simple words, given a set of training
    * examples, each marked as belonging to one of two categories, a SVM training algorithm
    * builds a model that predicts whether a new example falls into one category or the other.
    *
    * Intuitively, an SVM model is a representation of the examples as points in space,
    * mapped so that the examples of the separate categories are divided by a clear gap
    * that is as wide as possible. New examples are then mapped into that same space and
    * predicted to belong to a category based on which side of the gap they fall on.
    *
    * @references:
    *  - http://en.wikipedia.org/wiki/Support_vector_machine
    *
    * @example AND problem
    *
    *  var inputs =
    *  [
    *      [0,0] //0 and 0: 0 (label -1)
    *      [0,1] //0 and 1: 0 (label -1)
    *      [1,0] //1 and 0: 0 (label -1)
    *      [1,1] //1 and 1: 1 (label 1)
    *  ];
    *
    *  var labels =
    *  [
    *      //0, 0, 0, 1
    *      -1, -1, -1, 1
    *  ];
    *
    *  // Create a Support Vector Machine for the given inputs
    *  var machine = new SupportVectorMachine(inputs[0].length);
    *
    *  // Instantiate a new learning algorithm for SVMs
    *  var smo = new SequentialMinimalOptimization(machine, inputs, labels);
    *
    *  // Set up the learning algorithm
    *  smo.setComplexity(1.0);
    *
    *  // Run the learning algorithm
    *  var error = smo.run();
    *
    *  // Compute the decision output for one of the input vectors
    *  var decision = svm.compute(inputs[0]);
    *
    */
    var SupportVectorMachine = (function () {
        /**
        * @param inputs
        */
        function SupportVectorMachine(inputs) {
            this.inputCount = inputs;
        }
        /**
        * @returns {number}
        */
        SupportVectorMachine.prototype.getInputCount = function () {
            return this.inputCount;
        };

        /**
        * @returns {boolean}
        */
        SupportVectorMachine.prototype.isProbabilistic = function () {
            return false;
        };

        /**
        * @returns {boolean}
        */
        SupportVectorMachine.prototype.isCompact = function () {
            return this.supportVectors === null;
        };

        /**
        * @returns {number[][]}
        */
        SupportVectorMachine.prototype.getSupportVectors = function () {
            return this.supportVectors;
        };

        /**
        * @param index
        * @returns {number[]}
        */
        SupportVectorMachine.prototype.getSupportVector = function (index) {
            return this.supportVectors[index];
        };

        /**
        * @param value
        */
        SupportVectorMachine.prototype.setSupportVectors = function (value) {
            this.supportVectors = value;
        };

        /**
        * @param index
        * @param value
        */
        SupportVectorMachine.prototype.setSupportVector = function (index, value) {
            this.supportVectors[index] = value;
        };

        /**
        * @param index
        * @param value
        */
        SupportVectorMachine.prototype.setWeight = function (index, value) {
            this.weights[index] = value;
        };

        /**
        * @param index
        * @param value
        */
        SupportVectorMachine.prototype.getWeight = function (index) {
            return this.weights[index];
        };

        /**
        * Sets the collection of weights used by this machine.
        * @param value
        */
        SupportVectorMachine.prototype.setWeights = function (value) {
            this.weights = value;
        };

        /**
        * Gets the collection of weights used by this machine.
        * @returns {number[]}
        */
        SupportVectorMachine.prototype.getWeights = function () {
            return this.weights;
        };

        /**
        * Sets the threshold (bias) term for this machine.
        * @param value
        */
        SupportVectorMachine.prototype.setThreshold = function (value) {
            this.threshold = value;
        };

        /**
        * Gets the threshold (bias) term for this machine.
        * @returns {number}
        */
        SupportVectorMachine.prototype.getThreshold = function () {
            return this.threshold;
        };

        /**
        * @summary Computes the given input to produce the corresponding output.
        *
        * @remark For a binary decision problem, the decision for the negative
        * or positive class is typically computed by taking the sign of
        * the machine's output.
        *
        * @param inputs An input vector.
        * @param output The output of the machine.
        * If this is a probabilistic machine, the
        * output is the probability of the positive class. If this is
        * a standard machine, the output is the distance to the decision
        * hyperplane in feature space.
        *
        * @returns {number}
        */
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

        /**
        * @returns {LinearKernel}
        */
        SupportVectorMachine.prototype.getKernel = function () {
            return new SVM.Kernels.LinearKernel();
        };

        /**
        * @returns {string}
        */
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
    exports.SupportVectorMachine = SupportVectorMachine;
});
//# sourceMappingURL=SupportVectorMachine.js.map

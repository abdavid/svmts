var SupportVectorMachine = (function () {
    function SupportVectorMachine(inputs) {
        this.supportVectors = null;
        this.weights = null;
        this.inputCount = null;
        this.threshold = null;
        this.linkFunction = null;
        this.inputCount = inputs;
    }
    SupportVectorMachine.prototype.getInputCount = function () {
        return this.inputCount;
    };

    SupportVectorMachine.prototype.link = function () {
        return {};
    };

    SupportVectorMachine.prototype.isProbabilistic = function () {
        return this.linkFunction !== null;
    };

    SupportVectorMachine.prototype.isCompact = function () {
        return this.supportVectors === null;
    };

    SupportVectorMachine.prototype.getSupportVectors = function () {
        return this.supportVectors;
    };

    SupportVectorMachine.prototype.setSupportVectors = function (value) {
        this.supportVectors = value;
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

    SupportVectorMachine.prototype.compute = function (inputs) {
        var output = this.threshold;

        if (this.supportVectors === null) {
            for (var i = 0; i < this.weights.length; i++) {
                output += this.weights[i] * inputs[i];
            }
        } else {
            for (var i = 0; i < this.supportVectors.length; i++) {
                var sum = 0;
                for (var j = 0; j < inputs.length; j++) {
                    sum += this.supportVectors[i][j] * inputs[j];
                    output += this.weights[i] * sum;
                }
            }
        }

        if (this.isProbabilistic()) {
        }

        return output >= 0 ? 1 : -1;
    };
    return SupportVectorMachine;
})();
//# sourceMappingURL=SupportVectorMachine.js.map

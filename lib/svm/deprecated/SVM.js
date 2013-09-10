/**
* Created by davidatborresen on 8/31/13.
*/
///<reference path='../../../definitions/underscore.d.ts' />
var SVM = (function () {
    /**
    * @param options
    */
    function SVM(options) {
        this.setOptions(options);
    }
    /**
    * @param options
    */
    SVM.prototype.setOptions = function (options) {
        this.options = _.extend(this.getDefaultOptions(), options);
    };

    /**
    * @param data
    * @param labels
    * @param options
    */
    SVM.prototype.train = function (data, labels) {
        this.data = data;
        this.labels = labels;

        //        this.options = <SVMOptions>_.extend(this.getDefaultOptions(), options);
        this.N = data.length;
        this.D = data[0].length;
        this.alpha = this.zeros(this.N);
        this.bias = 0.0;
        this.useWeights = false;

        this.setupKernel();

        // run SMO algorithm
        var numIterations = this.runSMO();

        if (this.options.kernelType === SVM.kernelLinear) {
            this.updateWeights();
        } else {
            /**
            * okay, we need to retain all the support vectors in the training data,
            * we can't just get away with computing the weights and throwing it out
            *
            * But! We only need to store the support vectors for evaluation of testing
            * instances. So filter here based on this.alpha[i]. The training data
            * for which this.alpha[i] = 0 is irrelevant for future.
            */
            var newdata = [], newlabels = [], newalpha = [];

            for (var i = 0; i < this.N; i++) {
                if (this.alpha[i] > this.options.alphaTol) {
                    newdata.push(this.data[i]);
                    newlabels.push(this.labels[i]);
                    newalpha.push(this.alpha[i]);
                }
            }

            this.data = newdata;
            this.labels = newlabels;
            this.alpha = newalpha;
            this.N = this.data.length;
        }

        return {
            iterations: numIterations
        };
    };

    SVM.prototype.predictOne = function (inst) {
        return this.marginOne(inst) > 0 ? 1 : -1;
    };

    /**
    * Data is a {@link this.N}x{@link this.D} array. Returns array of 1 or -1, predictions
    * @param data
    * @returns {number[]}
    */
    SVM.prototype.predict = function (data) {
        var margs = this.margins(data);

        for (var i = 0; i < margs.length; i++) {
            margs[i] = margs[i] > 0 ? 1 : -1;
        }

        return margs;
    };

    /**
    * THIS FUNCTION IS NOW DEPRECATED. WORKS FINE BUT NO NEED TO USE ANYMORE.
    * LEAVING IT HERE JUST FOR BACKWARDS COMPATIBILITY FOR A WHILE.
    * if we trained a linear svm, it is possible to calculate just the weights and the offset
    * prediction is then yhat = sign(X * w + b)
    *
    * @returns {{weights: Array, bias: number}}
    */
    SVM.prototype.getWeights = function () {
        var w = new Array(this.D);
        for (var j = 0; j < this.D; j++) {
            var s = 0.0;
            for (var i = 0; i < this.N; i++) {
                s += this.alpha[i] * this.labels[i] * this.data[i][j];
            }
            w[j] = s;
        }

        return {
            weights: w,
            bias: this.bias
        };
    };

    SVM.prototype.setupKernel = function () {
        var self = this, kernelMethod;

        switch (this.options.kernelType) {
            case SVM.kernelRBF:
                kernelMethod = this.createRbfKernel(this.options.rbfSigma);
                break;

            case SVM.kernelPoly:
                kernelMethod = this.createPolyKernel(2);
                break;

            case SVM.kernelLinear:
                kernelMethod = this.linearKernel;
                break;

            default:
                this.options.kernelType = SVM.kernelCustom;
                kernelMethod = this.options.kernel;
                break;
        }

        if (this.options.memoize) {
            this.kernel = _.memoize(function (i, j) {
                return kernelMethod(this.data[i], this.data[j]);
            }, function (i, j) {
                return i + '//' + j + '//' + self.options.kernelType;
            });
        } else {
            this.kernel = kernelMethod;
        }
    };

    /**
    * @ref1 if the linear kernel was used and {@link this.weights} was computed and stored, (i.e. the svm has fully finished training)
    * the internal class variable {@link this.useWeights} will be set to true.
    *
    * @ref2 we can speed this up a lot by using the computed weights,
    * we computed these during train(). This is significantly faster than the version below
    *
    * @param inst is an array of length D. Returns margin of given example,
    * this is the core prediction function. All others are for convenience mostly and end up calling this one somehow.
    *
    * @returns {number}
    */
    SVM.prototype.marginOne = function (inst) {
        var f = this.bias;

        if (this.useWeights) {
            for (var j = 0; j < this.D; j++) {
                f += inst[j] * this.weights[j];
            }
        } else {
            for (var i = 0; i < this.N; i++) {
                f += this.alpha[i] * this.labels[i] * this.kernel(inst, this.data[i]);
            }
        }

        return f;
    };

    /**
    * Go over support vectors and accumulate the prediction.
    * @param data
    * @returns {Array}
    */
    SVM.prototype.margins = function (data) {
        var N = data.length, margins = new Array(N);

        for (var i = 0; i < N; i++) {
            margins[i] = this.marginOne(data[i]);
        }

        return margins;
    };

    /**
    * This is a binary SVM and is trained using the SMO algorithm.
    * Reference: "The Simplified SMO Algorithm" (http://math.unt.edu/~hsp0009/smo.pdf)
    */
    SVM.prototype.runSMO = function () {
        var numIterations = 0, numPasses = 0;

        while (numPasses < this.options.numPasses && numIterations < this.options.maxIterations) {
            var alphaChanged = 0;
            for (var i = 0; i < this.N; i++) {
                var Ei = this.marginOne(this.data[i]) - this.labels[i], A = (this.labels[i] * Ei < -this.options.tol && this.alpha[i] < this.options.C), B = (this.labels[i] * Ei > this.options.tol && this.alpha[i] > 0), Ej;

                if (A || B) {
                    // alpha_i needs updating! Pick a j to update it with
                    var j = i;
                    while (j === i) {
                        j = this.randomInteger(0, this.N);
                    }

                    Ej = this.marginOne(this.data[j]) - this.labels[j];

                    // calculate L and H bounds for j to ensure we're in [0 C]x[0 C] box
                    var alphaI = this.alpha[i], alphaJ = this.alpha[j];

                    var L = 0, H = this.options.C;

                    if (this.labels[i] === this.labels[j]) {
                        L = Math.max(0, alphaI + alphaJ - this.options.C);
                        H = Math.min(this.options.C, alphaI + alphaJ);
                    } else {
                        L = Math.max(0, alphaJ - alphaI);
                        H = Math.min(this.options.C, this.options.C + alphaJ - alphaI);
                    }

                    if (Math.abs(L - H) < 1e-4) {
                        continue;
                    }

                    var eta = 2 * this.kernelResult(i, j) - this.kernelResult(i, i) - this.kernelResult(j, j);
                    if (eta >= 0) {
                        continue;
                    }

                    // compute new alphaJ and clip it inside [0 C]x[0 C] box
                    // then compute alphaI based on it.
                    var newAlphaJ = alphaJ - this.labels[j] * (Ei - Ej) / eta;

                    if (newAlphaJ > H) {
                        newAlphaJ = H;
                    }
                    if (newAlphaJ < L) {
                        newAlphaJ = L;
                    }
                    if (Math.abs(alphaJ - newAlphaJ) < 1e-4) {
                        continue;
                    }

                    this.alpha[j] = newAlphaJ;

                    var newAlphaI = alphaI + this.labels[i] * this.labels[j] * (alphaJ - newAlphaJ);

                    this.alpha[i] = newAlphaI;

                    // update the bias term
                    var biasA = this.bias - Ei - this.labels[i] * (newAlphaI - alphaI) * this.kernelResult(i, i) - this.labels[j] * (newAlphaJ - alphaJ) * this.kernelResult(i, j), biasB = this.bias - Ej - this.labels[i] * (newAlphaI - alphaI) * this.kernelResult(i, j) - this.labels[j] * (newAlphaJ - alphaJ) * this.kernelResult(j, j);

                    this.bias = 0.5 * (biasA + biasB);

                    if (newAlphaI > 0 && newAlphaI < this.options.C) {
                        this.bias = biasA;
                    }
                    if (newAlphaJ > 0 && newAlphaJ < this.options.C) {
                        this.bias = biasB;
                    }

                    alphaChanged++;
                }
            }

            numIterations++;

            if (alphaChanged == 0) {
                numPasses++;
            } else {
                numPasses = 0;
            }
        }

        return numIterations;
    };

    /**
    * compute weights and store them
    */
    SVM.prototype.updateWeights = function () {
        this.weights = new Array(this.D);

        for (var j = 0; j < this.D; j++) {
            var s = 0.0;
            for (var i = 0; i < this.N; i++) {
                s += this.alpha[i] * this.labels[i] * this.data[i][j];
            }

            this.weights[j] = s;

            this.useWeights = true;
        }
    };

    /**
    * @returns {{kernel: string, rbfsigma: number, C: number, tol: number, alphatol: number, maxiter: number, numpasses: number}}
    */
    SVM.prototype.getDefaultOptions = function () {
        return {
            kernelType: 'rbf',
            rbfSigma: 0.5,
            C: 1.0,
            tol: 1e-4,
            alphaTol: 1e-7,
            maxIterations: 10000,
            numPasses: 10,
            memoize: false
        };
    };

    /**
    * @param vectorA
    * @param vectorB
    * @returns {number}
    */
    SVM.prototype.linearKernel = function (vectorA, vectorB) {
        var s = 0;
        for (var q = 0; q < vectorA.length; q++) {
            s += vectorA[q] * vectorB[q];
        }
        return s;
    };

    /**
    * @param sigma
    * @returns {function(*, *): number}
    */
    SVM.prototype.createRbfKernel = function (sigma) {
        return function rbfKernel(vectorA, vectorB) {
            var s = 0;
            for (var q = 0; q < vectorA.length; q++) {
                s += (vectorA[q] - vectorB[q]) * (vectorA[q] - vectorB[q]);
            }
            return Math.exp(-s / (2.0 * sigma * sigma));
        };
    };

    /**
    * Polynominal kernel
    * http://en.wikipedia.org/wiki/Polynomial_kernel
    * @param degree
    * @returns {function(number[], number[]): number}
    */
    SVM.prototype.createPolyKernel = function (degree) {
        if (typeof degree === "undefined") { degree = 2; }
        var self = this;
        return function polyKernel(vectorA, vectorB) {
            var sum = self.options.C;
            for (var q = 0; q < vectorA.length; q++) {
                sum += (vectorA[q] * vectorB[q]);
            }

            return Math.pow(sum, degree);
        };
    };

    /**
    * @param i
    * @param j
    * @returns {*}
    */
    SVM.prototype.kernelResult = function (i, j) {
        return this.kernel(this.data[i], this.data[j]);
    };

    /**
    * @param delta
    * @returns {Array}
    */
    SVM.prototype.zeros = function (delta) {
        var vector = new Array(delta);
        for (var i = 0; i < delta; i++) {
            vector[i] = 0;
        }
        return vector;
    };

    /**
    * @param a
    * @param b
    * @returns {number}
    */
    SVM.prototype.randomInteger = function (a, b) {
        return Math.floor(Math.random() * (b - a) + a);
    };
    SVM.kernelRBF = 'rbf';
    SVM.kernelPoly = 'poly';
    SVM.kernelLinear = 'linear';
    SVM.kernelCustom = 'custom';
    return SVM;
})();
//# sourceMappingURL=SVM.js.map

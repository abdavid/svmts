var SVM;
(function (SVM) {
    ///<reference path='./../interfaces/ISupportVectorMachineLearning.ts' />
    ///<reference path='./../interfaces/IKernel.ts' />
    ///<reference path='../base/Generic.ts' />
    ///<reference path='../SupportVectorMachine.ts' />
    ///<reference path='../utils/helpers.ts' />
    /**
    * @summary
    * Sequential Minimal Optimization (SMO) Algorithm
    *
    * @remark
    * The SMO algorithm is an algorithm for solving large quadratic programming (QP)
    * optimization problems, widely used for the training of support vector machines.
    * First developed by John C. Platt in 1998, SMO breaks up large QP problems into
    * a series of smallest possible QP problems, which are then solved analytically.
    *
    * @para
    * This class incorporates modifications in the original SMO algorithm to solve
    * regression problems as suggested by Alex J. Smola and Bernhard Scholkopf and
    * further modifications for better performance by Shevade et al.
    *
    * @para
    * Portions of this implementation has been based on the GPL code by Sylvain Roy in SMOreg.java, a
    * part of the Weka software package. It is, thus, available under the same GPL license. This file is
    * not linked against the rest of the Accord.NET Framework and can only be used in GPL aplications.
    * This class is only available in the special Accord.MachineLearning.GPL assembly, which has to be
    * explictly selected in the framework installation. Before linking against this assembly, please
    * read the http://www.gnu.org/copyleft/gpl.html license for more details. This
    * assembly also should have been distributed with a copy of the GNU GPLv3 alongside with it.
    *
    * @references
    * A. J. Smola and B. Scholkopf. A Tutorial on Support Vector Regression. NeuroCOLT2 Technical Report Series, 1998.
    * - http://www.kernel-machines.org/publications/SmoSch98c
    *
    * S.K. Shevade et al. Improvements to SMO Algorithm for SVM Regression, 1999.
    * - http://drona.csa.iisc.ernet.in/~chiru/papers/ieee_smo_reg.ps.gz
    *
    * S. S. Keerthi et al. Improvements to Platt's SMO Algorithm for SVM Classifier Design.* Technical Report CD-99-14.
    * - http://www.cs.iastate.edu/~honavar/keerthi-svm.pdf
    *
    * G. W. Flake, S. Lawrence. Efficient SVM Regression Training with SMO.
    * - http://www.keerthis.com/smoreg_ieee_shevade_00.pdf
    *
    *
    * Example regression problem. Suppose we are trying to model the following equation: f(x, y) = 2x + y
    * @example
    *
    *  var inputs = //(x, y)
    *  [
    *      [0,1], //2*0+1 = 1
    *      [4,3], //2*4+3 = 11
    *      [8,-8], //2*8-8 = 8
    *      [2,2], //2*2+2 = 6
    *      [6,1], //2*6+1 = 13
    *      [5,4], //2*5+4 = 14
    *      [9,1], //2*9+1 = 19
    *      [1,6] //2*0+1 = 8
    *  ]
    *
    *  var outputs = //f(x, y)
    *  [
    *      1, 11, 8, 6, 13, 14, 19, 8
    *  ]
    *
    *   // Create a Kernel Support Vector Machine for the given inputs
    *   var machine = new KernelSupportVectorMachine(new PolynominalKernel(2), 2);
    *
    *   // Instantiate a new learning algorithm for SVMs
    *   var learn = new SequentialMinimalOptimization(svm, inputs, outputs);
    *
    *   // Run the learning algorithm
    *   var error = learn.run();
    *
    *   // Compute the decision output for one of the input vectors
    *   var decision = machine.compute(inputs[0]); // 1.0003849827673186
    *
    **/
    (function (Learning) {
        var SequentialMinimalOptimization = (function () {
            /**
            * @param machine
            * @param inputs
            * @param outputs
            */
            function SequentialMinimalOptimization(machine, inputs, outputs) {
                if (typeof machine === "undefined") { machine = null; }
                if (typeof inputs === "undefined") { inputs = null; }
                if (typeof outputs === "undefined") { outputs = null; }
                // Learning algorithm parameters
                this.cost = 1.0;
                this.tolerance = 1e-3;
                this.epsilon = 1e-3;
                this.roundingEpsilon = 1e-12;
                if (machine === null) {
                    throw new Error('Machine is null');
                }

                if (inputs === null) {
                    throw new Error('Inputs is null');
                }

                if (outputs === null) {
                    throw new Error('Outputs is null');
                }

                if (inputs.length !== outputs.length) {
                    throw new Error('The number of inputs and outputs does not match. ' + inputs.length + ' != ' + outputs.length);
                }

                if (machine.getInputCount() > 0) {
                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i].length !== machine.getInputCount()) {
                            throw new Error('The size of the input vectors does not match the expected number of inputs of the machine');
                        }
                    }
                }

                this.machine = machine;

                this.kernel = machine.getKernel();

                this.inputs = inputs;

                this.outputs = outputs;
            }
            /**
            * Complexity (cost) parameter. Increasing the value of cost forces the creation
            * of a more accurate model that may not generalize well. Default value is the
            * number of examples divided by the trace of the kernel matrix.
            *
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.getComplexity = function () {
                return this.cost;
            };

            /**
            * The cost parameter controls the trade off between allowing training
            * errors and forcing rigid margins. It creates a soft margin that permits
            * some miss-classifications. Increasing the value of cost increases the cost of
            * miss-classifying points and forces the creation of a more accurate model
            * that may not generalize well.
            *
            * @param value
            */
            SequentialMinimalOptimization.prototype.setComplexity = function (value) {
                if (value <= 0) {
                    throw new Error('Out of range');
                }

                this.cost = value;
            };

            /**
            * Epsilon for round-off errors. Default value is 1e-12.
            * @param value
            */
            SequentialMinimalOptimization.prototype.setEpsilon = function (value) {
                if (value <= 0) {
                    throw new Error('Out of range');
                }

                this.epsilon = value;
            };

            /**
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.getEpsilon = function () {
                return this.epsilon;
            };

            /**
            *  Convergence tolerance. Default value is 1e-2 (0.01)
            *  The criterion for completing the model training process.
            * @param value
            */
            SequentialMinimalOptimization.prototype.setTolerance = function (value) {
                if (value <= 0) {
                    throw new Error('Out of range');
                }

                this.tolerance = value;
            };

            /**
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.getTolerance = function () {
                return this.tolerance;
            };

            /**
            * The SMO algorithm chooses to solve the smallest possible optimization problem
            * at every step. At every step, SMO chooses two Lagrange multipliers to jointly
            * optimize, finds the optimal values for these multipliers, and updates the SVM
            * to reflect the new optimal values.
            *
            * Reference: http://research.microsoft.com/en-us/um/people/jplatt/smoTR.pdf
            * The algorithm has been updated to implement the improvements suggested
            * by Keerthi et al. The code has been based on the pseudo-code available
            * on the author's technical report.
            *
            * Reference: http://www.cs.iastate.edu/~honavar/keerthi-svm.pdf
            */
            SequentialMinimalOptimization.prototype.run = function (computeError) {
                if (typeof computeError === "undefined") { computeError = false; }
                var N = this.inputs.length;

                this.alphaA = new Float64Array(N);
                this.alphaB = new Float64Array(N);
                this.errors = new Float64Array(N);

                this.I0 = new SVM.Generic.HashSet();
                this.I1 = new SVM.Generic.HashSet();
                this.I2 = new SVM.Generic.HashSet();
                this.I3 = new SVM.Generic.HashSet();

                for (var i = 0; i < N; i++) {
                    this.I1.add(i);
                }

                this.biasUpperIndex = 0;
                this.biasLowerIndex = 0;
                this.biasUpper = this.outputs[0] + this.getEpsilon();
                this.biasLower = this.outputs[0] - this.getEpsilon();

                var numChanged = 0, examineAll = true;

                while (numChanged > 0 || examineAll) {
                    numChanged = 0;
                    if (examineAll) {
                        for (var i = 0; i < N; i++) {
                            numChanged += this.examineExample(i);
                        }
                    } else {
                        for (var i = 0; i < N; i++) {
                            if ((0 < this.alphaA[i] && this.alphaA[i] < this.cost) || (0 < this.alphaB[i] && this.alphaB[i] < this.cost)) {
                                numChanged += this.examineExample(i);

                                if (this.biasUpper > this.biasLower - 2.0 * this.getTolerance()) {
                                    numChanged = 0;
                                    break;
                                }
                            }
                        }
                    }

                    if (examineAll) {
                        examineAll = false;
                    } else if (numChanged === 0) {
                        examineAll = true;
                    }
                }

                // Store Support Vectors in the SV Machine. Only vectors which have lagrange multipliers
                // greater than zero will be stored as only those are actually required during evaluation.
                var list = [];
                for (var i = 0; i < N; i++) {
                    if (this.alphaA[i] > 0 || this.alphaB[i] > 0) {
                        list.push(i);
                    }
                }

                this.machine.setSupportVectors(new Array(list.length));
                this.machine.setWeights(new Array(list.length));

                for (var i = 0; i < list.length; i++) {
                    var j = list[i];
                    this.machine.setSupportVector(i, this.inputs[j]);
                    this.machine.setWeight(i, (this.alphaA[j] - this.alphaB[j]));
                }

                this.machine.setThreshold((this.biasLower + this.biasUpper) / 2.0);

                return (computeError) ? this.computeError(this.inputs, this.outputs) : 0.0;
            };

            /**
            * Chooses which multipliers to optimize using heuristics.
            * @param i2
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.examineExample = function (i2) {
                var alpha2A = this.alphaA[i2], alpha2B = this.alphaB[i2], e2 = 0.0, epsilon = this.getEpsilon(), tolerance = this.getTolerance();

                if (this.I0.contains(i2)) {
                    // Value is cached
                    e2 = this.errors[i2];
                } else {
                    // Value is not cached and should be computed
                    this.errors[i2] = e2 = this.outputs[i2] - this.compute(this.inputs[i2]);

                    if (this.I1.contains(i2)) {
                        if (e2 + epsilon < this.biasUpper) {
                            this.biasUpper = e2 + epsilon;
                            this.biasUpperIndex = i2;
                        } else if (e2 - epsilon > this.biasLower) {
                            this.biasLower = e2 - epsilon;
                            this.biasLowerIndex = i2;
                        }
                    } else if (this.I2.contains(i2) && (e2 + epsilon > this.biasLower)) {
                        this.biasLower = e2 + epsilon;
                        this.biasLowerIndex = i2;
                    } else if (this.I3.contains(i2) && (e2 - epsilon < this.biasUpper)) {
                        this.biasUpper = e2 - epsilon;
                        this.biasUpperIndex = i2;
                    }
                }

                //end region
                //region
                //Check optimality using current thresholds
                //Check optimality using current thresholds then select
                //the best i1 to joint optimize when appropriate.
                var i1 = -1, optimal = true;

                if (this.I0.contains(i2)) {
                    if (0 < alpha2A && alpha2A < this.cost) {
                        if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance) {
                            optimal = false;
                            i1 = this.biasLowerIndex;

                            if ((e2 - epsilon) - this.biasUpper > this.biasLower - (e2 - epsilon)) {
                                i1 = this.biasUpperIndex;
                            }
                        } else if ((e2 - epsilon) - this.biasUpper > 2.0 * tolerance) {
                            optimal = false;

                            i1 = this.biasUpperIndex;
                            if (this.biasLower - (e2 - epsilon) > (e2 - epsilon) - this.biasUpper) {
                                i1 = this.biasLowerIndex;
                            }
                        }
                    } else if (0 < alpha2B && alpha2B < this.cost) {
                        if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance) {
                            optimal = false;
                            i1 = this.biasLowerIndex;
                            if ((e2 + epsilon) - this.biasUpper > this.biasLower - (e2 + epsilon)) {
                                i1 = this.biasUpperIndex;
                            }
                        } else if ((e2 + epsilon) - this.biasUpper > 2.0 * tolerance) {
                            optimal = false;
                            i1 = this.biasUpperIndex;
                            if (this.biasLower - (e2 + epsilon) > (e2 + epsilon) - this.biasUpper) {
                                i1 = this.biasLowerIndex;
                            }
                        }
                    }
                } else if (this.I1.contains(i2)) {
                    if (this.biasLower - (e2 + epsilon) > 2.0 * tolerance) {
                        optimal = false;

                        i1 = this.biasLowerIndex;
                        if ((e2 + epsilon) - this.biasUpper > this.biasLower - (e2 + epsilon)) {
                            i1 = this.biasUpperIndex;
                        }
                    } else if ((e2 - epsilon) - this.biasUpper > 2.0 * tolerance) {
                        optimal = false;

                        i1 = this.biasUpperIndex;
                        if (this.biasLower - (e2 - epsilon) > (e2 - epsilon) - this.biasUpper) {
                            i1 = this.biasLowerIndex;
                        }
                    }
                } else if (this.I2.contains(i2)) {
                    if ((e2 + epsilon) - this.biasUpper > 2.0 * tolerance) {
                        optimal = false;
                        i1 = this.biasUpperIndex;
                    }
                } else if (this.I3.contains(i2)) {
                    if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance) {
                        optimal = false;
                        i1 = this.biasLowerIndex;
                    }
                } else {
                    throw new Error('BOM! I missed');
                }

                if (optimal) {
                    // The examples are already optimal.
                    return 0;
                } else {
                    if (this.takeStep(i1, i2)) {
                        return 1;
                    }
                }

                return 0;
            };

            /**
            * Computes the error ratio for a given set of input and outputs.
            * @param inputs
            * @param expectedOutputs
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.computeError = function (inputs, expectedOutputs) {
                // Compute errors
                var sum = 0;
                for (var i = 0; i < inputs.length; i++) {
                    var s = this.machine.compute(inputs[i]) - expectedOutputs[i];
                    sum += s * s;
                }

                return s;
            };

            /**
            * Computes the SVM output for a given point.
            * @param point
            * @returns {number}
            */
            SequentialMinimalOptimization.prototype.compute = function (point) {
                var sum = 0;
                for (var j = 0; j < this.alphaA.length; j++) {
                    sum += (this.alphaA[j] - this.alphaB[j]) * this.kernel.run(point, this.inputs[j]);
                }
                return sum;
            };

            /**
            * Analytically solves the optimization problem for two Lagrange multipliers.
            * @param i1 {number}
            * @param i2 {number}
            * @returns {boolean}
            */
            SequentialMinimalOptimization.prototype.takeStep = function (i1, i2) {
                var _this = this;
                if (i1 == i2) {
                    return false;
                }

                // Lagrange multipliers
                var alpha1a = this.alphaA[i1], alpha1b = this.alphaB[i1], alpha2a = this.alphaA[i2], alpha2b = this.alphaB[i2];

                // Errors
                var e1 = this.errors[i1], e2 = this.errors[i2], delta = e1 - e2, epsilon = this.getEpsilon();

                // Kernel evaluation
                var k11 = this.kernel.run(this.inputs[i1], this.inputs[i1]), k12 = this.kernel.run(this.inputs[i1], this.inputs[i2]), k22 = this.kernel.run(this.inputs[i2], this.inputs[i2]), eta = k11 + k22 - 2.0 * k12, gamma = alpha1a - alpha1b + alpha2a - alpha2b;

                if (eta < 0) {
                    eta = 0;
                }

                //region Optimize
                var case1 = false, case2 = false, case3 = false, case4 = false, changed = false, finished = false, L, H, a1, a2;

                while (!finished) {
                    if (!case1 && (alpha1a > 0 || (alpha1b == 0 && delta > 0)) && (alpha2a > 0 || (alpha2b == 0 && delta < 0))) {
                        // Compute L and H (wrt alpha1, alpha2)
                        L = Math.max(0, gamma - this.cost);
                        H = Math.min(this.cost, gamma);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2a - (delta / eta);

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = -L * delta;
                                var Hobj = -H * delta;

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }

                            a1 = alpha1a - (a2 - alpha2a);

                            if (Math.abs(a1 - alpha1a) > this.roundingEpsilon || Math.abs(a2 - alpha2a) > this.roundingEpsilon) {
                                alpha1a = a1;
                                alpha2a = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case1 = true;
                    } else if (!case2 && (alpha1a > 0 || (alpha1b == 0 && delta > 2 * epsilon)) && (alpha2b > 0 || (alpha2a == 0 && delta > 2 * epsilon))) {
                        // Compute L and H  (wrt alpha1, alpha2*)
                        L = Math.max(0, -gamma);
                        H = Math.min(this.cost, -gamma + this.cost);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2b + ((delta - 2 * epsilon) / eta);

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = L * (-2 * epsilon + delta);
                                var Hobj = H * (-2 * epsilon + delta);

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }
                            a1 = alpha1a + (a2 - alpha2b);

                            if (Math.abs(a1 - alpha1a) > this.roundingEpsilon || Math.abs(a2 - alpha2b) > this.roundingEpsilon) {
                                alpha1a = a1;
                                alpha2b = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case2 = true;
                    } else if (!case3 && (alpha1b > 0 || (alpha1a == 0 && delta < -2 * epsilon)) && (alpha2a > 0 || (alpha2b == 0 && delta < -2 * epsilon))) {
                        // Compute L and H (wrt alpha1*, alpha2)
                        L = Math.max(0, gamma);
                        H = Math.min(this.cost, this.cost + gamma);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2a - ((delta + 2 * epsilon) / eta);

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = -L * (2 * epsilon + delta);
                                var Hobj = -H * (2 * epsilon + delta);

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }
                            a1 = alpha1b + (a2 - alpha2a);

                            if (Math.abs(a1 - alpha1b) > this.roundingEpsilon || Math.abs(a2 - alpha2a) > this.roundingEpsilon) {
                                alpha1b = a1;
                                alpha2a = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case3 = true;
                    } else if (!case4 && (alpha1b > 0 || (alpha1a == 0 && delta < 0)) && (alpha2b > 0 || (alpha2a == 0 && delta > 0))) {
                        // Compute L and H (wrt alpha1*, alpha2*)
                        L = Math.max(0, -gamma - this.cost);
                        H = Math.min(this.cost, -gamma);

                        if (L < H) {
                            if (eta > 0) {
                                a2 = alpha2b + delta / eta;

                                if (a2 > H) {
                                    a2 = H;
                                } else if (a2 < L) {
                                    a2 = L;
                                }
                            } else {
                                var Lobj = L * delta;
                                var Hobj = H * delta;

                                if (Lobj > Hobj) {
                                    a2 = L;
                                } else {
                                    a2 = H;
                                }
                            }

                            a1 = alpha1b - (a2 - alpha2b);

                            if (Math.abs(a1 - alpha1b) > this.roundingEpsilon || Math.abs(a2 - alpha2b) > this.roundingEpsilon) {
                                alpha1b = a1;
                                alpha2b = a2;
                                changed = true;
                            }
                        } else {
                            finished = true;
                        }

                        case4 = true;
                    } else {
                        finished = true;
                    }

                    // Update the delta
                    delta += eta * ((alpha2a - alpha2b) - (this.alphaA[i2] - this.alphaB[i2]));
                }

                if (!changed) {
                    return false;
                }

                // #endregion
                //  #region Update error cache
                // Update error cache using new Lagrange multipliers
                this.I0.values().forEach(function (i) {
                    if (Number(i) !== Number(i1) && Number(i) !== Number(i2)) {
                        // Update all in set i0 except i1 and i2 (because we have the kernel function cached for them)
                        _this.errors[i] += ((_this.alphaA[i1] - _this.alphaB[i1]) - (alpha1a - alpha1b)) * _this.kernel.run(_this.inputs[i1], _this.inputs[i]) + ((_this.alphaA[i2] - _this.alphaB[i2]) - (alpha2a - alpha2b)) * _this.kernel.run(_this.inputs[i2], _this.inputs[i]);
                    }
                });

                // Update error cache using new Lagrange multipliers for i1 and i2
                this.errors[i1] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k11 + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k12;
                this.errors[i2] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k12 + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k22;

                //#endregion
                // to prevent precision problems
                var m_Del = 1e-10;
                if (alpha1a > this.cost - m_Del * this.cost) {
                    alpha1a = this.cost;
                } else if (alpha1a <= m_Del * this.cost) {
                    alpha1a = 0;
                }
                if (alpha1b > this.cost - m_Del * this.cost) {
                    alpha1b = this.cost;
                } else if (alpha1b <= m_Del * this.cost) {
                    alpha1b = 0;
                }
                if (alpha2a > this.cost - m_Del * this.cost) {
                    alpha2a = this.cost;
                } else if (alpha2a <= m_Del * this.cost) {
                    alpha2a = 0;
                }
                if (alpha2b > this.cost - m_Del * this.cost) {
                    alpha2b = this.cost;
                } else if (alpha2b <= m_Del * this.cost) {
                    alpha2b = 0;
                }

                // #region Store the new Lagrange multipliers
                // Store the changes in the _alpha, _alpha* arrays
                this.alphaA[i1] = alpha1a;
                this.alphaB[i1] = alpha1b;
                this.alphaA[i2] = alpha2a;
                this.alphaB[i2] = alpha2b;

                if ((0 < alpha1a && alpha1a < this.cost) || (0 < alpha1b && alpha1b < this.cost)) {
                    this.I0.add(i1);
                } else {
                    this.I0.remove(i1);
                }

                if (alpha1a == 0 && alpha1b == 0) {
                    this.I1.add(i1);
                } else {
                    this.I1.remove(i1);
                }

                if (alpha1a == 0 && alpha1b == this.cost) {
                    this.I2.add(i1);
                } else {
                    this.I2.remove(i1);
                }

                if (alpha1a == this.cost && alpha1b == 0) {
                    this.I3.add(i1);
                } else {
                    this.I3.remove(i1);
                }

                if ((0 < alpha2a && alpha2a < this.cost) || (0 < alpha2b && alpha2b < this.cost)) {
                    this.I0.add(i2);
                } else {
                    this.I0.remove(i2);
                }

                if (alpha2a == 0 && alpha2b == 0) {
                    this.I1.add(i2);
                } else {
                    this.I1.remove(i2);
                }

                if (alpha2a == 0 && alpha2b == this.cost) {
                    this.I2.add(i2);
                } else {
                    this.I2.remove(i2);
                }

                if (alpha2a == this.cost && alpha2b == 0) {
                    this.I3.add(i2);
                } else {
                    this.I3.remove(i2);
                }

                // #endregion
                // #region Compute the new thresholds
                this.biasLower = -Math.pow(2, 32);
                this.biasUpper = Math.pow(2, 32);
                this.biasLowerIndex = -1;
                this.biasUpperIndex = -1;

                this.I0.values().forEach(function (i) {
                    if (0 < _this.alphaB[i] && _this.alphaB[i] < _this.cost && _this.errors[i] + epsilon > _this.biasLower) {
                        _this.biasLower = _this.errors[i] + epsilon;
                        _this.biasLowerIndex = i;
                    } else if (0 < _this.alphaA[i] && _this.alphaA[i] < _this.cost && _this.errors[i] - epsilon > _this.biasLower) {
                        _this.biasLower = _this.errors[i] - epsilon;
                        _this.biasLowerIndex = i;
                    }
                    if (0 < _this.alphaA[i] && _this.alphaA[i] < _this.cost && _this.errors[i] - epsilon < _this.biasUpper) {
                        _this.biasUpper = _this.errors[i] - epsilon;
                        _this.biasUpperIndex = i;
                    } else if (0 < _this.alphaB[i] && _this.alphaB[i] < _this.cost && _this.errors[i] + epsilon < _this.biasUpper) {
                        _this.biasUpper = _this.errors[i] + epsilon;
                        _this.biasUpperIndex = i;
                    }
                });

                if (!this.I0.contains(i1)) {
                    if (this.I2.contains(i1) && this.errors[i1] + epsilon > this.biasLower) {
                        this.biasLower = this.errors[i1] + epsilon;
                        this.biasLowerIndex = i1;
                    } else if (this.I1.contains(i1) && this.errors[i1] - epsilon > this.biasLower) {
                        this.biasLower = this.errors[i1] - epsilon;
                        this.biasLowerIndex = i1;
                    }

                    if (this.I3.contains(i1) && this.errors[i1] - epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i1] - epsilon;
                        this.biasUpperIndex = i1;
                    } else if (this.I1.contains(i1) && this.errors[i1] + epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i1] + epsilon;
                        this.biasUpperIndex = i1;
                    }
                }

                if (!this.I0.contains(i2)) {
                    if (this.I2.contains(i2) && this.errors[i2] + epsilon > this.biasLower) {
                        this.biasLower = this.errors[i2] + epsilon;
                        this.biasLowerIndex = i2;
                    } else if (this.I1.contains(i2) && this.errors[i2] - epsilon > this.biasLower) {
                        this.biasLower = this.errors[i2] - epsilon;
                        this.biasLowerIndex = i2;
                    }

                    if (this.I3.contains(i2) && this.errors[i2] - epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i2] - epsilon;
                        this.biasUpperIndex = i2;
                    } else if (this.I1.contains(i2) && this.errors[i2] + epsilon < this.biasUpper) {
                        this.biasUpper = this.errors[i2] + epsilon;
                        this.biasUpperIndex = i2;
                    }
                }

                if (this.biasLowerIndex == -1 || this.biasUpperIndex == -1) {
                    throw new Error('cry cry');
                }

                //#endregion
                // Success.
                return true;
            };
            return SequentialMinimalOptimization;
        })();
        Learning.SequentialMinimalOptimization = SequentialMinimalOptimization;
    })(SVM.Learning || (SVM.Learning = {}));
    var Learning = SVM.Learning;
})(SVM || (SVM = {}));
//# sourceMappingURL=SequentialMinimalOptimization.js.map

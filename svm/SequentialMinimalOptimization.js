var SequentialMinimalOptimization = (function () {
    function SequentialMinimalOptimization(machine, inputs, outputs) {
        if (typeof machine === "undefined") { machine = null; }
        if (typeof inputs === "undefined") { inputs = null; }
        if (typeof outputs === "undefined") { outputs = null; }
        this.cost = 0.6;
        this.tolerance = 1e-2;
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
            throw new Error('The number of inputs and outputs does not match.');
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
    SequentialMinimalOptimization.prototype.getComplexity = function () {
        return this.cost;
    };

    SequentialMinimalOptimization.prototype.setComplexity = function (value) {
        if (value <= 0) {
            throw new Error('Out of range');
        }

        this.cost = value;
    };

    SequentialMinimalOptimization.prototype.setEpsilon = function (value) {
        if (value <= 0) {
            throw new Error('Out of range');
        }

        this.epsilon = value;
    };

    SequentialMinimalOptimization.prototype.getEpsilon = function () {
        return this.epsilon;
    };

    SequentialMinimalOptimization.prototype.setTolerance = function (value) {
        if (value <= 0) {
            throw new Error('Out of range');
        }

        this.tolerance = value;
    };

    SequentialMinimalOptimization.prototype.getTolerance = function () {
        return this.tolerance;
    };

    SequentialMinimalOptimization.prototype.run = function (computeError) {
        if (typeof computeError === "undefined") { computeError = false; }
        var N = this.inputs.length;

        this.alphaA = Array.apply(null, new Array(N)).map(Number.prototype.valueOf, 0);
        this.alphaB = Array.apply(null, new Array(N)).map(Number.prototype.valueOf, 0);
        this.errors = Array.apply(null, new Array(N)).map(Number.prototype.valueOf, 0);

        this.I0 = new HashSet();
        this.I1 = new HashSet();
        this.I2 = new HashSet();
        this.I3 = new HashSet();

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

        var list = new HashSet();
        for (var i = 0; i < N; i++) {
            if (this.alphaA[i] > 0 || this.alphaB[i] > 0) {
                list.add(i);
            }
        }

        var vectors = list.count();

        this.machine.setSupportVectors(new Array(vectors));
        this.machine.setWeights(new Array(vectors));

        for (var i = 0; i < vectors; i++) {
            var j = list.at(i);
            this.machine.supportVectors[i] = this.inputs[j];
            this.machine.weights[i] = this.alphaA[j] - this.alphaB[j];
        }

        this.machine.setThreshold((this.biasLower + this.biasUpper) / 2.0);

        return (computeError) ? this.computeError(this.inputs, this.outputs) : 0.0;
    };

    SequentialMinimalOptimization.prototype.examineExample = function (i2) {
        var alpha2A = this.alphaA[i2], alpha2B = this.alphaB[i2], e2 = 0.0, epsilon = this.getEpsilon(), tolerance = this.getTolerance();

        if (this.I0.contains(i2)) {
            e2 = this.errors[i2];
        } else {
            this.errors[i2] = e2 = this.compute(this.inputs[i2]);

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
            return 0;
        } else {
            if (this.takeStep(i1, i2)) {
                return 1;
            }
        }

        return 0;
    };

    SequentialMinimalOptimization.prototype.computeError = function (inputs, expectedOutputs) {
        var sum = 0;
        for (var i = 0; i < inputs.length; i++) {
            var s = this.machine.compute(inputs[i]) - expectedOutputs[i];
            sum += s * s;
        }

        return s;
    };

    SequentialMinimalOptimization.prototype.compute = function (point) {
        var sum = 0;
        for (var j = 0; j < this.alphaA.length; j++) {
            sum += (this.alphaA[j] - this.alphaB[j]) * this.kernel.run(point, this.inputs[j]);
        }
        return sum;
    };

    SequentialMinimalOptimization.prototype.takeStep = function (i1, i2) {
        if (i1 == i2) {
            return false;
        }

        var alpha1a = this.alphaA[i1], alpha1b = this.alphaB[i1], alpha2a = this.alphaA[i2], alpha2b = this.alphaB[i2];

        var e1 = this.errors[i1], e2 = this.errors[i2], delta = e1 - e2, epsilon = this.getEpsilon();

        var k11 = this.kernel.run(this.inputs[i1], this.inputs[i1]), k12 = this.kernel.run(this.inputs[i1], this.inputs[i2]), k22 = this.kernel.run(this.inputs[i2], this.inputs[i2]), eta = k11 + k22 - 2.0 * k12, gamma = alpha1a - alpha1b + alpha2a - alpha2b;

        if (eta < 0) {
            eta = 0;
        }

        var case1 = false, case2 = false, case3 = false, case4 = false, changed = false, finished = false, L, H, a1, a2;

        while (!finished) {
            if (!case1 && (alpha1a > 0 || (alpha1b == 0 && delta > 0)) && (alpha2a > 0 || (alpha2b == 0 && delta < 0))) {
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

            delta += eta * ((alpha2a - alpha2b) - (this.alphaA[i2] - this.alphaB[i2]));
        }

        if (!changed) {
            return false;
        }

        for (var i in this.I0.items) {
            if (i !== i1 && i !== i2) {
                this.errors[i] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * this.kernel.run(this.inputs[i1], this.inputs[i]) + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * this.kernel.run(this.inputs[i2], this.inputs[i]);
            }
        }

        this.errors[i1] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k11 + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k12;
        this.errors[i2] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k12 + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k22;

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

        this.biasLower = -Math.pow(2, 32);
        this.biasUpper = Math.pow(2, 32);
        this.biasLowerIndex = -1;
        this.biasUpperIndex = -1;

        for (var i in this.I0.items) {
            if (0 < this.alphaB[i] && this.alphaB[i] < this.cost && this.errors[i] + epsilon > this.biasLower) {
                this.biasLower = this.errors[i] + epsilon;
                this.biasLowerIndex = i;
            } else if (0 < this.alphaA[i] && this.alphaA[i] < this.cost && this.errors[i] - epsilon > this.biasLower) {
                this.biasLower = this.errors[i] - epsilon;
                this.biasLowerIndex = i;
            }
            if (0 < this.alphaA[i] && this.alphaA[i] < this.cost && this.errors[i] - epsilon < this.biasUpper) {
                this.biasUpper = this.errors[i] - epsilon;
                this.biasUpperIndex = i;
            } else if (0 < this.alphaB[i] && this.alphaB[i] < this.cost && this.errors[i] + epsilon < this.biasUpper) {
                this.biasUpper = this.errors[i] + epsilon;
                this.biasUpperIndex = i;
            }
        }

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

        return true;
    };
    return SequentialMinimalOptimization;
})();
//# sourceMappingURL=SequentialMinimalOptimization.js.map

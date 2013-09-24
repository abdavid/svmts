var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SVM;
(function (SVM) {
    (function (Engine) {
        (function (MulticlassComputeMethod) {
            MulticlassComputeMethod[MulticlassComputeMethod["Voting"] = 1] = "Voting";

            MulticlassComputeMethod[MulticlassComputeMethod["Elimination"] = 2] = "Elimination";
        })(Engine.MulticlassComputeMethod || (Engine.MulticlassComputeMethod = {}));
        var MulticlassComputeMethod = Engine.MulticlassComputeMethod;

        var Cache = (function () {
            function Cache() {
            }
            return Cache;
        })();
        Engine.Cache = Cache;

        var MulticlassSupportVectorMachine = (function (_super) {
            __extends(MulticlassSupportVectorMachine, _super);
            function MulticlassSupportVectorMachine(inputs, classes, kernel) {
                if (typeof kernel === "undefined") { kernel = new SVM.Kernels.LinearKernel(); }
                _super.call(this, inputs);
                this.totalVectorsCount = null;
                this.uniqueVectorsCount = null;
                this.sharedVectorsCount = null;
                this.sharedVectors = null;
                this.vectorCache = null;

                if (classes <= 1) {
                    throw new Error('The machine must have at least two classes.');
                }

                this.machines = SVM.Util.arrayPopulate(classes - 1, null);

                for (var i = 0; i < this.machines.length; i++) {
                    this.machines[i] = SVM.Util.arrayPopulate(i + 1, null);

                    for (var j = 0; j < i + 1; j++) {
                        this.machines[i][j] = new SVM.Engine.KernelSupportVectorMachine(kernel, inputs);
                    }
                }

                this.initialize();
            }
            MulticlassSupportVectorMachine.prototype.initialize = function () {
                this.vectorCache = new SVM.Generic.CachedHashSet();

                this.sharedVectors = new SVM.Generic.HashSet(this.computeSharedVectors());
            };

            MulticlassSupportVectorMachine.prototype.kernelSupportVectorMachine = function (class1, class2) {
                if (typeof class1 === "undefined") { class1 = 0; }
                if (typeof class2 === "undefined") { class2 = 0; }
                if (class1 === class2) {
                    return null;
                } else if (class1 > class2) {
                    return this.machines[class1 - 1][class2];
                } else {
                    return this.machines[class2 - 1][class1];
                }
            };

            MulticlassSupportVectorMachine.prototype.getMachineCount = function () {
                return ((this.machines.length + 1) * this.machines.length) / 2;
            };

            MulticlassSupportVectorMachine.prototype.getSupportVectorCount = function () {
                if (this.totalVectorsCount == null) {
                    var count = 0;
                    for (var i = 0; i < this.machines.length; i++) {
                        for (var j = 0; j < this.machines[i].length; j++) {
                            var supportVectors = this.machines[i][j].getInputCount();
                            if (supportVectors !== null) {
                                count += supportVectors;
                            }
                        }
                    }
                    this.totalVectorsCount = count;
                }

                return this.totalVectorsCount;
            };

            MulticlassSupportVectorMachine.prototype.getSupportVectorUniqueCount = function () {
                if (this.uniqueVectorsCount == null) {
                    var unique = new SVM.Generic.HashSet();

                    for (var i = 0; i < this.machines.length; i++) {
                        for (var j = 0; j < this.machines[i].length; j++) {
                            var supportVectors = this.machines[i][j].getInputCount();
                            if (supportVectors != null) {
                                for (var k = 0; k < supportVectors; k++) {
                                    unique.add(this.machines[i][j].getSupportVector(k));
                                }
                            }
                        }
                    }

                    this.uniqueVectorsCount = unique.count();
                }

                return this.uniqueVectorsCount;
            };

            MulticlassSupportVectorMachine.prototype.getSupportVectorSharedCount = function () {
                if (this.sharedVectorsCount == null) {
                    this.sharedVectorsCount = this.sharedVectors.count();
                }

                return this.sharedVectorsCount;
            };

            MulticlassSupportVectorMachine.prototype.getClasses = function () {
                return this.machines.length + 1;
            };

            MulticlassSupportVectorMachine.prototype.getInputs = function () {
                return this.machines[0][0].getInputCount();
            };

            MulticlassSupportVectorMachine.prototype.IsProbabilistic = function () {
                return this.machines[0][0].isProbabilistic();
            };

            MulticlassSupportVectorMachine.prototype.getMachines = function () {
                return this.machines;
            };

            MulticlassSupportVectorMachine.prototype.compute = function (inputs, method, responses, output) {
                if (typeof method === "undefined") { method = MulticlassComputeMethod.Elimination; }
                if (typeof responses === "undefined") { responses = []; }
                if (typeof output === "undefined") { output = 0; }
                if (method == MulticlassComputeMethod.Voting) {
                    var votes = [], result = this.computeVoting(inputs, votes, output);

                    responses = SVM.Util.arrayPopulate(votes.length, 0);
                    for (var i = 0; i < responses.length; i++) {
                        responses[i] = votes[i] * (2.0 / (this.getClasses() * (this.getClasses() - 1)));
                    }

                    return result;
                } else {
                    return this.computeElimination(inputs, responses, output, null);
                }
            };

            MulticlassSupportVectorMachine.prototype.computeVoting = function (inputs, votes, output) {
                this.sharedVectors = new SVM.Generic.HashSet(this.computeSharedVectors());
                var vectors = this.sharedVectors.values(), cache = this.createOrResetCache(), voting = SVM.Util.arrayPopulate(this.getClasses(), null);

                new P.Thread({
                    inputs: inputs,
                    votes: votes,
                    cache: cache,
                    output: output
                }).require(Cache).require(this.computeSequential).for(0, this.getClasses(), this._computeVoting).then(function (data) {
                });

                votes = voting;

                output = output * (2.0 / (this.getClasses() * (this.getClasses() - 1)));

                return _.max(votes);
            };

            MulticlassSupportVectorMachine.prototype._computeVoting = function (i, data) {
                for (var j = 0; j < i; j++) {
                    var machineOutput, answer = computeSequential(i, j, data.inputs, machineOutput, data.cache), y = (answer == -1) ? i : j;

                    data.votes[y]++;
                }
            };

            MulticlassSupportVectorMachine.prototype.createOrResetCache = function () {
                return new SVM.Generic.CachedHashSet();
            };

            MulticlassSupportVectorMachine.prototype.computeSharedVectors = function () {
                var shared = new SVM.Generic.Dictionary();

                for (var i = 0; i < this.machines.length; i++) {
                    for (var j = 0; j < this.machines[i].length; j++) {
                        var machine = this.machines[i][j];

                        if (!machine.isCompact()) {
                            for (var k = 0; k < machine.getInputCount(); k++) {
                                var sv = machine.getSupportVector(k), contains = shared.contains(sv), count;

                                if (contains) {
                                    count = shared.get(sv);
                                    count.add(SVM.Generic.Tuple.create(i, j, k));
                                } else {
                                    count = new SVM.Generic.List();
                                    count.add(SVM.Generic.Tuple.create(i, j, k));
                                    shared.add(count);
                                }
                            }
                        }
                    }
                }

                var idx = 0, indices = new SVM.Generic.Dictionary();

                shared.keys().forEach(function (value, sv) {
                    indices.add(sv, idx++);
                });

                var sharedVectors = SVM.Util.arrayPopulate(this.machines.length, 0);

                for (var i = 0; i < sharedVectors.length; i++) {
                    sharedVectors[i] = SVM.Util.arrayPopulate(this.machines.length, 0);
                    for (var j = 0; j < sharedVectors[i].length; j++) {
                        if (!this.machines[i][j].isCompact()) {
                            var ns = this.machines[i][j].supportVectors.length;
                            sharedVectors[i][j] = SVM.Util.arrayPopulate(ns, 0);

                            for (var k = 0; k < ns; k++) {
                                var sv = this.machines[i][j].getSupportVector(k);

                                if (shared.containsKey(sv)) {
                                    sharedVectors[i][j][k] = indices.get(sv);
                                } else {
                                    sharedVectors[i][j][k] = -1;
                                }
                            }
                        }
                    }
                }

                this.sharedVectorsCount = shared.keys().length;

                return sharedVectors;
            };

            MulticlassSupportVectorMachine.prototype.computeSequential = function (classA, classB, input, output, cache) {
                var machine = this.machines[classA - 1][classB], vectors = cache.vectors[classA - 1][classB], values = cache.products, sum = machine.getThreshold();

                if (machine.isCompact()) {
                    var weights = machine.getWeights();
                    for (var i = 0; i < weights.length; i++) {
                        sum += weights[i] * input[i];
                    }
                } else {
                    for (var i = 0; i < vectors.length; i++) {
                        var value;

                        var j = vectors[i];

                        if (j >= 0) {
                            if (!isNaN(values[j])) {
                                value = values[j];
                            } else {
                                value = values[j] = machine.getKernel().run(machine.getSupportVector(i), input);
                            }
                        } else {
                            value = machine.getKernel().run(machine.getSupportVector(i), input);
                        }

                        sum += machine.getWeight(i) * value;
                    }
                }

                if (machine.isProbabilistic()) {
                    throw new Error('Probabilistic SVMs are not supported yet');
                } else {
                    return output >= 0 ? 1 : -1;
                }
            };

            MulticlassSupportVectorMachine.prototype.computeElimination = function (inputs, reponses, output, decisionPath) {
                this.sharedVectors = new SVM.Generic.HashSet(this.computeSharedVectors());
                var vectors = this.sharedVectors.values();
            };
            return MulticlassSupportVectorMachine;
        })(SVM.Engine.SupportVectorMachine);
        Engine.MulticlassSupportVectorMachine = MulticlassSupportVectorMachine;
    })(SVM.Engine || (SVM.Engine = {}));
    var Engine = SVM.Engine;
})(SVM || (SVM = {}));
//# sourceMappingURL=MulticlassSupportVectorMachine.js.map

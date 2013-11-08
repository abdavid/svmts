/**
 * Created by davidatborresen on 24.09.13.
 */

///<reference path='./SupportVectorMachine.ts' />

module SVM.Engine {

    export enum MulticlassComputeMethod
    {
        //Max-voting method (also known as 1vs1 decision).
        Voting = 1,

        //Elimination method (also known as DAG decision).
        Elimination = 2,
    }

    export class Cache
    {
        public Evaluations:number;
        public Products:number[];
        public Vectors:number[][][];
        public SyncObjects:any[];
    }

    export class MulticlassSupportVectorMachine extends SVM.Engine.SupportVectorMachine
    {
        // List of underlying binary classifiers
        private machines: KernelSupportVectorMachine[][];

        // Multi-class statistics
        private  totalVectorsCount:number = null;
        private  uniqueVectorsCount:number = null;
        private  sharedVectorsCount:number = null;

        // Performance optimizations
        private sharedVectors:SVM.Generic.HashSet = null;
        private vectorCache:SVM.Generic.CachedHashSet = null;

        /**
         * Constructs a new Multi-class Kernel Support Vector Machine
         *
         * @param inputs The number of inputs for the machine. If sequences have
         * varying length, pass zero to this parameter and pass a suitable sequence
         * kernel to this constructor, such as {@link SVM.Kernels.DynamicTimeWarping}
         *
         * @param classes The number of classes in the classification problem.
         *
         * @param kernel The chosen kernel for the machine. Default is to use the {@link SVM.Kernels.LinearKernel} kernel.
         */
            constructor(inputs:number, classes:number, kernel:IKernel = new SVM.Kernels.LinearKernel())
        {
            super(inputs);

            if(classes <= 1)
            {
                throw new Error('The machine must have at least two classes.')
            }

            // Create the kernel machines
            //@todo fix and improve this section!
            this.machines = SVM.Util.arrayPopulate(classes - 1, null);

            for(var i = 0; i < this.machines.length; i++)
            {
                this.machines[i] = SVM.Util.arrayPopulate(i + 1, null);

                for(var j = 0; j < i + 1; j++)
                {
                    this.machines[i][j] = new SVM.Engine.KernelSupportVectorMachine(kernel, inputs);
                }
            }

            this.initialize();
        }

        private initialize():void
        {
            //Threadable?

            this.vectorCache = new SVM.Generic.CachedHashSet();

            this.sharedVectors = new SVM.Generic.HashSet(this.computeSharedVectors());
        }

        /**
         * @param class1
         * @param class2
         * @returns {*}
         */
        public kernelSupportVectorMachine(class1:number = 0, class2:number = 0)
        {
            if(class1 === class2)
            {
                return null;
            }
            else if(class1 > class2)
            {
                return this.machines[class1-1][class2];
            }
            else
            {
                return this.machines[class2 -1][class1];
            }

        }

        /**
         * Gets the total number of machines
         * in this multi-class classifier.
         * @returns {number}
         */
        public getMachineCount():number
        {
            return ((this.machines.length + 1) * this.machines.length) / 2;
        }

        /**
         * Gets the total number of support vectors
         * in the entire multi-class machine.
         * @returns {number}
         */
        public getSupportVectorCount():number
        {
            if(this.totalVectorsCount == null)
            {
                var count:number = 0;
                for(var i = 0; i < this.machines.length; i++)
                {
                    for(var j = 0; j < this.machines[i].length; j++)
                    {
                        var supportVectors = this.machines[i][j].getInputCount()
                        if(supportVectors !== null)
                        {
                            count += supportVectors;
                        }
                    }
                }
                this.totalVectorsCount = count;
            }

            return this.totalVectorsCount;
        }

        /**
         * Gets the number of unique support
         * vectors in the multi-class machine.
         * @returns {number}
         */
        public getSupportVectorUniqueCount():number
        {

            if(this.uniqueVectorsCount == null)
            {
                var unique = new SVM.Generic.HashSet();

                for (var i = 0; i < this.machines.length; i++)
                {
                    for (var j = 0; j < this.machines[i].length; j++)
                    {
                        var supportVectors = this.machines[i][j].getInputCount();
                        if (supportVectors != null)
                        {
                            for (var k = 0; k < supportVectors; k++)
                            {
                                unique.add(this.machines[i][j].getSupportVector(k));
                            }
                        }
                    }
                }

                this.uniqueVectorsCount = unique.count();
            }

            return this.uniqueVectorsCount;
        }

        /**
         * Gets the number of shared support
         * vectors in the multi-class machine.
         * @returns {number}
         */
        public getSupportVectorSharedCount():number
        {
            if(this.sharedVectorsCount == null)
            {
                this.sharedVectorsCount = this.sharedVectors.count();
            }

            return this.sharedVectorsCount;
        }

        /**
         * Gets the number of classes.
         * @returns {number}
         */
        public getClasses():number
        {
            return this.machines.length + 1;
        }

        /**
         * Gets the number of inputs of the machines.
         * @returns {number}
         */
        public getInputs():number
        {
            return this.machines[0][0].getInputCount();
        }

        /**
         * Gets a value indicating whether this machine produces probabilistic outputs.
         * @returns {boolean} true if this machine produces probabilistic outputs; otherwise, false.
         */
        public IsProbabilistic():boolean
        {
            return this.machines[0][0].isProbabilistic();
        }

        /**
         * Gets the subproblems classifiers.
         * @returns {SVM.Engine.KernelSupportVectorMachine[][]}
         */
        public getMachines():KernelSupportVectorMachine[][]
        {
            return this.machines;
        }

        /**
         * Computes the given input to produce the corresponding output.
         *
         * @param inputs An input vector.
         *
         * @param method The {@link MulticlassComputeMethod}
         * multi-class classification method
         *
         * @param responses The model response for each class.
         *
         * @param output The output of the machine. If this is a
         * {@link SVM.Engine.SupportVectorMachine.IsProbabilistic} machine, the
         * output is the probability of the positive class. If this is
         * a standard machine, the output is the distance to the decision
         * hyperplane in feature space.
         *
         * @returns {*}
         */
        public compute(inputs:number[], method:MulticlassComputeMethod = MulticlassComputeMethod.Elimination, responses:number[] = [], output:number = 0):number
        {
            if(method == MulticlassComputeMethod.Voting)
            {
                var votes:number[] = [],
                    result = this.computeVoting(inputs,votes,output);

                responses = SVM.Util.arrayPopulate(votes.length, 0);
                for (var i = 0; i < responses.length; i++)
                {
                    responses[i] = votes[i] * (2.0 / (this.getClasses() * (this.getClasses() - 1)));
                }

                return result;
            }
            else
            {
                return this.computeElimination(inputs, responses, output, null);
            }
        }

        /**
         * Computes the given input to produce the corresponding output.
         *
         * @param inputs An input vector.
         *
         * @param votes A vector containing the number of votes for each class.
         *
         * @param output The output of the machine. If this is a
         * {@link SVM.SupportVectorMachine.IsProbabilistic} machine, the
         * output is the probability of the positive class. If this is
         * a standard machine, the output is the distance to the decision
         * hyperplane in feature space.
         */
        private computeVoting(inputs:number[], votes:number[], output:number):number
        {
            // Compute decision by Voting

            // Get a list of the shared vectors
            this.sharedVectors = new SVM.Generic.HashSet(this.computeSharedVectors());
            var vectors:number[][][] = this.sharedVectors.values(),

            // Get the cache for this thread
                cache:SVM.Generic.CachedHashSet = this.createOrResetCache(),

            // out variables cannot be passed into delegates,
            // so will be creating a copy for the vote array.
                voting:number[] = SVM.Util.arrayPopulate(this.getClasses(), null);


            new P.Thread({
                inputs:inputs,
                votes: votes,
                cache: cache,
                output:output
            })
                .require(Cache)
                .require(this.computeSequential)
                .for(0, this.getClasses(), this._computeVoting)
                .then((data)=>
                {

                });

            // Voting finished.
            votes = voting;

            output = output * (2.0 / (this.getClasses() * (this.getClasses() - 1)));

            return _.max(votes);
        }

        private _computeVoting(i,data):void
        {
            for(var j = 0; j < i; j++)
            {
                var machineOutput:number,
                    answer:number = computeSequential(i, j, data.inputs, machineOutput, data.cache),
                    y:number = (answer == -1) ? i : j;


                data.votes[y]++;
            }
        }

        private createOrResetCache():SVM.Generic.CachedHashSet
        {
            return new SVM.Generic.CachedHashSet();
        }

        private computeSharedVectors():number[][][]
        {
            // This method should only be called once after the machine has
            // been learned. If the inner machines or they Support Vectors
            // change, this method will need to be recomputed.


            // Detect all vectors which are being shared along the machines
            var shared = new SVM.Generic.Dictionary();

            // for all machines
            for(var i = 0; i < this.machines.length; i++)
            {
                for (var j = 0; j < this.machines[i].length; j++)
                {
                    var machine = this.machines[i][j];
                    // if the machine is not in compact form
                    if (!machine.isCompact())
                    {
                        // register the support vector on the shared cache collection
                        for (var k = 0; k < machine.getInputCount(); k++)
                        {
                            var sv:number[] = machine.getSupportVector(k),
                                contains = shared.contains(sv),
                                count:SVM.Generic.List;

                            if(contains)
                            {
                                count = shared.get(sv);
                                count.add(SVM.Generic.Tuple.create(i,j,k));
                            }
                            else
                            {
                                count = new SVM.Generic.List();
                                count.add(SVM.Generic.Tuple.create(i,j,k));
                                shared.add(count);
                            }
                        }
                    }
                }
            }

            // Create a table of indices for shared vectors
            var idx = 0,
                indices = new SVM.Generic.Dictionary();

            shared.keys().forEach((value, sv)=>
            {
                indices.add(sv, idx++);
            });

            // Create a lookup table for the machines
            var sharedVectors:number[][][] = SVM.Util.arrayPopulate(this.machines.length, 0);

            for (var i = 0; i < sharedVectors.length; i++)
            {
                sharedVectors[i] = SVM.Util.arrayPopulate(this.machines.length, 0);
                for (var j = 0; j < sharedVectors[i].length; j++)
                {
                    if (!this.machines[i][j].isCompact())
                    {
                        var ns = this.machines[i][j].supportVectors.length;
                        sharedVectors[i][j] = SVM.Util.arrayPopulate(ns, 0);

                        for (var k = 0; k < ns; k++)
                        {
                            var sv:number[] = this.machines[i][j].getSupportVector(k);

                            if (shared.containsKey(sv))
                            {
                                sharedVectors[i][j][k] = indices.get(sv);
                            }
                            else
                            {
                                sharedVectors[i][j][k] = -1;
                            }
                        }
                    }
                }
            }

            this.sharedVectorsCount = shared.keys().length;

            return sharedVectors;
        }

        private computeSequential(classA:number, classB:number, input:number[], output:number, cache):number
        {
            var machine = this.machines[classA - 1][classB],
                vectors = cache.vectors[classA - 1][classB],
                values:number[] = cache.products,
                sum = machine.getThreshold();

            if(machine.isCompact())
            {
                // For linear machines, computation is simpler
                var weights = machine.getWeights();
                for(var i = 0; i < weights.length; i++)
                {
                    sum += weights[i] * input[i];
                }
            }
            else
            {
                // For each support vector in the machine
                for(var i = 0; i < vectors.length; i++)
                {
                    var value;

                    // Check if it is a shared vector
                    var j = vectors[i];

                    if(j >= 0)
                    {
                        // This is a shared vector. Check
                        // if it has already been computed
                        if(!isNaN(values[j]))
                        {
                            // Yes, it has. Retrieve the value from the cache
                            value = values[j];
                        }
                        else
                        {
                            // No, it has not. Compute and store the computed value in the cache
                            value = values[j] = machine.getKernel().run(machine.getSupportVector(i), input);
                            //Interlocked.Increment(ref cache.Evaluations);
                        }
                    }
                    else
                    {
                        // This vector is not shared by any other machine. No need to cache
                        value = machine.getKernel().run(machine.getSupportVector(i), input);
                    }

                    sum += machine.getWeight(i) * value;
                }
            }

            // Produce probabilities if required
            if(machine.isProbabilistic())
            {
                throw new Error('Probabilistic SVMs are not supported yet');
            }
            else
            {
                return output >= 0 ? 1 : -1;
            }
        }

        private computeElimination(inputs:number[], reponses:number[], output:number, decisionPath:SVM.Generic.Tuple)
        {
            // Compute decision by Directed Acyclic Graph


            // Get a list of the shared vectors
            this.sharedVectors = new SVM.Generic.HashSet(this.computeSharedVectors());
            var vectors:number[][][] = this.sharedVectors.values();
        }
    }
}
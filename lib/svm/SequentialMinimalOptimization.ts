/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='./interfaces/ISupportVectorMachineLearning.ts' />
///<reference path='./interfaces/IKernel.ts' />

///<reference path='./kernels/LinearKernel.ts' />
///<reference path='./collections/HashSet.ts' />

///<reference path='./SupportVectorMachine.ts' />
///<reference path='./KernelSupportVectorMachine.ts' />


/// <summary>
///   Sequential Minimal Optimization (SMO) Algorithm
/// </summary>
///
/// <remarks>
/// <para>
///   The SMO algorithm is an algorithm for solving large quadratic programming (QP)
///   optimization problems, widely used for the training of support vector machines.
///   First developed by John C. Platt in 1998, SMO breaks up large QP problems into
///   a series of smallest possible QP problems, which are then solved analytically.</para>
/// <para>
///   This class follows the original algorithm by Platt with additional modifications
///   by Keerthi et al.</para>
///
/// <para>
///   References:
///   <list type="bullet">
///     <item><description>
///       <a href="http://en.wikipedia.org/wiki/Sequential_Minimal_Optimization">
///       Wikipedia, The Free Encyclopedia. Sequential Minimal Optimization. Available on:
///       http://en.wikipedia.org/wiki/Sequential_Minimal_Optimization </a></description></item>
///     <item><description>
///       <a href="http://research.microsoft.com/en-us/um/people/jplatt/smoTR.pdf">
///       John C. Platt, Sequential Minimal Optimization: A Fast Algorithm for Training Support
///       Vector Machines. 1998. Available on: http://research.microsoft.com/en-us/um/people/jplatt/smoTR.pdf </a></description></item>
///     <item><description>
///       <a href="http://www.cs.iastate.edu/~honavar/keerthi-svm.pdf">
///       S. S. Keerthi et al. Improvements to Platt's SMO Algorithm for SVM Classifier Design.
///       Technical Report CD-99-14. Available on: http://www.cs.iastate.edu/~honavar/keerthi-svm.pdf </a></description></item>
///     <item><description>
///       <a href="http://www.idiom.com/~zilla/Work/Notes/svmtutorial.pdf">
///       J. P. Lewis. A Short SVM (Support Vector Machine) Tutorial. Available on:
///       http://www.idiom.com/~zilla/Work/Notes/svmtutorial.pdf </a></description></item>
///     </list></para>
/// </remarks>
///
/// <example>
///   <code>
///   // Example XOR problem
///   double[][] inputs =
///   {
///       new double[] { 0, 0 }, // 0 xor 0: 1 (label +1)
///       new double[] { 0, 1 }, // 0 xor 1: 0 (label -1)
///       new double[] { 1, 0 }, // 1 xor 0: 0 (label -1)
///       new double[] { 1, 1 }  // 1 xor 1: 1 (label +1)
///   };
///
///   // Dichotomy SVM outputs should be given as [-1;+1]
///   int[] labels =
///   {
///          1, -1, -1, 1
///   };
///
///   // Create a Kernel Support Vector Machine for the given inputs
///   KernelSupportVectorMachine svm = new KernelSupportVectorMachine(new Gaussian(0.1), inputs[0].Length);
///
///   // Instantiate a new learning algorithm for SVMs
///   SequentialMinimalOptimization smo = new SequentialMinimalOptimization(svm, inputs, labels);
///
///   // Set up the learning algorithm
///   smo.Complexity = 1.0;
///
///   // Run the learning algorithm
///   double error = smo.Run();
///
///   // Compute the decision output for one of the input vectors
///   int decision = System.Math.Sign(svm.Compute(inputs[0])); // +1
///  </code>
/// </example>
///
class SequentialMinimalOptimization implements ISupportVectorMachineLearning {

    // Training data
    public inputs:number[][];
    public outputs:number[];

    public alphaA:number[];
    public alphaB:number[];
    public errors:number[];

    public biasLower:number;
    public biasUpper:number;

    // Learning algorithm parameters
    private cost:number = 0.6;
    private tolerance:number = 1e-2;
    private epsilon = 1e-3;
    private roundingEpsilon = 1e-12;

    // Support Vector Machine parameters
    private machine:SupportVectorMachine;
    private kernel:IKernel;

    private biasLowerIndex:number;
    private biasUpperIndex:number;

    private I0:HashSet;
    private I1:HashSet;
    private I2:HashSet;
    private I3:HashSet;

    constructor(machine:KernelSupportVectorMachine = null, inputs:number[][] = null, outputs:number[] = null)
    {
        if (machine === null)
        {
            throw new Error('Machine is null');
        }

        if (inputs === null)
        {
            throw new Error('Inputs is null');
        }

        if (outputs === null)
        {
            throw new Error('Outputs is null');
        }

        if (inputs.length !== outputs.length)
        {
            throw new Error('The number of inputs and outputs does not match.')
        }

        if (machine.getInputCount() > 0)
        {
            for (var i = 0; i < inputs.length; i++)
            {
                if (inputs[i].length !== machine.getInputCount())
                {
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
    public getComplexity():number
    {
        return this.cost;
    }

    /**
     * The cost parameter controls the trade off between allowing training
     * errors and forcing rigid margins. It creates a soft margin that permits
     * some misclassifications. Increasing the value of cost increases the cost of
     * misclassifying points and forces the creation of a more accurate model
     * that may not generalize well.
     *
     * @param value
     */
    public setComplexity(value:number):void
    {
        if (value <= 0)
        {
            throw new Error('Out of range');
        }

        this.cost = value;
    }

    /**
     * Epsilon for round-off errors. Default value is 1e-12.
     * @param value
     */
    public setEpsilon(value:number):void
    {
        if (value <= 0)
        {
            throw new Error('Out of range');
        }

        this.epsilon = value;
    }

    /**
     * @returns {number}
     */
    public getEpsilon():number
    {
        return this.epsilon;
    }

    /**
     *  Convergence tolerance. Default value is 1e-2 (0.01)
     *  The criterion for completing the model training process.
     * @param value
     */
    public setTolerance(value:number):void
    {
        if (value <= 0)
        {
            throw new Error('Out of range');
        }

        this.tolerance = value;
    }

    /**
     * @returns {number}
     */
    public getTolerance():number
    {
        return this.tolerance;
    }

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
    public run(computeError:boolean = false):number
    {
        var N = this.inputs.length;

        this.alphaA = Array.apply(null, new Array(N)).map(Number.prototype.valueOf, 0);
        this.alphaB = Array.apply(null, new Array(N)).map(Number.prototype.valueOf, 0);
        this.errors = Array.apply(null, new Array(N)).map(Number.prototype.valueOf, 0);

        this.I0 = new HashSet();
        this.I1 = new HashSet();
        this.I2 = new HashSet();
        this.I3 = new HashSet();

        for (var i = 0; i < N; i++)
        {
            this.I1.add(i);
        }

        this.biasUpperIndex = 0;
        this.biasLowerIndex = 0;

        this.biasUpper = this.outputs[0] + this.getEpsilon();
        this.biasLower = this.outputs[0] - this.getEpsilon();

        var numChanged = 0,
            examineAll = true;

        while (numChanged > 0 || examineAll)
        {
            numChanged = 0;
            if (examineAll)
            {
                for (var i = 0; i < N; i++)
                {
                    numChanged += this.examineExample(i);
                }
            }
            else
            {
                /**
                 * Loop over all examples where a and a*
                 * are greater than 0 and less than cost.
                 */
                for (var i = 0; i < N; i++)
                {
                    if ((0 < this.alphaA[i] && this.alphaA[i] < this.cost) || (0 < this.alphaB[i] && this.alphaB[i] < this.cost))
                    {
                        numChanged += this.examineExample(i);

                        if (this.biasUpper > this.biasLower - 2.0 * this.getTolerance())
                        {
                            numChanged = 0;
                            break;
                        }
                    }
                }
            }

            if (examineAll)
            {
                examineAll = false;
            }
            else if (numChanged === 0)
            {
                examineAll = true;
            }
        }

        var list = new HashSet();
        for (var i = 0; i < N; i++)
        {
            if (this.alphaA[i] > 0 || this.alphaB[i] > 0)
            {
                list.add(i);
            }
        }

        var vectors = list.count();

        this.machine.setSupportVectors(new Array(vectors));
        this.machine.setWeights(new Array(vectors));

        for (var i = 0; i < vectors; i++)
        {
            var j = list.at(i);
            this.machine.supportVectors[i] = this.inputs[j];
            this.machine.weights[i] = this.alphaA[j] - this.alphaB[j];
        }

        this.machine.setThreshold((this.biasLower + this.biasUpper) / 2.0);

        return (computeError) ? this.computeError(this.inputs, this.outputs) : 0.0;
    }

    /**
     * Chooses which multipliers to optimize using heuristics.
     * @param i2
     * @returns {number}
     */
    public examineExample(i2:number):number
    {
        var alpha2A = this.alphaA[i2],
            alpha2B = this.alphaB[i2],
            e2 = 0.0,
            epsilon = this.getEpsilon(),
            tolerance = this.getTolerance();

        //region Compute example error
        if (this.I0.contains(i2))
        {
            // Value is cached
            e2 = this.errors[i2];
        }
        else
        {
            // Value is not cached and should be computed
            this.errors[i2] = e2 = this.compute(this.inputs[i2]); //this.outputs[i2] =

            // Update thresholds
            if (this.I1.contains(i2))
            {
                if (e2 + epsilon < this.biasUpper)
                {
                    this.biasUpper = e2 + epsilon;
                    this.biasUpperIndex = i2;
                }
                else if (e2 - epsilon > this.biasLower)
                {
                    this.biasLower = e2 - epsilon;
                    this.biasLowerIndex = i2;
                }
            }
            else if (this.I2.contains(i2) && (e2 + epsilon > this.biasLower))
            {
                this.biasLower = e2 + epsilon;
                this.biasLowerIndex = i2;
            }
            else if (this.I3.contains(i2) && (e2 - epsilon < this.biasUpper))
            {
                this.biasUpper = e2 - epsilon;
                this.biasUpperIndex = i2;
            }
        }
        //end region


        //region
        //Check optimality using current thresholds
        //Check optimality using current thresholds then select
        //the best i1 to joint optimize when appropriate.
        var i1 = -1,
            optimal = true;

        // In case i2 is in the first set of indices:
        if (this.I0.contains(i2))
        {
            if (0 < alpha2A && alpha2A < this.cost)
            {
                if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance)
                {
                    optimal = false;
                    i1 = this.biasLowerIndex;

                    if ((e2 - epsilon) - this.biasUpper > this.biasLower - (e2 - epsilon))
                    {
                        i1 = this.biasUpperIndex;
                    }
                }
                else if ((e2 - epsilon) - this.biasUpper > 2.0 * tolerance)
                {
                    optimal = false;

                    i1 = this.biasUpperIndex;
                    if (this.biasLower - (e2 - epsilon) > (e2 - epsilon) - this.biasUpper)
                    {
                        i1 = this.biasLowerIndex;
                    }
                }
            }
            else if (0 < alpha2B && alpha2B < this.cost)
            {
                if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance)
                {
                    optimal = false;
                    i1 = this.biasLowerIndex;
                    if ((e2 + epsilon) - this.biasUpper > this.biasLower - (e2 + epsilon))
                    {
                        i1 = this.biasUpperIndex;
                    }
                }
                else if ((e2 + epsilon) - this.biasUpper > 2.0 * tolerance)
                {
                    optimal = false;
                    i1 = this.biasUpperIndex;
                    if (this.biasLower - (e2 + epsilon) > (e2 + epsilon) - this.biasUpper)
                    {
                        i1 = this.biasLowerIndex;
                    }
                }
            }
        }
        // In case i2 is in the second set of indices:
        else if (this.I1.contains(i2))
        {
            if (this.biasLower - (e2 + epsilon) > 2.0 * tolerance)
            {
                optimal = false;

                i1 = this.biasLowerIndex;
                if ((e2 + epsilon) - this.biasUpper > this.biasLower - (e2 + epsilon))
                {
                    i1 = this.biasUpperIndex;
                }
            }
            else if ((e2 - epsilon) - this.biasUpper > 2.0 * tolerance)
            {
                optimal = false;

                i1 = this.biasUpperIndex;
                if (this.biasLower - (e2 - epsilon) > (e2 - epsilon) - this.biasUpper)
                {
                    i1 = this.biasLowerIndex;
                }
            }
        }
        // In case i2 is in the third set of indices:
        else if (this.I2.contains(i2))
        {
            if ((e2 + epsilon) - this.biasUpper > 2.0 * tolerance)
            {
                optimal = false;
                i1 = this.biasUpperIndex;
            }
        }
        // In case i2 is in the fourth set of indices:
        else if (this.I3.contains(i2))
        {
            if (this.biasLower - (e2 - epsilon) > 2.0 * tolerance)
            {
                optimal = false;
                i1 = this.biasLowerIndex;
            }
        }
        else
        {
            throw new Error('BOM! I missed');
        }
        //end region

        if (optimal)
        {
            // The examples are already optimal.
            return 0;//  No need to optimize.
        }
        else
        {
            // Optimize i1 and i2
            if (this.takeStep(i1, i2))
            {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Computes the error ratio for a given set of input and outputs.
     * @param inputs
     * @param expectedOutputs
     * @returns {number}
     */
    public computeError(inputs:Array[], expectedOutputs:number[]):number
    {
        // Compute errors
        var sum = 0;
        for (var i = 0; i < inputs.length; i++)
        {
            var s = this.machine.compute(inputs[i]) - expectedOutputs[i];
            sum += s * s;
        }

        return s;
    }

    /**
     * Computes the SVM output for a given point.
     * @param point
     * @returns {number}
     */
    private compute(point:number[]):number
    {
        var sum = 0;
        for (var j = 0; j < this.alphaA.length; j++)
        {
            sum += (this.alphaA[j] - this.alphaB[j]) * this.kernel.run(point, this.inputs[j]);
        }
        return sum;
    }

    /**
     * Analytically solves the optimization problem for two Lagrange multipliers.
     * @param i1 {number}
     * @param i2 {number}
     * @returns {boolean}
     */
    private takeStep(i1:number, i2:number):boolean
    {
        if (i1 == i2)
        {
            return false;
        }

        // Lagrange multipliers
        var alpha1a = this.alphaA[i1],
            alpha1b = this.alphaB[i1],
            alpha2a = this.alphaA[i2],
            alpha2b = this.alphaB[i2];

        // Errors
        var e1 = this.errors[i1],
            e2 = this.errors[i2],
            delta = e1 - e2,
            epsilon = this.getEpsilon();

        // Kernel evaluation
        var k11 = this.kernel.run(this.inputs[i1], this.inputs[i1]),
            k12 = this.kernel.run(this.inputs[i1], this.inputs[i2]),
            k22 = this.kernel.run(this.inputs[i2], this.inputs[i2]),
            eta = k11 + k22 - 2.0 * k12,
            gamma = alpha1a - alpha1b + alpha2a - alpha2b;

        // Assume the kernel is positive definite.
        if (eta < 0)
        {
            eta = 0;
        }

        //region Optimize
        var case1 = false,
            case2 = false,
            case3 = false,
            case4 = false,
            changed = false,
            finished = false,
            L, H, a1, a2;

        while (!finished)
        {
            //  !case1 && (alpha1a > 0 || (alpha1b == 0 && delta > 0)) && (alpha2a > 0 || (alpha2b == 0 && delta < 0))
            if (!case1 && (alpha1a > 0 || (alpha1b == 0 && delta > 0)) && (alpha2a > 0 || (alpha2b == 0 && delta < 0)))
            {
                // Compute L and H (wrt alpha1, alpha2)
                L = Math.max(0, gamma - this.cost);
                H = Math.min(this.cost, gamma);

                if (L < H)
                {
                    if (eta > 0)
                    {
                        a2 = alpha2a - (delta / eta);

                        if (a2 > H)
                        {
                            a2 = H;
                        }
                        else if (a2 < L)
                        {
                            a2 = L;
                        }
                    }
                    else
                    {
                        var Lobj = -L * delta;
                        var Hobj = -H * delta;

                        if (Lobj > Hobj)
                        {
                            a2 = L;
                        }
                        else
                        {
                            a2 = H;
                        }
                    }

                    a1 = alpha1a - (a2 - alpha2a);

                    // Update alpha1, alpha2 if change is larger than some epsilon
                    if (Math.abs(a1 - alpha1a) > this.roundingEpsilon ||
                        Math.abs(a2 - alpha2a) > this.roundingEpsilon)
                    {
                        alpha1a = a1;
                        alpha2a = a2;
                        changed = true;
                    }
                }
                else
                {
                    finished = true;
                }

                case1 = true;
            }
            //       !case2 && (alpha1a > 0 || (alpha1b == 0 && delta > 2 * epsilon)) && (alpha2b > 0 || (alpha2a == 0 && delta > 2 * epsilon))
            else if (!case2 && (alpha1a > 0 || (alpha1b == 0 && delta > 2 * epsilon)) && (alpha2b > 0 || (alpha2a == 0 && delta > 2 * epsilon)))
            {
                // Compute L and H  (wrt alpha1, alpha2*)
                L = Math.max(0, -gamma);
                H = Math.min(this.cost, -gamma + this.cost);

                if (L < H)
                {
                    if (eta > 0)
                    {
                        a2 = alpha2b + ((delta - 2 * epsilon) / eta);

                        if (a2 > H)
                        {
                            a2 = H;
                        }
                        else if (a2 < L)
                        {
                            a2 = L;
                        }
                    }
                    else
                    {
                        var Lobj = L * (-2 * epsilon + delta);
                        var Hobj = H * (-2 * epsilon + delta);

                        if (Lobj > Hobj)
                        {
                            a2 = L;
                        }
                        else
                        {
                            a2 = H;
                        }
                    }
                    a1 = alpha1a + (a2 - alpha2b);

                    // Update alpha1, alpha2* if change is larger than some epsilon
                    if (Math.abs(a1 - alpha1a) > this.roundingEpsilon ||
                        Math.abs(a2 - alpha2b) > this.roundingEpsilon)
                    {
                        alpha1a = a1;
                        alpha2b = a2;
                        changed = true;
                    }
                }
                else
                {
                    finished = true;
                }

                case2 = true;
            }
            //       !case3 && (alpha1b > 0 || (alpha1a == 0 && delta < -2 * epsilon)) && (alpha2a > 0 || (alpha2b == 0 && delta < -2 * epsilon))
            else if (!case3 && (alpha1b > 0 || (alpha1a == 0 && delta < -2 * epsilon)) && (alpha2a > 0 || (alpha2b == 0 && delta < -2 * epsilon)))
            {
                // Compute L and H (wrt alpha1*, alpha2)
                L = Math.max(0, gamma);
                H = Math.min(this.cost, this.cost + gamma);

                if (L < H)
                {
                    if (eta > 0)
                    {
                        a2 = alpha2a - ((delta + 2 * epsilon) / eta);

                        if (a2 > H)
                        {
                            a2 = H;
                        }
                        else if (a2 < L)
                        {
                            a2 = L;
                        }
                    }
                    else
                    {
                        var Lobj = -L * (2 * epsilon + delta);
                        var Hobj = -H * (2 * epsilon + delta);

                        if (Lobj > Hobj)
                        {
                            a2 = L;
                        }
                        else
                        {
                            a2 = H;
                        }
                    }
                    a1 = alpha1b + (a2 - alpha2a);

                    // Update alpha1*, alpha2 if change is larger than some epsilon
                    if (Math.abs(a1 - alpha1b) > this.roundingEpsilon ||
                        Math.abs(a2 - alpha2a) > this.roundingEpsilon)
                    {
                        alpha1b = a1;
                        alpha2a = a2;
                        changed = true;
                    }
                }
                else
                {
                    finished = true;
                }

                case3 = true;
            }
            //       !case4 && (alpha1b > 0 || (alpha1a == 0 && delta < 0)) && (alpha2b > 0 || (alpha2a == 0 && delta > 0))
            else if (!case4 && (alpha1b > 0 || (alpha1a == 0 && delta < 0)) && (alpha2b > 0 || (alpha2a == 0 && delta > 0)))
            {
                // Compute L and H (wrt alpha1*, alpha2*)
                L = Math.max(0, -gamma - this.cost);
                H = Math.min(this.cost, -gamma);

                if (L < H)
                {
                    if (eta > 0)
                    {
                        a2 = alpha2b + delta / eta;

                        if (a2 > H)
                        {
                            a2 = H;
                        }
                        else if (a2 < L)
                        {
                            a2 = L;
                        }
                    }
                    else
                    {
                        var Lobj = L * delta;
                        var Hobj = H * delta;

                        if (Lobj > Hobj)
                        {
                            a2 = L;
                        }
                        else
                        {
                            a2 = H;
                        }
                    }

                    a1 = alpha1b - (a2 - alpha2b);

                    // Update alpha1*, alpha2* if change is larger than some epsilon
                    if (Math.abs(a1 - alpha1b) > this.roundingEpsilon ||
                        Math.abs(a2 - alpha2b) > this.roundingEpsilon)
                    {
                        alpha1b = a1;
                        alpha2b = a2;
                        changed = true;
                    }
                }
                else
                {
                    finished = true;
                }

                case4 = true;
            }
            else
            {
                finished = true;
            }

            // Update the delta
            delta += eta * ((alpha2a - alpha2b) - (this.alphaA[i2] - this.alphaB[i2]));
        }


        // If nothing has changed, return false.
        if (!changed)
        {
            return false;
        }
        // #endregion


        //  #region Update error cache
        // Update error cache using new Lagrange multipliers
        for (var i in this.I0.items)
        {
            if (<number>i !== i1 && <number>i !== i2)
            {
                // Update all in set i0 except i1 and i2 (because we have the kernel function cached for them)
                this.errors[i] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * this.kernel.run(this.inputs[i1], this.inputs[i])
                    + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * this.kernel.run(this.inputs[i2], this.inputs[i]);
            }
        }

        // Update error cache using new Lagrange multipliers for i1 and i2
        this.errors[i1] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k11
            + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k12;
        this.errors[i2] += ((this.alphaA[i1] - this.alphaB[i1]) - (alpha1a - alpha1b)) * k12
            + ((this.alphaA[i2] - this.alphaB[i2]) - (alpha2a - alpha2b)) * k22;
        //#endregion

        // to prevent precision problems
        var m_Del = 1e-10;
        if (alpha1a > this.cost - m_Del * this.cost)
        {
            alpha1a = this.cost;
        }
        else if (alpha1a <= m_Del * this.cost)
        {
            alpha1a = 0;
        }
        if (alpha1b > this.cost - m_Del * this.cost)
        {
            alpha1b = this.cost;
        }
        else if (alpha1b <= m_Del * this.cost)
        {
            alpha1b = 0;
        }
        if (alpha2a > this.cost - m_Del * this.cost)
        {
            alpha2a = this.cost;
        }
        else if (alpha2a <= m_Del * this.cost)
        {
            alpha2a = 0;
        }
        if (alpha2b > this.cost - m_Del * this.cost)
        {
            alpha2b = this.cost;
        }
        else if (alpha2b <= m_Del * this.cost)
        {
            alpha2b = 0;
        }


        // #region Store the new Lagrange multipliers
        // Store the changes in the alpha, alpha* arrays
        this.alphaA[i1] = alpha1a;
        this.alphaB[i1] = alpha1b;
        this.alphaA[i2] = alpha2a;
        this.alphaB[i2] = alpha2b;
        // #endregion


        // #region Update the sets of indices
        // Update the sets of indices (for i1)
        if ((0 < alpha1a && alpha1a < this.cost) || (0 < alpha1b && alpha1b < this.cost))
        {
            this.I0.add(i1);
        }
        else
        {
            this.I0.remove(i1);
        }

        if (alpha1a == 0 && alpha1b == 0)
        {
            this.I1.add(i1);
        }
        else
        {
            this.I1.remove(i1);
        }

        if (alpha1a == 0 && alpha1b == this.cost)
        {
            this.I2.add(i1);
        }
        else
        {
            this.I2.remove(i1);
        }

        if (alpha1a == this.cost && alpha1b == 0)
        {
            this.I3.add(i1);
        }
        else
        {
            this.I3.remove(i1);
        }

        // Update the sets of indices (for i2)
        if ((0 < alpha2a && alpha2a < this.cost) || (0 < alpha2b && alpha2b < this.cost))
        {
            this.I0.add(i2);
        }
        else
        {
            this.I0.remove(i2);
        }

        if (alpha2a == 0 && alpha2b == 0)
        {
            this.I1.add(i2);
        }
        else
        {
            this.I1.remove(i2);
        }

        if (alpha2a == 0 && alpha2b == this.cost)
        {
            this.I2.add(i2);
        }
        else
        {
            this.I2.remove(i2);
        }

        if (alpha2a == this.cost && alpha2b == 0)
        {
            this.I3.add(i2);
        }
        else
        {
            this.I3.remove(i2);
        }
        // #endregion


        // #region Compute the new thresholds
        this.biasLower = -Math.pow(2,32);
        this.biasUpper = Math.pow(2,32);
        this.biasLowerIndex = -1;
        this.biasUpperIndex = -1;

        for (var i in this.I0.items)
        {
            if (0 < this.alphaB[i] && this.alphaB[i] < this.cost
                && this.errors[i] + epsilon > this.biasLower)
            {
                this.biasLower = this.errors[i] + epsilon;
                this.biasLowerIndex = i;
            }
            else if (0 < this.alphaA[i] && this.alphaA[i] < this.cost
                && this.errors[i] - epsilon > this.biasLower)
            {
                this.biasLower = this.errors[i] - epsilon;
                this.biasLowerIndex = i;
            }
            if (0 < this.alphaA[i] && this.alphaA[i] < this.cost
                && this.errors[i] - epsilon < this.biasUpper)
            {
                this.biasUpper = this.errors[i] - epsilon;
                this.biasUpperIndex = i;
            }
            else if (0 < this.alphaB[i] && this.alphaB[i] < this.cost
                && this.errors[i] + epsilon < this.biasUpper)
            {
                this.biasUpper = this.errors[i] + epsilon;
                this.biasUpperIndex = i;
            }
        }

        if (!this.I0.contains(i1))
        {
            if (this.I2.contains(i1) && this.errors[i1] + epsilon > this.biasLower)
            {
                this.biasLower = this.errors[i1] + epsilon;
                this.biasLowerIndex = i1;
            }
            else if (this.I1.contains(i1) && this.errors[i1] - epsilon > this.biasLower)
            {
                this.biasLower = this.errors[i1] - epsilon;
                this.biasLowerIndex = i1;
            }

            if (this.I3.contains(i1) && this.errors[i1] - epsilon < this.biasUpper)
            {
                this.biasUpper = this.errors[i1] - epsilon;
                this.biasUpperIndex = i1;
            }
            else if (this.I1.contains(i1) && this.errors[i1] + epsilon < this.biasUpper)
            {
                this.biasUpper = this.errors[i1] + epsilon;
                this.biasUpperIndex = i1;
            }
        }

        if (!this.I0.contains(i2))
        {
            if (this.I2.contains(i2) && this.errors[i2] + epsilon > this.biasLower)
            {
                this.biasLower = this.errors[i2] + epsilon;
                this.biasLowerIndex = i2;
            }
            else if (this.I1.contains(i2) && this.errors[i2] - epsilon > this.biasLower)
            {
                this.biasLower = this.errors[i2] - epsilon;
                this.biasLowerIndex = i2;
            }

            if (this.I3.contains(i2) && this.errors[i2] - epsilon < this.biasUpper)
            {
                this.biasUpper = this.errors[i2] - epsilon;
                this.biasUpperIndex = i2;
            }
            else if (this.I1.contains(i2) && this.errors[i2] + epsilon < this.biasUpper)
            {
                this.biasUpper = this.errors[i2] + epsilon;
                this.biasUpperIndex = i2;
            }
        }

        if (this.biasLowerIndex == -1 || this.biasUpperIndex == -1)
        {
            throw new Error('cry cry');
        }

        //#endregion


        // Success.
        return true;
    }
}
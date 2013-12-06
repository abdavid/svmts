/**
 * Created by davidatborresen on 03.12.13.
 */

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
export class SupportVectorMachine implements ISupportVectorMachine
{
    private inputCount:number;
    private threshold:number;

    public supportVectors:number[][];
    public weights:number[];

    /**
     * @param inputs
     */
        constructor(inputs:number)
    {
        this.inputCount = inputs;
    }

    /**
     * @returns {number}
     */
    public getInputCount():number
    {
        return this.inputCount;
    }

    /**
     * @returns {boolean}
     */
    public isProbabilistic():boolean
    {
        return false;
    }

    /**
     * @returns {boolean}
     */
    public isCompact():boolean
    {
        return this.supportVectors === null;
    }

    /**
     * @returns {number[][]}
     */
    public getSupportVectors():number[][]
    {
        return this.supportVectors;
    }

    /**
     * @param index
     * @returns {number[]}
     */
    public getSupportVector(index:number):number[]
    {
        return this.supportVectors[index];
    }

    /**
     * @param value
     */
    public setSupportVectors(value:number[][]):void
    {
        this.supportVectors = value;
    }

    /**
     * @param index
     * @param value
     */
    public setSupportVector(index:number,value:number[])
    {
        this.supportVectors[index] = value;
    }

    /**
     * @param index
     * @param value
     */
    public setWeight(index:number, value:number):void
    {
        this.weights[index] = value;
    }

    /**
     * @param index
     * @param value
     */
    public getWeight(index:number):number
    {
        return this.weights[index];
    }

    /**
     * Sets the collection of weights used by this machine.
     * @param value
     */
    public setWeights(value:number[]):void
    {
        this.weights = value;
    }

    /**
     * Gets the collection of weights used by this machine.
     * @returns {number[]}
     */
    public getWeights():number[]
    {
        return this.weights;
    }

    /**
     * Sets the threshold (bias) term for this machine.
     * @param value
     */
    public setThreshold(value:number):void
    {
        this.threshold = value;
    }

    /**
     * Gets the threshold (bias) term for this machine.
     * @returns {number}
     */
    public getThreshold():number
    {
        return this.threshold;
    }

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
    public compute(inputs:number[], output:number = 0):number
    {
        output = this.threshold;

        if(this.supportVectors === null)
        {
            for (var i = 0; i < this.weights.length; i++)
            {
                output += this.weights[i] * inputs[i];
            }
        }
        else
        {
            for (var i = 0; i < this.supportVectors.length; i++)
            {
                var sum = 0;
                for (var j = 0; j < inputs.length; j++)
                {
                    sum += this.supportVectors[i][j] * inputs[j];
                }

                output += this.weights[i] * sum;
            }
        }

        return !isNaN(output) && output >= 0 ? 1 : -1;
    }

    /**
     * @returns {LinearKernel}
     */
    public getKernel():IKernel
    {
        return new SVM.Kernels.LinearKernel();
    }

    /**
     * @returns {string}
     */
    public toJSON():string
    {
        return JSON.stringify({
            supportVectors: this.getSupportVectors(),
            weights: this.getWeights(),
            inputCount: this.getInputCount(),
            threshold:this.getThreshold()
        });
    }

    /**
     * @param data
     *
     public fromJSON(data:Object):void
     {
         this.setSupportVectors(data.supportVectors);
         this.setWeights(data.weights);
         this.inputCount = data.inputCount;
         this.setThreshold(data.threshold);
     }
     */
}
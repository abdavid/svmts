/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='./interfaces/ISupportVectorMachine.ts' />
interface ILinkFunction{}


class SupportVectorMachine implements ISupportVectorMachine
{
    public supportVectors:Array[] = null;

    public weights:number[] = null;

    private inputCount:number = null;

    private threshold:number = null;

    private linkFunction:ILinkFunction = null;

    /**
     * @param inputs
     */
    constructor(inputs:number)
    {
        this.inputCount = inputs;
    }

    public getInputCount():number
    {
        return this.inputCount;
    }

    /**
     * @returns {ILinkFunction}
     */
    public link():ILinkFunction
    {
        return <ILinkFunction>{};
    }

    /**
     * @returns {boolean}
     */
    public isProbabilistic():boolean
    {
        return this.linkFunction !== null;
    }

    public isCompact():boolean
    {
        return this.supportVectors === null;
    }

    /**
     * @returns {Array[]}
     */
    public getSupportVectors():Array[]
    {
        return this.supportVectors;
    }

    /**
     * @param inputs
     */
    public setSupportVectors(value:Array[]):void
    {
        this.supportVectors = value;
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
     * Computes the given input to produce the corresponding output.
     *
     * @remark For a binary decision problem, the decision for the negative
     * or positive class is typically computed by taking the sign of
     * the machine's output.
     * @param inputs An input vector.
     * @returns {number}
     *
     * If this is a probabilistic machine, the
     * return value is the probability of the positive class. If this is
     * a standard machine, the output is the distance to the decision
     * hyperplane in feature space.
     */
    public compute(inputs:number[]):number
    {
        var output = this.threshold;

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
                    output += this.weights[i] * sum;
                }
            }
        }

        if (this.isProbabilistic())
        {
            //output = this.linkFunction.inverse(output);
            //return output >= 0.5 ? +1 : -1;
        }

        return output >= 0 ? 1 : -1;
    }
}
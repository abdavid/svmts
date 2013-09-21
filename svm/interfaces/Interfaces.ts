/**
 * Created by davidatborresen on 9/3/13.
 */


interface IKernel {

    /**
     * The kernel function.
     * @param x Vector x in input space.
     * @param y Vector y in input space.
     */
    run(x:number[], y:number[]):number;
}

interface ISupportVectorMachineLearning {

    run(computeError:boolean);
}

/**
 * Common interface for Support Vector Machines
 */
interface ISupportVectorMachine {

    /**
     * Computes the given input to produce the corresponding output.
     * @param inputs An input vector.
     * @param output The output for the given input.
     * @returns number The decision label for the given input.
     */
    compute(inputs:number[]):number;
    compute(inputs:number[], output:number):number;

    getKernel():IKernel;

    getInputCount():number;

    getSupportVectors():number[][];
    setSupportVectors(supportVectors:number[][]):void;
    setSupportVector(index:number,supportVector:number[]):void;
    getSupportVector(index:number):number[];

    getWeights():number[];
    getWeight(index:number):number;
    setWeights(weights:number[]):void;
    setWeight(index:number, value:number):void;

    setThreshold(bias:number):void
    getThreshold():number;
}

interface IEstimable {

    /**
     * Estimates kernel parameters from the data.
     * @param inputs The input data.
     */
    estimate(inputs:Array[]):void;
}

interface IDistance {

    /**
     * Computes the distance in input space
     * between two points given in feature space.
     * @param x Vector x in feature (kernel) space.
     * @param y Vector y in feature (kernel) space.
     * @return number Distance between x and y in input space.
     */
    distance(x:number[], y:number[]):number;
}

interface IRenderer {

    render():IRenderer;
}


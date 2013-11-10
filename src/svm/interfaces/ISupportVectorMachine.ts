/**
 * Created by davidatborresen on 12.10.13.
 */
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
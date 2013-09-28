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

    machine:ISupportVectorMachine;
    alphaA:number[];
    alphaB:number[];
    inputs:number[][];
    outputs:number[];
    biasLower:number;
    biasUpper:number;
    kernel:IKernel;

    run(computeError:boolean);
    getComplexity():number;
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

interface ICollection
{
    values():any[];
    keys():string[];
    equals(collection:ICollection):boolean;
    clone():ICollection;
}

interface IList
{
    add(whatever:any):void;
    count():number;
    remove(key:number):void;
    contains(key:number):boolean;
    clear():void;
}

interface IRenderer<T>
{
    (teacher:ISupportVectorMachineLearning):IRenderer<T>
    render():IRenderer<T>;
    drawBackground(matrix:number[][], color:string):IRenderer<T>;
    drawAxis():IRenderer<T>;
    drawMargin():IRenderer<T>;
    drawStatus():IRenderer<T>;
    drawCircle(x:number, y:number, r:number):IRenderer<T>
    drawRect(x:number, y:number, w:number, h:number):IRenderer<T>
    drawBubble(x:number, y:number, w:number, h:number, radius:number):IRenderer<T>
    drawDataPoints(inputs:number[], outputs:number[], alphaA:number[], alphaB:number[], complexity:number):IRenderer<T>;
}

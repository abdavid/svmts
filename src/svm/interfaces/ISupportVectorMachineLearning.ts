/**
 * Created by davidatborresen on 12.10.13.
 */


///<reference path='./IKernel.ts' />
///<reference path='./ISupportVectorMachine.ts' />

interface ISupportVectorMachineLearning {

    machine:ISupportVectorMachine;
    alphaA:Float64Array;
    alphaB:Float64Array;
    errors:Float64Array;
    inputs:number[][];
    outputs:number[];
    biasLower:number;
    biasUpper:number;
    kernel:IKernel;

    run(computeError?:boolean):number;
    getComplexity():number;
    setComplexity(c:number):void;
}
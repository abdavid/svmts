/**
 * Created by davidatborresen on 12.10.13.
 */
interface IKernel {

    /**
     * The kernel function.
     * @param x Vector x in input space.
     * @param y Vector y in input space.
     */
    run(x:number[], y:number[]):number;
}

interface IInteractableKernel
{
    properties:Object;
    getProperties():string[];
    getProperty(name:string):IKernelProperty;
    setProperty(name:string, value:number):void;
}

interface IKernelProperty
{
    name:string;
    value:number;
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

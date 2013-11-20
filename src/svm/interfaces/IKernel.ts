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
    getProperties():string[];
    getProperty(name:string):IKernelProperty;
    getPropertyType(name:string):PropertyType;
}

interface IKernelProperty extends PropertyDescriptor
{
    type:PropertyType;
    name?:string;
}

interface IKernelPropertyMap extends PropertyDescriptor
{
    [s: string]: IKernelProperty;
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

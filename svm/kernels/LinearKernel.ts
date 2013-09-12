/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='../interfaces/IDistance.ts' />


class LinearKernel implements IKernel, IDistance
{
    public constant:number;

    /**
     * @param constant
     */
    constructor(constant:number = 1)
    {
        this.constant = constant;
    }
    
    /**
     * Linear kernel function.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Dot product in feature (kernel) space
     */
    public run(x:number[], y:number[]):number
    {
        var sum = this.constant;

        for (var i = 0; i < x.length; i++)
        {
            sum += x[i] * y[i];
        }

        return sum;
    }

    /**
     * Computes the distance in input space
     * between two points given in feature space.
     *
     * @param x Vector X in input space
     * @param y Vector Y in input space
     * @returns {number} Distance between x and y in input space.
     */
    public distance(x:number[], y:number[]):number
    {
        return this.run(x, x) + this.run(y ,y) - 2.0 * this.run(x ,y);
    }
}
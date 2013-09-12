/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />

/**
 * Symmetric Triangle Kernel.
 */
class SymmetricTriangleKernel implements IKernel {

    public gamma:number;

    constructor(gamma:number)
    {
        this.gamma = gamma;
    }

    public run(x:number[], y:number[]):number
    {
        var norm = 0.0, d;
        for(var i = 0; i < x.length; i++)
        {
            d = x[i] - y[i];
            norm += d * d;
        }

        var z = 1.0 - this.gamma * Math.sqrt(norm);

        return (z > 0) ? z : 0;
    }
}
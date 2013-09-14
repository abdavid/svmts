/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseBessel.ts' />

/**
 * The Bessel kernel is well known in the theory of function spaces of fractional smoothness.
 */
class BesselKernel extends BaseBessel implements IKernel {

    public order:number;
    public sigma:number;

    constructor(order:number = 1,sigma:number = 1)
    {
        super();

        this.order = order;
        this.sigma = sigma;
    }

    public run(x:number[], y:number[]):number
    {
        var norm = 0.0;

        for(var i = 0; i < x.length; i++)
        {
            var d = x[i] - y[i];
            norm += d*d;
        }

        norm = Math.sqrt(norm);

        return this.J(this.order, this.sigma * norm) / Math.pow(norm, -norm * this.order);

    }
}
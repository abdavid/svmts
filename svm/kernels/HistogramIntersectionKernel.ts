/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />

/**
 * The Cauchy kernel comes from the Cauchy distribution (Basak, 2008). It is a
 * long-tailed kernel and can be used to give long-range influence and sensitivity
 * over the high dimension space.
 */
class CauchyKernel implements IKernel {

    public sigma:number;

    constructor(sigma:number)
    {
        this.sigma = sigma;
    }

    public run(x:number[], y:number[]):number
    {
        // Optimization in case x and y are
        // exactly the same object reference.
        if(x == y)
        {
            return 1.0;
        }

        var norm = 0.0;
        for(var i = 0; i < x.length; i++)
        {
            var d = x[i] - y[i];
            norm += d * d;
        }

        return (1.0 / (1.0 + norm / this.sigma));

    }
}
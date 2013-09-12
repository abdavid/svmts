/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />

class WaveletKernel implements IKernel {

    public dilation:number = 1.0;
    public translation:number = 0.0;
    public invariant:boolean = true;


    constructor(invariant:boolean, dilation:number);

    constructor(invariant:boolean, dilation:number, mother:Function);

    /**
     * @param invariant
     */
    constructor(invariant:boolean = true)
    {
        this.invariant = invariant;
    }

    public run(x:number[], y:number[]):number
    {
        var prod = 1.0;

        if(this.invariant)
        {
            for(var i = 0; i < x.length; i++)
            {
                prod *=(this.mother((x[i] - this.translation) / this.dilation)) *
                       (this.mother((y[i] - this.translation) / this.dilation));
            }
        }
        else
        {
            for(var i = 0; i < x.length; i++)
            {
                prod *= this.mother((x[i] - y[i] / this.dilation));
            }
        }

        return prod;
    }

    private mother(x:number):number
    {
        return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
    }

}
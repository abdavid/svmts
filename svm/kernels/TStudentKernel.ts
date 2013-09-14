/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />

class TStudentKernel implements IKernel {

    public degree:number;

    /**
     * @param invariant
     */
    constructor(degree:number = 1)
    {
        this.degree = degree;
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

        return 1.0 / (1.0 + Math.pow(norm, this.degree));
    }
}
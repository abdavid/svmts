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



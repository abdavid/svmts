/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {
    /**
     * Generalized Histogram Intersection Kernel.
     *
     * The Generalized Histogram Intersection kernel is built based on the
     * Histogram Intersection Kernel for image classification but applies
     * in a much larger variety of contexts (Boughorbel, 2005).
     */
    export class HistogramIntersectionKernel implements IKernel {

        public alpha:number;
        public beta:number;

        constructor(alpha:number = 1, beta:number = 1)
        {
            this.alpha = alpha;
            this.beta = beta;
        }

        public run(x:number[], y:number[]):number
        {
            var sum = 0.0;
            for(var i = 0; i < x.length; i++)
            {
                sum += Math.min(
                    Math.pow(Math.abs(x[i]), this.alpha),
                    Math.pow(Math.abs(y[i]), this.beta)
                );
            }

            return sum;
        }
    }
}

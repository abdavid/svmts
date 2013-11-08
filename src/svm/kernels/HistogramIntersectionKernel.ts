/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {
    /**
     * Generalized Histogram Intersection Kernel.
     *
     * The Generalized Histogram Intersection kernel is built based on the
     * Histogram Intersection Kernel for image classification but applies
     * in a much larger variety of contexts (Boughorbel, 2005).
     */
    export class HistogramIntersectionKernel extends BaseKernel implements IKernel
    {
        public properties = {
            alpha : {
                type: 'number',
                value: 0
            },
            beta : {
                type: 'number',
                value: 0
            }
        }

        /**
         * @param alpha
         * @param beta
         */
        constructor(alpha:number = 1, beta:number = 1)
        {
            super();

            this.setProperty('alpha', alpha);
            this.setProperty('beta', beta);
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var sum = 0.0;
            for(var i = 0; i < x.length; i++)
            {
                sum += Math.min(
                    Math.pow(Math.abs(x[i]), this.properties.alpha.value),
                    Math.pow(Math.abs(y[i]), this.properties.beta.value)
                );
            }

            return sum;
        }
    }
}

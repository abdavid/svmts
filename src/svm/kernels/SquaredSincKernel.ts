///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {

    /**
     * Squared Sinc Kernel.
     */
    export class SquaredSincKernel extends BaseKernel implements IKernel
    {
        public properties = {
            gamma: {
                type:'number',
                value:0
            }
        };

        /**
         * @param gamma
         */
        constructor(gamma:number = 1.0)
        {
            super();

            this.properties.gamma.value = gamma;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var norm = 0.0, d;
            for(var i = 0; i < x.length; i++)
            {
                d = x[i] - y[i];
                norm += d * d;
            }

            var num = this.properties.gamma.value * Math.sqrt(norm);
            var den = this.properties.gamma.value * this.properties.gamma.value * norm;

            return Math.sin(num) / den;
        }
    }
}

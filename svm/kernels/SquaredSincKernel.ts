
///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {
    /**
     * Squared Sinc Kernel.
     */
    export class SquaredSincKernel implements IKernel {

        public gamma:number;

        /**
         * @param gamma
         */
        constructor(gamma:number = 1.0)
        {
            this.gamma = gamma;
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

            var num = this.gamma * Math.sqrt(norm);
            var den = this.gamma * this.gamma * norm;

            return Math.sin(num) / den;
        }
    }
}

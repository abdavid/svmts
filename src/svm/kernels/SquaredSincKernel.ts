///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels {

    /**
     * Squared Sinc Kernel.
     */
    export class SquaredSincKernel extends BaseKernel implements IKernel
    {
        constructor()
        {
            super();
            super.initialize({
                gamma: {
                    type: PropertyType.NUMBER,
                    value: 1.0,
                    writable: true
                }
            });
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

/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/Interfaces.ts' />
module SVM.Kernels
{
    export class WaveKernel implements IKernel {

        public sigma:number;

        /**
         * @param sigma
         */
        constructor(sigma:number = 1)
        {
            this.sigma = sigma;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var norm = 0.0;
            for(var i = 0; i < x.length; i++)
            {
                var d = x[i] - y[i];
                norm += d * d;
            }

            if(this.sigma == 0 || norm == 0)
            {
                return 0;
            }
            else
            {
                return (this.sigma / norm) * Math.sin(norm / this.sigma);
            }
        }
    }
}

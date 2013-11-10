/**
 * Created by davidatborresen on 9/3/13.
 */

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels
{
    export class WaveKernel extends BaseKernel implements IKernel
    {
        public properties = {
            sigma: {
                type:'number',
                value:0
            }
        };

        /**
         * @param sigma
         */
        constructor(sigma:number = 1)
        {
            super();

            this.properties.sigma.value = sigma;
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

            if(this.properties.sigma.value == 0 || norm == 0)
            {
                return 0;
            }
            else
            {
                return (this.properties.sigma.value / norm) * Math.sin(norm / this.properties.sigma.value);
            }
        }
    }
}

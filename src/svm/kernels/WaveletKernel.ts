///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels
{
    export class WaveletKernel extends BaseKernel implements IKernel
    {
        constructor()
        {
            super();

            super.initialize({
                dilation: {
                    type:'number',
                    value:1.0,
                    writable:true
                },
                translation: {
                    type:'number',
                    value:1.0,
                    writable:true
                },
                invariant:{
                    type:'boolean',
                    value: false,
                    writable:false
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
            var prod = 1.0;

            if(this.invariant)
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= (this.mother((x[i] - this.translation) / this.dilation)) *
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

        /**
         * @param x
         * @returns {number}
         */
        private mother(x:number):number
        {
            return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
        }

    }
}

///<reference path='../interfaces/IKernel.ts' />
///<reference path='./BaseKernel.ts' />

module SVM.Kernels
{
    export class WaveletKernel extends BaseKernel implements IKernel
    {
        public properties = {
            dilation: {
                type:'number',
                value:0
            },
            translation: {
                type:'number',
                value:0
            },
            invariant:{
                type:'boolean',
                value: true
            }
        };

        private _mother:Function;

        /**
         * @param dilation
         * @param translation
         * @param invariant
         * @param mother
         */
        constructor(dilation:number = 1.0, translation:number = 1.0, invariant:boolean = true, mother:Function = null)
        {
            super();

            this.properties.invariant.value = invariant;
            this.properties.dilation.value = dilation;
            this.properties.translation.value = translation
            this._mother = mother || this.mother;
        }

        /**
         * @param x
         * @param y
         * @returns {number}
         */
        public run(x:number[], y:number[]):number
        {
            var prod = 1.0;

            if(this.properties.invariant)
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= (this._mother((x[i] - this.properties.translation.value) / this.properties.dilation.value)) *
                        (this._mother((y[i] - this.properties.translation.value) / this.properties.dilation.value));
                }
            }
            else
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= this._mother((x[i] - y[i] / this.properties.dilation.value));
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

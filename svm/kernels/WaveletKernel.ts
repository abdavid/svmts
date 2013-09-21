///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels
{
    export class WaveletKernel implements IKernel {

        public dilation:number;
        public translation:number;
        public invariant:boolean = true;
        public _mother:Function;

        /**
         * @param dilation
         * @param translation
         * @param invariant
         * @param mother
         */
        constructor(dilation:number = 1.0, translation:number = 1.0, invariant:boolean = true, mother:Function = null)
        {
            this.invariant = invariant;
            this.dilation = dilation;
            this.translation = translation
            this._mother = mother || this.mother;
        }

        public run(x:number[], y:number[]):number
        {
            var prod = 1.0;

            if(this.invariant)
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= (this._mother((x[i] - this.translation) / this.dilation)) *
                        (this._mother((y[i] - this.translation) / this.dilation));
                }
            }
            else
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= this._mother((x[i] - y[i] / this.dilation));
                }
            }

            return prod;
        }

        private mother(x:number):number
        {
            return Math.cos(1.75 * x) * Math.exp(-(x * x) / 2.0);
        }

    }
}

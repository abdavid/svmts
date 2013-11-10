///<reference path='../interfaces/IKernel.ts' />

module SVM.Kernels
{
    export class WaveletKernel implements IKernel
    {
        private _dilation:number;
        private _translation:number;
        private _invariant:boolean = true;
        private _mother:Function;

        /**
         * @param dilation
         * @param translation
         * @param invariant
         * @param mother
         */
        constructor(dilation:number = 1.0, translation:number = 1.0, invariant:boolean = true, mother:Function = null)
        {
            this._invariant = invariant;
            this._dilation = dilation;
            this._translation = translation
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

            if(this._invariant)
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= (this._mother((x[i] - this._translation) / this._dilation)) *
                        (this._mother((y[i] - this._translation) / this._dilation));
                }
            }
            else
            {
                for(var i = 0; i < x.length; i++)
                {
                    prod *= this._mother((x[i] - y[i] / this._dilation));
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

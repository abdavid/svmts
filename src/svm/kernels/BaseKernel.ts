/**
 * Created by davidatborresen on 29.09.13.
 */

///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/IKernel.ts' />

module SVM.Kernels {

    export class BaseKernel implements IInteractableKernel
    {
        public properties:Object = {};

        /**
         * @returns {string[]}
         */
        public getProperties():string[]
        {
            return _.keys(this.properties);
        }

        /**
         * @param name
         * @returns {*}
         */
        public getProperty(name:string):IKernelProperty
        {
            if(name in this.properties)
            {
                return this.properties[name];
            }

            return undefined;
        }

        /**
         * @param name
         * @param value
         */
        public setProperty(name:string, value:number):SVM.Kernels.BaseKernel
        {
            if(name in this)
            {
                this[name](value);
            }
            else if(name in this.properties && 'value' in this.properties[name])
            {
                this.properties[name].value = value;
            }
            else
            {
                throw new Error('Undefined property')
            }

            return this;
        }
    }
}
/**
 * Created by davidatborresen on 29.09.13.
 */

///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/Interfaces.ts' />

module SVM.Kernels {

    export class BaseKernel implements IInteractableKernel
    {
        private _properties:Object = {};

        /**
         * @param properties
         */
        constructor(properties:IKernelProperty[])
        {
            this.initProperties(properties);
        }

        /**
         * @param properties
         */
        public initProperties(properties:IKernelProperty[])
        {
            for(var i = 0; i < properties.length; i++)
            {
                var property = properties[i];
                this._properties[property.name] = property.value;
            }
        }

        /**
         * @returns {string[]}
         */
        public getKernelProperties():string[]
        {
            return _.keys(this._properties);
        }

        /**
         * @param name
         * @returns {*}
         */
        public getKernelProperty(name:string):number
        {
            if(name in this._properties)
            {
                return this._properties[name];
            }

            return undefined;
        }

        /**
         * @param name
         * @param value
         */
        public setKernelProperty(name:string, value:number):void
        {
            if(name in this._properties)
            {
                this._properties[name] = value;
            }
            else
            {
                throw new Error('Undefined property')
            }
        }
    }
}
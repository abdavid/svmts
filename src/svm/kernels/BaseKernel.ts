/**
 * Created by davidatborresen on 29.09.13.
 */

///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/IKernel.ts' />

class PropertyType {
    static NUMBER = 'number';
    static BOOLEAN = 'boolean';
    static UNDEFINED = 'undefined';
}

module SVM.Kernels {

    export class BaseKernel implements IInteractableKernel
    {
        private properties:IKernelPropertyMap = {};

        public initialize(map:IKernelPropertyMap):void
        {
            this.properties = map;
            Object.defineProperties(this, this.properties);
            console.log('defining getters / setters for %O', this.properties);
        }

        /**
         * @returns {string[]}
         */
        public getProperties():string[]
        {
            return Object.keys(this.properties);
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

            return null;
        }

        /**
         * @param name
         * @returns {any}
         */
        public getPropertyType(name:string):PropertyType
        {
            return this.properties[name].type || void(name);
        }
    }
}
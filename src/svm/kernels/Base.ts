/**
 * Created by davidatborresen on 29.09.13.
 */
///<reference path='../../definitions/underscore.d.ts' />
///<reference path='../interfaces/IKernel.ts' />

import _ = require("underscore");

export class PropertyType {
    public static NUMBER = 'number';
    public static BOOLEAN = 'boolean';
    public static UNDEFINED = 'undefined';
}

export class Base implements IInteractableKernel
{
    public attributes:IKernelProperty[];

    /**
     * @returns {string[]}
     */
    public getAttributes():string[]
    {
        return Object.keys(this.getAttributeBy('name'));
    }

    /**
     * @param name
     * @returns {*}
     */
    public getAttribute(name:string):IKernelProperty
    {
        var attribute = this.getAttributeBy('name');
        if (name in attribute)
        {
            return attribute[name];
        }

        return null;
    }

    /**
     * @param name
     * @returns {any}
     */
    public getAttributeType(name:string):string
    {
        return this.getAttribute(name).type || void(name);
    }

    /**
     * @param prop
     * @returns {Dictionary<T>}
     */
    public getAttributeBy(prop:string):Object
    {
        return _.indexBy(this.attributes, prop);
    }
}
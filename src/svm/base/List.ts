/**
 * Created by davidatborresen on 03.12.13.
 */
///<reference path='../interfaces/ICollection.ts' />
///<reference path='../../definitions/underscore.d.ts' />

export class List implements IList
{
    public _elements:any[] = [];

    constructor(elements = [])
    {
        _.map(elements, (value)=>
        {
            this.add(value);
        });
    }

    /**
     * @param value
     * @returns {boolean}
     */
    public contains(value:any):boolean
    {
        return _.contains(this._elements, value);
    }

    /**
     * @param key
     * @param value
     */
    public add(value:any):void
    {
        this._elements.push(value);
    }

    /**
     * @param key
     */
    public remove(value):void
    {
        this._elements = _.without(this._elements, value);
    }

    /**
     * @returns {number}
     */
    public count():number
    {
        return _.size(this._elements);
    }

    public clear():void
    {
        this._elements = [];
    }

    /**
     * @returns {string}
     */
    public toString():string
    {
        return '[object List]';
    }
}
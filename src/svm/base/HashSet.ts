/**
 * Created by davidatborresen on 03.12.13.
 */

///<reference path='../interfaces/ICollection.ts' />
///<reference path='../../definitions/underscore.d.ts' />

export class HashSet
{
    private _elements:any[];

    /**
     * @param elements
     */
    constructor(elements:any[] = [])
    {
        this._elements = elements;
    }

    /**
     * @param value
     * @returns {boolean}
     */
    public contains(value:any):boolean
    {
        return [].indexOf.call(this._elements, value) > -1;
    }

    /**
     * @param value
     */
    public add(value:any):void
    {
        if(!this.contains(value))
        {
            this._elements.push(value);
        }
    }

    /**
     * @param value
     * @returns {*}
     */
    public get(value:any):any
    {
        var index;
        if((index = [].indexOf.call(this._elements, value)) !== -1)
        {
            return this._elements[index];
        }

        return void(1);
    }

    public forEach(callback:Function):any
    {
        this._elements.forEach(callback);
        return this;
    }

    /**
     * @param value
     */
    public remove(value:any):void
    {
        var index;
        if((index = [].indexOf.call(this._elements, value)) !== -1)
        {
            this._elements.splice(index,1);
        }
    }

    /**
     * @returns {*[]}
     */
    public values():any[]
    {
        return this._elements;
    }

    /**
     * @returns {string}
     */
    public toString():string
    {
        return '[object HashSet]';
    }
}
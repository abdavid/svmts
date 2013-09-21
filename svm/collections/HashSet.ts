/**
 * Created by davidatborresen on 18.09.13.
 */
class HashSet {

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
        this._elements.push(value);
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

    public remove(value:any):void
    {
        var index;
        if((index = [].indexOf.call(this._elements, value)) !== -1)
        {
            this._elements = this._elements.splice(index,1);
        }
    }

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
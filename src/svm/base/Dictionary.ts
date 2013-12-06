/**
 * Created by davidatborresen on 03.12.13.
 */
///<reference path='../interfaces/ICollection.ts' />
///<reference path='../../definitions/underscore.d.ts' />

export class Dictionary implements ICollection
{
    private _elements:Object = {};
    private _length:number = 0;

    /**
     * @returns {*[]}
     */
    public values():any[]
    {
        return _.values(this._elements);
    }

    /**
     * @returns {string[]}
     */
    public keys():string[]
    {
        return _.keys(this._elements);
    }

    /**
     * @param collection
     * @returns {boolean}
     */
    public equals(collection:ICollection):boolean
    {
        return _.isEqual(this, collection);
    }

    /**
     * @returns {SVM.Generic.Dictionary}
     */
    public clone():Dictionary
    {
        return _.clone(this);
    }

    /**
     * @returns {string}
     */
    public toString():string
    {
        return '[object Dictionary]';
    }

    /**
     * @param list IList
     */
    public add(list:IList):void
    {
        this._elements[this._length] = list;
        this._length++;
    }

    /**
     * @param value
     * @returns {T[]}
     */
    public get(value:any):any
    {
        return this._filterGet(value).first().value();
    }

    /**
     * @param value
     * @returns {boolean}
     */
    public contains(value:any):any
    {
        return this._filterGet(value).size().value() > 0;
    }

    /**
     * @param value
     * @returns {_Chain}
     * @private
     */
    private _filterGet(value:any):any
    {
        return _.chain(this._elements)
            .reject((list:IList)=>
            {
                return list.contains(value);
            });
    }
}